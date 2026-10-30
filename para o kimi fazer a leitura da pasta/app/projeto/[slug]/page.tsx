import { getProjetoBySlug, getSessoes, getTarefas } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, GitCommit, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import KanbanBoard from '@/components/KanbanBoard'

export const revalidate = 0

interface Props {
  params: { slug: string }
}

export default async function ProjetoPage({ params }: Props) {
  const projeto = await getProjetoBySlug(params.slug)

  if (!projeto) {
    notFound()
  }

  const sessoes = await getSessoes(projeto.id)
  const tarefas = await getTarefas(projeto.id)

  const totalMinutos = sessoes.reduce((acc, s) => acc + s.duracao_minutos, 0)
  const horas = Math.floor(totalMinutos / 60)

  return (
    <main className="min-h-screen p-6 max-w-[1400px] mx-auto">
      {/* Back button */}
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao Dashboard
      </Link>

      {/* Header do projeto */}
      <header className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${projeto.cor}20` }}
            >
              {projeto.icone}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{projeto.nome}</h1>
              <p className="text-zinc-500 mt-1">{projeto.descricao}</p>
              <div className="flex items-center gap-4 mt-3">
                {projeto.stack?.map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {projeto.repo_url && (
            <a
              href={projeto.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <GitCommit className="w-4 h-4" />
              GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Progresso */}
        <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-400">Progresso geral</span>
            <span className="text-white font-semibold">{projeto.progresso}%</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all"
              style={{ 
                width: `${projeto.progresso}%`,
                background: `linear-gradient(90deg, ${projeto.cor}, ${projeto.cor}cc)`
              }}
            />
          </div>
          <div className="flex items-center gap-6 mt-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {horas}h investidas
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {sessoes.length} sessões
            </span>
          </div>
        </div>
      </header>

      {/* Grid: Kanban + Sessões */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Kanban */}
        <div className="xl:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Tarefas</h2>
          <KanbanBoard tarefas={tarefas} projetoId={projeto.id} />
        </div>

        {/* Sessões */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Histórico de Sessões</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {sessoes.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
                <p className="text-zinc-500 text-sm">Nenhuma sessão registrada.</p>
              </div>
            ) : (
              sessoes.map((sessao) => (
                <div 
                  key={sessao.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-fade-in"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white text-sm">{sessao.titulo}</h3>
                    <span className="text-xs text-zinc-500 whitespace-nowrap ml-2">
                      {format(new Date(sessao.data), "dd MMM", { locale: ptBR })}
                    </span>
                  </div>
                  {sessao.resumo && (
                    <p className="text-xs text-zinc-400 mb-2 line-clamp-2">{sessao.resumo}</p>
                  )}
                  {sessao.proximo_passo && (
                    <p className="text-xs text-indigo-400 mb-2">
                      → {sessao.proximo_passo}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-zinc-600">
                    <Clock className="w-3 h-3" />
                    {sessao.duracao_minutos}min
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
