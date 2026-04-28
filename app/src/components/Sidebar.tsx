import type { ReactNode } from 'react'
import { BarChart3, Menu, Table2 } from 'lucide-react'
import { cn } from '../lib/utils'

export type Tab = 'tabela' | 'graficos'

type Props = {
  tab: Tab
  onTab: (t: Tab) => void
  expanded: boolean
  onToggle: () => void
}

const NAV: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: 'tabela', label: 'Tabela', icon: <Table2 size={18} /> },
  { id: 'graficos', label: 'Gráficos', icon: <BarChart3 size={18} /> },
]

export function Sidebar({ tab, onTab, expanded, onToggle }: Props) {
  return (
    <aside
      className={cn(
        'sticky top-0 z-20 flex h-screen flex-col border-r border-[var(--color-border)] bg-[var(--color-panel)] transition-[width] duration-200 ease-out',
        expanded ? 'w-56' : 'w-16',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        title={expanded ? 'Recolher menu' : 'Expandir menu'}
        className="flex h-14 items-center gap-3 border-b border-[var(--color-border)] px-4 text-white/80 hover:bg-white/5"
      >
        <Menu size={20} />
        {expanded && (
          <span className="text-sm font-medium tracking-tight">Menu</span>
        )}
      </button>

      <nav className="flex-1 p-2">
        {NAV.map((item) => {
          const active = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTab(item.id)}
              title={!expanded ? item.label : undefined}
              className={cn(
                'mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-[var(--color-panel-2)] text-white shadow-inner ring-1 ring-inset ring-white/10'
                  : 'text-[var(--color-muted)] hover:bg-white/5 hover:text-white',
                !expanded && 'justify-center px-0',
              )}
            >
              <span
                className={cn(
                  active ? 'text-emerald-400' : 'text-[var(--color-muted)]',
                )}
              >
                {item.icon}
              </span>
              {expanded && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-[var(--color-border)] p-3">
        <div
          className={cn(
            'flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--color-muted)]',
            !expanded && 'justify-center',
          )}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-sky-500 text-[10px] font-bold text-white">
            FS
          </div>
          {expanded && <span>Full Sales</span>}
        </div>
      </div>
    </aside>
  )
}
