'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'

export default function SyncButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSync() {
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/sync', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setMessage('Erro ao sincronizar. Veja o console.')
        console.error(data)
        return
      }

      const sucessos = data.resultados.filter((r: any) => r.ok).length
      const falhas = data.resultados.filter((r: any) => !r.ok)

      setMessage(`${sucessos} projeto(s) sincronizado(s)`)
      router.refresh()

      if (falhas.length > 0) {
        console.warn('Falhas na sincronização:', falhas)
      }
    } catch (error) {
      setMessage('Erro ao sincronizar.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {message && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {message}
        </div>
      )}
      <button
        onClick={handleSync}
        disabled={loading}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Sincronizando...' : 'Sincronizar STATUS'}
      </button>
    </div>
  )
}
