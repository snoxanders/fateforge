# FateForge — Plano de Correções (Engenharia)

> Status: proposto · Autor: auditoria técnica + D&D 5e · Data base: 2026-06-22
> Escopo: engine de geração de personagens (`backend/src`) e os painéis de ficha (`backend/frontend/src`).

## Princípios

1. **Rede de segurança antes de refatorar.** Hoje não há testes e o RNG usa `Math.random()` direto (não determinístico). Criar uma base de testes é pré-requisito para mexer na engine com confiança.
2. **Uma correção = um commit = uma verificação.** Cada item é validado (teste unitário + e2e contra o banco real) antes do próximo.
3. **Não quebrar a UI.** Toda mudança de modelo é checada contra os tipos do frontend (`frontend/src/types/character.ts`) e os painéis que consomem o campo.
4. **Corrigir regra > adicionar conteúdo.** Primeiro a ficha fica *correta*; depois fica *rica*.

## Risco transversal conhecido (resolver no Fase 0)

- **Contrato de magia divergente.** Backend gera `character.spellcasting` (`models/Character.ts:44`), mas `MagicPanel.tsx:10,23` lê `character.spells.spellcasting` e `character.spells.spells`. O `DatabaseService` ainda salva isso na coluna `spells`. Precisa auditar `App.tsx` + `types/character.ts` e **unificar o contrato** — é possível que a aba de Magias esteja parcial/quebrada hoje.
- **Tipos duplicados.** Existe um tipo no backend (`models/`) e outro no frontend (`types/character.ts`). Risco de drift. Recomendação: tratá-los como contrato e mantê-los em sincronia a cada mudança (idealmente, no futuro, um pacote compartilhado).
- **Drift de migration Prisma.** A migration não cria `experience`/`passivePerception`; hoje o banco está correto via `db push`. Fechar com uma migration formal (item X.1).

---

## Fase 0 — Rede de segurança

| ID | Tarefa | Arquivos | Esforço | Risco |
|----|--------|----------|---------|-------|
| T0.1 | **RNG determinístico injetável** (seed `mulberry32`). Refatorar `dice.ts`, `pickRandom`, `pickOne` para usar um RNG passável. Bônus de produto: habilita "compartilhar personagem por seed". | `utils/dice.ts`, `services/CharacterGeneratorService.ts` | M | Baixo |
| T0.2 | **Test runner + golden tests.** Adicionar `vitest`. Gerar fichas com seed fixa para cada classe (×12) em níveis 1/5/11 e assertar invariantes (CA, HP, PB, saves, slots). | `backend/` (config + `__tests__`) | M | Baixo |
| T0.3 | **Auditar e unificar o contrato de magia** backend↔frontend. Decidir formato único (`spellcasting`) e ajustar gerador/`App.tsx`/`MagicPanel`/`types`. | `App.tsx`, `MagicPanel.tsx`, `types/character.ts`, gerador | S–M | **Médio** (pode revelar bug existente) |

**Saída da fase:** qualquer correção seguinte é verificável automaticamente.

---

## Fase 1 — P0 (correções críticas de regra)

| ID | Tarefa | Causa raiz | Solução | Arquivos | Esforço |
|----|--------|-----------|---------|----------|---------|
| T1.1 | **Resistências com bônus de proficiência** | `CharacterGeneratorService.ts:110-119` — `saves` recebido e ignorado; `save = modifier` p/ todos | `save = modifier + (proficient ? pb : 0)`. Passar `pb` e a lista `savingThrows` para `calculateAttributes`. | gerador | S |
| T1.2 | **Popular spell slots + exibir na ficha** | `CharacterGeneratorService.ts:302` (`slots: []`) ignora `classes.ts` `slotsPerLevel`; `MagicPanel` não renderiza slots | Backend: mapear `spellcasting.slotsPerLevel[level]` → `SpellSlot[]` (`{level,total,used:0}`). Frontend: adicionar bloco de slots no `MagicPanel`. | gerador, `MagicPanel.tsx` | M |

**Aceite:** Guerreiro nv5 → save FOR/CON = mod+3; Mago nv5 → slots 1:4 / 2:3 / 3:2 visíveis.

---

## Fase 2 — P1 (regras de alto valor)

