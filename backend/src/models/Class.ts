export interface Class {
  id: string;
  name: string;
  hitDie: 6 | 8 | 10 | 12;
  statPriority: ('STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA')[]; 
  spellcasting?: {
    ability: 'INT' | 'WIS' | 'CHA';
    cantripsKnown: number; 
    spellsKnown: number;   
  };
  proficiencies: {
    armor: string[];
    weapons: string[];
    tools: string[];
    savingThrows: string[];
    skills: ClassSkillChoice;
  };
  startingEquipment: string[]; // Lista de itens iniciais (simplificado)
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
