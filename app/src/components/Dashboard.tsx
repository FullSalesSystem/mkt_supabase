import { useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Loader2,
  RefreshCw,
  Table2,
} from 'lucide-react'
import { useLeads } from '../hooks/useLeads'
import { fmtNumber } from '../lib/utils'
import { cn } from '../lib/utils'
import { KpiCards } from './KpiCards'
import { StatusByFunilChart } from './charts/StatusByFunilChart'
import { StatusDonut } from './charts/StatusDonut'
import { FunilRanking } from './charts/FunilRanking'
import { LeadsByFunilGrid } from './charts/LeadsByFunilGrid'
import { SegmentoChart } from './charts/SegmentoChart'
import { CargoChart, FaturamentoChart } from './charts/CargoFaturamento'
import { DataTable } from './table/DataTable'

type Tab = 'tabela' | 'graficos'

export function Dashboard() {
  const { data, isLoading, isFetching, isError, error, refetch } = useLeads()
  const [tab, setTab] = useState<Tab>('tabela')
  const rows = data ?? []

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 text-xs font-bold text-white">
            FS
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Dashboard Full Sales System
            </h1>
            <p className="text-xs text-[var(--color-muted)]">
              Análise dos leads — tabela e gráficos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1.5 text-xs text-[var(--color-muted)]">
            <CalendarDays size={14} />
            {data ? `${fmtNumber(data.length)} leads carregados` : 'Carregando...'}
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1.5 text-xs text-white/80 hover:border-white/20 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>
      </header>

      {/* Tab nav */}
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-1 w-fit">
        <TabButton active={tab === 'tabela'} onClick={() => setTab('tabela')}>
          <Table2 size={14} /> Tabela
        </TabButton>
        <TabButton active={tab === 'graficos'} onClick={() => setTab('graficos')}>
          <BarChart3 size={14} /> Gráficos
        </TabButton>
      </div>

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
        <DataTable rows={rows} />
      ) : (
        <div className="space-y-4">
          <KpiCards rows={rows} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <StatusByFunilChart rows={rows} />
            <StatusDonut rows={rows} />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <LeadsByFunilGrid rows={rows} />
            </div>
            <FunilRanking rows={rows} />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <SegmentoChart rows={rows} />
            <CargoChart rows={rows} />
            <FaturamentoChart rows={rows} />
          </div>
        </div>
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors',
        active
          ? 'bg-[var(--color-panel-2)] text-white shadow-inner'
          : 'text-[var(--color-muted)] hover:text-white',
      )}
    >
      {children}
    </button>
  )
}
