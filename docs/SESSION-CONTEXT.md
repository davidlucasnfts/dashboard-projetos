# SESSION-CONTEXT — Estado Atual

> Resumo das últimas sessões, onde paramos, decisões pendentes, débitos técnicos e como testar local. Atualizado em **29/10/2026**.

---

## Resumo das sessões

**Sessão 29/10/2026 — Sync automatizado via GitHub**
- `app/api/sync/route.ts` passou a buscar os arquivos direto do GitHub (raw.githubusercontent.com) para os projetos configurados.
- Configurado o repo do BeautFlow: `davidlucasnfts/BeautFllow`.
- Mantido fallback para leitura local de disco para projetos ainda sem repo configurado.
- Testado com sucesso: `curl -X POST http://localhost:3000/api/sync` retornou BeautFlow `ok: true`.

**Sessão 29/10/2026 — Documentação profissional do dashboard**
- Criada estrutura de documentação `docs/` com MEMORY, SESSION-CONTEXT, ROADMAP e AGENTS.
- README atualizado para refletir o propósito real do projeto.
- Próximo passo: validar re-sync e botão "ver mais" com o usuário.

**Sessão 29/10/2026 — Melhoria na timeline e no sync**
- Sync alterado para deletar sessões e tarefas antigas do projeto antes de re-inserir (fonte de verdade = arquivos locais).
- Parser deixou de truncar textos: resumos completos são armazenados no Supabase.
- `SessionTimeline` ganhou estado `expandido` e botão "ver mais / ver menos" para textos longos.

**Sessão 28/10/2026 — Parser do BeautFlow e sincronização real**
- Implementado `lib/parsers/beautflow.ts` lendo `MEMORY.md`, `SESSION-CONTEXT.md`, `ROADMAP.md` e `AGENTS.md`.
- Texto técnico convertido para linguagem de negócio (remoção de `.tsx`, commits, camelCase de componentes).
- Dashboard passou a mostrar dados reais do BeautFlow: 26 sessões, 1h investida, progresso 43%.

**Sessão 27/10/2026 — Correções iniciais**
- Tailwind 4 corrigido em `app/globals.css`.
- Query de projetos ajustada para tabela `projetos`.
- Corrigido erro 404 na página de detalhe (`params` como Promise no Next.js 16).

---

## Onde paramos — próximos passos

1. Validar re-sync e o botão "ver mais" na timeline com screenshot do usuário.
2. Adicionar os repositórios GitHub de **Mandato Digital**, **DeliveryApp** e **ReVende** em `app/api/sync/route.ts` quando estiverem prontos.
3. Implementar parsers para os demais projetos quando suas pastas/repos tiverem a mesma estrutura do BeautFlow.
4. Evoluir o Kanban para permitir mover cards entre colunas e persistir o novo status no Supabase.
5. Criar tela/página de configuração de projetos (URLs dos repos, cores, ícones).
6. Adicionar relatórios: tempo investido por projeto, velocidade de entregas, tarefas concluídas por período.

---

## Decisões pendentes / Ações manuais

- [ ] **David:** adicionar repositórios GitHub de Mandato Digital, DeliveryApp e ReVende no sync (`app/api/sync/route.ts`).
- [x] **David:** decidir se a sincronização deve ser automatizada — **decisão:** buscar do GitHub, manter botão manual por enquanto.
- [ ] **David:** organizar a estrutura de arquivos dos demais projetos no mesmo padrão do BeautFlow.
- [ ] **David:** revisar se o progresso deve continuar sendo calculado por fases do roadmap ou por requisitos funcionais.
- [ ] **David:** definir se o dashboard ficará hospedado (Vercel) ou será apenas local.

---

## Débitos técnicos conhecidos

- Parser ainda baseado em regex; ideal migrar para parser markdown estruturado (ex: `marked` + AST) para maior robustez.
- Ausência de testes automatizados (unitários e integração).
- Políticas de RLS no Supabase ainda não revisadas; app usa anon key com acesso direto às tabelas.
- Código de sync acoplado ao slug `beautflow`; precisa ser generalizado via configuração de projetos (hoje já busca do GitHub, mas só o BeautFlow está mapeado).
- `lib/status-parser.ts` (legado do STATUS.md) já foi removido; confirmar que nenhuma referência resta.
