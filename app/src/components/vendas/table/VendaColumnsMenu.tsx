import { useEffect, useRef, useState } from 'react'
import { Check, Columns3 } from 'lucide-react'
import { VENDA_COLUMNS, type VendaColumnKey } from './types'

type Props = {
  visible: VendaColumnKey[]
  onChange: (next: VendaColumnKey[]) => void
}

export function VendaColumnsMenu({ visible, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const set = new Set(visible)
  const toggle = (key: VendaColumnKey) => {
    if (set.has(key)) onChange(visible.filter((k) => k !== key))
    else onChange([...visible, key])
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3 py-1.5 text-xs hover:border-white/20"
      >
        <Columns3 size={14} />
        Colunas
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-30 w-56 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] p-2 shadow-xl">
          {VENDA_COLUMNS.map((col) => {
            const on = set.has(col.key)
            return (
              <button
                key={col.key}
                type="button"
                onClick={() => toggle(col.key)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs hover:bg-white/5"
              >
                <span>{col.label}</span>
                {on && <Check size={12} className="text-emerald-400" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
