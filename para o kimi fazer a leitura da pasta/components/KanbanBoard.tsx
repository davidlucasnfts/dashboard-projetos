'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tarefa, updateTarefaStatus, createTarefa } from '@/lib/supabase'
import { Plus, Loader2 } from 'lucide-react'

interface Props {
  tarefas: Tarefa[]
  projetoId: string
}

const columns = [
  { id: 'a_fazer', label: 'A Fazer', color: 'border-zinc-600' },
  { id: 'em_andamento', label: 'Em Andamento', color: 'border-indigo-500' },
  { id: 'concluido', label: 'Concluído', color: 'border-emerald-500' },
] as const

export default function KanbanBoard({ tarefas: initialTarefas, projetoId }: Props) {
  const router = useRouter()
  const [tarefas, setTarefas] = useState(initialTarefas)
  const [loading, setLoading] = useState<string | null>(null)
  const [newTask, setNewTask] = useState('')
  const [addingTo, setAddingTo] = useState<string | null>(null)

  async function handleStatusChange(tarefaId: string, newStatus: Tarefa['status']) {
    setLoading(tarefaId)
    try {
      await updateTarefaStatus(tarefaId, newStatus)
      setTarefas(tarefas.map(t => 
        t.id === tarefaId ? { ...t, status: newStatus } : t
      ))
      router.refresh()
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
    } finally {
      setLoading(null)
    }
  }

  async function handleAddTask(status: Tarefa['status']) {
    if (!newTask.trim()) return

    setLoading('new')
    try {
      const tarefa = await createTarefa({
        projeto_id: projetoId,
        titulo: newTask,
        descricao: null,
        status,
        prioridade: 'media',
        ordem: tarefas.length,
      })
      setTarefas([...tarefas, tarefa])
      setNewTask('')
      setAddingTo(null)
      router.refresh()
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => {
        const columnTarefas = tarefas.filter(t => t.status === column.id)

        return (
          <div key={column.id} className="bg-zinc-900/50 rounded-xl overflow-hidden">
            {/* Column header */}
            <div className={`bg-zinc-900 border-b-2 ${column.color} p-3`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">{column.label}</span>
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                  {columnTarefas.length}
                </span>
              </div>
            </div>

            {/* Tasks */}
            <div className="p-3 space-y-2 min-h-[200px]">
              {columnTarefas.map((tarefa) => (
                <div
                  key={tarefa.id}
                  className={`bg-zinc-950 border-l-2 ${column.color} rounded-lg p-3 group ${
                    loading === tarefa.id ? 'opacity-50' : ''
                  }`}
                >
                  <p className={`text-sm ${
                    column.id === 'concluido' ? 'text-zinc-500 line-through' : 'text-zinc-200'
                  }`}>
                    {tarefa.titulo}
                  </p>

                  {/* Actions */}
                  {column.id !== 'concluido' && (
                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {column.id === 'a_fazer' && (
                        <button
                          onClick={() => handleStatusChange(tarefa.id, 'em_andamento')}
                          className="text-[10px] px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
                        >
                          Iniciar →
                        </button>
                      )}
                      {column.id === 'em_andamento' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(tarefa.id, 'a_fazer')}
                            className="text-[10px] px-2 py-1 rounded bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                          >
                            ← Voltar
                          </button>
                          <button
                            onClick={() => handleStatusChange(tarefa.id, 'concluido')}
                            className="text-[10px] px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                          >
                          Concluir ✓
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Add task */}
              {addingTo === column.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Nova tarefa..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTask(column.id)
                      if (e.key === 'Escape') {
                        setAddingTo(null)
                        setNewTask('')
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddTask(column.id)}
                      disabled={loading === 'new'}
                      className="text-xs px-3 py-1.5 rounded bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
                    >
                      {loading === 'new' ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Adicionar'}
                    </button>
                    <button
                      onClick={() => {
                        setAddingTo(null)
                        setNewTask('')
                      }}
                      className="text-xs px-3 py-1.5 rounded bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingTo(column.id)}
                  className="w-full flex items-center justify-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 py-2 rounded-lg border border-dashed border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Adicionar
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
