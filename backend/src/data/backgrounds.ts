export interface BackgroundTemplate {
    name: string;
    description: string;
    traits: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
}

export const BACKGROUNDS: BackgroundTemplate[] = [
    {
        name: "Acólito",
        description: "Você passou sua vida a serviço de um templo para um deus específico ou panteão de deuses.",
        traits: [
            "Eu idolatro um herói específico da minha fé e constantemente refiro-me aos feitos e exemplos dessa pessoa.",
            "Consigo encontrar terreno comum entre os inimigos mais ferozes, empatizando com eles e sempre trabalhando pela paz."
        ],
        ideals: [
            "Tradição. As antigas tradições de adoração e sacrifício devem ser preservadas e mantidas.",
            "Caridade. Eu sempre tento ajudar aqueles em necessidade, não importa o custo pessoal."
        ],
        bonds: [
            "Eu morreria para recuperar uma relíquia antiga da minha fé que foi perdida há muito tempo.",
            "Algum dia vou me vingar da hierarquia corrupta do templo que me marcou como herege."
        ],
        flaws: [
            "Eu julgo os outros severamente, e a mim mesmo ainda mais.",
            "Eu deposito muita confiança naqueles que detêm poder dentro da hierarquia do meu templo."
        ]
    },
    {
        name: "Soldado",
        description: "A guerra tem sido sua vida desde que você se lembra.",
        traits: [
            "Sou sempre educado e respeitoso.",
            "Sou assombrado por memórias de guerra. Não consigo tirar as imagens de violência da minha mente."
        ],
        ideals: [
            "Bem Maior. Nosso destino é dar nossas vidas em defesa dos outros.",
            "Poder. Na vida como na guerra, a força mais forte vence."
        ],
        bonds: [
            "Eu ainda daria minha vida pelas pessoas com quem servi.",
            "Alguém salvou minha vida no campo de batalha. Até hoje, nunca deixarei um amigo para trás."
        ],
        flaws: [
            "O inimigo monstruoso que enfrentamos em batalha ainda me deixa tremendo de medo.",
            "Cometi um erro terrível em batalha que custou muitas vidas — e farei qualquer coisa para manter esse erro em segredo."
        ]
    },
    {
        name: "Criminoso",
        description: "Você é um criminoso experiente com um histórico de contravensão da lei.",
        traits: [
            "Estou sempre calmo, não importa a situação. Nunca levanto minha voz ou deixo minhas emoções me controlarem.",
            "O primeiro erro é baixar a guarda."
        ],
        ideals: [
            "Honra. Eu não roubo de outros em meu ofício.",
            "Liberdade. As correntes são feitas para serem quebradas, assim como aqueles que as forjariam."
        ],
        bonds: [
            "Estou tentando pagar uma dívida antiga que devo a um benfeitor generoso.",
            "Alguém que eu amava morreu por causa de um erro que cometi. Isso nunca vai acontecer de novo."
        ],
        flaws: [
            "Quando vejo algo valioso, não consigo pensar em nada além de como roubá-lo.",
            "Eu viro as costas e corro quando as coisas ficam ruins."
        ]
    },
    {
        name: "Sábio",
        description: "Você passou anos aprendendo o saber do multiverso. Você vasculhou manuscritos, estudou pergaminhos e ouviu os maiores especialistas.",
        traits: [
            "Eu uso palavras polissilábicas para transmitir a impressão de grande erudição.",
            "Estou acostumado a ajudar aqueles que não são tão inteligentes quanto eu, e pacientemente explico tudo e qualquer coisa para os outros."
        ],
        ideals: [
            "Conhecimento. O caminho para o poder e o autoaperfeiçoamento é através do conhecimento.",
            "Beleza. O que é belo aponta para o que é verdadeiro."
        ],
        bonds: [
            "Tenho um texto antigo que guarda segredos terríveis que não devem cair em mãos erradas.",
            "Trabalho para preservar uma biblioteca, universidade, scriptorium ou mosteiro."
        ],
        flaws: [
            "Falo sem pensar realmente nas minhas palavras, insultando os outros invariavelmente.",
            "Não consigo guardar um segredo para salvar minha vida, ou a de qualquer outra pessoa."
        ]
    },
    {
        name: "Herói do Povo",
        description: "Você vem de uma origem humilde, mas está destinado a muito mais. Já o povo da sua vila natal o considera seu campeão.",
        traits: [
            "Julgo as pessoas por suas ações, não por suas palavras.",
            "Se alguém está com problemas, estou sempre pronto para ajudar."
        ],
        ideals: [
            "Respeito. As pessoas merecem ser tratadas com dignidade e respeito.",
            "Sinceridade. Não há nada de bom em fingir ser o que não sou."
        ],
        bonds: [
            "Protejo aqueles que não podem se proteger.",
            "Desejo que meu amor de infância venha comigo para ver o mundo."
        ],
        flaws: [
            "Tenho dificuldade em confiar nos meus aliados.",
            "Estou convencido da importância do meu destino e cego para minhas falhas e o risco de fracasso."
        ]
    },
    {
        name: "Forasteiro",
        description: "Você cresceu nas florestas, longe da civilização e do conforto da cidade e da tecnologia.",
        traits: [
            "Sinto-me muito mais próximo dos animais do que das pessoas.",
            "Fui criado por lobos (ou macacos, ou corujas, etc...)."
        ],
        ideals: [
            "Mudança. A vida é como as estações, em constante mudança, e devemos mudar com ela.",
            "Natureza. O mundo natural é mais importante do que todas as construções da civilização."
        ],
        bonds: [
            "Minha família, clã ou tribo é a coisa mais importante na minha vida, mesmo quando estão longe.",
            "Sofro de visões terríveis de um desastre iminente e farei qualquer coisa para evitá-lo."
        ],
        flaws: [
            "Não entendo muito bem etiqueta e expectativas sociais.",
            "Lembro-me de cada insulto que recebi e nutro um ressentimento silencioso contra qualquer um que já me tenha prejudicado."
        ]
    }
];
