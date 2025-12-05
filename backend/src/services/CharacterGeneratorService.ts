import { Character, GenerationPreferences, GenerationMethod } from '../models/Character';
import { Stats, StatModifiers } from '../models/Stats';
import { RACES } from '../data/races';
import { CLASSES } from '../data/classes';
import { BACKGROUNDS } from '../data/backgrounds';
import { roll4d6DropLowest, getModifier, rollDie } from '../utils/dice';
import { Race } from '../models/Race';
import { Class } from '../models/Class';

import { SPELLS, Spell } from '../data/spells';

export class CharacterGeneratorService {

  public generateCharacter(name: string, preferences: GenerationPreferences = {}): Character {
    const level = preferences.level || 1;
    
    // 1. Selecionar Raça e Classe
    const race = this.selectRace(preferences.raceId);
    const characterClass = this.selectClass(preferences.classId);

    // 2. Gerar Atributos Base
    let baseStatsValues = this.generateBaseStats(preferences.method || 'roll');

    // 3. Mapear Atributos Base para Stats
    let stats = this.assignStatsByClassPriority(baseStatsValues, characterClass);

    // 4. Aplicar Bônus Raciais
    stats = this.applyRaceBonuses(stats, race);

    // 4.5 Aplicar ASI (Ability Score Improvement) se level >= 4
    if (level >= 4) {
        stats = this.applyASI(stats, characterClass);
    }

    // 5. Calcular Modificadores e Derivados
    const modifiers = this.calculateModifiers(stats);
    const hp = this.calculateHP(characterClass, modifiers.CON, level, race);
    const armorClass = this.calculateAC(modifiers.DEX, characterClass);
    const proficiencyBonus = this.calculateProficiencyBonus(level);
    const initiative = modifiers.DEX;

    // 6. Selecionar Magias (se aplicável)
    const spells = this.selectSpells(characterClass, race);

    // 7. Background e Personalidade
    const background = this.getRandomBackground();
    const personality = this.generatePersonality(background.traits, background.ideals, background.bonds, background.flaws);

    return {
      name: name || this.generateRandomName(),
      level,
      race,
      class: characterClass,
      stats,
      modifiers,
      hp,
      armorClass,
      proficiencyBonus,
      initiative,
      speed: race.speed,
      skills: [], 
      equipment: characterClass.startingEquipment || [], // Equipamento da Classe
      spells,
      background: { name: background.name, description: background.description },
      personality
    };
  }

  private selectSpells(charClass: Class, race: Race) {
    const spellList = { cantrips: [] as string[], level1: [] as string[] };

    // Magias de Classe
    if (charClass.spellcasting) {
        const classSpells = SPELLS.filter(s => s.classes.includes(charClass.id));
        
        // Cantrips
        const cantrips = classSpells.filter(s => s.level === 0);
        const selectedCantrips = this.pickRandom(cantrips, charClass.spellcasting.cantripsKnown);
        spellList.cantrips.push(...selectedCantrips.map(s => s.name));

        // Level 1
        const lvl1 = classSpells.filter(s => s.level === 1);
        const selectedLvl1 = this.pickRandom(lvl1, charClass.spellcasting.spellsKnown);
        spellList.level1.push(...selectedLvl1.map(s => s.name));
    }

    // Magias Raciais (Ex: Tiefling ganha Taumaturgia)
    if (race.id === 'tiefling') {
        // Evitar duplicata se já tiver
        if (!spellList.cantrips.includes('Taumaturgia')) {
            spellList.cantrips.push('Taumaturgia (Racial)');
        }
    }
    if (race.id === 'elf-high') {
        // High Elf ganha 1 cantrip de mago
        const wizardCantrips = SPELLS.filter(s => s.classes.includes('wizard') && s.level === 0);
        const pick = this.pickRandom(wizardCantrips, 1)[0];
        if (pick && !spellList.cantrips.includes(pick.name)) {
            spellList.cantrips.push(`${pick.name} (Racial)`);
        }
    }

    return spellList;
  }