| ID | Tarefa | Causa raiz | Solução | Esforço |
|----|--------|-----------|---------|---------|
| T2.1 | **Tipo de conjurador** (`full`/`half`/`pact`/`none`) | Meio-conjuradores recebem magia no nv1 e círculo alto demais (`ceil(level/2)`) | Adicionar `casterType` ao modelo+dados de classe. `none`→sem magia; `half`→sem magia <2 e nível máx = `ceil(level/4)`; `full`→`ceil(level/2)`; `pact`→tabela do bruxo. | M |
| T2.2 | **Timing de subclasse** | `:20` fixa nv≥3; Clérigo/Feiticeiro/Bruxo (nv1) e Druida (nv2) saem sem subclasse | Adicionar `subclassLevel` por classe e usar `level >= subclassLevel`. Corrige de quebra a CA da Resiliência Dracônica no nv1. | S |
| T2.3 | **ASI escalonado** | `:391-397` aplica só um +2; `increases` calculado e ignorado; marcos de classe não modelados | Modelar marcos por classe (padrão 4/8/12/16/19; Guerreiro +6/14; Ladino +10). Aplicar +2 por marco, cap 20, com "spill" pro 2º atributo prioritário quando estourar. | M |

**Aceite:** Paladino nv1 sem magia; Paladino nv5 só até 2º círculo; Clérigo nv1 com domínio; Guerreiro nv8 com +4 distribuídos (cap 20).

---

## Fase 3 — P2 (coerência / imersão)

| ID | Tarefa | Causa raiz | Solução | Esforço |
|----|--------|-----------|---------|---------|
| T3.1 | **Bio coerente por raça** | `generateBio:307` usa 1,75m/75kg/idade 20-39 p/ todos | Tabela antropométrica por raça/tamanho (Small ~0,9m; faixas de idade por longevidade). Sortear dentro da faixa. | M |
| T3.2 | **Tendência + idiomas + ouro** | alignment vem de `ideals[0]` (não do ideal exibido); idioma = texto "Idioma Extra"; ouro duplicado (bolsa 15 + item "15 po") | Derivar alignment do ideal sorteado; sortear idiomas de um pool real; remover strings de moeda do equipamento OU calcular ouro inicial por classe. | S |
| T3.3 | **Especialização (Expertise)** | Ladino nv1 / Bardo nv3 não dobram PB | Após perícias, marcar 2 perícias com PB dobrado; adicionar `expertise?: boolean` ao `Skill` e indicar na UI. | S–M |

---

## Fase 4 — P3 (conteúdo — alavanca de produto/monetização)

| ID | Tarefa | Solução | Esforço |
|----|--------|---------|---------|
| T4.1 | **Mais antecedentes** | Subir de 3 → ~13 (PHB: Soldado, Sábio, Nobre, Forasteiro, Charlatão, Artesão, Eremita, Artista, Marinheiro, Órfão…). | M |
| T4.2 | **Mais subclasses** | ≥2 por classe (hoje 1) para o sorteio de subclasse variar de verdade. | M–L |
| T4.3 | **Mais magias** | Ampliar o pool por classe/nível (hoje ~30). Garantir pool > nº conhecido para haver variedade. | M–L |
| T4.4 | **Método point-buy** | `GenerationMethod` já prevê `point-buy`, mas `generateBaseStats` não implementa. Adicionar compra de 27 pontos. | S |

> **Gancho de monetização:** parte do conteúdo (T4.x) e exportações/temas podem ser *gratuito até X / premium ilimitado*. Conteúdo é o que mais aumenta valor percebido.

---

## Débito técnico transversal

| ID | Tarefa | Esforço |
|----|--------|---------|
| X.1 | **Migration Prisma formal** fechando o drift (`experience`/`passivePerception`). | S |
| X.2 | **Validação/erros de API** (mensagens claras, `zod` no `generate`/`save`). | M |

---

## Sequenciamento (milestones)

- **Milestone A — "Correto e jogável":** T0.3 → T1.1 → T1.2 → T2.1 → T2.2 (+ X.1).
  Resultado: fichas corretas para todas as classes nos níveis usuais. **Este é o portão de "pronto pra mesa".**
- **Milestone B — "Polido":** T2.3 → T3.1 → T3.2 → T3.3.
- **Milestone C — "Conteúdo/produto":** T4.1 → T4.2 → T4.3 → T4.4.
- **Fundação (paralela ao A):** T0.1 → T0.2.

## Verificação por tarefa

1. **Unitário** (golden test com seed) — invariante numérica da regra.
2. **E2E** contra o banco de produção (gerar → salvar → listar → deletar), como já validado nesta sessão.
3. **Revisão D&D** — conferência manual de 1 ficha representativa contra o PHB.

## Rollback

Cada tarefa é um commit isolado em `main` (deploy automático na Vercel). Se o e2e falhar, `git revert` do commit e redeploy. Banco: mudanças de schema só via migration revisável (X.1).

## Estimativa agregada

- Milestone A: ~1–1,5 dia · Milestone B: ~1 dia · Milestone C: ~2–3 dias (majoritariamente conteúdo).
