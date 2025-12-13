import { Race } from './Race';
import { Class, Subclass } from './Class';

export interface Attribute {
  value: number;
  modifier: number;
  save: number; // Saving Throw bonus
}

export interface Attributes {
  STR: Attribute;
  DEX: Attribute;
  CON: Attribute;
  INT: Attribute;
  WIS: Attribute;
  CHA: Attribute;
}

export interface Skill {
  name: string;
  ability: keyof Attributes;
  value: number;
  proficient: boolean;
}

export interface SpellSlot {
  level: number;
  total: number;
  used: number;
}

export interface Spell {
  name: string;
  level: number;
  school?: string;
  castingTime?: string;
  range?: string;
  components?: string[];
  duration?: string;
  description?: string;
  prepared?: boolean;
}

export interface Spellcasting {
  ability: keyof Attributes;
  saveDC: number;
  attackBonus: number;
  slots: SpellSlot[];
  spells: Spell[]; // Flat list or organized by level
}

export interface EquipmentItem {
  name: string;
  quantity: number;
  type?: string; // weapon, armor, gear
  properties?: string[];
  damage?: string;
  armorClass?: number;
}

export interface Wallet {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
}

export interface Bio {
  age: number;
  height: string;
  weight: string;
  eyes: string;
  skin: string;
  hair: string;
  alignment: string;
  appearance: string;
  backstory: string;
}

export interface Character {
  id?: string;
  name: string;
  level: number;
  experience: number;
  playerName?: string;
  
  race: Race;
  class: Class;
  subclass?: Subclass;
  
  attributes: Attributes;
  
  hp: {
    max: number;
    current: number;
    temp: number;
    hitDice: string; // e.g., "1d10"
    hitDiceTotal: number;
    hitDiceCurrent: number;
  };
  
  armorClass: {
    value: number;
    description: string; // e.g. "16 (Chain Mail)"
  };
  
  proficiencyBonus: number;
  initiative: number;
  speed: number;
  passivePerception: number;
  
  skills: Skill[];
  proficiencies: {
    armor: string[];
    weapons: string[];
    tools: string[];
    languages: string[];
    savingThrows: (keyof Attributes)[];
  };
  
  equipment: EquipmentItem[];
  wallet: Wallet;
  
  spellcasting?: Spellcasting;
  
  background: CharacterBackground;
  personality: PersonalityTraits;
  bio: Bio;
}

export interface CharacterBackground {
  name: string;
  feature: string;
  description: string;
}

export interface PersonalityTraits {
  traits: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
}

export type GenerationMethod = 'roll' | 'standard' | 'point-buy';

export interface GenerationPreferences {
  level?: number;
  method?: GenerationMethod;
  classId?: string; 
  raceId?: string;
}
