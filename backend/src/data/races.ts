import { Race } from '../models/Race';

export const RACES: Race[] = [
  {
    id: 'human',
    name: 'Humano',
    speed: 30,
    size: 'Medium',
    abilityBonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    traits: [],
    languages: ['Comum', 'Um idioma extra à escolha']
  },
  {
    id: 'elf-high',
    name: 'Alto Elfo',
    subrace: 'Alto Elfo',
    speed: 30,
    size: 'Medium',
    abilityBonuses: { DEX: 2, INT: 1 },
    traits: [
      { name: 'Visão no Escuro', description: 'Acostumado a florestas crepusculares e ao céu noturno, você tem visão superior em condições de escuridão e penumbra.' },
      { name: 'Ancestralidade Feérica', description: 'Você tem vantagem em testes de resistência contra ser enfeitiçado e magia não pode colocá-lo para dormir.' },
      { name: 'Transe', description: 'Elfos não precisam dormir. Em vez disso, meditam profundamente, permanecendo semiconscientes, por 4 horas por dia.' }
    ],
    languages: ['Comum', 'Élfico']
  },
  {
    id: 'elf-wood',
    name: 'Elfo da Floresta',
    subrace: 'Elfo da Floresta',
    speed: 35,
    size: 'Medium',
    abilityBonuses: { DEX: 2, WIS: 1 },
    traits: [
      { name: 'Visão no Escuro', description: 'Visão superior em escuridão e penumbra.' },
      { name: 'Ancestralidade Feérica', description: 'Vantagem contra ser enfeitiçado, imune a sono mágico.' },
      { name: 'Máscara da Natureza', description: 'Você pode tentar se esconder mesmo quando estiver apenas levemente obscurecido por folhagem, chuva forte, neve caindo, névoa ou outro fenômeno natural.' }
    ],
    languages: ['Comum', 'Élfico']
  },
  {
    id: 'elf-drow',
    name: 'Elfo Negro (Drow)',
    subrace: 'Drow',
    speed: 30,
    size: 'Medium',
    abilityBonuses: { DEX: 2, CHA: 1 },
    traits: [
      { name: 'Visão no Escuro Superior', description: 'Sua visão no escuro tem alcance de 36 metros (120 pés).' },
      { name: 'Sensibilidade à Luz Solar', description: 'Você tem desvantagem nas jogadas de ataque e testes de Sabedoria (Percepção) relacionados à visão quando você ou o alvo do seu ataque ou o que você está tentando perceber está sob luz solar direta.' },
      { name: 'Magia Drow', description: 'Você conhece o truque luzes dançantes.' }
    ],
    languages: ['Comum', 'Élfico']
  },
  {
    id: 'dwarf-hill',
    name: 'Anão da Colina',
    subrace: 'Anão da Colina',
    speed: 25,
    size: 'Medium',
    abilityBonuses: { CON: 2, WIS: 1 },
    traits: [
      { name: 'Visão no Escuro', description: 'Acostumado à vida subterrânea, você tem visão superior em condições de escuridão e penumbra.' },
      { name: 'Resiliência Anã', description: 'Você tem vantagem em testes de resistência contra veneno e resistência contra dano de veneno.' },
      { name: 'Robustez Anã', description: 'Seu máximo de pontos de vida aumenta em 1, e aumenta em 1 cada vez que você ganha um nível.' }
    ],
    languages: ['Comum', 'Anão']
  },
  {
    id: 'halfling-lightfoot',
    name: 'Halfling Pés-Leves',
    subrace: 'Pés-Leves',
    speed: 25,
    size: 'Small',
    abilityBonuses: { DEX: 2, CHA: 1 },
    traits: [
      { name: 'Sorte', description: 'Quando você rola um 1 no d20 para um ataque, teste de habilidade ou resistência, você pode rolar novamente o dado e deve usar o novo resultado.' },
      { name: 'Bravura', description: 'Você tem vantagem em testes de resistência contra ficar amedrontado.' },
      { name: 'Agilidade Halfling', description: 'Você pode se mover através do espaço de qualquer criatura que for de um tamanho maior que o seu.' }
    ],
    languages: ['Comum', 'Halfling']
  },
  {
    id: 'halfling-stout',
    name: 'Halfling Robusto',
    subrace: 'Robusto',
    speed: 25,
    size: 'Small',
    abilityBonuses: { DEX: 2, CON: 1 },
    traits: [
      { name: 'Sorte', description: 'Rerolar 1s em d20.' },
      { name: 'Bravura', description: 'Vantagem contra medo.' },
      { name: 'Resiliência dos Robustos', description: 'Você tem vantagem em testes de resistência contra veneno e resistência contra dano de veneno.' }
    ],
    languages: ['Comum', 'Halfling']
  },
  {
    id: 'half-orc',
    name: 'Meio-Orc',
    speed: 30,
    size: 'Medium',
    abilityBonuses: { STR: 2, CON: 1 },
    traits: [
      { name: 'Visão no Escuro', description: 'Graças ao seu sangue orc, você tem uma visão superior no escuro e na penumbra.' },
      { name: 'Ameaçador', description: 'Você ganha proficiência na perícia Intimidação.' },
      { name: 'Resistência Implacável', description: 'Quando você é reduzido a 0 pontos de vida mas não é morto instantaneamente, você pode voltar para 1 ponto de vida. Você não pode usar essa característica novamente até terminar um descanso longo.' },
      { name: 'Ataques Selvagens', description: 'Quando você atinge um acerto crítico com um ataque corpo-a-corpo com arma, você pode rolar um dos dados de dano da arma mais uma vez e adicioná-lo ao dano extra do acerto crítico.' }
    ],
    languages: ['Comum', 'Orc']
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    speed: 30,
    size: 'Medium',
    abilityBonuses: { CHA: 2, INT: 1 },
    traits: [
      { name: 'Visão no Escuro', description: 'Graças à sua herança infernal, você tem uma visão superior no escuro e na penumbra.' },
      { name: 'Resistência Infernal', description: 'Você tem resistência a dano de fogo.' },
      { name: 'Legado Infernal', description: 'Você conhece o truque taumaturgia.' }
    ],
    languages: ['Comum', 'Infernal']
  },
  {
    id: 'gnome-rock',
    name: 'Gnomo das Rochas',
    subrace: 'Gnomo das Rochas',
    speed: 25,
    size: 'Small',
    abilityBonuses: { INT: 2, CON: 1 },
    traits: [
      { name: 'Visão no Escuro', description: 'Acostumado à vida subterrânea, você tem uma visão superior no escuro e na penumbra.' },
      { name: 'Esperteza Gnômica', description: 'Você tem vantagem em testes de resistência de Inteligência, Sabedoria e Carisma contra magia.' },
      { name: 'Conhecimento de Artífice', description: 'Sempre que você fizer um teste de História relacionado a itens mágicos, objetos alquímicos ou dispositivos tecnológicos, você pode adicionar o dobro do seu bônus de proficiência.' }
    ],
    languages: ['Comum', 'Gnomo']
  },
  {
    id: 'gnome-forest',
    name: 'Gnomo da Floresta',
    subrace: 'Gnomo da Floresta',
    speed: 25,
    size: 'Small',
    abilityBonuses: { INT: 2, DEX: 1 },
    traits: [
      { name: 'Visão no Escuro', description: 'Visão no escuro 60ft.' },
      { name: 'Esperteza Gnômica', description: 'Vantagem em saves de INT/WIS/CHA contra magia.' },
      { name: 'Ilusionista Nato', description: 'Você conhece o truque ilusão menor. Inteligência é sua habilidade de conjuração para ele.' },
      { name: 'Falar com Bestas Pequenas', description: 'Através de sons e gestos, você pode comunicar ideias simples para Bestas pequenas ou menores.' }
    ],
    languages: ['Comum', 'Gnomo']
  },
  {
    id: 'half-elf',
    name: 'Meio-Elfo',
    speed: 30,
    size: 'Medium',
    abilityBonuses: { CHA: 2, DEX: 1, CON: 1 },
    traits: [
      { name: 'Visão no Escuro', description: 'Graças ao seu sangue élfico, você tem uma visão superior no escuro e na penumbra.' },
      { name: 'Ancestralidade Feérica', description: 'Você tem vantagem em testes de resistência contra ser enfeitiçado e magia não pode colocá-lo para dormir.' },
      { name: 'Versatilidade em Perícia', description: 'Você ganha proficiência em duas perícias, à sua escolha.' }
    ],
    languages: ['Comum', 'Élfico', 'Um idioma extra à escolha']
  },
  {
    id: 'dragonborn',
    name: 'Draconato',
    speed: 30,
    size: 'Medium',
    abilityBonuses: { STR: 2, CHA: 1 },
    traits: [
      { name: 'Ancestralidade Dracônica', description: 'Você possui ancestralidade dracônica. Escolha um tipo de dragão (Fogo, Gelo, etc).' },
      { name: 'Ataque de Sopro', description: 'Você pode usar sua ação para exalar energia destrutiva baseada na sua ancestralidade dracônica.' },
      { name: 'Resistência a Dano', description: 'Você possui resistência ao tipo de dano associado à sua ancestralidade dracônica.' }
    ],
    languages: ['Comum', 'Dracônico']
  },
  {
    id: 'dwarf-mountain',
    name: 'Anão da Montanha',
    subrace: 'Anão da Montanha',
    speed: 25,
    size: 'Medium',
    abilityBonuses: { CON: 2, STR: 2 },
    traits: [
      { name: 'Visão no Escuro', description: 'Acostumado à vida subterrânea, você tem visão superior em condições de escuridão e penumbra.' },
      { name: 'Resiliência Anã', description: 'Você tem vantagem em testes de resistência contra veneno e resistência contra dano de veneno.' },
      { name: 'Treinamento Anão em Armaduras', description: 'Você tem proficiência em armaduras leves e médias.' }
    ],
    languages: ['Comum', 'Anão']
  }
];
