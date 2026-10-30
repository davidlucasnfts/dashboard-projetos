import Link from 'next/link'
import { Projeto } from '@/lib/supabase'
import { Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react'

interface Props {
  projeto: Projeto
}

const statusColors = {
  ativo: 'bg-emerald-500',
  pausado: 'bg-amber-500',
  arquivado: 'bg-zinc-500',
  concluido: 'bg-indigo-500',
}

const statusLabels = {
  ativo: 'Ativo',
  pausado: 'Pausado',
  arquivado: 'Arquivado',
  concluido: 'Concluído',
}

export default function ProjectCard({ projeto }: Props) {
  const horas = Math.floor((projeto.total_minutos || 0) / 60)

  return (
    <Link href={`/projeto/${projeto.slug}`}>
      <div 
        className="group relative bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all cursor-pointer animate-fade-in"
        style={{ borderTopColor: projeto.cor, borderTopWidth: '3px' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{ backgroundColor: `${projeto.cor}20` }}
            >
              {projeto.icone}
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                {projeto.nome}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${statusColors[projeto.status]}`} />
                <span className="text-xs text-zinc-500">{statusLabels[projeto.status]}</span>
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Stack */}
        {projeto.stack && projeto.stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {projeto.stack.slice(0, 3).map((tech) => (
              <span 
                key={tech}
                className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Progresso */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-zinc-500">Progresso</span>
            <span className="text-white font-medium">{projeto.progresso}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all"
              style={{ 
                width: `${projeto.progresso}%`,
                background: `linear-gradient(90deg, ${projeto.cor}, ${projeto.cor}cc)`
              }}
            />
          </div>
        </div>

        {/* Última sessão */}
        {projeto.ultima_sessao_titulo && (
          <div className="bg-zinc-950 rounded-lg p-3 mb-4">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Última sessão</div>
            <div className="text-xs text-zinc-300 line-clamp-2">{projeto.ultima_sessao_titulo}</div>
            {projeto.ultimo_proximo_passo && (
              <div className="text-[11px] text-indigo-400 mt-1.5 line-clamp-1">
                → {projeto.ultimo_proximo_passo}
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {horas}h
            </span>
            <span>{projeto.total_sessoes || 0} sessões</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>{projeto.tarefas_concluidas || 0}</span>
            <span className="text-zinc-600">/</span>
            <Circle className="w-3 h-3 text-zinc-600" />
            <span>{projeto.tarefas_pendentes || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
