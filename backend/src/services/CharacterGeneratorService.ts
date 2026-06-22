import { Character, GenerationPreferences, GenerationMethod, Attributes, Skill, Spellcasting, SpellSlot, EquipmentItem, Wallet, Bio, CharacterBackground, PersonalityTraits } from '../models/Character';
import { RACES } from '../data/races';
import { CLASSES } from '../data/classes';
import { BACKGROUNDS, BackgroundData } from '../data/backgrounds';
import { SKILLS_MAPPING } from '../data/skills';
import { SPELLS } from '../data/spells';
import { roll4d6DropLowest, getModifier, mulberry32, RNG } from '../utils/dice';
import { Race } from '../models/Race';
import { Class, Subclass, ClassFeature } from '../models/Class';

// Físico aproximado por raça (PHB): altura em cm [min,max], peso em kg [min,max], idade [min,max].
type Physique = { h: [number, number]; w: [number, number]; age: [number, number] };
const RACE_PHYSIQUE: { [raceId: string]: Physique } = {
  'human':              { h: [160, 185], w: [60, 90],  age: [18, 55] },
  'elf-high':           { h: [165, 190], w: [50, 75],  age: [100, 500] },
  'elf-wood':           { h: [165, 190], w: [50, 75],  age: [100, 500] },
  'elf-drow':           { h: [160, 180], w: [50, 70],  age: [100, 500] },
  'dwarf-hill':         { h: [120, 140], w: [60, 90],  age: [40, 250] },
  'dwarf-mountain':     { h: [125, 145], w: [70, 100], age: [40, 250] },
  'halfling-lightfoot': { h: [85, 100],  w: [16, 22],  age: [20, 100] },
  'halfling-stout':     { h: [85, 100],  w: [16, 22],  age: [20, 100] },
  'half-orc':           { h: [170, 200], w: [80, 120], age: [14, 55] },
  'tiefling':           { h: [160, 185], w: [60, 90],  age: [18, 55] },
  'gnome-rock':         { h: [90, 105],  w: [15, 20],  age: [40, 300] },
  'gnome-forest':       { h: [90, 105],  w: [15, 20],  age: [40, 300] },
  'half-elf':           { h: [160, 185], w: [55, 85],  age: [20, 120] },
  'dragonborn':         { h: [175, 200], w: [90, 130], age: [15, 60] },
};

export class CharacterGeneratorService {

  private rng: RNG;

  // seed opcional -> geração reproduzível (testes determinísticos / compartilhar por seed)
  constructor(seed?: number) {
    this.rng = seed !== undefined ? mulberry32(seed) : Math.random;
  }

