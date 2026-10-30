import { Projeto } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Props {
  projetos: Projeto[]
}

export default function SessionTimeline({ projetos }: Props) {
  // Pegar projetos com sessões recentes, ordenados por última sessão
  const comSessoes = projetos
    .filter(p => p.ultima_sessao)
    .sort((a, b) => new Date(b.ultima_sessao!).getTime() - new Date(a.ultima_sessao!).getTime())
    .slice(0, 6)

  if (comSessoes.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
        <p className="text-zinc-500">Nenhuma sessão registrada ainda.</p>
        <p className="text-sm text-zinc-600 mt-1">Clique em "+ Nova Sessão" para começar.</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="space-y-4">
        {comSessoes.map((projeto, index) => (
          <div key={projeto.id} className="flex gap-4 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            {/* Timeline dot */}
            <div className="flex flex-col items-center">
              <div 
                className="w-3 h-3 rounded-full mt-1.5"
                style={{ backgroundColor: projeto.cor }}
              />
              {index < comSessoes.length - 1 && (
                <div className="w-0.5 flex-1 bg-zinc-800 mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span>{projeto.icone}</span>
                  <span className="font-medium text-white text-sm">{projeto.nome}</span>
                </div>
                {projeto.ultima_sessao && (
                  <span className="text-xs text-zinc-500">
                    {formatDistanceToNow(new Date(projeto.ultima_sessao), { 
                      addSuffix: true,
                      locale: ptBR 
                    })}
                  </span>
                )}
              </div>
              {projeto.ultima_sessao_titulo && (
                <p className="text-sm text-zinc-400">{projeto.ultima_sessao_titulo}</p>
              )}
              {projeto.ultimo_proximo_passo && (
                <p className="text-xs text-indigo-400 mt-1">
                  Próximo: {projeto.ultimo_proximo_passo}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
