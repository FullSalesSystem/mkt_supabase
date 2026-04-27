import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '../../lib/utils'

type Props = {
  label: string
  options: string[]
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Selecionar...',
}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase()),
  )

  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt))
    else onChange([...value, opt])
  }

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-xs text-[var(--color-muted)]">
        {label} {value.length > 0 && `(${value.length} selecionados)`}
      </label>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={cn(
          'flex items-center justify-between gap-2 rounded-lg border border-[var(--color-border)]',
          'bg-[var(--color-panel-2)] px-3 py-2 text-left text-sm hover:border-white/20 transition-colors',
        )}
      >
        <span className={cn('truncate', !value.length && 'text-[var(--color-muted)]')}>
          {value.length ? value.join(', ') : placeholder}
        </span>
        <div className="flex items-center gap-1.5">
          {value.length > 0 && (
            <X
              size={14}
              className="text-[var(--color-muted)] hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                onChange([])
              }}
            />
          )}
          <ChevronDown size={14} className="text-[var(--color-muted)]" />
        </div>
      </button>
      {open && (
        <div className="relative">
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] p-2 shadow-xl">
            <input
              autoFocus
              type="text"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-xs outline-none focus:border-white/20"
            />
            <div className="mt-2 max-h-56 overflow-y-auto">
              {filtered.length === 0 && (
                <div className="p-2 text-xs text-[var(--color-muted)]">
                  Nada encontrado.
                </div>
              )}
              {filtered.map((opt) => {
                const checked = value.includes(opt)
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggle(opt)}
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs hover:bg-white/5"
                  >
                    <span className="truncate">{opt}</span>
                    {checked && <Check size={14} className="text-emerald-400" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
