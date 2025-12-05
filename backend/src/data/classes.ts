import { Class } from '../models/Class';

export const CLASSES: Class[] = [
  {
    id: 'fighter',
    name: 'Guerreiro',
    hitDie: 10,
    statPriority: ['STR', 'CON', 'DEX', 'WIS', 'CHA', 'INT'],
    startingEquipment: [
        'Cota de Malha (AC 16)',
        'Espada Longa (1d8 cortante)',
        'Escudo (+2 AC)',
        'Besta Leve e 20 virotes',
        'Pacote de Aventureiro'
    ],
    proficiencies: {
      armor: ['Todas as armaduras', 'Escudos'],
      weapons: ['Armas simples', 'Armas marciais'],
      tools: [],
      savingThrows: ['STR', 'CON'],
      skills: {
        choose: 2,
        from: ['Acrobacia', 'Adestrar Animais', 'Atletismo', 'História', 'Intuição', 'Intimidação', 'Percepção', 'Sobrevivência']
      }
    },
    features: [
      { name: 'Estilo de Luta', level: 1, description: 'Você adota um estilo de combate particular como sua especialidade.' },
      { name: 'Retomar o Fôlego', level: 1, description: 'Você possui uma reserva de energia limitada para se recuperar de ferimentos.' }
    ]
  },
  {
    id: 'wizard',
    name: 'Mago',
    hitDie: 6,
    statPriority: ['INT', 'CON', 'DEX', 'WIS', 'CHA', 'STR'],
    spellcasting: {
        ability: 'INT',
        cantripsKnown: 3,
        spellsKnown: 6 // No grimório, mas prepara INT + Lvl. Simplificado: ganha 6 no lvl 1.
    },
    startingEquipment: [
        'Bordão (1d6 contundente)',
        'Bolsa de Componentes',
        'Grimório',
        'Pacote de Estudioso'
    ],
    proficiencies: {
      armor: [],
      weapons: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas leves'],
      tools: [],
      savingThrows: ['INT', 'WIS'],
      skills: {
        choose: 2,
        from: ['Arcanismo', 'História', 'Intuição', 'Investigação', 'Medicina', 'Religião']
      }
    },
    features: [
      { name: 'Recuperação Arcana', level: 1, description: 'Você aprendeu a recuperar parte de sua energia mágica estudando seu grimório.' },
      { name: 'Conjuração', level: 1, description: 'Como um estudante de magia arcana, você possui um grimório contendo magias.' }
    ]
  },
  {
    id: 'rogue',
    name: 'Ladino',
    hitDie: 8,
    statPriority: ['DEX', 'CON', 'WIS', 'CHA', 'INT', 'STR'],
    startingEquipment: [
        'Rapieira (1d8 perfurante)',
        'Arco Curto e 20 flechas',
        'Armadura de Couro (AC 11+Dex)',
        'Duas Adagas',
        'Ferramentas de Ladrão',
        'Pacote de Assaltante'
    ],
    proficiencies: {
      armor: ['Armaduras leves'],
      weapons: ['Armas simples', 'Bestas de mão', 'Espadas longas', 'Rapiers', 'Espadas curtas'],
      tools: ['Ferramentas de Ladrão'],
      savingThrows: ['DEX', 'INT'],
      skills: {
        choose: 4,
        from: ['Acrobacia', 'Atletismo', 'Enganação', 'Intuição', 'Intimidação', 'Investigação', 'Percepção', 'Atuação', 'Persuasão', 'Prestidigitação', 'Furtividade']
      }
    },
    features: [
      { name: 'Ataque Furtivo', level: 1, description: 'A partir do 1º nível, você sabe como atacar sutilmente e explorar a distração de um inimigo.' },
      { name: 'Gíria de Ladrão', level: 1, description: 'Durante seu treinamento de ladino você aprendeu a gíria de ladrão, uma mistura secreta de dialeto, jargão e código.' }
    ]
  },
  {
    id: 'cleric',
    name: 'Clérigo',
    hitDie: 8,
    statPriority: ['WIS', 'CON', 'STR', 'DEX', 'CHA', 'INT'],
    spellcasting: {
        ability: 'WIS',
        cantripsKnown: 3,
        spellsKnown: 4 // WIS mod + Lvl (aprox)
    },
    startingEquipment: [
        'Maça (1d6 contundente)',
        'Cota de Escamas (AC 14+Dex)',
        'Escudo (+2 AC)',
        'Símbolo Sagrado',
        'Pacote de Sacerdote'
    ],
    proficiencies: {
      armor: ['Armaduras leves', 'Armaduras médias', 'Escudos'],
      weapons: ['Armas simples'],
      tools: [],
      savingThrows: ['WIS', 'CHA'],
      skills: {
        choose: 2,
        from: ['História', 'Intuição', 'Medicina', 'Persuasão', 'Religião']
      }
    },
    features: [
      { name: 'Conjuração', level: 1, description: 'Como um canal de poder divino, você pode conjurar magias de clérigo.' },
      { name: 'Domínio Divino', level: 1, description: 'Escolha um domínio relacionado à sua divindade (ex: Vida, Luz, Guerra).' }
    ]
  },
  {
    id: 'bard',
    name: 'Bardo',
    hitDie: 8,
    statPriority: ['CHA', 'DEX', 'CON', 'WIS', 'INT', 'STR'],
    spellcasting: {
        ability: 'CHA',
        cantripsKnown: 2,
        spellsKnown: 4
    },
    startingEquipment: [
        'Rapieira (1d8 perfurante)',
        'Instrumento Musical',
        'Armadura de Couro (AC 11+Dex)',
        'Adaga',
        'Pacote de Artista'
    ],
    proficiencies: {
      armor: ['Armaduras leves'],
      weapons: ['Armas simples', 'Bestas de mão', 'Espadas longas', 'Rapiers', 'Espadas curtas'],
      tools: ['Três instrumentos musicais à sua escolha'],
      savingThrows: ['DEX', 'CHA'],
      skills: {
        choose: 3,
        from: ['Qualquer perícia'] 
      }
    },
    features: [
      { name: 'Conjuração', level: 1, description: 'Você aprendeu a desembaraçar e remodelar o tecido da realidade em harmonia com seus desejos e música.' },
      { name: 'Inspiração de Bardo', level: 1, description: 'Você pode inspirar os outros através de palavras ou música.' }
    ]
  },
  {
    id: 'paladin',
    name: 'Paladino',
    hitDie: 10,
    statPriority: ['STR', 'CHA', 'CON', 'WIS', 'DEX', 'INT'],
    startingEquipment: [
        'Espada Longa (1d8 cortante)',
        'Escudo (+2 AC)',
        'Cota de Malha (AC 16)',
        'Símbolo Sagrado',
        'Pacote de Aventureiro'
    ],
    proficiencies: {
      armor: ['Todas as armaduras', 'Escudos'],
      weapons: ['Armas simples', 'Armas marciais'],
      tools: [],
      savingThrows: ['WIS', 'CHA'],
      skills: {
        choose: 2,
        from: ['Atletismo', 'Intuição', 'Intimidação', 'Medicina', 'Persuasão', 'Religião']
      }
    },
    features: [
      { name: 'Sentido Divino', level: 1, description: 'A presença de um mal forte registra em seus sentidos como um odor nocivo.' },
      { name: 'Cura pelas Mãos', level: 1, description: 'Seu toque abençoado pode curar ferimentos.' }
    ]
  }
];
