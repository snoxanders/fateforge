import { Class } from '../models/Class';

// Standard Full Caster Slots
const fullCasterSlots = {
    1: { 1: 2 },
    2: { 1: 3 },
    3: { 1: 4, 2: 2 },
    4: { 1: 4, 2: 3 },
    5: { 1: 4, 2: 3, 3: 2 }
};

// Standard Cantrips Progression (Bard, Druid, Warlock start with 2)
const standardCantrips = { 1: 2, 2: 2, 3: 2, 4: 3, 5: 3 }; 
// Cleric/Wizard start with 3
const highCantrips = { 1: 3, 2: 3, 3: 3, 4: 4, 5: 4 };
// Sorcerer starts with 4
const sorcererCantrips = { 1: 4, 2: 4, 3: 4, 4: 5, 5: 5 };

const halfCasterSlots = {
    1: {},
    2: { 1: 2 },
    3: { 1: 3 },
    4: { 1: 3 },
    5: { 1: 4, 2: 2 }
};

const warlockSlots = {
    1: { 1: 1 },
    2: { 1: 2 },
    3: { 2: 2 }, 
    4: { 2: 2 },
    5: { 3: 2 }
};

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
      { name: 'Retomar o Fôlego', level: 1, description: 'Você possui uma reserva de energia limitada para se recuperar de ferimentos (1d10 + nível).' },
      { name: 'Surto de Ação', level: 2, description: 'Você pode realizar uma ação adicional no seu turno.' },
      { name: 'Arquétipo Marcial', level: 3, description: 'Você escolhe um arquétipo que se esforça para emular.' },
      { name: 'Aumento no Valor de Habilidade', level: 4, description: 'Você pode aumentar um valor de habilidade em 2, ou dois valores em 1.' },
      { name: 'Ataque Extra', level: 5, description: 'Você pode atacar duas vezes, ao invés de uma, quando realizar a ação de Ataque.' }
    ],
    subclasses: [
        {
            id: 'champion',
            name: 'Campeão',
            description: 'O arquétipo de Campeão foca no desenvolvimento da força bruta e aprimoramento até a perfeição mortal.',
            features: [
                { name: 'Crítico Aprimorado', level: 3, description: 'Seus ataques com arma adquirem um acerto crítico numa rolagem 19 ou 20.' }
            ]
        }
    ]
  },
  {
    id: 'wizard',
    name: 'Mago',
    hitDie: 6,
    statPriority: ['INT', 'CON', 'DEX', 'WIS', 'CHA', 'STR'],
    spellcasting: {
        ability: 'INT',
        slotsPerLevel: fullCasterSlots,
        knownSpellsPerLevel: { 1: 6, 2: 8, 3: 10, 4: 12, 5: 14 },
        cantripsKnown: highCantrips
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
      { name: 'Conjuração', level: 1, description: 'Como um estudante de magia arcana, você possui um grimório contendo magias.' },
      { name: 'Tradição Arcana', level: 2, description: 'Você escolhe uma tradição arcana.' },
      { name: 'Aumento no Valor de Habilidade', level: 4, description: 'Você pode aumentar um valor de habilidade em 2, ou dois valores em 1.' }
    ],
    subclasses: [
        {
            id: 'school-evocation',
            name: 'Escola de Evocação',
            description: 'Você foca seus estudos na magia que cria poderosos efeitos elementais.',
            features: [
                { name: 'Esculpir Magias', level: 2, description: 'Você pode criar bolsões de segurança relativa dentro dos efeitos de suas magias de evocação.' }
            ]
        }
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
      { name: 'Ataque Furtivo', level: 1, description: 'Você sabe como atacar sutilmente e explorar a distração de um inimigo.' },
      { name: 'Gíria de Ladrão', level: 1, description: 'Mistura secreta de dialeto, jargão e código.' },
      { name: 'Ação Astuta', level: 2, description: 'Você pode usar uma ação bônus para Correr, Desengajar ou Esconder.' },
      { name: 'Arquétipo de Ladino', level: 3, description: 'Você escolhe um arquétipo que se esforça para emular.' },
      { name: 'Aumento no Valor de Habilidade', level: 4, description: 'Você pode aumentar um valor de habilidade em 2, ou dois valores em 1.' },
      { name: 'Esquiva Sobrenatural', level: 5, description: 'Quando um atacante que você possa ver o atinge com um ataque, você pode usar sua reação para reduzir o dano à metade.' }
    ],
    subclasses: [
        {
            id: 'thief',
            name: 'Ladrão',
            description: 'Você aprimora suas habilidades nas artes furtivas.',
            features: [
                { name: 'Mãos Rápidas', level: 3, description: 'Você pode usar a ação bônus concedida pela sua Ação Astuta para fazer um teste de Destreza (Prestidigitação), usar suas ferramentas de ladrão para desarmar uma armadilha ou abrir uma fechadura, ou realizar a ação de Usar um Objeto.' },
                { name: 'Andarilho de Telhados', level: 3, description: 'Você ganha a habilidade de escalar mais rápido.' }
            ]
        }
    ]
  },
  {
    id: 'cleric',
    name: 'Clérigo',
    hitDie: 8,
    statPriority: ['WIS', 'CON', 'STR', 'DEX', 'CHA', 'INT'],
    spellcasting: {
        ability: 'WIS',
        slotsPerLevel: fullCasterSlots,
        cantripsKnown: highCantrips
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
      { name: 'Domínio Divino', level: 1, description: 'Escolha um domínio relacionado à sua divindade.' },
      { name: 'Canalizar Divindade', level: 2, description: 'Você ganha a habilidade de canalizar energia divina diretamente de sua divindade.' },
      { name: 'Aumento no Valor de Habilidade', level: 4, description: 'Você pode aumentar um valor de habilidade em 2, ou dois valores em 1.' },
      { name: 'Destruir Mortos-Vivos', level: 5, description: 'Quando um morto-vivo falhar no teste de resistência contra seu Expulsar Mortos-vivos, a criatura é instantaneamente destruída se seu nível de desafio for 1/2 ou menor.' }
    ],
    subclasses: [
        {
            id: 'life-domain',
            name: 'Domínio da Vida',
            description: 'O domínio da vida foca na energia positiva vibrante, uma das forças fundamentais do universo, que sustenta toda a vida.',
            features: [
                { name: 'Discípulo da Vida', level: 1, description: 'Suas magias de cura são mais efetivas.' },
                { name: 'Canalizar Divindade: Preservar a Vida', level: 2, description: 'Você pode usar seu Canalizar Divindade para curar os feridos.' }
            ]
        }
    ]
  },
  {
    id: 'bard',
    name: 'Bardo',
    hitDie: 8,
    statPriority: ['CHA', 'DEX', 'CON', 'WIS', 'INT', 'STR'],
    spellcasting: {
        ability: 'CHA',
        slotsPerLevel: fullCasterSlots,
        knownSpellsPerLevel: { 1: 4, 2: 5, 3: 6, 4: 7, 5: 8 },
        cantripsKnown: standardCantrips
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
      { name: 'Inspiração de Bardo', level: 1, description: 'Você pode inspirar os outros através de palavras ou música.' },
      { name: 'Jack of All Trades', level: 2, description: 'Você pode adicionar metade de seu bônus de proficiência, arredondado para baixo, em qualquer teste de habilidade que você fizer.' },
      { name: 'Canção de Descanso', level: 2, description: 'Você pode usar música suave ou oratória para ajudar a revitalizar seus aliados feridos durante um descanso curto.' },
      { name: 'Colégio de Bardo', level: 3, description: 'Você mergulha nas técnicas avançadas de um colégio de bardo.' },
      { name: 'Especialização', level: 3, description: 'Escolha duas de suas perícias em que é proficiente. Seu bônus de proficiência é dobrado para qualquer teste de habilidade que você fizer usando qualquer uma das perícias escolhidas.' },
      { name: 'Aumento no Valor de Habilidade', level: 4, description: 'Você pode aumentar um valor de habilidade em 2, ou dois valores em 1.' },
      { name: 'Fonte de Inspiração', level: 5, description: 'Você recupera todos os seus usos de Inspiração de Bardo quando termina um descanso curto ou longo.' }
    ],
    subclasses: [
        {
            id: 'college-lore',
            name: 'Colégio do Conhecimento',
            description: 'Bardos do Colégio do Conhecimento sabem algo sobre quase tudo.',
            features: [
                { name: 'Palavras Cortantes', level: 3, description: 'Você aprende como usar sua sagacidade para distrair, confundir e minar a confiança e competência de outros.' }
            ]
        }
    ]
  },
  {
    id: 'paladin',
    name: 'Paladino',
    hitDie: 10,
    statPriority: ['STR', 'CHA', 'CON', 'WIS', 'DEX', 'INT'],
    spellcasting: {
        ability: 'CHA',
        slotsPerLevel: halfCasterSlots
        // No cantrips for Paladin
    },
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
      { name: 'Cura pelas Mãos', level: 1, description: 'Seu toque abençoado pode curar ferimentos.' },
      { name: 'Estilo de Luta', level: 2, description: 'Você adota um estilo de combate particular como sua especialidade.' },
      { name: 'Conjuração', level: 2, description: 'Você aprendeu a extrair magia divina através de meditação e oração.' },
      { name: 'Destruição Divina', level: 2, description: 'Quando você acertar uma criatura com um ataque corpo-a-corpo com arma, você pode gastar um espaço de magia para causar dano radiante.' },
      { name: 'Saúde Divina', level: 3, description: 'A magia divina fluindo em você o torna imune a doenças.' },
      { name: 'Juramento Sagrado', level: 3, description: 'Você faz um juramento que o vincula como um paladino para sempre.' },
      { name: 'Aumento no Valor de Habilidade', level: 4, description: 'Você pode aumentar um valor de habilidade em 2, ou dois valores em 1.' },
      { name: 'Ataque Extra', level: 5, description: 'Você pode atacar duas vezes, ao invés de uma, quando realizar a ação de Ataque.' }
    ],
    subclasses: [
        {
            id: 'oath-devotion',
            name: 'Juramento de Devoção',
            description: 'O Juramento de Devoção vincula um paladino aos ideais mais nobres de justiça, virtude e ordem.',
            features: [
                { name: 'Canalizar Divindade: Arma Sagrada', level: 3, description: 'Você pode imbuir uma arma que esteja segurando com energia positiva.' }
            ]
        }
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
      { name: 'Defesa Sem Armadura', level: 1, description: 'Quando você não estiver vestindo nenhuma armadura, sua CA será 10 + mod. Destreza + mod. Constituição.' },
      { name: 'Ataque Descuidado', level: 2, description: 'Você pode abrir mão de toda preocupação com sua defesa para atacar com desespero feroz.' },
      { name: 'Senso de Perigo', level: 2, description: 'Você ganha uma percepção sobrenatural de quando as coisas próximas não estão como deveriam.' },
      { name: 'Caminho Primitivo', level: 3, description: 'Você escolhe um caminho que molda a natureza da sua fúria.' },
      { name: 'Aumento no Valor de Habilidade', level: 4, description: 'Você pode aumentar um valor de habilidade em 2, ou dois valores em 1.' },
      { name: 'Ataque Extra', level: 5, description: 'Você pode atacar duas vezes, ao invés de uma, quando realizar a ação de Ataque.' },
      { name: 'Movimento Rápido', level: 5, description: 'Seu deslocamento aumenta em 3 metros enquanto você não estiver usando armadura pesada.' }
    ],
    subclasses: [
        {
            id: 'path-berserker',
            name: 'Caminho do Berserker',
            description: 'Para alguns bárbaros, a fúria é um meio para um fim, mas para você é o fim em si.',
            features: [
                { name: 'Frenesi', level: 3, description: 'Você pode entrar em frenesi quando em fúria, permitindo fazer um ataque corpo-a-corpo como ação bônus.' }
            ]
        }
    ]
  },
  {
    id: 'ranger',
    name: 'Patrulheiro (Ranger)',
    hitDie: 10,
    statPriority: ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
    spellcasting: {
        ability: 'WIS',
        slotsPerLevel: halfCasterSlots
        // No cantrips
    },
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
      { name: 'Explorador Natural', level: 1, description: 'Você é um mestre em navegar pelo mundo natural.' },
      { name: 'Estilo de Luta', level: 2, description: 'Você adota um estilo de combate particular como sua especialidade.' },
      { name: 'Conjuração', level: 2, description: 'Você aprendeu a usar a essência mágica da natureza.' },
      { name: 'Arquétipo de Patrulheiro', level: 3, description: 'Você escolhe um arquétipo que se esforça para emular.' },
      { name: 'Consciência Primitiva', level: 3, description: 'Você pode usar sua ação e gastar um espaço de magia para focar sua consciência na região ao seu redor.' },
      { name: 'Aumento no Valor de Habilidade', level: 4, description: 'Você pode aumentar um valor de habilidade em 2, ou dois valores em 1.' },
      { name: 'Ataque Extra', level: 5, description: 'Você pode atacar duas vezes, ao invés de uma, quando realizar a ação de Ataque.' }
    ],
    subclasses: [
        {
            id: 'hunter',
            name: 'Caçador',
            description: 'Emular o arquétipo de Caçador significa aceitar seu lugar como um baluarte entre a civilização e os terrores da natureza.',
            features: [
                { name: 'Presa do Caçador', level: 3, description: 'Você ganha uma das seguintes características: Matador de Colossos, Matador de Gigantes ou Quebrador de Hordas.' }
            ]
        }
    ]
  },
  {
    id: 'sorcerer',
    name: 'Feiticeiro',
    hitDie: 6,
    statPriority: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
    spellcasting: {
        ability: 'CHA',
        slotsPerLevel: fullCasterSlots,
        knownSpellsPerLevel: { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 },
        cantripsKnown: sorcererCantrips
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
      { name: 'Conjuração', level: 1, description: 'O poder da magia corre em suas veias.' },
      { name: 'Fonte de Magia', level: 2, description: 'Você possui uma fonte profunda de magia dentro de si. Essa fonte é representada por pontos de feitiçaria.' },
      { name: 'Metamagia', level: 3, description: 'Você ganha a habilidade de distorcer suas magias para se adequarem às suas necessidades.' },
      { name: 'Aumento no Valor de Habilidade', level: 4, description: 'Você pode aumentar um valor de habilidade em 2, ou dois valores em 1.' }
    ],
    subclasses: [
        {
            id: 'draconic-bloodline',
            name: 'Linhagem Dracônica',
            description: 'Sua magia inata vem da magia dracônica que foi misturada com seu sangue ou o de seus ancestrais.',
            features: [
                { name: 'Resiliência Dracônica', level: 1, description: 'A magia flui através do seu corpo, fazendo com que traços físicos de seus ancestrais dragões surjam.' },
                { name: 'Afinidade Elemental', level: 6, description: 'Quando você conjura uma magia que causa dano do tipo associado ao seu ancestral dracônico, você pode adicionar seu modificador de Carisma ao dano.' }
            ]
        }
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
      { name: 'Artes Marciais', level: 1, description: 'Sua prática de artes marciais lhe dá domínio do estilo de combate desarmado e com armas de monge.' },
      { name: 'Ki', level: 2, description: 'Seu treinamento permite que você controle a energia mística do ki.' },
      { name: 'Movimento Sem Armadura', level: 2, description: 'Seu deslocamento aumenta enquanto você não estiver usando armadura ou escudo.' },
      { name: 'Tradição Monástica', level: 3, description: 'Você se compromete com uma tradição monástica.' },
      { name: 'Defletir Projéteis', level: 3, description: 'Você pode usar sua reação para defletir ou pegar o projétil quando for atingido por um ataque à distância com arma.' },
      { name: 'Aumento no Valor de Habilidade', level: 4, description: 'Você pode aumentar um valor de habilidade em 2, ou dois valores em 1.' },
      { name: 'Queda Lenta', level: 4, description: 'Você pode usar sua reação quando cai para reduzir o dano de queda.' },
      { name: 'Ataque Extra', level: 5, description: 'Você pode atacar duas vezes, ao invés de uma, quando realizar a ação de Ataque.' },
      { name: 'Ataque Atordoante', level: 5, description: 'Você pode interferir com o fluxo de ki no corpo de um oponente.' }
    ],
    subclasses: [
        {
            id: 'open-hand',
            name: 'Caminho da Mão Aberta',
            description: 'Monges do Caminho da Mão Aberta são os mestres supremos do combate de artes marciais.',
            features: [
                { name: 'Técnica da Mão Aberta', level: 3, description: 'Você pode manipular o ki do seu inimigo quando acerta seus ataques.' }
            ]
        }
    ]
  },
  {
    id: 'warlock',
    name: 'Bruxo',
    hitDie: 8,
    statPriority: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
    spellcasting: {
        ability: 'CHA',
        slotsPerLevel: warlockSlots,
        knownSpellsPerLevel: { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 },
        cantripsKnown: standardCantrips
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
      { name: 'Magia de Pacto', level: 1, description: 'Sua pesquisa arcana e a magia concedida a você pelo seu patrono lhe deram facilidade com magias.' },
      { name: 'Invocacoes Misticas', level: 2, description: 'Em seus estudos de conhecimento oculto, você desenterrou invocacoes misticas, fragmentos de conhecimento proibido que imbuem você com uma habilidade mágica duradoura.' },
      { name: 'Dádiva do Pacto', level: 3, description: 'Seu patrono lhe concede uma dádiva pelos seus serviços leais.' },
      { name: 'Aumento no Valor de Habilidade', level: 4, description: 'Você pode aumentar um valor de habilidade em 2, ou dois valores em 1.' }
    ],
    subclasses: [
        {
            id: 'fiend',
            name: 'O Infernal',
            description: 'Você fez um pacto com um corruptor dos planos inferiores de existência.',
            features: [
                { name: 'Bênção do Tenebroso', level: 1, description: 'Quando você reduz uma criatura hostil a 0 pontos de vida, você ganha pontos de vida temporários.' }
            ]
        }
    ]
  },
  {
    id: 'druid',
    name: 'Druida',
    hitDie: 8,
    statPriority: ['WIS', 'CON', 'DEX', 'STR', 'INT', 'CHA'],
    spellcasting: {
        ability: 'WIS',
        slotsPerLevel: fullCasterSlots,
        cantripsKnown: standardCantrips
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
      { name: 'Conjuração', level: 1, description: 'Extraindo a essência divina da própria natureza, você pode conjurar magias.' },
      { name: 'Forma Selvagem', level: 2, description: 'Você pode usar sua ação para assumir magicamente a forma de uma besta que você já tenha visto antes.' },
      { name: 'Círculo Druídico', level: 2, description: 'Você escolhe se identificar com um círculo de druidas.' },
      { name: 'Aumento no Valor de Habilidade', level: 4, description: 'Você pode aumentar um valor de habilidade em 2, ou dois valores em 1.' }
    ],
    subclasses: [
        {
            id: 'circle-land',
            name: 'Círculo da Terra',
            description: 'O Círculo da Terra é constituído por místicos e sábios que salvaguardam conhecimento e ritos antigos através de uma vasta tradição oral.',
            features: [
                { name: 'Truque Bônus', level: 2, description: 'Você aprende um truque de druida adicional à sua escolha.' },
                { name: 'Recuperação Natural', level: 2, description: 'Você pode recuperar alguma energia mágica meditando.' }
            ]
        }
    ]
  }
];
