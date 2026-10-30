# 📊 Dashboard de Projetos

Centro de comando para gerenciar seus projetos de desenvolvimento.

## 🎯 O que é

Um dashboard web para visualizar e gerenciar todos os seus projetos em um só lugar:
- **Mandato Digital** 🏛️
- **BeautFlow** 💅
- **DeliveryApp** 🛵
- **Revende** 🛒

## ✨ Features

- 📊 Visão geral de todos os projetos com métricas
- 📝 Registro de sessões de trabalho
- 📋 Kanban de tarefas por projeto
- 📈 Acompanhamento de progresso
- 🕐 Timeline de atividades
- 💾 Dados sincronizados na nuvem (Supabase)
- 🌐 Acesse de qualquer PC (casa, trabalho, celular)

## 🚀 Instalação Rápida

1. **Supabase**: Execute o SQL em `01_schema_supabase.sql`
2. **Next.js**: `npx create-next-app@latest dashboard-projetos --typescript --tailwind --app`
3. **Dependências**: `npm install @supabase/supabase-js date-fns lucide-react`
4. **Env**: Copie `.env.local.example` para `.env.local` e configure
5. **Arquivos**: Copie `app/`, `components/`, `lib/` para o projeto
6. **Rodar**: `npm run dev`

Leia o guia completo em `02_guia_instalacao.md`

## 📁 Estrutura

```
├── 01_schema_supabase.sql    # Schema do banco de dados
├── 02_guia_instalacao.md     # Guia passo a passo
├── .env.local.example        # Template de variáveis
├── app/                      # Páginas Next.js
│   ├── layout.tsx
│   ├── page.tsx              # Dashboard principal
│   ├── globals.css
│   └── projeto/[slug]/
│       └── page.tsx          # Detalhe do projeto
├── components/               # Componentes React
│   ├── ProjectCard.tsx
│   ├── MetricsCards.tsx
│   ├── SessionTimeline.tsx
│   ├── NewSessionModal.tsx
│   └── KanbanBoard.tsx
└── lib/
    └── supabase.ts           # Cliente e queries Supabase
```

## 🛠️ Stack

- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Banco**: Supabase (PostgreSQL)
- **Deploy**: Vercel (opcional)
- **Custo**: R$ 0,00 (free tier)

## 📱 Uso Diário

1. Trabalhe no projeto com Kimi Code
2. No fim da sessão, abra o dashboard
3. Clique em "+ Nova Sessão"
4. Registre: o que fez, duração, próximo passo
5. Pronto! Nunca mais fique perdido.

## 🔮 Roadmap (Fase 2)

- [ ] Integração com GitHub API
- [ ] Leitura automática de STATUS.md
- [ ] Webhooks para atualização em tempo real
- [ ] Gráficos de produtividade
- [ ] Exportação de relatórios

---

Criado para David — Mandato Digital, BeautFlow, DeliveryApp, Revende
