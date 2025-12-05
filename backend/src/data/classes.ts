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
  },
  {
    id: 'barbarian',
    name: 'Bárbaro',
    hitDie: 12,
    statPriority: ['STR', 'CON', 'DEX', 'WIS', 'CHA', 'INT'],
    startingEquipment: [
        'Machado Grande (1d12 cortante)',
        'Duas machadinhas',
        'Pacote de Explorador',
        '4 Azagaias'
    ],
    proficiencies: {
      armor: ['Armaduras leves', 'Armaduras médias', 'Escudos'],
      weapons: ['Armas simples', 'Armas marciais'],
      tools: [],
      savingThrows: ['STR', 'CON'],
      skills: {
        choose: 2,
        from: ['Adestrar Animais', 'Atletismo', 'Intimidação', 'Natureza', 'Percepção', 'Sobrevivência']
      }
    },
    features: [
      { name: 'Fúria', level: 1, description: 'Em batalha, você luta com uma ferocidade primitiva.' },
      { name: 'Defesa Sem Armadura', level: 1, description: 'Quando você não estiver vestindo nenhuma armadura, sua CA será 10 + mod. Destreza + mod. Constituição.' }
    ]
  },
  {
    id: 'ranger',
    name: 'Patrulheiro (Ranger)',
    hitDie: 10,
    statPriority: ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
    startingEquipment: [
        'Armadura de Couro Batido (AC 12+Dex)',
        'Duas Espadas Curtas (1d6 perfurante)',
        'Arco Longo e 20 flechas',
        'Pacote de Explorador'
    ],
    proficiencies: {
      armor: ['Armaduras leves', 'Armaduras médias', 'Escudos'],
      weapons: ['Armas simples', 'Armas marciais'],
      tools: [],
      savingThrows: ['STR', 'DEX'],
      skills: {
        choose: 3,
        from: ['Adestrar Animais', 'Atletismo', 'Furtividade', 'Intuição', 'Investigação', 'Natureza', 'Percepção', 'Sobrevivência']
      }
    },
    features: [
      { name: 'Inimigo Favorito', level: 1, description: 'Você estuda, rastreia, caça e até mesmo fala com um certo tipo de inimigo.' },
      { name: 'Explorador Natural', level: 1, description: 'Você é um mestre em navegar pelo mundo natural.' }
    ]
  },
  {
    id: 'sorcerer',
    name: 'Feiticeiro',
    hitDie: 6,
    statPriority: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
    spellcasting: {
        ability: 'CHA',
        cantripsKnown: 4,
        spellsKnown: 2
    },
    startingEquipment: [
        'Besta Leve e 20 virotes',
        'Foco Arcano',
        'Pacote de Aventureiro',
        'Duas Adagas'
    ],
    proficiencies: {
      armor: [],
      weapons: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas leves'],
      tools: [],
      savingThrows: ['CON', 'CHA'],
      skills: {
        choose: 2,
        from: ['Arcanismo', 'Enganação', 'Intuição', 'Intimidação', 'Persuasão', 'Religião']
      }
    },
    features: [
      { name: 'Origem de Feitiçaria', level: 1, description: 'Escolha uma origem de feitiçaria, que descreve a fonte do seu poder mágico inato.' },
      { name: 'Conjuração', level: 1, description: 'O poder da magia corre em suas veias.' }
    ]
  },
  {
    id: 'monk',
    name: 'Monge',
    hitDie: 8,
    statPriority: ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
    startingEquipment: [
        'Espada Curta (1d6 perfurante)',
        'Pacote de Aventureiro',
        '10 Dardos'
    ],
    proficiencies: {
      armor: [],
      weapons: ['Armas simples', 'Espadas curtas'],
      tools: ['Um tipo de ferramenta de artesão ou instrumento musical'],
      savingThrows: ['STR', 'DEX'],
      skills: {
        choose: 2,
        from: ['Acrobacia', 'Atletismo', 'Furtividade', 'História', 'Intuição', 'Religião']
      }
    },
    features: [
      { name: 'Defesa Sem Armadura', level: 1, description: 'Quando não estiver usando armadura nem escudo, sua CA é 10 + mod. Destreza + mod. Sabedoria.' },
      { name: 'Artes Marciais', level: 1, description: 'Sua prática de artes marciais lhe dá domínio do estilo de combate desarmado e com armas de monge.' }
    ]
  },
  {
    id: 'warlock',
    name: 'Bruxo',
    hitDie: 8,
    statPriority: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
    spellcasting: {
        ability: 'CHA',
        cantripsKnown: 2,
        spellsKnown: 2
    },
    startingEquipment: [
        'Besta Leve e 20 virotes',
        'Foco Arcano',
        'Armadura de Couro (AC 11+Dex)',
        'Arma Simples',
        'Duas Adagas'
    ],
    proficiencies: {
      armor: ['Armaduras leves'],
      weapons: ['Armas simples'],
      tools: [],
      savingThrows: ['WIS', 'CHA'],
      skills: {
        choose: 2,
        from: ['Arcanismo', 'Enganação', 'História', 'Intimidação', 'Investigação', 'Natureza', 'Religião']
      }
    },
    features: [
      { name: 'Patrono Sobrenatural', level: 1, description: 'Você firmou um pacto com um ser extraplanar.' },
      { name: 'Magia de Pacto', level: 1, description: 'Sua pesquisa arcana e a magia concedida a você pelo seu patrono lhe deram facilidade com magias.' }
    ]
  },
  {
    id: 'druid',
    name: 'Druida',
    hitDie: 8,
    statPriority: ['WIS', 'CON', 'DEX', 'STR', 'INT', 'CHA'],
    spellcasting: {
        ability: 'WIS',
        cantripsKnown: 2,
        spellsKnown: 4 // WIS mod + Level (aprox)
    },
    startingEquipment: [
        'Escudo de Madeira (+2 AC)',
        'Cimitarra (1d6 cortante)',
        'Armadura de Couro (AC 11+Dex)',
        'Foco Druídico',
        'Pacote de Explorador'
    ],
    proficiencies: {
      armor: ['Armaduras leves', 'Armaduras médias', 'Escudos (apenas madeira)'],
      weapons: ['Clavas', 'Adagas', 'Dardos', 'Azagaias', 'Maças', 'Bordões', 'Cimitarras', 'Foices', 'Fundas', 'Lanças'],
      tools: ['Kit de Herbalismo'],
      savingThrows: ['INT', 'WIS'],
      skills: {
        choose: 2,
        from: ['Adestrar Animais', 'Arcanismo', 'Intuição', 'Medicina', 'Natureza', 'Percepção', 'Religião', 'Sobrevivência']
      }
    },
    features: [
      { name: 'Druídico', level: 1, description: 'Você conhece o idioma secreto dos druidas.' },
      { name: 'Conjuração', level: 1, description: 'Extraindo a essência divina da própria natureza, você pode conjurar magias.' }
    ]
  }
];
