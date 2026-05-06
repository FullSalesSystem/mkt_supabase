import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Loader2,
  RefreshCw,
  Table2,
} from 'lucide-react'
import { useLeads } from '../hooks/useLeads'
import { useVendas } from '../hooks/useVendas'
import { useFiltered } from '../hooks/useFiltered'
import { initialFilters, type Filters } from '../types'
import { distinctFunis, distinctValues } from '../lib/aggregations'
import { fmtNumber } from '../lib/utils'
import { FiltersPanel } from './Filters'
import { KpiCards } from './KpiCards'
import { StatusByFunilChart } from './charts/StatusByFunilChart'
import { StatusDonut } from './charts/StatusDonut'
import { FunilRanking } from './charts/FunilRanking'
import { LeadsByFunilGrid } from './charts/LeadsByFunilGrid'
import { SegmentoChart } from './charts/SegmentoChart'
import { CargoChart, FaturamentoChart } from './charts/CargoFaturamento'
import { DataTable } from './table/DataTable'
import { Sidebar, type Section } from './Sidebar'
import { SubTabs, type SubTab } from './SubTabs'
import { VendasCharts } from './vendas/VendasDashboard'
import { VendasDataTable } from './vendas/table/VendasDataTable'

const SECTION_INFO: Record<Section, { title: string; subtitle: string }> = {
  leads: {
    title: 'Leads',
    subtitle: 'Dashboard Full Sales System — análise dos leads',
  },
  vendas: {
    title: 'Vendas',
    subtitle: 'Dashboard Full Sales System — vendas Ticto',
  },
}

const SUB_TAB_ITEMS = [
  { id: 'tabela' as SubTab, label: 'Tabela', icon: <Table2 size={14} /> },
  { id: 'graficos' as SubTab, label: 'Gráficos', icon: <BarChart3 size={14} /> },
]

export function Dashboard() {
  const [section, setSection] = useState<Section>('leads')
  const [subTab, setSubTab] = useState<SubTab>('tabela')
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [filters, setFilters] = useState<Filters>(initialFilters)

  const leadsQuery = useLeads()
  const vendasQuery = useVendas()
  const active = section === 'vendas' ? vendasQuery : leadsQuery

  const filtered = useFiltered(leadsQuery.data, filters)

  const funilOptions = useMemo(
    () => distinctFunis(leadsQuery.data ?? []),
    [leadsQuery.data],
  )
  const statusOptions = useMemo(
    () => distinctValues(leadsQuery.data ?? [], 'status_entrada'),
    [leadsQuery.data],
  )
  const segmentoOptions = useMemo(
    () => distinctValues(leadsQuery.data ?? [], 'segmento'),
    [leadsQuery.data],
  )

  const info = SECTION_INFO[section]
  const counterLabel =
    section === 'vendas'
      ? `${fmtNumber(vendasQuery.data?.length ?? 0)} vendas carregadas`
      : `${fmtNumber(leadsQuery.data?.length ?? 0)} leads carregados`

  return (
    <div className="flex min-h-screen">
      <Sidebar
        section={section}
        onSection={setSection}
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((s) => !s)}
      />

      <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-white tracking-tight">
              {info.title}
            </h1>
            <p className="text-xs text-[var(--color-muted)]">{info.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1.5 text-xs text-[var(--color-muted)]">
              <CalendarDays size={14} />
              {active.data ? counterLabel : 'Carregando...'}
            </div>
            <button
              onClick={() => active.refetch()}
              disabled={active.isFetching}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1.5 text-xs text-white/80 hover:border-white/20 disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={active.isFetching ? 'animate-spin' : ''}
              />
              Atualizar
            </button>
          </div>
        </header>

        <div className="mb-4">
          <SubTabs value={subTab} onChange={setSubTab} items={SUB_TAB_ITEMS} />
        </div>

        {active.isError && (
          <div className="mb-6 flex items-start gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <div>
              <div className="font-medium">Erro ao carregar dados</div>
              <div className="text-xs opacity-80 mt-1">
                {(active.error as Error)?.message ??
                  'Verifique credenciais e RLS no Supabase.'}
              </div>
            </div>
          </div>
        )}

        {active.isLoading ? (
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <Loader2 size={16} className="animate-spin" /> Carregando dados do
            Supabase...
          </div>
        ) : section === 'leads' && subTab === 'tabela' ? (
          <DataTable rows={leadsQuery.data ?? []} />
        ) : section === 'leads' && subTab === 'graficos' ? (
          <div className="space-y-4">
            <KpiCards rows={filtered} />
            <FiltersPanel
              filters={filters}
              onChange={setFilters}
              funilOptions={funilOptions}
              statusOptions={statusOptions}
              segmentoOptions={segmentoOptions}
            />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <StatusByFunilChart rows={filtered} />
              <StatusDonut rows={filtered} />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <LeadsByFunilGrid rows={filtered} />
              </div>
              <FunilRanking rows={filtered} />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <SegmentoChart rows={filtered} />
              <CargoChart rows={filtered} />
              <FaturamentoChart rows={filtered} />
            </div>
          </div>
        ) : section === 'vendas' && subTab === 'tabela' ? (
          <VendasDataTable rows={vendasQuery.data ?? []} />
        ) : (
          <VendasCharts rows={vendasQuery.data ?? []} />
        )}
      </main>
    </div>
  )
}
