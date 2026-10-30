# 🚀 Dashboard de Projetos — Guia de Instalação

## Pré-requisitos
- Node.js 18+ instalado
- Conta no Supabase (você já tem ✅)
- Git instalado
- 30 minutos

---

## PASSO 1: Configurar o Supabase (5 min)

1. Acesse https://supabase.com/dashboard
2. Crie um **novo projeto** chamado `dashboard-projetos`
   - Região: South America (São Paulo)
   - Plano: Free
3. Aguarde o projeto inicializar (~2 min)
4. Vá em **SQL Editor** (menu lateral)
5. Clique em **New Query**
6. Cole TODO o conteúdo do arquivo `01_schema_supabase.sql`
7. Clique em **Run** (ou Ctrl+Enter)
8. Verifique se apareceu "Success"

### Pegar as chaves de API
1. Vá em **Project Settings** → **API**
2. Anote:
   - **Project URL**: `https://xxxx.supabase.co`
   - **anon public key**: `eyJ...`

---

## PASSO 2: Criar o projeto Next.js (5 min)

Abra o terminal (PowerShell) e rode:

```powershell
cd C:\Users\David\Documents
npx create-next-app@latest dashboard-projetos --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

Quando perguntar:
- TypeScript? **Yes**
- ESLint? **Yes**
- Tailwind CSS? **Yes**
- `src/` directory? **No**
- App Router? **Yes**
- Turbopack? **Yes** (recomendado)

---

## PASSO 3: Instalar dependências (2 min)

```powershell
cd dashboard-projetos
npm install @supabase/supabase-js @supabase/ssr date-fns lucide-react
npm install -D @types/node
```

---

## PASSO 4: Configurar variáveis de ambiente (2 min)

Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

> ⚠️ Substitua pelos valores do PASSO 1.

---

## PASSO 5: Copiar os arquivos do dashboard (5 min)

Copie os arquivos da pasta `app/` e `components/` deste pacote para o seu projeto Next.js, substituindo os existentes.

Estrutura final:
```
dashboard-projetos/
├── app/
│   ├── layout.tsx          ← substituir
│   ├── page.tsx            ← substituir (Dashboard principal)
│   ├── globals.css         ← substituir
│   └── projeto/
│       └── [slug]/
│           └── page.tsx    ← novo (Detalhe do projeto)
├── components/
│   ├── ProjectCard.tsx     ← novo
│   ├── SessionTimeline.tsx ← novo
│   ├── KanbanBoard.tsx     ← novo
│   ├── MetricsCards.tsx    ← novo
│   └── NewSessionModal.tsx ← novo
├── lib/
│   └── supabase.ts         ← novo
└── .env.local              ← criar no PASSO 4
```

---

## PASSO 6: Rodar o dashboard (1 min)

```powershell
npm run dev
```

Abra no navegador: **http://localhost:3000**

---

## PASSO 7: Deploy na Vercel (opcional, 5 min)

Para acessar de qualquer lugar sem precisar rodar `npm run dev`:

```powershell
npm install -g vercel
vercel login
vercel
```

Configure as mesmas variáveis de ambiente na Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Pronto! Seu dashboard estará em `https://dashboard-projetos.vercel.app`

---

## USO DIÁRIO

### No PC de casa (Mandato Digital, BeautFlow, DeliveryApp):
1. Trabalhe no projeto com Kimi Code
2. No fim da sessão, abra o dashboard
3. Clique em **"+ Nova Sessão"**
4. Preencha: o que fez, duração, próximo passo
5. Salve

### No PC do trabalho (Revende):
1. Mesmo fluxo
2. O dashboard mostra TODOS os projetos, mesmo os que estão em casa

### Sincronização automática (Fase 2):
- Configure o STATUS.md em cada projeto
- O dashboard lê via GitHub API
- 80% automático

---

## SUPORTE

Se der erro:
1. Verifique se o SQL rodou sem erros no Supabase
2. Verifique se as variáveis de ambiente estão corretas
3. Rode `npm install` de novo
4. Limpe o cache: `rm -rf .next && npm run dev`

---

**Próximo passo:** Depois de rodar, me avisa que eu configuro a Fase 2 (integração Git automática).
