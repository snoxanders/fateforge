# RandomPC - Documento de Especificação do Produto

## 1 — Visão do produto (e proposta de valor)

**Nome de trabalho:** RandomPC (só um placeholder)

**O que faz:** gera fichas de personagem totalmente aleatórias ou semi-controladas para sistemas estilo D&D (foco inicial: D&D 5e-like / SRD). O usuário digita o nome, escolhe nível e estilo opcional e recebe uma ficha pronta para jogar — atributos, raça, classe, poderes, equipamentos, background e mini-gancho de roleplay.

**Porquê funciona:**
*   Economiza tempo (geração em 1 clique).
*   Aumenta diversão com surpresas.
*   Útil para one-shots, NPCs rápidos, inspiração criativa.
*   Pode exportar PDF / integração TTRPG VTT.

## 2 — Público-alvo

*   Jogadores de mesa (novatos e experientes)
*   Mestres (para NPCs)
*   Streamers e criadores (conteúdo aleatório)
*   Pessoas que jogam one-shots improvisadas

## 3 — MVP (mínimo viável)

**Funcionalidades essenciais para lançar:**
*   Gerador aleatório com 1 campo: nome → cria personagem (nível 1 por padrão).
*   Gera: raça, classe, subclasse opcional, atributos (3 métodos), proficiências básicas, equipamento inicial, 3 traços de personalidade/background de 2–3 linhas.
*   Re-roll completo + re-roll seletivo (atributos/raça/classe).
*   Exportar ficha em PDF.
*   Salvar personagens localmente (no dispositivo) ou em conta (autenticação básica).
*   Tela de visão rápida (resumo) + ficha completa (detalhada).
*   Settings: escolher sistema de geração (padrão SRD-like), idioma PT/EN.
*   Métrica mínima: taxa de conversão "gerar → exportar" e retenção (usuários que geram >3 personagens/semana).

## 4 — Funcionalidades detalhadas (Produto final / roadmap)

**Núcleo (obrigatório)**
*   Gerador Aleatório (1 clique) — cria ficha completa coerente.
*   Re-roll seletivo (raça, classe, atributos, background, equipamentos).
*   Distribuição de pontos com regras: aplicar bônus raciais e limites (point-buy / standard array / roll).
*   Ficha PDF / Imprimível.
*   Salvar / Exportar JSON (estrutura para VTT).
*   Perfis de usuário (sincronização entre dispositivos).

**Avançado (1–3 meses após MVP)**
*   Modo “aleatório controlado” (escolhes estilo/nível/classe preferida).
*   Gerador de poderes (spells/feats): atribui poderes coerentes com classe/nível.
*   Gerar background + ganchos para história (2–3 linhas).
*   Compatibilidade com SRD 5.1.
*   Integração com Foundry/Roll20 (export/import).
*   Temas visuais e templates de ficha.

**Premium / Monetização**
*   Export em PDF customizado (tema premium).
*   Packs de raças/classes homebrew (pagos).
*   Modo multiplayer: gerar/partilhar personagens na campanha do DM.
*   API paga para ferramentas de terceiros.

**Social / Gamificação**
*   Feed de personagens gerados por outros (moderação).
*   Challenges: "gerar personagem com 3 condições" e compartilhar.
*   Sistema de favoritos / biblioteca.

## 5 — Requisitos funcionais e não funcionais

**Requisitos funcionais (exemplos)**
*   RF1: O usuário pode gerar um personagem ao digitar apenas o nome.
*   RF2: O sistema deve aplicar um dos 3 métodos de geração de atributos (roll/standard/point-buy).
*   RF3: O usuário pode re-rolar elementos individualmente.
*   RF4: O app validará regras (ex.: no point-buy o limite máximo).
*   RF5: Exportar ficha em PDF e JSON.
*   RF6: Salvar personagens no servidor com autenticação.

**Requisitos não funcionais**
*   RNF1: Tempo de resposta da geração < 1.5s (percepção de instantâneo).
*   RNF2: Disponível offline (modo local) para gerar sem conta.
*   RNF3: Segurança dos dados do usuário (JWT + TLS).
*   RNF4: Localização (PT/EN) — textos gerados em PT.
*   RNF5: Alta disponibilidade (quando escalar).

## 6 — Regras de geração de atributos (opções)

**Roll padrão (aleatório puro)**
*   Rolar 6 × (4d6, descartar menor) → ordenar como quiser ou mapear para STR/DEX/CON/INT/WIS/CHA.
*   Aplicar bônus raciais.
*   (Vantagem: sensação old-school).

**Standard array**
*   Usar array fixo [15, 14, 13, 12, 10, 8].
*   Aplicar bônus raciais.

**Point-buy (ex.: 27 pontos)**
*   Implementar tabela point-buy igual à 5e (por exemplo: custo de 8→13 etc.).
*   Validar limites e aplicar bônus raciais.

**Regra importante:** Se o utilizador escolher “aleatório total” por nome, podes escolher por default Roll padrão mas com verificação: se ficar impraticável (ex.: todas as stats baixas), permitir re-roll automático (opcional).

## 7 — Algoritmo de geração (pseudocódigo simplificado)

