import { Character, GenerationPreferences, GenerationMethod, Attributes, Skill, Spellcasting, EquipmentItem, Bio, CharacterBackground, PersonalityTraits } from '../models/Character';
import { RACES } from '../data/races';
import { CLASSES } from '../data/classes';
import { BACKGROUNDS, BackgroundData } from '../data/backgrounds';
import { SKILLS_MAPPING } from '../data/skills';
import { SPELLS } from '../data/spells';
import { roll4d6DropLowest, getModifier } from '../utils/dice';
import { Race } from '../models/Race';
import { Class, Subclass, ClassFeature } from '../models/Class';

export class CharacterGeneratorService {

  public generateCharacter(name: string, preferences: GenerationPreferences = {}): Character {
    const level = preferences.level || 1;
    
    const race = this.selectRace(preferences.raceId);
    let characterClass = this.selectClass(preferences.classId);
    let subclass: Subclass | undefined = undefined;

    if (level >= 3 && characterClass.subclasses && characterClass.subclasses.length > 0) {
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

    const attributes = this.calculateAttributes(rawAttributes, characterClass.proficiencies.savingThrows);

    const modifiers = {
        STR: attributes.STR.modifier,
        DEX: attributes.DEX.modifier,
        CON: attributes.CON.modifier,
        INT: attributes.INT.modifier,
        WIS: attributes.WIS.modifier,
        CHA: attributes.CHA.modifier
    };

    const hp = this.calculateHP(characterClass, modifiers.CON, level, race);
    const proficiencyBonus = this.calculateProficiencyBonus(level);
    const initiative = modifiers.DEX; 
    
    const bgData = this.getRandomBackground();
    const background: CharacterBackground = {
        name: bgData.name,
        description: bgData.description,
        feature: `${bgData.feature.name}: ${bgData.feature.description}`
    };

    const personality = this.generatePersonality(bgData);
    const bio = this.generateBio(race, bgData, name, level);

    const proficiencies = this.calculateProficiencies(characterClass, race, bgData, modifiers);
    const skills = this.calculateSkills(proficiencies.skillNames, attributes, proficiencyBonus);

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
        languages: [...race.languages, ...(new Array(bgData.languages || 0).fill('Idioma Extra'))],
        savingThrows: characterClass.proficiencies.savingThrows as (keyof Attributes)[]
      },
      equipment,
      wallet: { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 },
      spellcasting, 
      background,
      personality,
      bio
    };
  }

  // --- Helpers ---

  private calculateAttributes(raw: { [key: string]: number }, saves: string[]): Attributes {
      const stats = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
      const attrs: any = {};
      
      stats.forEach(stat => {
          const value = raw[stat];
          const modifier = getModifier(value);
          attrs[stat] = { value, modifier, save: modifier };
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
      bg.equipment.forEach(s => items.push(parseItem(s)));

      return items;
  }

  private generateSpellcasting(charClass: Class, race: Race, level: number, attributes: Attributes, pb: number): Spellcasting | undefined {
      if (!charClass.spellcasting) return undefined;

      const abilityKey = charClass.spellcasting.ability;
      const abilityMod = attributes[abilityKey].modifier;
      const saveDC = 8 + pb + abilityMod;
      const attackBonus = pb + abilityMod;

      const spells: any[] = []; 
      
      if (charClass.spellcasting.cantripsKnown) {
          const count = charClass.spellcasting.cantripsKnown[level] || 0;
          const available = SPELLS.filter(s => s.classes.includes(charClass.id) && s.level === 0);
          const picked = this.pickRandom(available, count);
          spells.push(...picked.map(p => ({ ...p, prepared: true })));
      }

      let knownCount = 0;
      if (charClass.spellcasting.knownSpellsPerLevel) {
          knownCount = charClass.spellcasting.knownSpellsPerLevel[level] || level + abilityMod;
      } else {
          knownCount = level + abilityMod; 
      }
      
      const availableLeveled = SPELLS.filter(s => s.classes.includes(charClass.id) && s.level > 0 && s.level <= Math.ceil(level/2));
      const pickedLeveled = this.pickRandom(availableLeveled, Math.max(1, knownCount));
      spells.push(...pickedLeveled.map(p => ({ ...p, prepared: true })));

      return {
          ability: abilityKey,
          saveDC,
          attackBonus,
          slots: [], 
          spells
      };
  }

  private generateBio(race: Race, bg: BackgroundData, name: string, level: number): Bio {
      return {
          age: 20 + Math.floor(Math.random() * 20),
          height: "1,75m",
          weight: "75kg",
          eyes: "Castanhos",
          skin: "Clara",
          hair: "Castanho",
          alignment: bg.ideals[0]?.align || "Neutro",
          appearance: `Um ${race.name} de aparência marcante, vestindo roupas de ${bg.name.toLowerCase()}.`,
          backstory: `Nascido como ${race.name}, ${name} cresceu sob a influência de um passado de ${bg.name}. ${bg.description}`
      };
  }

  private selectRace(raceId?: string): Race {
    if (raceId) {
      const found = RACES.find(r => r.id === raceId);
      if (found) return found;
    }
    return RACES[Math.floor(Math.random() * RACES.length)];
  }

  private selectClass(classId?: string): Class {
    if (classId) {
      const found = CLASSES.find(c => c.id === classId);
      if (found) return found;
    }
    return CLASSES[Math.floor(Math.random() * CLASSES.length)];
  }

  private getRandomBackground(): BackgroundData {
    return BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
  }
  
  private generatePersonality(bg: BackgroundData): PersonalityTraits {
      return {
          traits: [this.pickOne(bg.personalityTraits)],
          ideals: [this.pickOne(bg.ideals).text],
          bonds: [this.pickOne(bg.bonds)],
          flaws: [this.pickOne(bg.flaws)]
      };
  }

  private pickOne<T>(arr: T[]): T {
      return arr[Math.floor(Math.random() * arr.length)];
  }

  private pickRandom<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private generateBaseStats(method: GenerationMethod): number[] {
    if (method === 'standard') return [15, 14, 13, 12, 10, 8];
    const stats: number[] = [];
    for (let i = 0; i < 6; i++) stats.push(roll4d6DropLowest());
    return stats.sort((a, b) => b - a);
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

  private applyASI(stats: any, charClass: Class, level: number): any {
      const mainStat = charClass.statPriority[0];
      const newStats = { ...stats };
      const increases = Math.floor(level / 4); 
      newStats[mainStat] = Math.min(20, newStats[mainStat] + 2);
      return newStats;
  }

  private calculateProficiencyBonus(level: number): number {
    return Math.ceil(1 + (level / 4));
  }
  
  private generateRandomName(): string {
    const names = ["Tharivol", "Erevan", "Keth", "Murbella", "Dorn", "Zephyros", "Seraphina", "Grim", "Valeria", "Nyx"];
    return names[Math.floor(Math.random() * names.length)];
  }

  private calculateXP(level: number): number {
      const table: any = { 1: 0, 2: 300, 3: 900, 4: 2700, 5: 6500 };
      return table[level] || 0;
  }
}





