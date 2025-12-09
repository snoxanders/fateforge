import { Character, GenerationPreferences, GenerationMethod } from '../models/Character';
import { Stats, StatModifiers } from '../models/Stats';
import { RACES } from '../data/races';
import { CLASSES } from '../data/classes';
import { BACKGROUNDS } from '../data/backgrounds';
import { roll4d6DropLowest, getModifier } from '../utils/dice';
import { Race } from '../models/Race';
import { Class, Subclass, ClassFeature } from '../models/Class';

import { SPELLS } from '../data/spells';

export class CharacterGeneratorService {

  public generateCharacter(name: string, preferences: GenerationPreferences = {}): Character {
    const level = preferences.level || 1;
    
    // 1. Selecionar Raça e Classe
    const race = this.selectRace(preferences.raceId);
    let characterClass = this.selectClass(preferences.classId);
    let subclass: Subclass | undefined = undefined;

    // Lógica de Subclasse: geralmente escolhida no nível 3 (ou 1/2 para alguns, simplificado para 3 ou se disponível)
    // Para simplificar, se nível >= 3 e a classe tiver subclasses, escolhe uma.
    if (level >= 3 && characterClass.subclasses && characterClass.subclasses.length > 0) {
        subclass = this.pickRandom(characterClass.subclasses, 1)[0];
    }

    // Acumular Features (Classe + Subclasse) até o nível atual
    const activeFeatures: ClassFeature[] = [];
    
    // Features de Classe base
    characterClass.features.forEach(feat => {
        if (feat.level <= level) activeFeatures.push(feat);
    });

    // Features de Subclasse
    if (subclass) {
        subclass.features.forEach(feat => {
            if (feat.level <= level) activeFeatures.push(feat);
        });
    }

    // Atualiza a classe no objeto final para ter apenas as features ativas (visualização mais limpa na ficha)
    // Mas mantemos a referência original para cálculos se precisar
    const displayClass = { ...characterClass, features: activeFeatures };

    // 2. Gerar Atributos Base
    let baseStatsValues = this.generateBaseStats(preferences.method || 'roll');

    // 3. Mapear Atributos Base para Stats
    let stats = this.assignStatsByClassPriority(baseStatsValues, characterClass);

    // 4. Aplicar Bônus Raciais
    stats = this.applyRaceBonuses(stats, race);

    // 4.5 Aplicar ASI (Ability Score Improvement)
    // A cada 4 níveis (4, 8, 12...) ganha +2 em um ou +1 em dois.
    // Simplificação: Nível 4 aplica ASI focado no atributo principal e secundário.
    if (level >= 4) {
        stats = this.applyASI(stats, characterClass);
    }

    // 5. Calcular Modificadores e Derivados
    const modifiers = this.calculateModifiers(stats);
    const hp = this.calculateHP(characterClass, modifiers.CON, level, race);
    const armorClass = this.calculateAC(modifiers, characterClass, activeFeatures);
    const proficiencyBonus = this.calculateProficiencyBonus(level);
    const initiative = modifiers.DEX;

    // 6. Selecionar Magias (se aplicável)
    const spells = this.selectSpells(characterClass, race, level);

    // 7. Background e Personalidade
    const background = this.getRandomBackground();
    const personality = this.generatePersonality(background.traits, background.ideals, background.bonds, background.flaws);

    return {
      name: name || this.generateRandomName(),
      level,
      race,
      class: displayClass,
      subclass,
      stats,
      modifiers,
      hp,
      armorClass,
      proficiencyBonus,
      initiative,
      speed: race.speed,
      skills: [], 
      equipment: characterClass.startingEquipment || [], 
      spells,
      background: { name: background.name, description: background.description },
      personality
    };
  }

