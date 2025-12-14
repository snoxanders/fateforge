export interface Character {
  id?: string;
  name: string;
  level: number;
  experience: number;
  race: { id: string; name: string; speed: number; size: string };
  class: { id: string; name: string; hitDie: number };
  subclass?: { id: string; name: string; description: string };
  
  attributes: {
      [key: string]: { value: number; modifier: number; save: number };
  };
  
  hp: { max: number; current: number; hitDice: string; };
  armorClass: { value: number; description: string };
  proficiencyBonus: number;
  initiative: number;
  speed: number;
  passivePerception: number;
  
  skills: { name: string; value: number; proficient: boolean; ability: string }[];
  
  proficiencies: {
    armor: string[];
    weapons: string[];
    tools: string[];
    languages: string[];
    savingThrows: string[];
  };
  
  equipment: { name: string; quantity: number; type?: string; properties?: string[]; armorClass?: number }[];
  wallet: { cp: number; sp: number; ep: number; gp: number; pp: number };
  
  spells?: {
      spellcasting?: { ability: string; saveDC: number; attackBonus: number; };
      spells: { name: string; level: number; school?: string; prepared?: boolean }[];
  };
  
  background: { name: string; description: string; feature: string };
  personality: { traits: string[]; ideals: string[]; bonds: string[]; flaws: string[] };
  bio: { age: number; height: string; weight: string; eyes: string; skin: string; hair: string; appearance: string; backstory: string; alignment: string };
}


