import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

export type SubTab = 'tabela' | 'graficos'

type Item = { id: SubTab; label: string; icon?: ReactNode }

type Props = {
  value: SubTab
  onChange: (v: SubTab) => void
  items: Item[]
}

export function SubTabs({ value, onChange, items }: Props) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-1">
      {items.map((item) => {
        const active = value === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors',
              active
                ? 'bg-[var(--color-panel-2)] text-white ring-1 ring-inset ring-white/10'
                : 'text-[var(--color-muted)] hover:text-white',
            )}
          >
            {item.icon && (
              <span
                className={cn(
                  active ? 'text-emerald-400' : 'text-[var(--color-muted)]',
                )}
              >
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
