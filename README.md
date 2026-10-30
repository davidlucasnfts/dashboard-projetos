# dashboard-projetos

Dashboard pessoal para gerenciar projetos de desenvolvimento. Conecta-se ao Supabase e sincroniza dados a partir dos arquivos markdown de cada projeto (`MEMORY.md`, `SESSION-CONTEXT.md`, `ROADMAP.md`, `AGENTS.md`).

---

## Objetivo

Centralizar em um único lugar:

- Visão geral de todos os projetos ativos.
- Métricas de produtividade (sessões, tempo investido, tarefas).
- Histórico de entregas e atividades recentes.
- Próximos passos e débitos técnicos.
- Kanban com tarefas pendentes.

---

## Stack

- **Framework:** Next.js 16.4.3 (App Router)
- **Linguagem:** TypeScript 5
- **Estilos:** Tailwind CSS 4
- **Banco de dados:** Supabase (PostgreSQL)
- **Ícones:** Lucide React
- **Datas:** date-fns

---

## Estrutura de pastas

```
app/
  page.tsx                 # Dashboard principal
  layout.tsx               # Layout root
  projeto/[slug]/page.tsx  # Detalhe do projeto
  globals.css              # Estilos globais (Tailwind 4)
  api/sync/route.ts        # Sincronização de dados via GitHub ou arquivos locais
components/
  ProjectCard.tsx          # Card do projeto no dashboard
  MetricsCards.tsx         # Métricas consolidadas
  SessionTimeline.tsx      # Timeline de atividades (com "ver mais")
  KanbanBoard.tsx          # Kanban de tarefas
  NewSessionModal.tsx      # Modal de registro manual de sessão
  SyncButton.tsx           # Botão de sincronização
lib/
  supabase.ts              # Cliente Supabase e queries
  parsers/
    beautflow.ts           # Parser específico do BeautFlow
```

---

## Documentação do projeto

A documentação do próprio dashboard segue o mesmo padrão dos projetos monitorados:

- [`docs/MEMORY.md`](docs/MEMORY.md) — histórico de entregas.
- [`docs/SESSION-CONTEXT.md`](docs/SESSION-CONTEXT.md) — estado atual, próximos passos e débitos técnicos.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — planejamento, requisitos funcionais e não-funcionais.
- [`docs/AGENTS.md`](docs/AGENTS.md) — regras do projeto e erros registrados (Self-Healing).

---

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

> O servidor já deve estar rodando durante o desenvolvimento ativo. Alterações refletem automaticamente via hot-reload.

---

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<seu-projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>

# Opcional — apenas se os repositórios dos projetos forem privados
GITHUB_TOKEN=<seu-token-do-github>
```

> Se alterar `.env.local`, reinicie o servidor (`npm run dev`) para que as mudanças tenham efeito.

---

## Sincronização de projetos

O botão **"Sincronizar STATUS"** no dashboard executa a API `/api/sync`, que:

1. Busca os arquivos markdown do repositório GitHub do projeto (quando configurado).
2. Se não houver repo configurado, lê do disco local como fallback.
3. Extrai sessões, tarefas, progresso e status.
4. Atualiza o banco de dados no Supabase.

Projetos configurados no GitHub:

| Projeto | Repositório | Branch |
|---|---|---|
| BeautFlow | `davidlucasnfts/BeautFllow` | `main` |

Os demais projetos ainda usam caminho local (não funcionam na Vercel até que sejam mapeados).

---

## Próximos marcos

Ver [`docs/ROADMAP.md`](docs/ROADMAP.md) para o planejamento completo.

Resumo:

- [x] Correções críticas e dashboard visual
- [x] Sincronização do BeautFlow
- [ ] Sincronização dos demais projetos
- [ ] Kanban interativo (mover cards)
- [ ] Tela de configuração de projetos
- [ ] Relatórios de produtividade