  public generateCharacter(name: string, preferences: GenerationPreferences = {}): Character {
    const level = preferences.level || 1;
    
    const race = this.selectRace(preferences.raceId);
    let characterClass = this.selectClass(preferences.classId);
    let subclass: Subclass | undefined = undefined;

    // Clérigo/Feiticeiro/Bruxo escolhem no nv1, Druida no nv2, demais no nv3.
    const subclassLevel = characterClass.subclassLevel ?? 3;
    if (level >= subclassLevel && characterClass.subclasses && characterClass.subclasses.length > 0) {
        subclass = this.pickRandom(characterClass.subclasses, 1)[0];
    }

    const activeFeatures: ClassFeature[] = [];
    characterClass.features.forEach(feat => {
        if (feat.level <= level) activeFeatures.push(feat);
    });
    if (subclass) {
        subclass.features.forEach(feat => {
            if (feat.level <= level) activeFeatures.push(feat);
        });
    }

    let baseStatsValues = this.generateBaseStats(preferences.method || 'roll');
    let rawAttributes = this.assignStatsByClassPriority(baseStatsValues, characterClass);
    rawAttributes = this.applyRaceBonuses(rawAttributes, race);
    
    if (level >= 4) {
        rawAttributes = this.applyASI(rawAttributes, characterClass, level);
    }

    const proficiencyBonus = this.calculateProficiencyBonus(level);
    const attributes = this.calculateAttributes(rawAttributes, characterClass.proficiencies.savingThrows, proficiencyBonus);

    const modifiers = {
        STR: attributes.STR.modifier,
        DEX: attributes.DEX.modifier,
        CON: attributes.CON.modifier,
        INT: attributes.INT.modifier,
        WIS: attributes.WIS.modifier,
        CHA: attributes.CHA.modifier
    };

    const hp = this.calculateHP(characterClass, modifiers.CON, level, race);
    const initiative = modifiers.DEX;
    
    const bgData = this.getRandomBackground();
    const background: CharacterBackground = {
        name: bgData.name,
        description: bgData.description,
        feature: `${bgData.feature.name}: ${bgData.feature.description}`
    };

    const chosenIdeal = this.pickOne(bgData.ideals);
    const personality = this.generatePersonality(bgData, chosenIdeal);
    const bio = this.generateBio(race, bgData, name, chosenIdeal.align);

    const proficiencies = this.calculateProficiencies(characterClass, race, bgData, modifiers);
    const skills = this.calculateSkills(proficiencies.skillNames, attributes, proficiencyBonus);
    this.applyExpertise(skills, characterClass, level, proficiencyBonus);

    const equipment = this.generateEquipment(characterClass, bgData);
    const armorClass = this.calculateAC(modifiers.DEX, modifiers.CON, modifiers.WIS, characterClass, activeFeatures, equipment);

    const spellcasting = this.generateSpellcasting(characterClass, race, level, attributes, proficiencyBonus);

    const displayClass = { ...characterClass, features: activeFeatures };

    return {
      name: name || this.generateRandomName(),
      level,
      experience: level === 1 ? 0 : this.calculateXP(level),
      race,
      class: displayClass,
      subclass,
      attributes,
      hp,
      armorClass,
      proficiencyBonus,
      initiative,
      speed: race.speed,
      passivePerception: 10 + (skills.find(s => s.name === 'Percepção')?.value || 0),
      skills,
      proficiencies: {
        armor: characterClass.proficiencies.armor,
        weapons: characterClass.proficiencies.weapons,
        tools: [...characterClass.proficiencies.tools, ...bgData.toolProficiencies],
        languages: this.resolveLanguages(race, bgData.languages || 0),
        savingThrows: characterClass.proficiencies.savingThrows as (keyof Attributes)[]
      },
      equipment,
      wallet: this.computeWallet(bgData),
      spellcasting, 
      background,
      personality,
      bio
    };
  }

  // --- Helpers ---

  private calculateAttributes(raw: { [key: string]: number }, saves: string[], pb: number): Attributes {
      const stats = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
      const attrs: any = {};

      stats.forEach(stat => {
          const value = raw[stat];
          const modifier = getModifier(value);
          const proficient = saves.includes(stat);
          attrs[stat] = { value, modifier, save: modifier + (proficient ? pb : 0) };
      });
      return attrs as Attributes;
  }

  private calculateSkills(proficientSkills: string[], attributes: Attributes, pb: number): Skill[] {
      return SKILLS_MAPPING.map(mapping => {
          const isProficient = proficientSkills.includes(mapping.name);
          const attr = attributes[mapping.ability];
          const value = attr.modifier + (isProficient ? pb : 0);
          
          return {
              name: mapping.name,
              ability: mapping.ability,
              value,
              proficient: isProficient
          };
      });
  }

  // Especialização: dobra o PB em perícias proficientes (Ladino nv1, Bardo nv3).
  private applyExpertise(skills: Skill[], charClass: Class, level: number, pb: number): void {
      let count = 0;
      if (charClass.id === 'rogue' && level >= 1) count = 2;
      if (charClass.id === 'bard' && level >= 3) count = 2;
      if (count === 0) return;

      const proficient = skills.filter(s => s.proficient);
      const chosen = this.pickRandom(proficient, count);
      for (const sk of chosen) {
          sk.expertise = true;
          sk.value += pb; // já tinha 1x PB; agora 2x
      }
  }

