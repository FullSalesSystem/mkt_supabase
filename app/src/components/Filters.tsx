import { Filter, RotateCcw } from 'lucide-react'
import { cn } from '../lib/utils'
import type {
  Filters,
  PeriodPreset,
  Qualificacao,
} from '../types'
import { initialFilters } from '../types'
import { Panel, PanelTitle } from './ui/Panel'
import { MultiSelect } from './ui/MultiSelect'
import {
  CARGO_LABEL,
  CARGO_CATEGORIAS,
  type CargoCategoria,
} from '../lib/cargo'
import {
  FATURAMENTO_FAIXAS,
  FATURAMENTO_LABEL,
  type FaturamentoFaixa,
} from '../lib/faturamento'
import { CATEGORIA_LABEL, type Categoria } from '../lib/categorias'
import { QUALIFICACAO_LABEL } from '../lib/aggregations'

const PRESETS: { id: PeriodPreset; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'hoje', label: 'Hoje' },
  { id: 'ontem', label: 'Ontem' },
  { id: '7d', label: 'Últimos 7 dias' },
  { id: '15d', label: 'Últimos 15 dias' },
  { id: '30d', label: 'Últimos 30 dias' },
  { id: '90d', label: 'Últimos 90 dias' },
]

const CATEGORIA_OPTIONS: Categoria[] = ['aplicacao', 'aquisicao', 'outro']
const QUALIFICACAO_OPTIONS: Qualificacao[] = [
  'quali',
  'semi',
  'desquali',
  'outro',
]

type Props = {
  filters: Filters
  onChange: (next: Filters) => void
  funilOptions: string[]
  statusOptions: string[]
  segmentoOptions: string[]
}

export function FiltersPanel({
  filters,
  onChange,
  funilOptions,
  statusOptions,
  segmentoOptions,
}: Props) {
  const setPreset = (preset: PeriodPreset) =>
    onChange({ ...filters, preset, startDate: null, endDate: null })

  const setStart = (v: string) =>
    onChange({ ...filters, preset: 'custom', startDate: v || null })

  const setEnd = (v: string) =>
    onChange({ ...filters, preset: 'custom', endDate: v || null })

  const activeCount =
    filters.funis.length +
    filters.statuses.length +
    filters.segmentos.length +
    filters.categorias.length +
    filters.qualificacoes.length +
    filters.cargos.length +
    filters.faturamentos.length

  return (
    <Panel>
      <div className="mb-4 flex items-center justify-between">
        <PanelTitle icon={<Filter size={16} className="text-[var(--color-muted)]" />}>
          Filtros
        </PanelTitle>
        {activeCount > 0 && (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
            {activeCount} ativo{activeCount === 1 ? '' : 's'}
          </span>
        )}
      </div>

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
          label="Categoria"
          options={CATEGORIA_OPTIONS}
          value={filters.categorias}
          onChange={(v) =>
            onChange({ ...filters, categorias: v as Categoria[] })
          }
          renderLabel={(v) => CATEGORIA_LABEL[v as Categoria]}
          placeholder="Aplicação / Aquisição..."
        />

        <MultiSelect
          label="Qualificação"
          options={QUALIFICACAO_OPTIONS}
          value={filters.qualificacoes}
          onChange={(v) =>
            onChange({ ...filters, qualificacoes: v as Qualificacao[] })
          }
          renderLabel={(v) => QUALIFICACAO_LABEL[v as Qualificacao]}
          placeholder="Qualificado / Semi..."
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <MultiSelect
          label="Cargo"
          options={CARGO_CATEGORIAS}
          value={filters.cargos}
          onChange={(v) => onChange({ ...filters, cargos: v as CargoCategoria[] })}
          renderLabel={(v) => CARGO_LABEL[v as CargoCategoria]}
          placeholder="Sócio / Gerente / ..."
        />

        <MultiSelect
          label="Faturamento"
          options={FATURAMENTO_FAIXAS}
          value={filters.faturamentos}
          onChange={(v) =>
            onChange({ ...filters, faturamentos: v as FaturamentoFaixa[] })
          }
          renderLabel={(v) => FATURAMENTO_LABEL[v as FaturamentoFaixa]}
          placeholder="Faixas de faturamento..."
        />

        <MultiSelect
          label="Funil"
          options={funilOptions}
          value={filters.funis}
          onChange={(funis) => onChange({ ...filters, funis })}
          placeholder="Selecionar funil..."
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <MultiSelect
          label="Status"
          options={statusOptions}
          value={filters.statuses}
          onChange={(statuses) => onChange({ ...filters, statuses })}
          placeholder="Selecionar status..."
        />

        <MultiSelect
          label="Segmento"
          options={segmentoOptions}
          value={filters.segmentos}
          onChange={(segmentos) => onChange({ ...filters, segmentos })}
          placeholder="Selecionar segmento..."
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onChange(initialFilters)}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3 py-1.5 text-xs text-white/80 hover:border-white/20"
        >
          <RotateCcw size={12} />
          Limpar Todos os Filtros
        </button>
      </div>
    </Panel>
  )
}
