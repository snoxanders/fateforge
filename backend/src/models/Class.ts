export interface Class {
  id: string;
  name: string;
  hitDie: 6 | 8 | 10 | 12;
  statPriority: ('STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA')[]; 
  spellcasting?: {
    ability: 'INT' | 'WIS' | 'CHA';
    slotsPerLevel: { [level: number]: { [spellLevel: number]: number } };
    knownSpellsPerLevel?: { [level: number]: number }; // Magias de círculo 1+
    cantripsKnown?: { [level: number]: number };      // Truques
  };
  proficiencies: {
    armor: string[];
    weapons: string[];
    tools: string[];
    savingThrows: string[];
    skills: ClassSkillChoice;
  };
  startingEquipment: string[];
  features: ClassFeature[];
  subclasses?: Subclass[];
  subclassLevel?: number; // nível em que a subclasse é escolhida (padrão 3)
}

export interface Subclass {
  id: string;
  name: string;
  description: string;
  features: ClassFeature[];
}

export interface ClassSkillChoice {
  choose: number;
  from: string[];
}

export interface ClassFeature {
  name: string;
  level: number;
  description: string;
}