  private calculateProficiencies(charClass: Class, race: Race, bg: BackgroundData, modifiers: any) {
      const classSkillOptions = charClass.proficiencies.skills.from.filter(s => !bg.skillProficiencies.includes(s));
      const numClassSkills = charClass.proficiencies.skills.choose;
      const classSkills = this.pickRandom(classSkillOptions, numClassSkills);

      const raceSkills: string[] = [];
      if (race.id === 'elf-high' || race.id === 'elf-wood' || race.id === 'elf-drow') {
           raceSkills.push('Percepção'); 
      }
      if (race.id === 'half-orc') raceSkills.push('Intimidação');
      if (race.id === 'half-elf') {
          const allSkills = SKILLS_MAPPING.map(s => s.name);
          const available = allSkills.filter(s => !bg.skillProficiencies.includes(s) && !classSkills.includes(s));
          raceSkills.push(...this.pickRandom(available, 2));
      }

      const allSkills = [...new Set([...bg.skillProficiencies, ...classSkills, ...raceSkills])];
      return { skillNames: allSkills };
  }

  private calculateHP(charClass: Class, conMod: number, level: number, race: Race) {
    let hp = charClass.hitDie + conMod;
    if (race.id === 'dwarf-hill') hp += 1;

    if (level > 1) {
      const avgDie = (charClass.hitDie / 2) + 1;
      for (let i = 2; i <= level; i++) {
        hp += Math.max(1, avgDie + conMod);
        if (race.id === 'dwarf-hill') hp += 1;
      }
    }
    
    return {
        max: hp,
        current: hp,
        temp: 0,
        hitDice: `1d${charClass.hitDie}`,
        hitDiceTotal: level,
        hitDiceCurrent: level
    };
  }

  private calculateAC(dexMod: number, conMod: number, wisMod: number, charClass: Class, features: ClassFeature[], equipment: EquipmentItem[]) {
      const armor = equipment.find(e => e.type === 'armor');
      const shield = equipment.find(e => e.type === 'shield');
      
      let baseAC = 10 + dexMod;
      let desc = "Sem Armadura";

      if (armor) {
          if (armor.armorClass) {
              baseAC = armor.armorClass;
              if (armor.name.includes('Couro') || armor.name.includes('Couro Batido')) {
                   baseAC = (armor.armorClass || 11) + dexMod;
                   desc = armor.name;
              } else if (armor.name.includes('Cota de Escamas') || armor.name.includes('Peitoral')) {
                   baseAC = (armor.armorClass || 14) + Math.min(dexMod, 2);
                   desc = armor.name;
              } else {
                   baseAC = armor.armorClass;
                   desc = armor.name;
              }
          }
      }

      if (!armor) {
          if (charClass.id === 'monk') {
              const monkAC = 10 + dexMod + wisMod;
              if (monkAC > baseAC) {
                  baseAC = monkAC;
                  desc = "Defesa Sem Armadura (Monge)";
              }
          } else if (charClass.id === 'barbarian') {
               const barbAC = 10 + dexMod + conMod;
               if (barbAC > baseAC) {
                   baseAC = barbAC;
                   desc = "Defesa Sem Armadura (Bárbaro)";
               }
          } else if (features.some(f => f.name === 'Resiliência Dracônica')) {
              baseAC = 13 + dexMod;
              desc = "Resiliência Dracônica";
          }
      }

      if (shield) {
          baseAC += 2;
          desc += " + Escudo";
      }

      return { value: baseAC, description: desc };
  }

