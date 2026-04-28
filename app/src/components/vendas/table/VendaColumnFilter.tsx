import { useEffect, useRef, useState } from 'react'
import { Check, Filter, X } from 'lucide-react'
import type { VendaColumnDef, VendaColumnFilterValue } from './types'
import { cn } from '../../../lib/utils'

type Props = {
  col: VendaColumnDef
  options: string[]
  value: VendaColumnFilterValue | undefined
  onChange: (v: VendaColumnFilterValue | undefined) => void
}

const empty = (col: VendaColumnDef): VendaColumnFilterValue => {
  switch (col.filterKind) {
    case 'text':
      return { kind: 'text', query: '' }
    case 'multi':
      return { kind: 'multi', values: [] }
    case 'dateRange':
      return { kind: 'dateRange', from: '', to: '' }
    case 'numberRange':
      return { kind: 'numberRange', min: '', max: '' }
  }
}

const isActive = (v: VendaColumnFilterValue | undefined) => {
  if (!v) return false
  if (v.kind === 'text') return !!v.query
  if (v.kind === 'multi') return v.values.length > 0
  if (v.kind === 'dateRange') return !!(v.from || v.to)
  if (v.kind === 'numberRange') return !!(v.min || v.max)
  return false
}

export function VendaColumnFilter({ col, options, value, onChange }: Props) {
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

  const v = value ?? empty(col)
  const active = isActive(value)

  const clear = () => onChange(undefined)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((s) => !s)
        }}
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded transition-colors',
          active
            ? 'bg-emerald-500/20 text-emerald-300'
            : 'text-[var(--color-muted)] hover:bg-white/10 hover:text-white',
        )}
        title="Filtrar coluna"
      >
        <Filter size={12} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-7 z-30 w-64 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] p-2 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-white/80">
              Filtrar: {col.label}
            </span>
            {active && (
              <button
                onClick={clear}
                className="flex items-center gap-1 text-[10px] text-rose-300 hover:text-rose-200"
              >
                <X size={10} /> Limpar
              </button>
            )}
          </div>

          {v.kind === 'text' && (
            <input
              autoFocus
              type="text"
              value={v.query}
              onChange={(e) => onChange({ kind: 'text', query: e.target.value })}
              placeholder="Contém..."
              className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-xs outline-none focus:border-white/20"
            />
          )}

          {v.kind === 'multi' && (
            <div>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-xs outline-none focus:border-white/20"
              />
              <div className="mt-2 max-h-56 overflow-y-auto">
                {options
                  .filter((o) => o.toLowerCase().includes(query.toLowerCase()))
                  .map((opt) => {
                    const checked = v.values.includes(opt)
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          const next = checked
                            ? v.values.filter((x) => x !== opt)
                            : [...v.values, opt]
                          onChange({ kind: 'multi', values: next })
                        }}
                        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs hover:bg-white/5"
                      >
                        <span className="truncate">{opt}</span>
                        {checked && (
                          <Check size={12} className="text-emerald-400" />
                        )}
                      </button>
                    )
                  })}
                {options.length === 0 && (
                  <div className="p-2 text-xs text-[var(--color-muted)]">
                    Sem opções.
                  </div>
                )}
              </div>
            </div>
          )}

          {v.kind === 'dateRange' && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-[var(--color-muted)]">De</label>
              <input
                type="date"
                value={v.from}
                onChange={(e) => onChange({ ...v, from: e.target.value })}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-xs outline-none focus:border-white/20"
              />
              <label className="text-[10px] text-[var(--color-muted)]">Até</label>
              <input
                type="date"
                value={v.to}
                onChange={(e) => onChange({ ...v, to: e.target.value })}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-xs outline-none focus:border-white/20"
              />
            </div>
          )}

          {v.kind === 'numberRange' && (
            <div className="flex gap-2">
              <input
                type="number"
                value={v.min}
                onChange={(e) => onChange({ ...v, min: e.target.value })}
                placeholder="Min"
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-xs outline-none focus:border-white/20"
              />
              <input
                type="number"
                value={v.max}
                onChange={(e) => onChange({ ...v, max: e.target.value })}
                placeholder="Max"
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-xs outline-none focus:border-white/20"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