  private pickRandom<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
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

  private generateBaseStats(method: GenerationMethod): number[] {
    if (method === 'standard') {
      return [15, 14, 13, 12, 10, 8];
    }
    // Default to roll 4d6 drop lowest for 6 stats
    const stats: number[] = [];
    for (let i = 0; i < 6; i++) {
      stats.push(roll4d6DropLowest());
    }
    return stats.sort((a, b) => b - a); // Sort descending
  }

  private assignStatsByClassPriority(values: number[], charClass: Class): Stats {
    const sortedValues = [...values].sort((a, b) => b - a);
    const stats: Stats = { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 };
    const priority = charClass.statPriority as (keyof Stats)[];

    priority.forEach(stat => {
        if (sortedValues.length > 0) {
            stats[stat] = sortedValues.shift()!;
        }
    });

    return stats;
  }

  private applyASI(stats: Stats, charClass: Class): Stats {
    const newStats = { ...stats };
    const priority = charClass.statPriority as (keyof Stats)[];
    let pointsToDistribute = 2;

    for (const stat of priority) {
        if (pointsToDistribute <= 0) break;

        const currentVal = newStats[stat];
        if (currentVal < 20) {
            const canAdd = Math.min(20 - currentVal, pointsToDistribute);
            newStats[stat] += canAdd;
            pointsToDistribute -= canAdd;
        }
    }

    return newStats;
  }

  private applyRaceBonuses(stats: Stats, race: Race): Stats {
    const newStats = { ...stats };
    const bonuses = race.abilityBonuses;
    
    // Itera sobre as chaves de bônus (ex: {STR: 2, CHA: 1})
    (Object.keys(bonuses) as (keyof Stats)[]).forEach(key => {
        if (bonuses[key]) {
            newStats[key] += bonuses[key]!;
        }
    });

    return newStats;
  }

  private calculateModifiers(stats: Stats): StatModifiers {
    return {
      STR: getModifier(stats.STR),
      DEX: getModifier(stats.DEX),
      CON: getModifier(stats.CON),
      INT: getModifier(stats.INT),
      WIS: getModifier(stats.WIS),
      CHA: getModifier(stats.CHA),
    };
  }

  private calculateHP(charClass: Class, conMod: number, level: number, race: Race): number {
    // Nível 1: Max Hit Die + CON Mod
    let hp = charClass.hitDie + conMod;
    
    // Dwarf Hill Trait
    if (race.id === 'dwarf-hill') {
      hp += 1; 
    }

    // Níveis subsequentes (média)
    if (level > 1) {
      const avgDie = (charClass.hitDie / 2) + 1;
      for (let i = 2; i <= level; i++) {
        hp += Math.max(1, avgDie + conMod);
        if (race.id === 'dwarf-hill') hp += 1;
      }
    }

    return hp;
  }

  private calculateAC(dexMod: number, charClass: Class): number {
    // Base 10 + Dex
    // TODO: Considerar equipamentos iniciais no futuro.
    // Se for Monk ou Barbarian tem regras especiais (Unarmored Defense), ignorado por enquanto.
    return 10 + dexMod; 
  }

  private calculateProficiencyBonus(level: number): number {
    return Math.ceil(1 + (level / 4));
  }

  private getRandomBackground() {
    return BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
  }

  private generatePersonality(traits: string[], ideals: string[], bonds: string[], flaws: string[]) {
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    return {
      trait: pick(traits),
      ideal: pick(ideals),
      bond: pick(bonds),
      flaw: pick(flaws)
    };
  }

  private generateRandomName(): string {
    const names = ["Tharivol", "Erevan", "Keth", "Murbella", "Dorn", "Zephyros", "Seraphina", "Grim"];
    return names[Math.floor(Math.random() * names.length)];
  }
}

