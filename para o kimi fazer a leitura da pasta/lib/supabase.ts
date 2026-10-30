import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// TIPOS
// ============================================

export interface Projeto {
  id: string
  nome: string
  slug: string
  descricao: string | null
  stack: string[] | null
  cor: string
  icone: string
  repo_url: string | null
  local_path: string | null
  status: 'ativo' | 'pausado' | 'arquivado' | 'concluido'
  progresso: number
  ultima_sessao: string | null
  created_at: string
  updated_at: string
  // Campos da view
  total_sessoes?: number
  tarefas_concluidas?: number
  tarefas_pendentes?: number
  total_minutos?: number
  ultima_sessao_titulo?: string
  ultimo_proximo_passo?: string
}

export interface Sessao {
  id: string
  projeto_id: string
  data: string
  duracao_minutos: number
  titulo: string
  resumo: string | null
  proximo_passo: string | null
  arquivos_modificados: string[] | null
  commits: string[] | null
  created_at: string
}

export interface Tarefa {
  id: string
  projeto_id: string
  titulo: string
  descricao: string | null
  status: 'a_fazer' | 'em_andamento' | 'concluido'
  prioridade: 'baixa' | 'media' | 'alta' | 'critica'
  ordem: number
  data_conclusao: string | null
  created_at: string
  updated_at: string
}

export interface RoadmapItem {
  id: string
  projeto_id: string
  titulo: string
  descricao: string | null
  fase: 'planejado' | 'em_andamento' | 'concluido'
  ordem: number
  data_prevista: string | null
  data_conclusao: string | null
  created_at: string
}

// ============================================
// QUERIES
// ============================================

export async function getProjetos() {
  const { data, error } = await supabase
    .from('v_projetos_resumo')
    .select('*')

  if (error) {
    console.error('Erro ao buscar projetos:', error)
    return []
  }
  return data as Projeto[]
}

export async function getProjetoBySlug(slug: string) {
  const { data, error } = await supabase
    .from('projetos')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data as Projeto
}

export async function getSessoes(projetoId: string, limit = 20) {
  const { data, error } = await supabase
    .from('sessoes')
    .select('*')
    .eq('projeto_id', projetoId)
    .order('data', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data as Sessao[]
}

export async function getTarefas(projetoId: string) {
  const { data, error } = await supabase
    .from('tarefas')
    .select('*')
    .eq('projeto_id', projetoId)
    .order('ordem', { ascending: true })

  if (error) return []
  return data as Tarefa[]
}

export async function createSessao(sessao: Omit<Sessao, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('sessoes')
    .insert(sessao)
    .select()
    .single()

  if (error) throw error

  // Atualizar ultima_sessao do projeto
  await supabase
    .from('projetos')
    .update({ ultima_sessao: new Date().toISOString() })
    .eq('id', sessao.projeto_id)

  return data as Sessao
}

export async function updateTarefaStatus(tarefaId: string, status: Tarefa['status']) {
  const updateData: any = { status }
  if (status === 'concluido') {
    updateData.data_conclusao = new Date().toISOString()
  }

  const { error } = await supabase
    .from('tarefas')
    .update(updateData)
    .eq('id', tarefaId)

  if (error) throw error
}

export async function createTarefa(tarefa: Omit<Tarefa, 'id' | 'created_at' | 'updated_at' | 'data_conclusao'>) {
  const { data, error } = await supabase
    .from('tarefas')
    .insert(tarefa)
    .select()
    .single()

  if (error) throw error
  return data as Tarefa
}
