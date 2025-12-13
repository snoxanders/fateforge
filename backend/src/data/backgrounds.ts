export interface BackgroundData {
    id: string;
    name: string;
    description: string;
    feature: {
        name: string;
        description: string;
    };
    skillProficiencies: string[];
    toolProficiencies: string[];
    languages?: number; // Number of extra languages
    equipment: string[]; // Simple string list for now, or could be complex objects
    personalityTraits: string[];
    ideals: { text: string; align: string }[];
    bonds: string[];
    flaws: string[];
}

export const BACKGROUNDS: BackgroundData[] = [
    {
        id: 'acolyte',
        name: 'Acólito',
        description: 'Você viveu a serviço de um templo de algum deus especifico ou de um panteão de deuses.',
        feature: {
            name: 'Abrigo dos Fiéis',
            description: 'Você e seus companheiros podem receber cura e caridade de um templo de sua fé.'
        },
        skillProficiencies: ['Intuição', 'Religião'],
        toolProficiencies: [],
        languages: 2,
        equipment: ['Símbolo sagrado', 'Livro de preces ou conta de orações', '5 varetas de incenso', 'Vestimentas', 'Roupas comuns', '15 po'],
        personalityTraits: [
            'Eu idolatro um herói particular da minha fé, e constantemente me refiro a seus feitos e exemplos.',
            'Eu consigo encontrar semelhanças mesmo entre os inimigos mais violentos.',
            'Eu vejo presságios em cada evento e ação.',
            'Nada pode abalar minha atitude otimista.',
            'Eu cito textos sagrados e provérbios em quase qualquer situação.',
            'Eu sou tolerante (ou intolerante) a qualquer outra fé.',
            'Eu aprecio comida requintada, bebidas e a elite do meu templo.',
            'Eu passei tanto tempo no templo que possuo pouca prática em lidar com as pessoas.'
        ],
        ideals: [
            { text: 'Tradição. As tradições ancestrais devem ser preservadas.', align: 'Leal' },
            { text: 'Caridade. Eu sempre tento ajudar aqueles em necessidade.', align: 'Bom' },
            { text: 'Mudança. Nós devemos ajudar a conduzir as mudanças divinas.', align: 'Caótico' },
            { text: 'Poder. Eu espero chegar ao topo na hierarquia.', align: 'Leal' },
            { text: 'Fé. Eu acredito que minha divindade guia minhas ações.', align: 'Leal' },
            { text: 'Aspiração. Eu busco ser digno da graça do meu deus.', align: 'Qualquer' }
        ],
        bonds: [
            'Eu morreria para recuperar uma relíquia ancestral de minha fé.',
            'Eu ainda terei minha vingança contra o templo corrupto que me acusou.',
            'Eu devo minha vida ao sacerdote que me acolheu.',
            'Tudo o que faço, faço pelo povo.',
            'Eu farei qualquer coisa para proteger o templo que sirvo.',
            'Eu busco guardar um texto sagrado que meus inimigos tentam destruir.'
        ],
        flaws: [
            'Eu julgo os outros severamente, e a mim mesmo mais ainda.',
            'Eu deposito muita confiança naqueles que detêm o poder na hierarquia.',
            'Minha devoção muitas vezes me cega.',
            'Meu pensamento é inflexível.',
            'Eu suspeito de estranhos e sempre espero o pior deles.',
            'Depois de escolher um objetivo, fico obcecado em cumpri-lo.'
        ]
    },
    {
        id: 'criminal',
        name: 'Criminoso',
        description: 'Você é um criminoso experiente com um histórico de contravenções.',
        feature: {
            name: 'Contato Criminal',
            description: 'Você possui contatos de confiança que agem como seus informantes em uma rede criminosa.'
        },
        skillProficiencies: ['Enganação', 'Furtividade'],
        toolProficiencies: ['Kit de jogo', 'Ferramentas de ladrão'],
        equipment: ['Pé de cabra', 'Roupas escuras com capuz', '15 po'],
        personalityTraits: [
            'Eu sempre tenho um plano para quando as coisas dão errado.',
            'Eu estou sempre calmo, não importa a situação.',
            'A primeira coisa que faço ao chegar a um novo local é decorar a localização de coisas valiosas.',
            'Eu prefiro fazer um novo amigo a um novo inimigo.',
            'Eu sou incrivelmente receoso em confiar.',
            'Eu não presto atenção aos riscos envolvidos em uma situação.',
            'A melhor maneira de me levar a fazer algo é dizendo que eu não posso fazer.',
            'Eu explodo ao menor insulto.'
        ],
        ideals: [
            { text: 'Honra. Eu não roubo de irmãos de profissão.', align: 'Leal' },
            { text: 'Liberdade. Correntes foram feitas para serem partidas.', align: 'Caótico' },
            { text: 'Caridade. Eu roubo dos ricos para dar aos que precisam.', align: 'Bom' },
            { text: 'Ganância. Eu farei qualquer coisa para me tornar rico.', align: 'Mal' },
            { text: 'Povo. Eu sou leal aos meus amigos, não a qualquer ideal.', align: 'Neutro' },
            { text: 'Redenção. Há uma centelha de bondade em todo mundo.', align: 'Bom' }
        ],
        bonds: [
            'Eu estou tentando quitar uma dívida que tenho com um benfeitor.',
            'Meus ganhos são para sustentar minha família.',
            'Algo importante foi roubado de mim, e eu vou recuperá-lo.',
            'Eu me tornarei o maior ladrão que já existiu.',
            'Eu sou culpado por um terrível crime e espero me redimir.',
            'Alguém que amo morreu por causa de um erro que cometi.'
        ],
        flaws: [
            'Quando vejo algo valioso, não consigo pensar em mais nada além de roubá-lo.',
            'Quando confrontado entre dinheiro e amigo, escolho o dinheiro.',
            'Se há um plano, eu vou esquecê-lo ou ignorá-lo.',
            'Eu tenho um "tique" que revela se estou mentindo.',
            'Eu viro as costas e corro quando as coisas começam a ficar ruins.',
            'Um inocente foi preso por um crime que cometi. Por mim tudo bem.'
        ]
    },
    {
        id: 'folk_hero',
        name: 'Herói do Povo',
        description: 'Você veio de uma parcela humilde da sociedade, mas está destinado a muito mais.',
        feature: {
            name: 'Hospitalidade Rústica',
            description: 'Você pode encontrar lugar entre os camponeses para se esconder ou descansar.'
        },
        skillProficiencies: ['Adestrar Animais', 'Sobrevivência'],
        toolProficiencies: ['Ferramentas de artesão', 'Veículos terrestres'],
        equipment: ['Ferramentas de artesão', 'Pá', 'Pote de ferro', 'Roupas comuns', '10 po'],
        personalityTraits: [
            'Eu julgo as pessoas por suas ações, não por suas palavras.',
            'Se alguém está em apuros, eu estou sempre pronto para ajudar.',
            'Quando eu fixo minha mente em algo, eu sigo esse caminho.',
            'Eu possuo um forte senso de justiça.',
            'Eu confio em minhas habilidades.',
            'Pensar é para os outros, eu prefiro agir.',
            'Eu abuso de palavras longas na tentativa de soar inteligente.',
            'Eu me entedio fácil.'
        ],
        ideals: [
            { text: 'Respeito. As pessoas merecem ser tratadas com dignidade.', align: 'Bom' },
            { text: 'Justiça. Ninguém deve estar acima da lei.', align: 'Leal' },
            { text: 'Liberdade. Tiranos não devem oprimir o povo.', align: 'Caótico' },
            { text: 'Força. Se eu ficar forte, posso pegar o que quiser.', align: 'Mal' },
            { text: 'Sinceridade. Não há nada de bom em fingir.', align: 'Neutro' },
            { text: 'Destino. Nada pode me manter longe do meu chamado.', align: 'Qualquer' }
        ],
        bonds: [
            'Eu tenho uma família, mas não tenho ideia de onde eles estão.',
            'Eu trabalhei na terra, eu amo a terra, e vou proteger a terra.',
            'Um nobre orgulhoso certa vez me surrou, e eu vou me vingar.',
            'Minhas ferramentas são símbolos de minha vida passada.',
            'Eu protejo aqueles que não podem se proteger.',
            'Eu queria que meu amor de infância tivesse vindo comigo.'
        ],
        flaws: [
            'O tirano que governa minha terra não vai parar até ver meu cadáver.',
            'Eu estou convencido do significado do meu destino.',
            'Eu tenho uma fraqueza pelos vícios da cidade.',
            'Eu tenho um ódio secreto por dragões.',
            'Eu tenho medo de falhar com aqueles que acreditam em mim.',
            'Eu não consigo resistir a desafiar alguém mais forte que eu.'
        ]
    }
];
