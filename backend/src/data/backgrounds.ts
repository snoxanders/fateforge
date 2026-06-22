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
    },
    {
        id: 'soldier',
        name: 'Soldado',
        description: 'A guerra foi sua vida por tanto tempo quanto você consegue se lembrar. Você treinou, marchou e sangrou ao lado de seus companheiros.',
        feature: { name: 'Patente Militar', description: 'Soldados leais ainda reconhecem sua autoridade e influência, e cedem a ela se forem de patente inferior.' },
        skillProficiencies: ['Atletismo', 'Intimidação'],
        toolProficiencies: ['Kit de jogo', 'Veículos terrestres'],
        equipment: ['Insígnia de patente', 'Troféu de um inimigo caído', 'Baralho de cartas', 'Roupas comuns', '10 po'],
        personalityTraits: [
            'Estou sempre pronto e disposto a enfrentar o perigo.',
            'Tenho uma frase de efeito para cada situação difícil.',
            'Sou inflexível diante do dever e da disciplina.',
            'Cuido dos meus aliados como uma família.'
        ],
        ideals: [
            { text: 'Maior Bem. Nosso dever é proteger e defender os outros.', align: 'Bom' },
            { text: 'Responsabilidade. Faço o que devo e obedeço à autoridade justa.', align: 'Leal' },
            { text: 'Independência. Lutei o bastante para seguir minhas próprias ordens.', align: 'Caótico' },
            { text: 'Força. Os fracos existem para servir aos fortes.', align: 'Mal' }
        ],
        bonds: [
            'Eu daria minha vida pelos meus antigos companheiros de batalha.',
            'Um inimigo de guerra jurou me caçar até o fim.',
            'Carrego comigo a lembrança de quem não sobreviveu.',
            'Luto por aqueles que não podem lutar por si.'
        ],
        flaws: [
            'O inimigo que derrotei ainda me assombra em pesadelos.',
            'Tenho pouco respeito por quem nunca viu uma batalha.',
            'Obedeço ordens mesmo quando elas são erradas.',
            'Congelo diante de um dilema moral.'
        ]
    },
    {
        id: 'sage',
        name: 'Sábio',
        description: 'Você passou anos aprendendo sobre o multiverso, vasculhando manuscritos e debatendo com mestres do conhecimento.',
        feature: { name: 'Pesquisador', description: 'Quando você tenta obter um conhecimento, geralmente sabe onde e de quem pode obter essa informação.' },
        skillProficiencies: ['Arcanismo', 'História'],
        toolProficiencies: [],
        languages: 2,
        equipment: ['Frasco de tinta', 'Pena de escrever', 'Faca pequena', 'Carta de um colega falecido', 'Roupas comuns', '10 po'],
        personalityTraits: [
            'Uso palavras longas para parecer mais culto.',
            'Já li tudo sobre o assunto — ou quase tudo.',
            'Fico absorto em meus pensamentos com facilidade.',
            'Não há nada que eu goste mais que um bom mistério.'
        ],
        ideals: [
            { text: 'Conhecimento. O caminho para o poder e a melhoria é o saber.', align: 'Neutro' },
            { text: 'Verdade. Busco a verdade, custe o que custar.', align: 'Leal' },
            { text: 'Sabedoria. Conhecimento sem prudência não vale nada.', align: 'Bom' },
            { text: 'Poder. O saber antigo me erguerá acima dos outros.', align: 'Mal' }
        ],
        bonds: [
            'Dedico minha vida a resolver um enigma de saber antigo.',
            'Protejo uma biblioteca de valor inestimável.',
            'Busco vingança contra quem destruiu meu trabalho.',
            'Meu conhecimento é tudo o que tenho.'
        ],
        flaws: [
            'Sou distraído e ignoro o mundo ao meu redor.',
            'Acredito cegamente em textos antigos.',
            'Não resisto a um segredo, mesmo perigoso.',
            'Desprezo quem não compartilha minha sede de saber.'
        ]
    },
    {
        id: 'noble',
        name: 'Nobre',
        description: 'Você nasceu em uma família de prestígio e riqueza, e o seu nome abre portas que ouro nenhum compraria.',
        feature: { name: 'Posição Privilegiada', description: 'As pessoas tendem a pensar o melhor de você, e você é bem-vindo na alta sociedade.' },
        skillProficiencies: ['História', 'Persuasão'],
        toolProficiencies: ['Kit de jogo'],
        languages: 1,
        equipment: ['Roupas finas', 'Anel de sinete', 'Pergaminho de linhagem', '25 po'],
        personalityTraits: [
            'Minha educação refinada transparece em cada gesto.',
            'Trato todos com cortesia — mesmo meus inimigos.',
            'Espero o melhor acomodamento aonde quer que eu vá.',
            'Não tolero ser desrespeitado.'
        ],
        ideals: [
            { text: 'Nobreza Obriga. Tenho o dever de cuidar de quem está abaixo de mim.', align: 'Bom' },
            { text: 'Tradição. As glórias do passado devem ser preservadas.', align: 'Leal' },
            { text: 'Liberdade. Ninguém deveria curvar-se a outro.', align: 'Caótico' },
            { text: 'Poder. Pretendo subir ao topo da hierarquia.', align: 'Mal' }
        ],
        bonds: [
            'Serei fiel à minha família acima de tudo.',
            'O povo das minhas terras depende de mim.',
            'Devo restaurar a honra perdida do meu nome.',
            'Alguém roubou meu legado e vou recuperá-lo.'
        ],
        flaws: [
            'Acho que todos abaixo de mim são descartáveis.',
            'Escondo um segredo que arruinaria minha família.',
            'Tenho dívidas impagáveis por luxos.',
            'Sou facilmente manipulado por bajulação.'
        ]
    },
    {
        id: 'outlander',
        name: 'Forasteiro',
        description: 'Você cresceu nas terras selvagens, longe da civilização e de seus confortos, conhecendo bem os perigos da natureza.',
        feature: { name: 'Andarilho', description: 'Você tem excelente memória para mapas e geografia, e sempre consegue encontrar comida e água na natureza.' },
        skillProficiencies: ['Atletismo', 'Sobrevivência'],
        toolProficiencies: ['Instrumento musical'],
        languages: 1,
        equipment: ['Cajado', 'Armadilha de caça', 'Troféu de um animal caçado', 'Roupas comuns', '10 po'],
        personalityTraits: [
            'Estou sempre atento a sinais de perigo.',
            'Falo pouco, mas minhas palavras têm peso.',
            'Sinto-me preso e inquieto dentro de cidades.',
            'Conheço uma história para cada estrela no céu.'
        ],
        ideals: [
            { text: 'Natureza. O mundo natural importa mais que as construções humanas.', align: 'Neutro' },
            { text: 'Vida. A vida é preciosa e deve ser preservada.', align: 'Bom' },
            { text: 'Honra. Se eu desonrar minha tribo, perco tudo.', align: 'Leal' },
            { text: 'Glória. Devo conquistar fama em feitos memoráveis.', align: 'Caótico' }
        ],
        bonds: [
            'Minha tribo é tudo para mim.',
            'Protejo um lugar selvagem sagrado.',
            'Sofro de uma sede de vingança contra um monstro.',
            'Recuperarei algo que perdi no ermo.'
        ],
        flaws: [
            'Resolvo problemas com violência primeiro.',
            'Não confio nos confortos da civilização.',
            'Sou lento para confiar em forasteiros.',
            'Guardo rancores por tempo demais.'
        ]
    },
    {
        id: 'charlatan',
        name: 'Charlatão',
        description: 'Você sempre teve um jeito com as pessoas — sabe o que elas querem e dá exatamente isso a elas, por um preço.',
        feature: { name: 'Identidade Falsa', description: 'Você criou uma segunda identidade convincente e sabe forjar documentos e imitar maneiras.' },
        skillProficiencies: ['Enganação', 'Prestidigitação'],
        toolProficiencies: ['Kit de disfarce', 'Kit de falsificação'],
        equipment: ['Roupas finas', 'Kit de disfarce', 'Ferramentas de trapaça', '15 po'],
        personalityTraits: [
            'Caio nas graças de qualquer um em minutos.',
            'Tenho sempre um golpe pronto na manga.',
            'Coleciono pequenas mentiras como troféus.',
            'Visto-me bem para impressionar.'
        ],
        ideals: [
            { text: 'Independência. Sou livre, e ninguém me dará ordens.', align: 'Caótico' },
            { text: 'Justiça. Engano apenas quem merece ser enganado.', align: 'Bom' },
            { text: 'Ganância. Farei o que for preciso por dinheiro.', align: 'Mal' },
            { text: 'Sociabilidade. As pessoas existem para serem persuadidas.', align: 'Neutro' }
        ],
        bonds: [
            'Devo dinheiro a pessoas muito perigosas.',
            'Uma vítima inocente do meu golpe merece reparação.',
            'Procuro o vigarista que me passou para trás.',
            'Tenho uma família secreta que sustento.'
        ],
        flaws: [
            'Não resisto a um alvo fácil.',
            'Minto até quando não preciso.',
            'Subestimo quem parece simples.',
            'Sempre tenho um plano de fuga — e abandono os outros.'
        ]
    },
    {
        id: 'sailor',
        name: 'Marinheiro',
        description: 'Você navegou por anos a fio, enfrentando tempestades e monstros marinhos, e o convés é mais lar do que a terra firme.',
        feature: { name: 'Passagem de Navio', description: 'Você consegue passagem gratuita em navios para você e seus companheiros, em troca de ajuda na tripulação.' },
        skillProficiencies: ['Atletismo', 'Percepção'],
        toolProficiencies: ['Instrumentos de navegação', 'Veículos aquáticos'],
        equipment: ['Marlinspike', 'Corda de seda (15m)', 'Amuleto da sorte', 'Roupas comuns', '10 po'],
        personalityTraits: [
            'Meu linguajar faria um nobre corar.',
            'Conto histórias do mar exageradas.',
            'Encaro qualquer desafio de frente, sem medo.',
            'Sou leal à minha tripulação acima de tudo.'
        ],
        ideals: [
            { text: 'Liberdade. O mar é liberdade — não há nada como o horizonte aberto.', align: 'Caótico' },
            { text: 'Camaradagem. Minha tripulação é minha família.', align: 'Bom' },
            { text: 'Domínio. Sou o senhor do meu próprio destino.', align: 'Leal' },
            { text: 'Avareza. Navego atrás de tesouros, e só.', align: 'Mal' }
        ],
        bonds: [
            'Esse navio é o lar mais próximo que conheço.',
            'Tenho contas a acertar com um capitão tirano.',
            'Salvarei a tripulação custe o que custar.',
            'Procuro uma ilha que vi uma única vez.'
        ],
        flaws: [
            'Brigo ao menor insulto à minha honra.',
            'Bebo demais quando em terra firme.',
            'Aposto mais do que posso perder.',
            'Obedeço cegamente ao meu capitão.'
        ]
    }
];