  private generateEquipment(charClass: Class, bg: BackgroundData): EquipmentItem[] {
      const items: EquipmentItem[] = [];

      const parseItem = (str: string): EquipmentItem => {
          let name = str;
          let props: string[] = [];
          let ac = undefined;
          let type = 'gear';

          const match = str.match(/(.*?)\s*\((.*?)\)/);
          if (match) {
              name = match[1].trim();
              const details = match[2];
              props.push(details);

              if (details.includes('AC')) {
                  const acMatch = details.match(/AC\s*(\d+)/);
                  if (acMatch) ac = parseInt(acMatch[1]);
                  type = name.toLowerCase().includes('escudo') ? 'shield' : 'armor';
              } else if (details.includes('d') && (details.includes('cortante') || details.includes('perfurante') || details.includes('contundente'))) {
                  type = 'weapon';
              }
          }

          if (name.toLowerCase().includes('escudo') && type === 'gear') type = 'shield';
          
          return {
              name,
              quantity: 1,
              type,
              properties: props,
              armorClass: ac
          };
      };

      charClass.startingEquipment.forEach(s => items.push(parseItem(s)));
      // Itens que são apenas moeda (ex.: "15 po") viram saldo da bolsa, não item de inventário.
      bg.equipment.forEach(s => { if (!this.isCurrency(s)) items.push(parseItem(s)); });

      return items;
  }

  private isCurrency(s: string): boolean {
      return /^\s*\d+\s*(po|pp|pe|pl|pc)\b/i.test(s);
  }

  private computeWallet(bg: BackgroundData): Wallet {
      let gp = 0;
      for (const item of bg.equipment) {
          const m = item.match(/(\d+)\s*po\b/i);
          if (m) gp += parseInt(m[1]);
      }
      return { cp: 0, sp: 0, ep: 0, gp: gp || 10, pp: 0 };
  }

  // Resolve idiomas: substitui "à escolha" e idiomas extras do antecedente por idiomas reais do pool.
  private resolveLanguages(race: Race, extraCount: number): string[] {
      const pool = ['Anão', 'Élfico', 'Gigante', 'Gnômico', 'Goblin', 'Halfling', 'Orc', 'Dracônico', 'Abissal', 'Celestial', 'Infernal', 'Silvestre', 'Subterrâneo (Submundo)'];
      const known: string[] = [];
      let pending = extraCount;
      for (const l of race.languages) {
          if (l.toLowerCase().includes('escolha')) pending++;
          else if (!known.includes(l)) known.push(l);
      }
      const available = pool.filter(l => !known.includes(l));
      const picks = this.pickRandom(available, pending);
      return [...known, ...picks];
  }

  private generateSpellcasting(charClass: Class, race: Race, level: number, attributes: Attributes, pb: number): Spellcasting | undefined {
      const sc = charClass.spellcasting;
      if (!sc) return undefined;

      const abilityKey = sc.ability;
      const abilityMod = attributes[abilityKey].modifier;
      const saveDC = 8 + pb + abilityMod;
      const attackBonus = pb + abilityMod;

      // A tabela de slots já codifica full/half/pact corretamente -> é a fonte de verdade
      // para QUANTO se conjura e qual o maior círculo disponível.
      const slotMap = this.slotsForLevel(sc.slotsPerLevel, level);
      const slots: SpellSlot[] = Object.keys(slotMap)
          .map(k => parseInt(k))
          .filter(lvl => slotMap[lvl] > 0)
          .sort((a, b) => a - b)
          .map(lvl => ({ level: lvl, total: slotMap[lvl], used: 0 }));
      const maxSpellLevel = slots.length ? slots[slots.length - 1].level : 0;

      const spells: any[] = [];

      // Truques
      const cantripCount = sc.cantripsKnown ? (sc.cantripsKnown[level] || 0) : 0;
      if (cantripCount > 0) {
          const availableCantrips = SPELLS.filter(s => s.classes.includes(charClass.id) && s.level === 0);
          spells.push(...this.pickRandom(availableCantrips, cantripCount).map(p => ({ ...p, prepared: true })));
      }

      // Sem espaços de magia neste nível: não é conjurador ainda (ex.: Paladino/Patrulheiro nv1).
      if (maxSpellLevel === 0) {
          if (spells.length === 0) return undefined; // nem truques -> sem aba de magia
          return { ability: abilityKey, saveDC, attackBonus, slots, spells };
      }

      // Magias de nível, limitadas ao maior círculo com espaço disponível.
      let knownCount = sc.knownSpellsPerLevel
          ? (sc.knownSpellsPerLevel[level] || level + abilityMod)
          : level + abilityMod; // preparadas (Clérigo/Druida/Paladino)
      knownCount = Math.max(1, knownCount);

      const availableLeveled = SPELLS.filter(s => s.classes.includes(charClass.id) && s.level > 0 && s.level <= maxSpellLevel);
      spells.push(...this.pickRandom(availableLeveled, knownCount).map(p => ({ ...p, prepared: true })));

      return { ability: abilityKey, saveDC, attackBonus, slots, spells };
  }

