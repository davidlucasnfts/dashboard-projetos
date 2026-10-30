# MEMORY — Histórico de Entregas

> Arquivo mestre do histórico do dashboard-projetos. Aqui registra-se **o que já foi feito**, para manter rastreabilidade e contexto entre sessões.

---

## ✅ Entregues

| Funcionalidade | Data | Observações |
|---|---|---|
| Configuração inicial do projeto Next.js 16 + Tailwind 4 + Supabase | 25/10/2026 | `create-next-app`, tabelas criadas no Supabase, 4 projetos cadastrados manualmente. |
| Correção crítica de estilos (Tailwind 4) | 27/10/2026 | `globals.css` migrou de `@tailwind base/components/utilities` para `@import "tailwindcss"`. |
| Correção da query de projetos | 27/10/2026 | `getProjetos()` passou a ler direto da tabela `projetos` em vez da view `v_projetos_resumo` (problema de RLS/permissões com anon key). |
| Componentes resilientes a campos opcionais | 27/10/2026 | `ProjectCard`, `MetricsCards` e `SessionTimeline` ajustados para lidar com campos ausentes da view. |
| Página de detalhe do projeto | 27/10/2026 | Rota `/projeto/[slug]`; correção do erro 404 causado por `params` não ser `await` no Next.js 16. |
| Kanban de tarefas | 27/10/2026 | `KanbanBoard` exibe tarefas pendentes extraídas do `ROADMAP.md` e próximos passos do `SESSION-CONTEXT.md`. |
| Sincronização de status via arquivos locais | 28/10/2026 | API `/api/sync` + parser `lib/parsers/beautflow.ts` lê `MEMORY.md`, `SESSION-CONTEXT.md`, `ROADMAP.md` e `AGENTS.md` do BeautFlow. |
| Parser de linguagem de negócio | 28/10/2026 | Limpeza de código (nomes de arquivo `.tsx`, hashes de commit, camelCase técnico) para gerar descrições legíveis na timeline. |
| Timeline com datas formatadas e leitura confortável | 28/10/2026 | Fonte aumentada, datas em `dd/MM/yyyy`, removido `formatDistanceToNow`. |
| Re-sync completo e limpo | 29/10/2026 | Sync passou a deletar sessões/tarefas antigas antes de re-inserir, garantindo que melhorias no parser reflitam no dashboard. |
| Texto completo + botão "ver mais" na timeline | 29/10/2026 | Parser deixou de truncar; `SessionTimeline` exibe resumo com 3 linhas e botão para expandir. |
| Documentação profissional do próprio dashboard | 29/10/2026 | Criação de `docs/MEMORY.md`, `docs/SESSION-CONTEXT.md`, `docs/ROADMAP.md` e `docs/AGENTS.md`. |
| Sync automatizado via GitHub | 29/10/2026 | `app/api/sync/route.ts` passou a buscar os arquivos markdown direto do repositório GitHub do BeautFlow (`raw.githubusercontent.com`). |

---

## Notas de versão

- **Último registro:** Sync automatizado via GitHub — 29/10/2026.
- **Regra do projeto:** nunca duplicar informação. Histórico fica aqui; estado atual fica em `SESSION-CONTEXT.md`; planejamento em `ROADMAP.md`; erros em `docs/AGENTS.md`.
