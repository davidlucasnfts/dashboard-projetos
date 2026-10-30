import { getProjetos } from '@/lib/supabase'
import ProjectCard from '@/components/ProjectCard'
import MetricsCards from '@/components/MetricsCards'
import SessionTimeline from '@/components/SessionTimeline'
import NewSessionModal from '@/components/NewSessionModal'
import { FolderKanban } from 'lucide-react'

export const revalidate = 0 // Sempre buscar dados frescos

export default async function DashboardPage() {
  const projetos = await getProjetos()

  const projetosAtivos = projetos.filter(p => p.status === 'ativo')
  const totalSessoes = projetos.reduce((acc, p) => acc + (p.total_sessoes || 0), 0)
  const totalMinutos = projetos.reduce((acc, p) => acc + (p.total_minutos || 0), 0)
  const tarefasConcluidas = projetos.reduce((acc, p) => acc + (p.tarefas_concluidas || 0), 0)
  const tarefasPendentes = projetos.reduce((acc, p) => acc + (p.tarefas_pendentes || 0), 0)

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
        <NewSessionModal projetos={projetosAtivos} />
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
          {projetos.map((projeto) => (
            <ProjectCard key={projeto.id} projeto={projeto} />
          ))}
        </div>
      </section>

      {/* TIMELINE RECENTE */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Atividade Recente</h2>
        <SessionTimeline projetos={projetos} />
      </section>
    </main>
  )
}