  // Mapa de slots do nível; se o nível exato não estiver na tabela, usa o maior nível definido <= level.
  private slotsForLevel(table: { [level: number]: { [spellLevel: number]: number } }, level: number): { [spellLevel: number]: number } {
      if (table[level]) return table[level];
      const defined = Object.keys(table).map(k => parseInt(k)).filter(l => l <= level).sort((a, b) => b - a);
      return defined.length ? table[defined[0]] : {};
  }

  private randInt(min: number, max: number): number {
      return min + Math.floor(this.rng() * (max - min + 1));
  }

  private generateBio(race: Race, bg: BackgroundData, name: string, alignment: string): Bio {
      const p = RACE_PHYSIQUE[race.id] || RACE_PHYSIQUE['human'];
      const cm = this.randInt(p.h[0], p.h[1]);
      const kg = this.randInt(p.w[0], p.w[1]);
      return {
          age: this.randInt(p.age[0], p.age[1]),
          height: `${(cm / 100).toFixed(2).replace('.', ',')}m`,
          weight: `${kg}kg`,
          eyes: this.pickOne(['Castanhos', 'Azuis', 'Verdes', 'Âmbar', 'Cinzentos', 'Negros']),
          skin: this.pickOne(['Clara', 'Morena', 'Bronzeada', 'Escura', 'Pálida', 'Avermelhada']),
          hair: this.pickOne(['Castanho', 'Negro', 'Loiro', 'Ruivo', 'Grisalho', 'Branco']),
          alignment: alignment || 'Neutro',
          appearance: `Um ${race.name} de aparência marcante, vestindo roupas de ${bg.name.toLowerCase()}.`,
          backstory: `Nascido como ${race.name}, ${name} cresceu sob a influência de um passado de ${bg.name}. ${bg.description}`
      };
  }

  private selectRace(raceId?: string): Race {
    if (raceId) {
      const found = RACES.find(r => r.id === raceId);
      if (found) return found;
    }
    return RACES[Math.floor(this.rng() * RACES.length)];
  }

  private selectClass(classId?: string): Class {
    if (classId) {
      const found = CLASSES.find(c => c.id === classId);
      if (found) return found;
    }
    return CLASSES[Math.floor(this.rng() * CLASSES.length)];
  }

  private getRandomBackground(): BackgroundData {
    return BACKGROUNDS[Math.floor(this.rng() * BACKGROUNDS.length)];
  }
  
  private generatePersonality(bg: BackgroundData, chosenIdeal: { text: string; align: string }): PersonalityTraits {
      return {
          traits: [this.pickOne(bg.personalityTraits)],
          ideals: [chosenIdeal.text], // mesmo ideal usado para derivar a tendência (bio)
          bonds: [this.pickOne(bg.bonds)],
          flaws: [this.pickOne(bg.flaws)]
      };
  }

  private pickOne<T>(arr: T[]): T {
      return arr[Math.floor(this.rng() * arr.length)];
  }

