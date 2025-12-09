import { Stats, StatModifiers } from './Stats';
import { Race } from './Race';
import { Class, Subclass } from './Class';

export interface Character {
  id?: string;
  name: string;
  level: number;
  race: Race;
  class: Class;
  subclass?: Subclass; // Subclasse escolhida (se houver)
  stats: Stats;
  modifiers: StatModifiers;
  hp: number;
  armorClass: number;
  proficiencyBonus: number;
  initiative: number;
  speed: number;
  skills: string[];
  equipment: string[];
  spells: {
    cantrips: string[];
    level1: string[];
    level2?: string[];
    level3?: string[];
  };
  background: CharacterBackground;
  personality: PersonalityTraits;
}

export interface CharacterBackground {
  name: string;
  description: string;
}

export interface PersonalityTraits {
  trait: string;
  ideal: string;
  bond: string;
  flaw: string;
}

export type GenerationMethod = 'roll' | 'standard' | 'point-buy';

export interface GenerationPreferences {
  level?: number;
  method?: GenerationMethod;
  classId?: string; 
  raceId?: string;
}
