import { Stats } from './Stats';

export interface Race {
  id: string;
  name: string;
  subrace?: string;
  speed: number;
  size: 'Small' | 'Medium' | 'Large';
  abilityBonuses: Partial<Stats>; // Ex: { STR: 2, CON: 2 }
  traits: RaceTrait[];
  languages: string[];
}

export interface RaceTrait {
  name: string;
  description: string;
}

