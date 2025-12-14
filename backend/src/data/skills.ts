import { Attributes } from '../models/Character';

export const SKILLS_MAPPING: { name: string; ability: keyof Attributes }[] = [
  { name: 'Acrobacia', ability: 'DEX' },
  { name: 'Adestrar Animais', ability: 'WIS' },
  { name: 'Arcanismo', ability: 'INT' },
  { name: 'Atletismo', ability: 'STR' },
  { name: 'Atuação', ability: 'CHA' },
  { name: 'Enganação', ability: 'CHA' },
  { name: 'Furtividade', ability: 'DEX' },
  { name: 'História', ability: 'INT' },
  { name: 'Intimidação', ability: 'CHA' },
  { name: 'Intuição', ability: 'WIS' },
  { name: 'Investigação', ability: 'INT' },
  { name: 'Medicina', ability: 'WIS' },
  { name: 'Natureza', ability: 'INT' },
  { name: 'Percepção', ability: 'WIS' },
  { name: 'Persuasão', ability: 'CHA' },
  { name: 'Prestidigitação', ability: 'DEX' },
  { name: 'Religião', ability: 'INT' },
  { name: 'Sobrevivência', ability: 'WIS' },
];


