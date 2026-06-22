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
  // --- TRUQUES (Cantrips - Nível 0) ---
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
    classes: ['wizard', 'cleric', 'bard', 'sorcerer', 'druid']
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
    classes: ['cleric', 'tiefling']
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
  {
    id: 'eldritch-blast',
    name: 'Rajada Mística',
    level: 0,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '36 metros',
    components: 'V, S',
    duration: 'Instantânea',
    description: 'Um feixe de energia crepitante atinge uma criatura ao alcance. Ataque de magia à distância. Dano: 1d10 de força.',
    classes: ['warlock']
  },
  {
    id: 'shillelagh',
    name: 'Bordão Místico',
    level: 0,
    school: 'Transmutação',
    castingTime: '1 ação bônus',
    range: 'Toque',
    components: 'V, S, M',
    duration: '1 minuto',
    description: 'A madeira de uma clava ou bordão que você esteja segurando é imbuída com poder da natureza. Dano se torna 1d8 mágico e você usa sabedoria para ataque/dano.',
    classes: ['druid']
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
    classes: ['cleric', 'bard', 'paladin', 'ranger', 'druid']
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
    classes: ['cleric', 'bard', 'druid']
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
    classes: ['wizard', 'bard', 'sorcerer', 'druid']
  },
  {
    id: 'hellish-rebuke',
    name: 'Repreensão Infernal',
    level: 1,
    school: 'Evocação',
    castingTime: '1 reação',
    range: '18 metros',
    components: 'V, S',
    duration: 'Instantânea',
    description: 'Você aponta o dedo para a criatura que o atacou, e ela é momentaneamente envolta por chamas infernais. Dano 2d10 de fogo (dex save metade).',
    classes: ['warlock']
  },

  // --- NÍVEL 2 ---
  {
    id: 'misty-step',
    name: 'Passo Nebuloso',
    level: 2,
    school: 'Conjuração',
    castingTime: '1 ação bônus',
    range: 'Pessoal',
    components: 'V',
    duration: 'Instantânea',
    description: 'Você se teletransporta até 9m para um espaço desocupado que possa ver.',
    classes: ['wizard', 'sorcerer', 'warlock', 'druid'] // Druid circle land usually
  },
  {
    id: 'invisibility',
    name: 'Invisibilidade',
    level: 2,
    school: 'Ilusão',
    castingTime: '1 ação',
    range: 'Toque',
    components: 'V, S, M',
    duration: 'Concentração, até 1 hora',
    description: 'Uma criatura que você tocar se torna invisível até atacar ou conjurar uma magia.',
    classes: ['wizard', 'bard', 'sorcerer', 'warlock']
  },
  {
    id: 'hold-person',
    name: 'Imobilizar Pessoa',
    level: 2,
    school: 'Encantamento',
    castingTime: '1 ação',
    range: '18 metros',
    components: 'V, S, M',
    duration: 'Concentração, até 1 min',
    description: 'Escolha um humanoide que você possa ver. Ele deve passar num teste de WIS ou ficará paralisado.',
    classes: ['wizard', 'bard', 'cleric', 'druid', 'sorcerer', 'warlock']
  },
  {
    id: 'scorching-ray',
    name: 'Raio Ardente',
    level: 2,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '36 metros',
    components: 'V, S',
    duration: 'Instantânea',
    description: 'Você cria três raios de fogo. Faça um ataque de magia para cada raio. Dano: 2d6 de fogo por raio.',
    classes: ['wizard', 'sorcerer']
  },
  {
    id: 'spiritual-weapon',
    name: 'Arma Espiritual',
    level: 2,
    school: 'Evocação',
    castingTime: '1 ação bônus',
    range: '18 metros',
    components: 'V, S',
    duration: '1 minuto',
    description: 'Você cria uma arma espectral flutuante. Você pode fazer um ataque corpo-a-corpo com magia. Dano: 1d8 + mod.',
    classes: ['cleric']
  },
  {
    id: 'pass-without-trace',
    name: 'Passos sem Pegadas',
    level: 2,
    school: 'Abjuração',
    castingTime: '1 ação',
    range: 'Pessoal',
    components: 'V, S, M',
    duration: 'Concentração, até 1 hora',
    description: 'Sombras e silêncio irradiam de você. +10 em testes de Furtividade para o grupo.',
    classes: ['druid', 'ranger']
  },

  // --- NÍVEL 3 ---
  {
    id: 'fireball',
    name: 'Bola de Fogo',
    level: 3,
    school: 'Evocação',
    castingTime: '1 ação',
    range: '45 metros',
    components: 'V, S, M',
    duration: 'Instantânea',
    description: 'Uma explosão de chamas num raio de 6m. Cada criatura na área faz um teste de DEX, sofrendo 8d6 de dano de fogo (ou metade se passar).',
    classes: ['wizard', 'sorcerer']
  },
  {
    id: 'counterspell',
    name: 'Contra-mágica',
    level: 3,
    school: 'Abjuração',
    castingTime: '1 reação',
    range: '18 metros',
    components: 'S',
    duration: 'Instantânea',
    description: 'Você tenta interromper uma criatura no processo de conjurar uma magia.',
    classes: ['wizard', 'sorcerer', 'warlock']
  },
  {
    id: 'fly',
    name: 'Voo',
    level: 3,
    school: 'Transmutação',
    castingTime: '1 ação',
    range: 'Toque',
    components: 'V, S, M',
    duration: 'Concentração, até 10 min',
    description: 'Você toca uma criatura voluntária. O alvo ganha deslocamento de voo de 18 metros.',
    classes: ['wizard', 'sorcerer', 'warlock']
  },
  {
    id: 'revivify',
    name: 'Revivificar',
    level: 3,
    school: 'Necromancia',
    castingTime: '1 ação',
    range: 'Toque',
    components: 'V, S, M',
    duration: 'Instantânea',
    description: 'Você toca uma criatura que tenha morrido no último minuto. Essa criatura retorna à vida com 1 ponto de vida.',
    classes: ['cleric', 'paladin', 'ranger'] // Ranger e Paladin pegam no lvl 9+, mas ok estar listado
  },
  {
    id: 'spirit-guardians',
    name: 'Guardiões Espirituais',
    level: 3,
    school: 'Conjuração',
    castingTime: '1 ação',
    range: 'Pessoal (4.5m)',
    components: 'V, S, M',
    duration: 'Concentração, até 10 min',
    description: 'Você convoca espíritos para protegê-lo. Inimigos na área têm velocidade reduzida e sofrem 3d8 de dano (WIS save metade).',
    classes: ['cleric']
  },
  {
    id: 'call-lightning',
    name: 'Convocar Relâmpagos',
    level: 3,
    school: 'Conjuração',
    castingTime: '1 ação',
    range: '36 metros',
    components: 'V, S',
    duration: 'Concentração, até 10 min',
    description: 'Uma nuvem de tempestade aparece. Você pode chamar relâmpagos que causam 3d10 de dano elétrico (DEX save metade).',
    classes: ['druid']
  },

  // --- TRUQUES adicionais ---
  {
    id: 'ray-of-frost', name: 'Raio de Gelo', level: 0, school: 'Evocação',
    castingTime: '1 ação', range: '18 metros', components: 'V, S', duration: 'Instantânea',
    description: 'Um feixe gélido atinge uma criatura. Ataque de magia: 1d8 de frio e reduz o deslocamento do alvo em 3m.',
    classes: ['wizard', 'sorcerer']
  },
  {
    id: 'minor-illusion', name: 'Ilusão Menor', level: 0, school: 'Ilusão',
    castingTime: '1 ação', range: '9 metros', components: 'S, M', duration: '1 minuto',
    description: 'Você cria um som ou imagem ilusória de um objeto até o fim da duração.',
    classes: ['wizard', 'sorcerer', 'bard', 'warlock']
  },
  {
    id: 'guidance', name: 'Orientação', level: 0, school: 'Adivinhação',
    castingTime: '1 ação', range: 'Toque', components: 'V, S', duration: 'Concentração, até 1 min',
    description: 'O alvo soma 1d4 a um teste de habilidade à sua escolha antes do fim da duração.',
    classes: ['cleric', 'druid']
  },
  {
    id: 'chill-touch', name: 'Toque Gélido', level: 0, school: 'Necromancia',
    castingTime: '1 ação', range: '36 metros', components: 'V, S', duration: '1 rodada',
    description: 'Uma mão esquelética espectral agarra o alvo. Ataque de magia: 1d8 necrótico e impede cura por 1 turno.',
    classes: ['wizard', 'sorcerer', 'warlock']
  },
  {
    id: 'poison-spray', name: 'Borrifo Venenoso', level: 0, school: 'Conjuração',
    castingTime: '1 ação', range: '3 metros', components: 'V, S', duration: 'Instantânea',
    description: 'Você lança um jato de gás tóxico. O alvo faz um teste de CON ou sofre 1d12 de dano de veneno.',
    classes: ['wizard', 'sorcerer', 'druid', 'warlock']
  },
  {
    id: 'spare-the-dying', name: 'Estabilizar os Mortos', level: 0, school: 'Necromancia',
    castingTime: '1 ação', range: 'Toque', components: 'V, S', duration: 'Instantânea',
    description: 'Você toca uma criatura com 0 PV e a estabiliza, impedindo que morra.',
    classes: ['cleric']
  },
  {
    id: 'druidcraft', name: 'Truque Druídico', level: 0, school: 'Transmutação',
    castingTime: '1 ação', range: '9 metros', components: 'V, S', duration: 'Instantânea',
    description: 'Você produz um pequeno efeito natural: prever o clima, florir uma semente, criar um som natural.',
    classes: ['druid']
  },
  {
    id: 'dancing-lights', name: 'Luzes Dançantes', level: 0, school: 'Evocação',
    castingTime: '1 ação', range: '36 metros', components: 'V, S, M', duration: 'Concentração, até 1 min',
    description: 'Você cria até quatro luzes flutuantes que pode mover com o pensamento.',
    classes: ['wizard', 'sorcerer', 'bard']
  },

  // --- NÍVEL 1 adicionais ---
  {
    id: 'burning-hands', name: 'Mãos Flamejantes', level: 1, school: 'Evocação',
    castingTime: '1 ação', range: 'Pessoal (cone 4,5m)', components: 'V, S', duration: 'Instantânea',
    description: 'Um leque de chamas se espalha. Cada criatura na área faz teste de DEX, sofrendo 3d6 de fogo (metade se passar).',
    classes: ['wizard', 'sorcerer']
  },
  {
    id: 'charm-person', name: 'Enfeitiçar Pessoa', level: 1, school: 'Encantamento',
    castingTime: '1 ação', range: '9 metros', components: 'V, S', duration: '1 hora',
    description: 'Um humanoide deve passar num teste de WIS ou fica enfeitiçado por você até o fim da duração.',
    classes: ['wizard', 'sorcerer', 'bard', 'druid', 'warlock']
  },
  {
    id: 'detect-magic', name: 'Detectar Magia', level: 1, school: 'Adivinhação',
    castingTime: '1 ação', range: 'Pessoal (9m)', components: 'V, S', duration: 'Concentração, até 10 min',
    description: 'Você sente a presença de magia em 9 metros e pode identificar a escola de cada aura.',
    classes: ['wizard', 'sorcerer', 'bard', 'cleric', 'druid', 'paladin', 'ranger']
  },
  {
    id: 'faerie-fire', name: 'Fogo Feérico', level: 1, school: 'Evocação',
    castingTime: '1 ação', range: '18 metros', components: 'V', duration: 'Concentração, até 1 min',
    description: 'Objetos e criaturas numa área ficam delineados em luz; ataques contra eles têm vantagem.',
    classes: ['bard', 'druid']
  },
  {
    id: 'command', name: 'Comando', level: 1, school: 'Encantamento',
    castingTime: '1 ação', range: '18 metros', components: 'V', duration: '1 rodada',
    description: 'Você dá uma ordem de uma palavra; o alvo obedece se falhar num teste de WIS.',
    classes: ['cleric', 'paladin']
  },
  {
    id: 'hunters-mark', name: 'Marca do Caçador', level: 1, school: 'Adivinhação',
    castingTime: '1 ação bônus', range: '27 metros', components: 'V', duration: 'Concentração, até 1 hora',
    description: 'Você marca um alvo; causa 1d6 de dano extra a cada acerto e tem vantagem para rastreá-lo.',
    classes: ['ranger']
  },
  {
    id: 'disguise-self', name: 'Disfarçar-se', level: 1, school: 'Ilusão',
    castingTime: '1 ação', range: 'Pessoal', components: 'V, S', duration: '1 hora',
    description: 'Você altera magicamente sua aparência (roupas, rosto e voz) até o fim da duração.',
    classes: ['wizard', 'sorcerer', 'bard']
  },

  // --- NÍVEL 2 adicionais ---
  {
    id: 'darkness', name: 'Escuridão', level: 2, school: 'Evocação',
    castingTime: '1 ação', range: '18 metros', components: 'V, M', duration: 'Concentração, até 10 min',
    description: 'Escuridão mágica se espalha num raio de 4,5m, bloqueando até visão no escuro.',
    classes: ['wizard', 'sorcerer', 'warlock']
  },
  {
    id: 'aid', name: 'Auxílio', level: 2, school: 'Abjuração',
    castingTime: '1 ação', range: '9 metros', components: 'V, S, M', duration: '8 horas',
    description: 'Até três criaturas têm seu máximo e atual de PV aumentados em 5.',
    classes: ['cleric', 'paladin']
  },
  {
    id: 'flaming-sphere', name: 'Esfera Flamejante', level: 2, school: 'Conjuração',
    castingTime: '1 ação', range: '18 metros', components: 'V, S, M', duration: 'Concentração, até 1 min',
    description: 'Uma esfera de fogo de 1,5m que você move; causa 2d6 de fogo a quem se aproxima (DEX save).',
    classes: ['wizard', 'sorcerer', 'druid']
  },
  {
    id: 'lesser-restoration', name: 'Restauração Menor', level: 2, school: 'Abjuração',
    castingTime: '1 ação', range: 'Toque', components: 'V, S', duration: 'Instantânea',
    description: 'Você cura uma criatura de uma doença ou de uma condição (cego, surdo, paralisado ou envenenado).',
    classes: ['cleric', 'druid', 'paladin', 'ranger', 'bard']
  },
  {
    id: 'moonbeam', name: 'Raio Lunar', level: 2, school: 'Evocação',
    castingTime: '1 ação', range: '36 metros', components: 'V, S, M', duration: 'Concentração, até 1 min',
    description: 'Um feixe de luar de 1,5m que você move; causa 2d10 radiante a quem entra na área (CON save metade).',
    classes: ['druid']
  },

  // --- NÍVEL 3 adicionais ---
  {
    id: 'lightning-bolt', name: 'Relâmpago', level: 3, school: 'Evocação',
    castingTime: '1 ação', range: 'Pessoal (linha 30m)', components: 'V, S, M', duration: 'Instantânea',
    description: 'Um raio em linha causa 8d6 de dano elétrico a todos na linha (DEX save metade).',
    classes: ['wizard', 'sorcerer']
  },
  {
    id: 'dispel-magic', name: 'Dissipar Magia', level: 3, school: 'Abjuração',
    castingTime: '1 ação', range: '36 metros', components: 'V, S', duration: 'Instantânea',
    description: 'Encerra efeitos mágicos sobre uma criatura, objeto ou área.',
    classes: ['wizard', 'sorcerer', 'cleric', 'druid', 'paladin', 'warlock', 'bard']
  },
  {
    id: 'haste', name: 'Acelerar', level: 3, school: 'Transmutação',
    castingTime: '1 ação', range: '9 metros', components: 'V, S, M', duration: 'Concentração, até 1 min',
    description: 'O alvo dobra o deslocamento, ganha +2 de CA, vantagem em testes de DEX e uma ação adicional.',
    classes: ['wizard', 'sorcerer']
  },
  {
    id: 'conjure-animals', name: 'Conjurar Animais', level: 3, school: 'Conjuração',
    castingTime: '1 ação', range: '18 metros', components: 'V, S', duration: 'Concentração, até 1 hora',
    description: 'Você invoca espíritos feéricos em forma de bestas para lutar ao seu lado.',
    classes: ['druid', 'ranger']
  }
];
