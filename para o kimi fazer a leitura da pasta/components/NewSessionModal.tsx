'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Projeto, createSessao } from '@/lib/supabase'
import { Plus, X, Loader2 } from 'lucide-react'

interface Props {
  projetos: Projeto[]
}

export default function NewSessionModal({ projetos }: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    projeto_id: '',
    titulo: '',
    resumo: '',
    proximo_passo: '',
    duracao_minutos: 60,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.projeto_id || !formData.titulo) return

    setLoading(true)
    try {
      await createSessao({
        projeto_id: formData.projeto_id,
        titulo: formData.titulo,
        resumo: formData.resumo || null,
        proximo_passo: formData.proximo_passo || null,
        duracao_minutos: formData.duracao_minutos,
        data: new Date().toISOString().split('T')[0],
        arquivos_modificados: null,
        commits: null,
      })

      setIsOpen(false)
      setFormData({
        projeto_id: '',
        titulo: '',
        resumo: '',
        proximo_passo: '',
        duracao_minutos: 60,
      })
      router.refresh()
    } catch (error) {
      console.error('Erro ao criar sessão:', error)
      alert('Erro ao salvar sessão. Verifique o console.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        Nova Sessão
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white">Registrar Sessão</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Projeto */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Projeto *</label>
                <select
                  value={formData.projeto_id}
                  onChange={(e) => setFormData({ ...formData, projeto_id: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">Selecione o projeto</option>
                  {projetos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.icone} {p.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">O que você fez? *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Implementação de RBAC com 3 níveis"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Resumo */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Detalhes (opcional)</label>
                <textarea
                  value={formData.resumo}
                  onChange={(e) => setFormData({ ...formData, resumo: e.target.value })}
                  placeholder="Ex: Configurado middleware, criados 3 roles no Prisma, protegidas rotas admin"
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Próximo passo */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Onde parou? / Próximo passo</label>
                <input
                  type="text"
                  value={formData.proximo_passo}
                  onChange={(e) => setFormData({ ...formData, proximo_passo: e.target.value })}
                  placeholder="Ex: Finalizar tela de admin de subcontas"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Duração */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Duração (minutos)</label>
                <input
                  type="number"
                  value={formData.duracao_minutos}
                  onChange={(e) => setFormData({ ...formData, duracao_minutos: parseInt(e.target.value) || 0 })}
                  min={1}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Sessão'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
