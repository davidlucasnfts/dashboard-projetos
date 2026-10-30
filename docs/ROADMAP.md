# ROADMAP — Planejamento

> Plano de evolução do dashboard-projetos. Define fases, requisitos funcionais e o que falta para cada marco.

---

## Plano de Progresso

| Fase | Objetivo | Status |
|---|---|---|
| 0 | Setup do projeto e correções críticas (Tailwind, Supabase, rotas) | ✅ |
| 1 | Dashboard visual: cards, métricas, timeline e navegação | ✅ |
| 2 | Sincronização automática a partir de arquivos markdown | [~] |
| 3 | Kanban interativo e registro manual de sessões | [~] |
| 4 | Suporte a múltiplos projetos com parsers específicos | ⏳ |
| 5 | Relatórios, metas e exportação de dados | ⏳ |

**Legenda:** ✅ Concluído · [~] Em andamento / Parcial · ⏳ Pendente

---

## Requisitos Funcionais

| ID | Requisito | Descrição | Status |
|---|---|---|---|
| RF-001 | Listar projetos | Exibir todos os projetos cadastrados no Supabase em cards coloridos. | ✅ |
| RF-002 | Exibir métricas consolidadas | Mostrar total de projetos ativos, sessões, tempo investido e tarefas pendentes/concluídas. | ✅ |
| RF-003 | Timeline de atividade recente | Listar as últimas sessões de todos os projetos, com data, título e resumo. | ✅ |
| RF-004 | Detalhar projeto | Página `/projeto/[slug]` com descrição, progresso, sessões e tarefas. | ✅ |
| RF-005 | Kanban de tarefas | Visualizar tarefas em colunas "A Fazer", "Em Andamento" e "Concluído". | ✅ |
| RF-006 | Sincronizar status via arquivos | Ler `MEMORY.md`, `SESSION-CONTEXT.md`, `ROADMAP.md` e `AGENTS.md` de cada projeto e atualizar o banco. | [~] |
| RF-015 | Sincronizar via GitHub | Buscar os arquivos markdown direto do repositório GitHub do projeto, sem depender de arquivos locais. | [~] |
| RF-007 | Parser por projeto | Cada projeto pode ter parser específico para extrair seus dados. | [~] |
| RF-008 | Registro manual de sessão | Formulário para adicionar sessão manualmente sem depender do sync. | ✅ |
| RF-009 | Persistência no Supabase | Todos os dados de projetos, sessões e tarefas armazenados no Supabase. | ✅ |
| RF-010 | Expandir detalhes da timeline | Botão "ver mais" para exibir o texto completo de uma atividade. | ✅ |
| RF-011 | Mover tarefas no Kanban | Arrastar/alterar status das tarefas e persistir no banco. | ⏳ |
| RF-012 | Configurar projetos | Tela para editar caminho local, cor, ícone e stack de cada projeto. | ⏳ |
| RF-013 | Relatórios de produtividade | Tempo investido por projeto, entregas por período, velocity. | ⏳ |
| RF-014 | Sincronizar múltiplos projetos | BeautFlow, Mandato Digital, DeliveryApp e ReVende com parsers próprios. | ⏳ |

---

## Requisitos Não-Funcionais

| ID | Requisito | Meta |
|---|---|---|
| RNF-001 | Tempo de resposta da página inicial | < 2 segundos |
| RNF-002 | Hot-reload durante desenvolvimento | Servidor já roda com `npm run dev`; alterações refletem automaticamente. |
| RNF-003 | Segurança básica | Revisar RLS do Supabase antes de publicar. |
| RNF-004 | Manutenibilidade | Código modular: parsers separados, queries centralizadas em `lib/supabase.ts`. |

---

## Notas

- O progresso geral de cada projeto é calculado a partir do `ROADMAP.md` do próprio projeto (fases concluídas / total).
- A fase 2 só será considerada concluída quando **todos** os projetos monitorados tiverem sync funcionando.
