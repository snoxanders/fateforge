export type SpellSchool = 'Abjuração' | 'Conjuração' | 'Adivinhação' | 'Encantamento' | 'Evocação' | 'Ilusão' | 'Necromancia' | 'Transmutação';

export interface Spell {
  id: string;
  name: string;
  level: number; // 0 = Truque
  school: SpellSchool;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  classes: string[]; // IDs das classes que podem usar (ex: ['wizard', 'sorcerer'])
}

export const SPELLS: Spell[] = [
  // --- TRUQUES (Cantrips) ---
  {
    id: 'mage-hand',
    name: 'Mãos Mágicas',
    level: 0,
    school: 'Conjuração',
    castingTime: '1 ação',
    range: '9 metros',
    components: 'V, S',
    duration: '1 minuto',
    description: 'Uma mão espectral flutuante aparece num ponto à sua escolha. Você pode usar a mão para manipular objetos, abrir portas, etc.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock']
  },
  {
    id: 'light',
    name: 'Luz',
    level: 0,
    school: 'Evocação',
    castingTime: '1 ação',
    range: 'Toque',
    components: 'V, M',
    duration: '1 hora',
    description: 'Você toca um objeto e ele emite luz brilhante num raio de 6m e penumbra por mais 6m.',
    classes: ['wizard', 'cleric', 'bard', 'sorcerer']
  },
  {
    id: 'fire-bolt',
    name: 'Raio de Fogo',
    level: 0,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '36 metros',
    components: 'V, S',
    duration: 'Instantânea',
    description: 'Você arremessa um mote de fogo numa criatura. Faça um ataque de magia a distância. Dano: 1d10 de fogo.',
    classes: ['wizard', 'sorcerer']
  },
  {
    id: 'sacred-flame',
    name: 'Chama Sagrada',
    level: 0,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '18 metros',
    components: 'V, S',
    duration: 'Instantânea',
    description: 'Chamas descem sobre uma criatura. O alvo deve passar num teste de DEX ou sofrer 1d8 de dano radiante.',
    classes: ['cleric']
  },
  {
    id: 'prestidigitation',
    name: 'Prestidigitação',
    level: 0,
    school: 'Transmutação',
    castingTime: '1 ação',
    range: '3 metros',
    components: 'V, S',
    duration: 'Até 1 hora',
    description: 'Você cria um efeito mágico sensorial inofensivo, acende uma vela, limpa ou suja um objeto, etc.',
    classes: ['wizard', 'bard', 'sorcerer', 'warlock']
  },
  {
    id: 'thaumaturgy',
    name: 'Taumaturgia',
    level: 0,
    school: 'Transmutação',
    castingTime: '1 ação',
    range: '9 metros',
    components: 'V',
    duration: '1 minuto',
    description: 'Você manifesta um sinal menor de poder sobrenatural (trovão, corvos, tremores leves).',
    classes: ['cleric', 'tiefling'] // Tiefling ganha via racial
  },
  {
    id: 'vicious-mockery',
    name: 'Zombaria Viciosa',
    level: 0,
    school: 'Encantamento',
    castingTime: '1 ação',
    range: '18 metros',
    components: 'V',
    duration: 'Instantânea',
    description: 'Você lança insultos mágicos. O alvo faz teste de WIS ou sofre 1d4 psíquico e desvantagem no próximo ataque.',
    classes: ['bard']
  },

  // --- NÍVEL 1 ---
  {
    id: 'magic-missile',
    name: 'Mísseis Mágicos',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '36 metros',
    components: 'V, S',
    duration: 'Instantânea',
    description: 'Você cria três dardos brilhantes de força mágica. Cada dardo atinge uma criatura à sua escolha causando 1d4+1 de dano de força infalível.',
    classes: ['wizard', 'sorcerer']
  },
  {
    id: 'shield',
    name: 'Escudo Arcano',
    level: 1,
    school: 'Abjuração',
    castingTime: '1 reação',
    range: 'Pessoal',
    components: 'V, S',
    duration: '1 rodada',
    description: 'Uma barreira invisível aparece. +5 na CA até o início do seu próximo turno, inclusive contra o ataque que ativou a reação.',
    classes: ['wizard', 'sorcerer']
  },
  {
    id: 'cure-wounds',
    name: 'Curar Ferimentos',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação',
    range: 'Toque',
    components: 'V, S',
    duration: 'Instantânea',
    description: 'Uma criatura que você tocar recupera pontos de vida iguais a 1d8 + seu modificador de habilidade de conjuração.',
    classes: ['cleric', 'bard', 'paladin', 'ranger'] // Paladin/Ranger ganham lvl 2, mas ok ter na lista
  },
  {
    id: 'healing-word',
    name: 'Palavra Curativa',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação bônus',
    range: '18 metros',
    components: 'V',
    duration: 'Instantânea',
    description: 'Uma criatura à sua escolha recupera PV iguais a 1d4 + modificador de conjuração.',
    classes: ['cleric', 'bard']
  },
  {
    id: 'bless',
    name: 'Bênção',
    level: 1,
    school: 'Encantamento',
    castingTime: '1 ação',
    range: '9 metros',
    components: 'V, S, M',
    duration: 'Concentração, até 1 min',
    description: 'Você abençoa até 3 criaturas. Elas somam 1d4 em jogadas de ataque e testes de resistência.',
    classes: ['cleric', 'paladin']
  },
  {
    id: 'sleep',
    name: 'Sono',
    level: 1,
    school: 'Encantamento',
    castingTime: '1 ação',
    range: '27 metros',
    components: 'V, S, M',
    duration: '1 minuto',
    description: 'Criaturas num raio de 6m caem no sono mágico, começando pelas de menor PV atual (total 5d8 PV afetados).',
    classes: ['wizard', 'bard', 'sorcerer']
  },
  {
    id: 'guiding-bolt',
    name: 'Raio Guiador',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '36 metros',
    components: 'V, S',
    duration: '1 rodada',
    description: 'Um flash de luz atinge a criatura. Ataque de magia, 4d6 radiante. O próximo ataque contra ela tem vantagem.',
    classes: ['cleric']
  },
  {
    id: 'thunderwave',
    name: 'Onda Trovejante',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação',
    range: 'Pessoal (cubo 4.5m)',
    components: 'V, S',
    duration: 'Instantânea',
    description: 'Uma onda de força trovejante varre a área. Teste de CON ou 2d8 trovejante e empurrado 3m.',
    classes: ['wizard', 'bard', 'sorcerer']
  }
];

