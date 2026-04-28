import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CalendarDays,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { useLeads } from '../hooks/useLeads'
import { useVendas } from '../hooks/useVendas'
import { useFiltered } from '../hooks/useFiltered'
import { initialFilters, type Filters } from '../types'
import { distinctValues } from '../lib/aggregations'
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
import { Sidebar, type Tab } from './Sidebar'
import { VendasCharts } from './vendas/VendasDashboard'
import { VendasDataTable } from './vendas/table/VendasDataTable'

const TAB_TITLES: Record<Tab, { title: string; subtitle: string }> = {
  'leads-tabela': {
    title: 'Tabela de Leads',
    subtitle: 'Dashboard Full Sales System — análise dos leads',
  },
  'leads-graficos': {
    title: 'Visão Geral — Leads',
    subtitle: 'Dashboard Full Sales System — análise dos leads',
  },
  'vendas-tabela': {
    title: 'Tabela de Vendas',
    subtitle: 'Dashboard Full Sales System — vendas Ticto',
  },
  'vendas-graficos': {
    title: 'Visão Geral — Vendas',
    subtitle: 'Dashboard Full Sales System — vendas Ticto',
  },
}

export function Dashboard() {
  const [tab, setTab] = useState<Tab>('leads-tabela')
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [filters, setFilters] = useState<Filters>(initialFilters)

  const isVendas = tab === 'vendas-tabela' || tab === 'vendas-graficos'

  const leadsQuery = useLeads()
  const vendasQuery = useVendas()
  const active = isVendas ? vendasQuery : leadsQuery

  const filtered = useFiltered(leadsQuery.data, filters)

  const funilOptions = useMemo(
    () => distinctValues(leadsQuery.data ?? [], 'origem_primeira'),
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

  const titles = TAB_TITLES[tab]
  const counterLabel = isVendas
    ? `${fmtNumber(vendasQuery.data?.length ?? 0)} vendas carregadas`
    : `${fmtNumber(leadsQuery.data?.length ?? 0)} leads carregados`

  return (
    <div className="flex min-h-screen">
      <Sidebar
        tab={tab}
        onTab={setTab}
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((s) => !s)}
      />

      <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-white tracking-tight">
              {titles.title}
            </h1>
            <p className="text-xs text-[var(--color-muted)]">{titles.subtitle}</p>
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
        ) : tab === 'leads-tabela' ? (
          <DataTable rows={leadsQuery.data ?? []} />
        ) : tab === 'leads-graficos' ? (
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
        ) : tab === 'vendas-tabela' ? (
          <VendasDataTable rows={vendasQuery.data ?? []} />
        ) : (
          <VendasCharts rows={vendasQuery.data ?? []} />
        )}
      </main>
    </div>
  )
}
