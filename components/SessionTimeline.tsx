'use client'

import { useState } from 'react'
import { Projeto, Sessao } from '@/lib/supabase'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Props {
  sessoes: Sessao[]
  projetos: Projeto[]
}

export default function SessionTimeline({ sessoes, projetos }: Props) {
  const projetoMap = new Map(projetos.map(p => [p.id, p]))
  const recentes = sessoes.slice(0, 6)
  const [expandidas, setExpandidas] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setExpandidas(prev => {
      const nova = new Set(prev)
      if (nova.has(id)) nova.delete(id)
      else nova.add(id)
      return nova
    })
  }

  if (recentes.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
        <p className="text-zinc-500">Nenhuma sessão registrada ainda.</p>
        <p className="text-sm text-zinc-600 mt-1">Clique em "Sincronizar" para importar dados.</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="space-y-4">
        {recentes.map((sessao, index) => {
          const projeto = projetoMap.get(sessao.projeto_id)
          const dataFormatada = format(new Date(sessao.data), "dd/MM/yyyy", { locale: ptBR })
          const expandida = expandidas.has(sessao.id)
          const resumoLongo = (sessao.resumo?.length ?? 0) > 140

          return (
            <div key={sessao.id} className="flex gap-4 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-3 h-3 rounded-full mt-1.5"
                  style={{ backgroundColor: projeto?.cor ?? '#6366f1' }}
                />
                {index < recentes.length - 1 && (
                  <div className="w-0.5 flex-1 bg-zinc-800 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{projeto?.icone}</span>
                    <span className="font-medium text-white text-sm">{projeto?.nome ?? 'Projeto'}</span>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">
                    {dataFormatada}
                  </span>
                </div>
                <p className="text-sm text-zinc-200 font-medium">{sessao.titulo}</p>
                {sessao.resumo && (
                  <div className="mt-2">
                    <p className={`text-sm text-zinc-400 leading-relaxed whitespace-pre-line ${expandida ? '' : 'line-clamp-3'}`}>
                      {sessao.resumo}
                    </p>
                    {resumoLongo && (
                      <button
                        onClick={() => toggle(sessao.id)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 transition-colors"
                      >
                        {expandida ? 'ver menos' : 'ver mais'}
                      </button>
                    )}
                  </div>
                )}
                {sessao.proximo_passo && (
                  <p className="text-sm text-indigo-400 mt-2">
                    Próximo: {sessao.proximo_passo}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
