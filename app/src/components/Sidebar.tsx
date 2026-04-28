import type { ReactNode } from 'react'
import { BarChart3, LogOut, Menu, Table2 } from 'lucide-react'
import { cn } from '../lib/utils'

export type Tab = 'tabela' | 'graficos'

type Props = {
  tab: Tab
  onTab: (t: Tab) => void
  expanded: boolean
  onToggle: () => void
  userEmail: string | null
  onSignOut: () => void
}

const NAV: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: 'tabela', label: 'Tabela', icon: <Table2 size={18} /> },
  { id: 'graficos', label: 'Gráficos', icon: <BarChart3 size={18} /> },
]

export function Sidebar({
  tab,
  onTab,
  expanded,
  onToggle,
  userEmail,
  onSignOut,
}: Props) {
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

      <div className="border-t border-[var(--color-border)] p-2">
        {expanded && userEmail && (
          <div
            className="mb-2 px-2 py-1 text-[11px] text-[var(--color-muted)] truncate"
            title={userEmail}
          >
            {userEmail.split('@')[0]}
          </div>
        )}
        <button
          type="button"
          onClick={onSignOut}
          title={!expanded ? 'Sair' : undefined}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] hover:bg-white/5 hover:text-white transition-colors',
            !expanded && 'justify-center px-0',
          )}
        >
          <LogOut size={16} />
          {expanded && <span>Sair</span>}
        </button>
      </div>
    </aside>
  )
}
