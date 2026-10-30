import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { parseBeautFlow } from '@/lib/parsers/beautflow'
import { readFileSync } from 'fs'
import { join } from 'path'

interface RepoConfig {
  owner: string
  repo: string
  branch: string
  docsPath?: string
}

const GITHUB_REPOS: Record<string, RepoConfig> = {
  'beautflow': { owner: 'davidlucasnfts', repo: 'BeautFllow', branch: 'main' },
}

const LOCAL_PATHS: Record<string, string> = {
  'beautflow': 'C:/Users/David Lucas/Documents/PROJETOS IA/BeautFlow',
  'mandato-digital': 'C:/Users/David Lucas/Documents/PROJETOS IA/MandatoDigital',
  'deliveryapp': 'C:/Users/David Lucas/Documents/PROJETOS IA/DeliveryApp',
  'revende': 'C:/Users/David Lucas/Documents/PROJETOS IA/ReVende',
}

const DOCS = ['SESSION-CONTEXT.md', 'MEMORY.md', 'ROADMAP.md', 'AGENTS.md']

async function fetchRepoFile(owner: string, repo: string, branch: string, path: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
  const headers: Record<string, string> = {}

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`
  }

  const res = await fetch(url, { headers })
  if (!res.ok) {
    throw new Error(`GitHub retornou ${res.status} para ${path}`)
  }
  return res.text()
}

async function carregarArquivos(slug: string): Promise<Record<string, string>> {
  const repo = GITHUB_REPOS[slug]

  if (repo) {
    const prefix = repo.docsPath ? `${repo.docsPath}/` : ''
    const arquivos: Record<string, string> = {}

    await Promise.all(
      DOCS.map(async (nome) => {
        arquivos[nome] = await fetchRepoFile(repo.owner, repo.repo, repo.branch, `${prefix}${nome}`)
      })
    )

    return arquivos
  }

  const localPath = LOCAL_PATHS[slug]
  if (!localPath) {
    throw new Error('Repositório GitHub ou caminho local não configurado')
  }

  return {
    'SESSION-CONTEXT.md': readFileSync(join(localPath, 'SESSION-CONTEXT.md'), 'utf-8'),
    'MEMORY.md': readFileSync(join(localPath, 'MEMORY.md'), 'utf-8'),
    'ROADMAP.md': readFileSync(join(localPath, 'ROADMAP.md'), 'utf-8'),
    'AGENTS.md': readFileSync(join(localPath, 'AGENTS.md'), 'utf-8'),
  }
}

export async function POST() {
  const resultados: { projeto: string; ok: boolean; erro?: string }[] = []

  const { data: projetos, error: projetosError } = await supabase
    .from('projetos')
    .select('id, slug, nome')

  if (projetosError || !projetos) {
    return NextResponse.json({ error: 'Erro ao buscar projetos' }, { status: 500 })
  }

  for (const projeto of projetos) {
    if (projeto.slug !== 'beautflow') {
      resultados.push({ projeto: projeto.nome, ok: false, erro: 'Estrutura de arquivos ainda não implementada' })
      continue
    }

    try {
      const arquivos = await carregarArquivos(projeto.slug)

      const dados = parseBeautFlow({
        sessionContext: arquivos['SESSION-CONTEXT.md'],
        memory: arquivos['MEMORY.md'],
        roadmap: arquivos['ROADMAP.md'],
        agents: arquivos['AGENTS.md'],
      })

      // Atualizar projeto
      const { error: updateError } = await supabase
        .from('projetos')
        .update({
          progresso: dados.progresso,
          status: dados.status,
        })
        .eq('id', projeto.id)

      if (updateError) throw updateError

      // Limpa sessões e tarefas antigas — a fonte de verdade são os arquivos do projeto
      await supabase.from('sessoes').delete().eq('projeto_id', projeto.id)
      await supabase.from('tarefas').delete().eq('projeto_id', projeto.id)

      // Inserir sessões
      for (const sessao of dados.sessoes) {
        const { error: sessaoError } = await supabase.from('sessoes').insert({
          projeto_id: projeto.id,
          data: sessao.data,
          duracao_minutos: sessao.duracaoMinutos,
          titulo: sessao.titulo,
          resumo: sessao.resumo,
          proximo_passo: sessao.proximoPasso,
          arquivos_modificados: null,
          commits: null,
        })

        if (sessaoError) throw sessaoError
      }

      // Atualizar ultima_sessao do projeto
      if (dados.sessoes.length > 0) {
        const ultima = dados.sessoes[0]
        await supabase
          .from('projetos')
          .update({ ultima_sessao: `${ultima.data}T00:00:00.000Z` })
          .eq('id', projeto.id)
      }

      // Criar tarefas
      for (const tarefa of dados.tarefasPendentes) {
        await supabase.from('tarefas').insert({
          projeto_id: projeto.id,
          titulo: tarefa,
          descricao: null,
          status: 'a_fazer',
          prioridade: 'media',
          ordem: 0,
        })
      }

      resultados.push({ projeto: projeto.nome, ok: true })
    } catch (err: any) {
      resultados.push({ projeto: projeto.nome, ok: false, erro: err.message })
    }
  }

  return NextResponse.json({ resultados })
}
