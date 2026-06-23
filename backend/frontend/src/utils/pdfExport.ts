import { jsPDF } from 'jspdf';
import { Character } from '../components/CharacterSheet';
import { Capacitor } from '@capacitor/core';

// Paleta (parchment claro + tinta escura + dourado da marca)
const GOLD: number[] = [176, 80, 10];     // amber-700 escuro (legível no claro)
const GOLD_LT: number[] = [217, 119, 6];  // amber-600
const INK: number[] = [28, 25, 23];       // stone-900
const SUB: number[] = [120, 113, 108];    // stone-500
const LINE: number[] = [214, 211, 209];   // stone-300
const FILL: number[] = [245, 245, 244];   // stone-100
const DARK: number[] = [23, 23, 23];      // faixa do header
const EMER: number[] = [16, 185, 129];    // especialização

export const generatePDF = async (character: Character) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, H = 297, M = 14;
  const CW = W - M * 2;
  let y = 0;

  const mod = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
  const setText = (c: number[]) => doc.setTextColor(c[0], c[1], c[2]);
  const setFill = (c: number[]) => doc.setFillColor(c[0], c[1], c[2]);
  const setDraw = (c: number[]) => doc.setDrawColor(c[0], c[1], c[2]);

  const ensure = (h: number) => {
    if (y + h > H - 16) { doc.addPage(); y = M; }
  };

  const para = (
    text: string,
    opt: { size?: number; color?: number[]; bold?: boolean; indent?: number } = {}
  ) => {
    const size = opt.size ?? 9.5;
    const color = opt.color ?? INK;
    const indent = opt.indent ?? 0;
    const lh = size * 0.46 + 0.6;
    doc.setFont('helvetica', opt.bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    setText(color);
    const lines = doc.splitTextToSize(text, CW - indent) as string[];
    lines.forEach((ln) => { ensure(lh + 1); doc.text(ln, M + indent, y); y += lh; });
  };

  const section = (title: string) => {
    ensure(16);
    y += 3;
    setFill(GOLD); doc.rect(M, y - 4, 2.5, 6, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12.5); setText(INK);
    doc.text(title.toUpperCase(), M + 5, y);
    setDraw(LINE); doc.setLineWidth(0.3); doc.line(M, y + 2.5, W - M, y + 2.5);
    y += 9;
  };

  // ===== Header band =====
  setFill(DARK); doc.rect(0, 0, W, 42, 'F');
  setFill(GOLD_LT); doc.rect(0, 42, W, 1.4, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); setText(GOLD_LT);
  doc.text('C H A R V O', M, 12);
  doc.setFontSize(25); doc.setTextColor(245, 245, 244);
  doc.text(character.name, M, 26);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(190, 185, 180);
  const sub = `Nível ${character.level}  ·  ${character.race.name}  ·  ${character.class.name}${character.subclass ? ` (${character.subclass.name})` : ''}`;
  doc.text(sub, M, 34);
  doc.setFontSize(9); doc.setTextColor(150, 145, 140);
  doc.text(`${character.background.name}  ·  ${character.bio?.alignment || 'Neutro'}`, M, 39.5);

  y = 52;

  // ===== Stat cards =====
  const stats: [string, string][] = [
    ['CA', `${character.armorClass.value}`],
    ['PV MÁX', `${character.hp.max}`],
    ['INICIATIVA', mod(character.initiative)],
    ['DESLOC.', `${character.speed}ft`],
    ['PROF.', `+${character.proficiencyBonus}`],
    ['PERC. PASS.', `${character.passivePerception}`],
  ];
  const gap = 3.5, sw = (CW - gap * 5) / 6, sh = 17;
  stats.forEach((s, i) => {
    const sx = M + i * (sw + gap);
    setFill(FILL); setDraw(LINE); doc.setLineWidth(0.3);
    doc.roundedRect(sx, y, sw, sh, 1.8, 1.8, 'FD');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(13); setText(INK);
    doc.text(s[1], sx + sw / 2, y + 8.5, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6); setText(SUB);
    doc.text(s[0], sx + sw / 2, y + 14, { align: 'center' });
  });
  y += sh + 6;

  // ===== Atributos =====
  section('Atributos & Resistências');
  const aKeys = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  const aLabel: { [k: string]: string } = { STR: 'FOR', DEX: 'DES', CON: 'CON', INT: 'INT', WIS: 'SAB', CHA: 'CAR' };
  const aw = (CW - gap * 5) / 6, ah = 23;
  aKeys.forEach((k, i) => {
    const a = character.attributes[k]; const ax = M + i * (aw + gap);
    setFill(FILL); setDraw(LINE); doc.roundedRect(ax, y, aw, ah, 1.8, 1.8, 'FD');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); setText(GOLD);
    doc.text(aLabel[k], ax + aw / 2, y + 5, { align: 'center' });
    doc.setFontSize(15); setText(INK);
    doc.text(mod(a.modifier), ax + aw / 2, y + 12, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); setText(SUB);
    doc.text(`valor ${a.value}`, ax + aw / 2, y + 17, { align: 'center' });
    doc.text(`save ${mod(a.save)}`, ax + aw / 2, y + 21, { align: 'center' });
  });
  y += ah + 5;

  // ===== Perícias (todas as 18, 2 colunas) =====
  section('Perícias');
  const colW = CW / 2, rowH = 5.6;
  doc.setFontSize(9);
  for (let i = 0; i < character.skills.length; i += 2) {
    ensure(rowH + 1);
    for (let c = 0; c < 2; c++) {
      const sk = character.skills[i + c];
      if (!sk) continue;
      const sx = M + c * colW;
      if (sk.expertise) setFill(EMER); else if (sk.proficient) setFill(GOLD_LT); else setFill(LINE);
      doc.circle(sx + 1.4, y - 1.2, 1.2, 'F');
      doc.setFont('helvetica', sk.proficient ? 'bold' : 'normal');
      setText(sk.proficient ? INK : SUB);
      doc.text(`${sk.name} (${sk.ability})${sk.expertise ? ' (esp.)' : ''}`, sx + 4.5, y);
      doc.setFont('helvetica', 'bold'); setText(INK);
      doc.text(mod(sk.value), sx + colW - 6, y, { align: 'right' });
    }
    y += rowH;
  }
  y += 3;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); setText(SUB);
  ensure(5); doc.text('Bolinha dourada = proficiente   ·   verde = especialização (bônus dobrado)', M, y); y += 4;

  // ===== Combate / Armas =====
  const weapons = character.equipment.filter((e) => e.type === 'weapon');
  section('Combate');
  if (weapons.length === 0) {
    para('Nenhuma arma equipada.', { color: SUB });
  } else {
    weapons.forEach((w) => {
      const isFinesse = w.properties?.includes('Finesse') || w.name.includes('Rapieira') || w.name.includes('Adaga');
      const isRanged = w.properties?.includes('Range') || w.name.includes('Arco') || w.name.includes('Besta');
      let m = character.attributes.STR.modifier;
      if (isRanged || (isFinesse && character.attributes.DEX.modifier > m)) m = character.attributes.DEX.modifier;
      const atk = m + character.proficiencyBonus;
      const dmg = w.properties?.[0] || '1d8';
      ensure(6);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); setText(INK);
      doc.text(w.name, M, y);
      doc.setFont('helvetica', 'normal'); setText(SUB);
      doc.text(`Ataque ${mod(atk)}   ·   Dano ${dmg} ${mod(m)}`, W - M, y, { align: 'right' });
      y += 5.5;
    });
  }
  y += 2;

  // ===== Magias =====
  if (character.spellcasting && character.spellcasting.spells && character.spellcasting.spells.length > 0) {
    const sc = character.spellcasting;
    section('Magias');
    para(`Atributo ${sc.ability}   ·   CD de Resistência ${sc.saveDC}   ·   Ataque ${mod(sc.attackBonus)}`, { bold: true });
    const slotStr = (sc.slots || []).filter((s) => s.total > 0).map((s) => `Nv${s.level}: ${s.total}`).join('    ');
    if (slotStr) para(`Espaços de magia — ${slotStr}`, { color: SUB });
    y += 1;
    const byLevel: { [lvl: number]: string[] } = {};
    sc.spells.forEach((s) => { (byLevel[s.level] = byLevel[s.level] || []).push(s.name); });
    Object.keys(byLevel).map(Number).sort((a, b) => a - b).forEach((lvl) => {
      para(`${lvl === 0 ? 'Truques' : `Círculo ${lvl}`}: ${byLevel[lvl].join(', ')}`);
    });
    y += 2;
  }

  // ===== Equipamento =====
  section('Equipamento');
  const w = character.wallet;
  para(`Bolsa:  ${w.gp} PO  ·  ${w.sp} PP  ·  ${w.cp} PC`, { bold: true, color: GOLD });
  y += 1;
  character.equipment.forEach((it) => {
    const q = it.quantity > 1 ? `${it.quantity}x ` : '';
    const ac = it.armorClass ? `  (CA ${it.armorClass})` : '';
    para(`•  ${q}${it.name}${ac}`, { size: 9, indent: 2 });
  });
  y += 2;

  // ===== Proficiências =====
  section('Proficiências & Idiomas');
  const saves = character.proficiencies.savingThrows.join(', ');
  para(`Resistências: ${saves || '—'}`);
  para(`Armas: ${character.proficiencies.weapons.join(', ') || '—'}`);
  para(`Armaduras: ${character.proficiencies.armor.join(', ') || '—'}`);
  if (character.proficiencies.tools.length) para(`Ferramentas: ${character.proficiencies.tools.join(', ')}`);
  para(`Idiomas: ${character.proficiencies.languages.join(', ') || '—'}`);
  y += 2;

  // ===== Biografia =====
  section('Biografia & Traços');
  para(`Antecedente: ${character.background.name}`, { bold: true });
  if (character.background.feature) para(character.background.feature, { size: 9, color: SUB });
  y += 1;
  const pers: [string, string][] = [
    ['Traço', character.personality.traits[0]],
    ['Ideal', character.personality.ideals[0]],
    ['Vínculo', character.personality.bonds[0]],
    ['Defeito', character.personality.flaws[0]],
  ];
  pers.forEach(([label, val]) => { if (val) para(`${label}: ${val}`, { size: 9 }); });
  y += 1;
  const b = character.bio;
  para(`Aparência: ${b.age} anos · ${b.height} · ${b.weight} · olhos ${b.eyes} · cabelo ${b.hair} · pele ${b.skin}`, { size: 9, color: SUB });
  if (b.backstory) { y += 1; para(b.backstory, { size: 9 }); }

  // ===== Rodapé / paginação =====
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    setDraw(LINE); doc.setLineWidth(0.3); doc.line(M, H - 12, W - M, H - 12);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); setText(SUB);
    doc.text('Forjado em Charvo', M, H - 7);
    doc.text(`${p} / ${total}`, W - M, H - 7, { align: 'right' });
  }

  // ===== Salvar / compartilhar =====
  const fileName = `${character.name.replace(/\s+/g, '_')}_Charvo.pdf`;
  if (Capacitor.isNativePlatform()) {
    try {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      const { Share } = await import('@capacitor/share');
      const base64 = doc.output('datauristring').split(',')[1];
      await Filesystem.writeFile({ path: fileName, data: base64, directory: Directory.Cache });
      const { uri } = await Filesystem.getUri({ path: fileName, directory: Directory.Cache });
      await Share.share({ title: character.name, text: `Ficha de ${character.name} — Charvo`, url: uri });
    } catch (e) {
      console.error('Erro ao exportar PDF:', e);
      alert('Não foi possível exportar o PDF.');
    }
  } else {
    doc.save(fileName);
  }
};