  private pickRandom<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - this.rng());
    return shuffled.slice(0, count);
  }

  private generateBaseStats(method: GenerationMethod): number[] {
    if (method === 'standard') return [15, 14, 13, 12, 10, 8];
    if (method === 'point-buy') return this.pointBuyStats();
    const stats: number[] = [];
    for (let i = 0; i < 6; i++) stats.push(roll4d6DropLowest(this.rng));
    return stats.sort((a, b) => b - a);
  }

  // Compra de Pontos (27 pontos, PHB): valores 8-15 antes de bônus raciais.
  // Sorteia uma distribuição válida; o assignStatsByClassPriority coloca os maiores nos atributos-chave.
  private pointBuyStats(): number[] {
    const cost: { [v: number]: number } = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
    const values = [8, 8, 8, 8, 8, 8];
    let budget = 27;
    // Distribui o orçamento aleatoriamente respeitando o teto de 15 e o custo.
    let guard = 0;
    while (budget > 0 && guard++ < 1000) {
      const i = Math.floor(this.rng() * 6);
      const next = values[i] + 1;
      if (next > 15) continue;
      const delta = cost[next] - cost[values[i]];
      if (delta <= budget) {
        values[i] = next;
        budget -= delta;
      } else if (budget < 1) {
        break;
      }
    }
    return values.sort((a, b) => b - a);
  }

  private assignStatsByClassPriority(values: number[], charClass: Class): { [key: string]: number } {
    const sortedValues = [...values].sort((a, b) => b - a);
    const stats: any = { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 };
    const priority = charClass.statPriority;

    priority.forEach(stat => {
        if (sortedValues.length > 0) {
            stats[stat] = sortedValues.shift()!;
        }
    });
    return stats;
  }

  private applyRaceBonuses(stats: any, race: Race): any {
    const newStats = { ...stats };
    const bonuses = race.abilityBonuses;
    (Object.keys(bonuses) as string[]).forEach((key) => {
        const bonusValue = bonuses[key as keyof typeof bonuses];
        if (bonusValue) {
            newStats[key] += bonusValue;
        }
    });
    return newStats;
  }

  // Quantos ASIs a classe já recebeu até o nível atual.
  private asiCount(charClass: Class, level: number): number {
      const milestones = [4, 8, 12, 16, 19];
      if (charClass.id === 'fighter') milestones.push(6, 14); // ASIs extras do Guerreiro
      if (charClass.id === 'rogue') milestones.push(10);      // ASI extra do Ladino
      return milestones.filter(m => level >= m).length;
  }

  private applyASI(stats: any, charClass: Class, level: number): any {
      const newStats = { ...stats };
      let points = this.asiCount(charClass, level) * 2; // +2 por marco de ASI
      const priority = charClass.statPriority;
      // Concentra no maior atributo prioritário abaixo de 20; sobra "transborda" pro próximo.
      let guard = 0;
      while (points > 0 && guard++ < 100) {
          let applied = false;
          for (const stat of priority) {
              if (newStats[stat] < 20) {
                  const add = Math.min(2, 20 - newStats[stat], points);
                  newStats[stat] += add;
                  points -= add;
                  applied = true;
                  break; // reavalia a prioridade a cada incremento
              }
          }
          if (!applied) break; // todos no teto (20)
      }
      return newStats;
  }

  private calculateProficiencyBonus(level: number): number {
    return Math.ceil(1 + (level / 4));
  }
  
  private generateRandomName(): string {
    const names = ["Tharivol", "Erevan", "Keth", "Murbella", "Dorn", "Zephyros", "Seraphina", "Grim", "Valeria", "Nyx"];
    return names[Math.floor(this.rng() * names.length)];
  }

  private calculateXP(level: number): number {
      const table: any = { 1: 0, 2: 300, 3: 900, 4: 2700, 5: 6500 };
      return table[level] || 0;
  }
}





