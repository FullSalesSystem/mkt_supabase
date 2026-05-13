import { Filter, RotateCcw } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { VendasFilters, PeriodPreset } from '../../types'
import { initialVendasFilters } from '../../types'
import { Panel, PanelTitle } from '../ui/Panel'
import { MultiSelect } from '../ui/MultiSelect'

const PRESETS: { id: PeriodPreset; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'hoje', label: 'Hoje' },
  { id: 'ontem', label: 'Ontem' },
  { id: '7d', label: 'Últimos 7 dias' },
  { id: '15d', label: 'Últimos 15 dias' },
  { id: '30d', label: 'Últimos 30 dias' },
  { id: '90d', label: 'Últimos 90 dias' },
]

type Props = {
  filters: VendasFilters
  onChange: (next: VendasFilters) => void
  produtoOptions: string[]
  statusOptions: string[]
  formaPagamentoOptions: string[]
}

export function VendasFiltersPanel({
  filters,
  onChange,
  produtoOptions,
  statusOptions,
  formaPagamentoOptions,
}: Props) {
  const setPreset = (preset: PeriodPreset) =>
    onChange({ ...filters, preset, startDate: null, endDate: null })

  const setStart = (v: string) =>
    onChange({ ...filters, preset: 'custom', startDate: v || null })

  const setEnd = (v: string) =>
    onChange({ ...filters, preset: 'custom', endDate: v || null })

  return (
    <Panel>
      <PanelTitle icon={<Filter size={16} className="text-[var(--color-muted)]" />}>
        Filtros
      </PanelTitle>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-[var(--color-muted)] mr-1">Períodos:</span>
        {PRESETS.map((p) => {
          const active = filters.preset === p.id
          return (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs transition-colors',
                active
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-[var(--color-border)] bg-[var(--color-panel-2)] text-white/80 hover:border-white/20',
              )}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <div className="text-xs text-[var(--color-muted)] mb-1.5">
            Período Personalizado
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="date"
              value={filters.startDate ?? ''}
              onChange={(e) => setStart(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3 py-2 text-sm outline-none focus:border-white/20"
            />
            <input
              type="date"
              value={filters.endDate ?? ''}
              onChange={(e) => setEnd(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3 py-2 text-sm outline-none focus:border-white/20"
            />
          </div>
        </div>

        <MultiSelect
          label="Produto"
          options={produtoOptions}
          value={filters.produtos}
          onChange={(produtos) => onChange({ ...filters, produtos })}
          placeholder="Selecionar produto..."
        />

        <MultiSelect
          label="Status"
          options={statusOptions}
          value={filters.statuses}
          onChange={(statuses) => onChange({ ...filters, statuses })}
          placeholder="Selecionar status..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
        <MultiSelect
          label="Forma de Pagamento"
          options={formaPagamentoOptions}
          value={filters.formasPagamento}
          onChange={(formasPagamento) =>
            onChange({ ...filters, formasPagamento })
          }
          placeholder="Selecionar forma..."
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onChange(initialVendasFilters)}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3 py-1.5 text-xs text-white/80 hover:border-white/20"
        >
          <RotateCcw size={12} />
          Limpar Todos os Filtros
        </button>
      </div>
    </Panel>
  )
}
