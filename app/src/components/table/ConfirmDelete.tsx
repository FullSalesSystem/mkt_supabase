import { AlertTriangle, Loader2, X } from 'lucide-react'
import { useEffect } from 'react'
import { fmtNumber } from '../../lib/utils'

type Props = {
  count: number
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
  error: string | null
}

export function ConfirmDelete({ count, open, onClose, onConfirm, loading, error }: Props) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, loading, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !loading && onClose()}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-rose-500/30 bg-[var(--color-panel)] p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-3 top-3 text-[var(--color-muted)] hover:text-white disabled:opacity-30"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-rose-500/15 p-2 text-rose-400">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-white">
              Excluir {fmtNumber(count)} {count === 1 ? 'lead' : 'leads'}?
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Esta ação é <span className="text-rose-300">irreversível</span> —
              os registros serão removidos do banco de dados permanentemente.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
            <div className="font-medium mb-0.5">Erro ao excluir:</div>
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] px-4 py-2 text-sm text-white/80 hover:border-white/20 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-rose-500/90 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-50"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Excluir definitivamente
          </button>
        </div>
      </div>
    </div>
  )
}
