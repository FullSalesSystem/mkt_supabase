import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CalendarDays,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { useLeads } from '../hooks/useLeads'
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
import { useAuth } from '../hooks/useAuth'

export function Dashboard() {
  const { data, isLoading, isFetching, isError, error, refetch } = useLeads()
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState<Tab>('tabela')
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const filtered = useFiltered(data, filters)

  const funilOptions = useMemo(
    () => distinctValues(data ?? [], 'origem_primeira'),
    [data],
  )
  const statusOptions = useMemo(
    () => distinctValues(data ?? [], 'status_entrada'),
    [data],
  )
  const segmentoOptions = useMemo(
    () => distinctValues(data ?? [], 'segmento'),
    [data],
  )

  const tabTitle = tab === 'tabela' ? 'Tabela de Leads' : 'Visão Geral'

  return (
    <div className="flex min-h-screen">
      <Sidebar
        tab={tab}
        onTab={setTab}
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((s) => !s)}
        userEmail={user?.email ?? null}
        onSignOut={() => signOut()}
      />

      <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-white tracking-tight">
              {tabTitle}
            </h1>
            <p className="text-xs text-[var(--color-muted)]">
              Dashboard Full Sales System — análise dos leads
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1.5 text-xs text-[var(--color-muted)]">
              <CalendarDays size={14} />
              {data
                ? `${fmtNumber(data.length)} leads carregados`
                : 'Carregando...'}
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1.5 text-xs text-white/80 hover:border-white/20 disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={isFetching ? 'animate-spin' : ''}
              />
              Atualizar
            </button>
          </div>
        </header>

        {isError && (
          <div className="mb-6 flex items-start gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <div>
              <div className="font-medium">Erro ao carregar dados</div>
              <div className="text-xs opacity-80 mt-1">
                {(error as Error)?.message ??
                  'Verifique credenciais e RLS no Supabase.'}
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <Loader2 size={16} className="animate-spin" /> Carregando dados do
            Supabase...
          </div>
        ) : tab === 'tabela' ? (
          <DataTable rows={data ?? []} />
        ) : (
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
        )}
      </main>
    </div>
  )
}