```javascript
function gerarPersonagem(nome, preferencias):
    personagem = {}
    personagem.nome = nome
    personagem.nivel = preferencias.nivel or 1

    // escolha raça e classe (aleatório ou guiado)
    personagem.raca = escolherRaca(preferencias)
    personagem.classe = escolherClasse(preferencias)

    // atributos
    if preferencias.metodo == "roll":
        atributos = rolar6x4d6_drop_lowest()
    elif metodo == "standard":
        atributos = [15,14,13,12,10,8]
    else:
        atributos = point_buy(preferencias.points)

    // mapear atributos prioritários pela classe
    atributos = mapearPorClasse(atributos, personagem.classe)

    // aplicar bônus raciais
    atributos = aplicarBonusRaciais(atributos, personagem.raca)

    // calcular proficiências, HP, equipamentos iniciais
    personagem = calcularDerivadas(personagem, atributos)

    // gerar poderes básicos (spell list curta ou features)
    personagem.poderes = escolherPoderes(personagem)

    // background e personalidade
    personagem.background = gerarBackgroundAleatorio()
    personagem.tracos = gerarTracos()

    return personagem
```

## 8 — Estrutura da ficha (campos que a ficha deve ter)

*   Metadados: nome, jogador (opcional), nível, experiência (opcional), idioma.
*   Raça, sub-raça, ancestralidade.
*   Classe e subclasse.
*   Atributos: STR, DEX, CON, INT, WIS, CHA (valor + modificador).
*   HP, CA, proficiência, iniciativa, velocidade.
*   Perícias e proficiências (idiomas, ferramentas).
*   Equipamento principal e secundário.
*   Feats / Talents (se aplicável).
*   Poderes / Magias (lista com nível de magia).
*   Background: descrição curta, traços, ideais, vínculos, falhas.
*   Ganchos e ideias para roleplay.
*   Notas do mestre (geradas).

## 10 — Lista de raças a incluir (prioridade)

**Essenciais (MVP):**
*   Humano (versões: padrão e variante)
*   Elfo (sub-raças: Alto, Madeira, drow opcional)
*   Anão (sub-raças: anão da colina, anão da montanha)
*   Halfling (pés-leves, robustos)
*   Meio-elfo
*   Meio-orc
*   Gnomo (rocha, das florestas)
*   Tiefling
*   Dragonborn

**Extras (versão 1+):**
Aasimar, Tabaxi, Kenku, Lizardfolk, Tortle, Goliath, Firbolg, Genasi, Yuan-ti Pureblood, Changeling, Simic / Vedalken.

## 11 — Lista de classes e espécies de poderes a incluir

**Classes essenciais (MVP):**
Guerreiro, Ladino, Mago (Wizard), Clérigo, Bárbaro, Bardo, Ranger, Paladino, Feiticeiro (Sorcerer), Monge, Bruxo (Warlock).

**Subclasses (MVP):** 1–2 por classe.

## 12 — Dados / banco de conteúdo

*   **Races table:** nome, subraça, bônus atributos, habilidades raciais, velocidade, idiomas.
*   **Classes table:** nome, d6/d8/d10 HD, proficiencies, lista de poderes por nível.
*   **Spells table:** nome, nível, tipo, descr. curta.
*   **Equipment table:** armas, armaduras, itens com stats.
*   **Backgrounds:** listas de traços, ideais, vínculos, falhas, mini-histórias.
*   **Templates:** mapping de atributos por classe.

## 13 — Modelo de dados (exemplo simplificado)

*   **Tabela characters:** id, user_id, nome, nivel, raca_id, classe_id, atributos(json), poderes(json), equipamento(json), background(json), created_at, updated_at
*   **Tabela races:** id, nome, subraça, bonus (json), habilidades (json), descricao
*   **Tabela classes:** id, nome, hd, proficiencies (json), poderes_por_nivel (json)

## 14 — API endpoints (exemplo)

*   `POST /api/generate` — body: { nome, preferencias } → retorna personagem JSON
*   `GET /api/characters/:id` — obtém personagem salvo
*   `POST /api/characters` — salva personagem
*   `POST /api/export/pdf` — gera e retorna PDF

## 15 — UX/UI: fluxo do usuário (mvp)

*   **Tela inicial:** campo Nome + botão Gerar + botão Avançado.
*   **Gerar:** animação rápida → mostrar cartão resumo (raça/classe/nível/atributos chave).
*   **Botões:** Re-rolar tudo, Re-rolar raça, Re-rolar atributos, Salvar, Exportar PDF.
*   **Tela ficha detalhada:** todos os stats, poderes, histórico e ganchos.
*   **Configurações:** escolher método de geração, idioma, export templates.

## 16 — Tech stack recomendado

*   **Frontend:** React Native (iOS + Android) ou Flutter. Se quiser web: React + Tailwind.
*   **Backend:** Node.js + Express ou NestJS.
*   **DB:** PostgreSQL + Redis.
*   **Auth:** JWT + OAuth.
*   **PDF:** Puppeteer / html2pdf.

## 22 — Pseudocódigo para "Re-roll seletivo"

```javascript
function rerollField(characterId, field):
    character = loadCharacter(characterId)
    if field == "raca":
        newRaca = escolherRaca()
        character.raca = newRaca
        character.atributos = aplicarBonusRaciais(character.atributos, newRaca)
    if field == "atributos":
        novos = rolar6x4d6_drop_lowest()
        character.atributos = mapearPorClasse(novos, character.classe)
    save(character)
    return character
```

## 23 — Checklist prática pra começar hoje (to-do imediato)

1.  Escrever o Spec minimal (FEITO).
2.  Criar seed DB com raças/classes SRD (começa com 10 raças + 10 classes).
3.  Implementar endpoint POST /api/generate que retorna JSON com personagens.
4.  Fazer protótipo UI simples (botão gerar → mostra JSON).
5.  Testar internamente com 100 gerações e validar coerência.

