import { getProjetos, getAllSessoes, getAllTarefas, Projeto, Sessao, Tarefa } from '@/lib/supabase'
import ProjectCard from '@/components/ProjectCard'
import MetricsCards from '@/components/MetricsCards'
import SessionTimeline from '@/components/SessionTimeline'
import NewSessionModal from '@/components/NewSessionModal'
import SyncButton from '@/components/SyncButton'
import { FolderKanban } from 'lucide-react'

export const instant = false

function enrichProjetos(projetos: Projeto[], sessoes: Sessao[], tarefas: Tarefa[]): Projeto[] {
  return projetos.map((projeto) => {
    const sessoesProjeto = sessoes.filter(s => s.projeto_id === projeto.id)
    const tarefasProjeto = tarefas.filter(t => t.projeto_id === projeto.id)

    const total_sessoes = sessoesProjeto.length
    const total_minutos = sessoesProjeto.reduce((acc, s) => acc + s.duracao_minutos, 0)
    const tarefas_concluidas = tarefasProjeto.filter(t => t.status === 'concluido').length
    const tarefas_pendentes = tarefasProjeto.filter(t => t.status !== 'concluido').length

    const ultimaSessao = sessoesProjeto[0] || null

    return {
      ...projeto,
      total_sessoes,
      total_minutos,
      tarefas_concluidas,
      tarefas_pendentes,
      ultima_sessao_titulo: ultimaSessao?.titulo,
      ultimo_proximo_passo: ultimaSessao?.proximo_passo,
    }
  })
}

export default async function DashboardPage() {
  const [projetos, sessoes, tarefas] = await Promise.all([
    getProjetos(),
    getAllSessoes(),
    getAllTarefas(),
  ])

  const projetosEnriquecidos = enrichProjetos(projetos, sessoes, tarefas)
  const projetosAtivos = projetosEnriquecidos.filter(p => p.status === 'ativo')

  const totalSessoes = projetosEnriquecidos.reduce((acc, p) => acc + (p.total_sessoes || 0), 0)
  const totalMinutos = projetosEnriquecidos.reduce((acc, p) => acc + (p.total_minutos || 0), 0)
  const tarefasConcluidas = projetosEnriquecidos.reduce((acc, p) => acc + (p.tarefas_concluidas || 0), 0)
  const tarefasPendentes = projetosEnriquecidos.reduce((acc, p) => acc + (p.tarefas_pendentes || 0), 0)

  return (
    <main className="min-h-screen p-6 max-w-[1600px] mx-auto">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Meus Projetos</h1>
            <p className="text-sm text-zinc-500">Centro de comando • {projetosAtivos.length} projetos ativos</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SyncButton />
          <NewSessionModal projetos={projetosAtivos} />
        </div>
      </header>

      {/* MÉTRICAS */}
      <MetricsCards
        projetosAtivos={projetosAtivos.length}
        totalSessoes={totalSessoes}
        totalMinutos={totalMinutos}
        tarefasConcluidas={tarefasConcluidas}
        tarefasPendentes={tarefasPendentes}
      />

      {/* GRID DE PROJETOS */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Projetos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {projetosEnriquecidos.map((projeto) => (
            <ProjectCard key={projeto.id} projeto={projeto} />
          ))}
        </div>
      </section>

      {/* TIMELINE RECENTE */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Atividade Recente</h2>
        <SessionTimeline sessoes={sessoes} projetos={projetos} />
      </section>
    </main>
  )
}
