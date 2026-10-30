# AGENTS.md — Regras e Erros Registrados

> Regras de código, decisões arquiteturais e tabela Self-Healing com erros que não podem se repetir.

---

## Regras do projeto

1. **Nunca duplicar documentação.** Cada arquivo tem uma função única:
   - `MEMORY.md` → histórico do que foi feito.
   - `SESSION-CONTEXT.md` → estado atual e próximos passos.
   - `ROADMAP.md` → planejamento e requisitos.
   - `AGENTS.md` → regras e erros.

2. **Sempre que alterar `.env.local`, reiniciar o servidor.** O Next.js 16 não recarrega variáveis de ambiente automaticamente.

3. **Nunca editar o bloco `<!-- BEGIN:nextjs-agent-rules -->` do `AGENTS.md` raiz.** Ele é gerenciado automaticamente pelo `next dev`. Alterações devem ser commitadas junto com outras mudanças para manter a árvore limpa.

4. **Parsers ficam em `lib/parsers/<projeto>.ts`.** Cada projeto monitorado pode ter seu próprio parser, desde que retorne a interface `ProjetoExtraido`.

5. **A fonte de verdade dos dados são os arquivos markdown de cada projeto.** O banco de dados é uma projeção. Sempre que o parser mudar, os dados derivados devem ser reconstruídos (deletar e re-inserir).

6. **Prefira buscar os arquivos do GitHub ao invés de caminhos locais.** Para projetos com repositório público, use `raw.githubusercontent.com`. Projetos privados podem usar `GITHUB_TOKEN`. Mantenha caminho local apenas como fallback.

7. **Correções técnicas de funcionamento não precisam de autorização do usuário.** Decisões importantes e de alto impacto (arquitetura, custo, segurança, exclusão de dados sensíveis) devem ser questionadas.

---

## Erros Registrados (Self-Healing)

| # | Quando aconteceu | Causa raiz | Solução aplicada | Como prevenir |
|---|---|---|---|---|
| 001 | 27/10/2026 | Estilos não aplicados: `globals.css` usava diretivas `@tailwind base/components/utilities` do Tailwind 3 em projeto com Tailwind 4. | Substituído por `@import "tailwindcss";` e mantidos os estilos customizados. | Ao atualizar Tailwind/Next.js, verificar a diretiva correta na documentação oficial. |
| 002 | 27/10/2026 | Dashboard mostrava "0 projetos ativos": query usava a view `v_projetos_resumo`, que apresentava problema de RLS/permissões com a anon key. | `getProjetos()` passou a ler diretamente da tabela `projetos`, com ordenação por `updated_at DESC`. | Evitar views que dependam de permissões complexas quando se usa anon key pública. |
| 003 | 27/10/2026 | Página de detalhe do projeto retornava 404. | No Next.js 16, `params` é uma `Promise` e precisava ser aguardado com `await`. | Sempre tratar `params` como Promise em rotas dinâmicas do Next.js 16+. |
| 004 | 27/10/2026 | Warnings de hidratação com atributos `data-darkreader-*`. | Causado pela extensão Dark Reader do navegador, não pelo app. | Ignorar; não alterar o DOM para suprimir. |
| 005 | 28/10/2026 | Erro `ENOTFOUND seu-projeto.supabase.co` / `abcdefghijklmnopqrstuvwxyz.supabase.co`. | `.env.local` continha URL placeholder ou chave incorreta do Supabase. | Validar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no startup. |
| 006 | 29/10/2026 | Texto técnico antigo persistia na timeline mesmo após melhoria do parser. | O sync só inseria sessões novas; as antigas continuavam no banco. | Sync passou a deletar sessões e tarefas do projeto antes de re-inserir, reconstruindo do zero a partir dos arquivos. |
| 007 | 29/10/2026 | Sync só funcionava no PC local porque usava caminhos fixos do Windows. | Na Vercel ou outra máquina os arquivos locais não existiam. | Sync passou a buscar arquivos do GitHub (`raw.githubusercontent.com`) para projetos configurados, com fallback local. |

---

## Checklist antes de iniciar nova sessão

- [ ] `MEMORY.md` atualizado com o que foi entregue na sessão anterior.
- [ ] `SESSION-CONTEXT.md` reflete o estado atual e próximos passos.
- [ ] `ROADMAP.md` está com fases/requisitos atualizados.
- [ ] Nenhum erro novo foi introduzido sem ser registrado neste arquivo.
