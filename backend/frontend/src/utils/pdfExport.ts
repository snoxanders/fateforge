import { jsPDF } from 'jspdf';
import { Character } from '../components/CharacterSheet';

export const generatePDF = (character: Character) => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    
    // Header
    doc.setFontSize(24);
    doc.text(character.name, 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    let classLine = `Nível ${character.level} ${character.race.name} ${character.class.name}`;
    if (character.subclass) {
        classLine += ` (${character.subclass.name})`;
    }
    doc.text(classLine, 20, 30);
    doc.line(20, 35, 190, 35); 

    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text(`HP: ${character.hp.max}`, 20, 50);
    doc.text(`CA: ${character.armorClass.value}`, 60, 50);
    doc.text(`Iniciativa: ${character.initiative >= 0 ? '+' : ''}${character.initiative}`, 100, 50);
    doc.text(`Deslocamento: ${character.speed}ft`, 140, 50);

    // Attributes
    doc.setFontSize(16);
    doc.text("Atributos", 20, 70);
    
    let x = 20;
    let y = 80;
    
    const attrs = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
    attrs.forEach((key) => {
        const attr = character.attributes[key];
        doc.rect(x, y, 25, 25);
        doc.setFontSize(10);
        doc.text(key, x + 12.5, y + 5, { align: 'center' });
        
        doc.setFontSize(16);
        doc.text(`${attr.modifier >= 0 ? '+' : ''}${attr.modifier}`, x + 12.5, y + 15, { align: 'center' });
        
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(attr.value.toString(), x + 12.5, y + 22, { align: 'center' });
        doc.setTextColor(0);
        
        x += 30;
    });

    y = 120;
    // Skills & Proficiencies
    doc.setFontSize(14);
    doc.text("Perícias & Proficiências", 20, y);
    doc.setFontSize(10);
    doc.text(`Bônus de Proficiência: +${character.proficiencyBonus}`, 20, y + 8);
    
    // List proficient skills
    const proficientSkills = character.skills.filter(s => s.proficient).map(s => s.name).join(', ');
    const splitSkills = doc.splitTextToSize(`Perícias: ${proficientSkills}`, 170);
    doc.text(splitSkills, 20, y + 15);
    y += 15 + (splitSkills.length * 5);

    // Spells
    if (character.spells && character.spells.spells.length > 0) {
        doc.setFontSize(14);
        doc.text("Magias", 20, y);
        doc.setFontSize(10);
        y += 8;
        
        const cantrips = character.spells.spells.filter(s => s.level === 0).map(s => s.name).join(', ');
        if (cantrips) {
            doc.text(`Truques: ${cantrips}`, 20, y);
            y += 6;
        }
        
        const level1 = character.spells.spells.filter(s => s.level === 1).map(s => s.name).join(', ');
        if (level1) {
            doc.text(`Nível 1: ${level1}`, 20, y);
            y += 6;
        }
        y += 6;
    }

    // Equipment
    if (character.equipment.length > 0) {
        doc.setFontSize(14);
        doc.text("Equipamento", 20, y);
        doc.setFontSize(10);
        y += 8;
        const items = character.equipment.map(e => e.name).join(', ');
        const splitItems = doc.splitTextToSize(items, 170);
        doc.text(splitItems, 20, y);
        y += (splitItems.length * 5) + 6;
    }

    // Background
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    
    doc.setFontSize(14);
    doc.text(`Antecedente: ${character.background.name}`, 20, y);
    doc.setFontSize(10);
    y += 8;
    const splitDesc = doc.splitTextToSize(character.background.description, 170);
    doc.text(splitDesc, 20, y);
    y += (splitDesc.length * 5) + 10;
    
    doc.text(`Traço: ${character.personality.traits[0]}`, 20, y);
    y += 6;
    doc.text(`Ideal: ${character.personality.ideals[0]}`, 20, y);
    y += 6;
    doc.text(`Vínculo: ${character.personality.bonds[0]}`, 20, y);
    y += 6;
    doc.text(`Defeito: ${character.personality.flaws[0]}`, 20, y);

    doc.save(`${character.name.replace(/\s+/g, '_')}_FateForge.pdf`);
};