  private selectSpells(charClass: Class, race: Race, level: number) {
    const spellList: Character['spells'] = { cantrips: [], level1: [], level2: [], level3: [] };

    if (charClass.spellcasting) {
        const slots = charClass.spellcasting.slotsPerLevel[level];
        
        // Se a classe tem slots neste nível
        if (slots) {
            const classSpells = SPELLS.filter(s => s.classes.includes(charClass.id));
            
            // Cantrips (Nível 0)
            const cantripsKnownCount = charClass.spellcasting.cantripsKnown?.[level] || 0;
            
            if (cantripsKnownCount > 0) {
                 const cantrips = classSpells.filter(s => s.level === 0);
                 const known = this.pickRandom(cantrips, cantripsKnownCount);
                 spellList.cantrips.push(...known.map(s => s.name));
            } else if (charClass.spellcasting.knownSpellsPerLevel) {
                 // Fallback para lógica específica se não tiver cantripsKnown explícito
                 // Ex: Paladinos não tem cantrips, Magos tem fixo.
                 // Vamos assumir 3 se não definido e for caster, ou 0.
            }

            // Magias de Círculo 1, 2, 3...
            // A lógica correta seria "Magias Conhecidas" vs "Magias Preparadas".
            // Simplificação MVP: Se tem slot de nível X, conhece/prepara X magias desse nível.
            
            [1, 2, 3].forEach(spellLevel => {
                const slotCount = slots[spellLevel];
                if (slotCount && slotCount > 0) {
                    const availableSpells = classSpells.filter(s => s.level === spellLevel);
                    // Seleciona um número razoável (ex: 2 a 4 magias desse nível)
                    const countToPick = Math.min(availableSpells.length, 3); // Pega 3 opções
                    const picked = this.pickRandom(availableSpells, countToPick);
                    
                    if (spellLevel === 1) spellList.level1.push(...picked.map(s => s.name));
                    if (spellLevel === 2) spellList.level2!.push(...picked.map(s => s.name));
                    if (spellLevel === 3) spellList.level3!.push(...picked.map(s => s.name));
                }
            });
        }
    }

    // Magias Raciais
    if (race.id === 'tiefling') {
        if (!spellList.cantrips.includes('Taumaturgia')) spellList.cantrips.push('Taumaturgia (Racial)');
        if (level >= 3 && !spellList.level1.includes('Repreensão Infernal')) spellList.level1.push('Repreensão Infernal (Racial)');
        // Lvl 5 Tiefling ganha Darkness, mas não temos Darkness no DB ainda.
    }
    if (race.id === 'elf-high') {
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
    const stats: number[] = [];
    for (let i = 0; i < 6; i++) {
      stats.push(roll4d6DropLowest());
    }
    return stats.sort((a, b) => b - a);
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
    let hp = charClass.hitDie + conMod;
    
    if (race.id === 'dwarf-hill') {
      hp += 1; 
    }

    if (level > 1) {
      const avgDie = (charClass.hitDie / 2) + 1;
      for (let i = 2; i <= level; i++) {
        hp += Math.max(1, avgDie + conMod);
        if (race.id === 'dwarf-hill') hp += 1;
      }
    }

    return hp;
  }

  private calculateAC(modifiers: StatModifiers, charClass: Class, features: ClassFeature[]): number {
    const dexMod = modifiers.DEX;
    let ac = 10 + dexMod;

    const hasChainMail = charClass.startingEquipment.some(i => i.includes('Cota de Malha'));
    const hasScaleMail = charClass.startingEquipment.some(i => i.includes('Cota de Escamas'));
    const hasLeather = charClass.startingEquipment.some(i => i.includes('Couro') || i.includes('Couro Batido'));
    const hasShield = charClass.startingEquipment.some(i => i.includes('Escudo'));

    // Lógica simples de prioridade: Heavy > Medium > Unarmored > Light
    if (hasChainMail) {
        ac = 16; 
        if (hasShield) ac += 2;
        return ac;
    } 
    
    if (hasScaleMail) {
        ac = 14 + Math.min(dexMod, 2);
        if (hasShield) ac += 2;
        return ac;
    }

    // Unarmored Defense (Monk/Barbarian) - Assume que preferem isso se for melhor que light armor
    if (charClass.id === 'monk') {
         const monkAC = 10 + dexMod + modifiers.WIS;
         if (monkAC > ac) ac = monkAC;
    }
    else if (charClass.id === 'barbarian') {
         const barbAC = 10 + dexMod + modifiers.CON;
         // Bárbaro pode usar escudo com Unarmored Defense
         const shieldBonus = hasShield ? 2 : 0;
         if ((barbAC + shieldBonus) > ac) ac = barbAC + shieldBonus;
    }
    // Se não for unarmored ou se light armor for melhor (raro para esses dois, mas possível)
    else if (hasLeather) {
        ac = 11 + dexMod;
        if (hasShield) ac += 2;
    }
    // Caso base (sem armadura, mago/sorcerer)
    else {
        // Mago/Sorcerer pode ter Mage Armor (AC 13+dex), mas é spell, não base.
        // Draconic Sorcerer (Feature)
        const draconicResilience = features.find(f => f.name === 'Resiliência Dracônica');
        if (draconicResilience) {
            ac = 13 + dexMod;
        }
    }

    return ac;
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
    const names = ["Tharivol", "Erevan", "Keth", "Murbella", "Dorn", "Zephyros", "Seraphina", "Grim", "Valeria", "Nyx"];
    return names[Math.floor(Math.random() * names.length)];
  }
}
