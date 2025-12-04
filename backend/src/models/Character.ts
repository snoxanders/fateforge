import { Stats, StatModifiers } from './Stats';
import { Race } from './Race';
import { Class } from './Class';

export interface Character {
  id?: string;
  name: string;
  level: number;
  race: Race;
  class: Class;
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
    cantrips: string[]; // Nomes das magias
    level1: string[];
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
  classId?: string; // Opcional: forçar classe
  raceId?: string;  // Opcional: forçar raça
}

