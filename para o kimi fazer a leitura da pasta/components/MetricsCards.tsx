import { FolderKanban, History, Clock, CheckCircle2 } from 'lucide-react'

interface Props {
  projetosAtivos: number
  totalSessoes: number
  totalMinutos: number
  tarefasConcluidas: number
  tarefasPendentes: number
}

export default function MetricsCards({ 
  projetosAtivos, 
  totalSessoes, 
  totalMinutos, 
  tarefasConcluidas,
  tarefasPendentes 
}: Props) {
  const horas = Math.floor(totalMinutos / 60)
  const mediaSessao = totalSessoes > 0 ? (totalMinutos / totalSessoes / 60).toFixed(1) : '0'

  const metrics = [
    {
      label: 'Projetos Ativos',
      value: projetosAtivos,
      sub: `${projetosAtivos} em desenvolvimento`,
      icon: FolderKanban,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      label: 'Sessões Totais',
      value: totalSessoes,
      sub: `Média ${mediaSessao}h/sessão`,
      icon: History,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Tempo Investido',
      value: `${horas}h`,
      sub: `${totalMinutos} minutos totais`,
      icon: Clock,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Tarefas',
      value: tarefasConcluidas,
      sub: `${tarefasPendentes} pendentes`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {metrics.map((metric) => (
        <div 
          key={metric.label}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-fade-in"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">{metric.label}</span>
            <div className={`w-8 h-8 rounded-lg ${metric.bg} flex items-center justify-center`}>
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
          <div className="text-xs text-zinc-500">{metric.sub}</div>
        </div>
      ))}
    </div>
  )
}
