import { UserCheck, Wallet } from 'lucide-react'
import type { Lead } from '../../types'
import { leadsByCargo, leadsByFaturamento } from '../../lib/aggregations'
import { Panel, PanelTitle } from '../ui/Panel'
import { fmtNumber } from '../../lib/utils'

function MiniBars({ data }: { data: { label: string; total: number }[] }) {
  const max = Math.max(...data.map((d) => d.total), 1)
  return (
    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
      {data.length === 0 && (
        <div className="text-sm text-[var(--color-muted)]">Sem dados.</div>
      )}
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-white/80 truncate pr-2">{d.label}</span>
            <span className="text-[var(--color-muted)] tabular-nums">
              {fmtNumber(d.total)}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"
              style={{ width: `${(d.total / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CargoChart({ rows }: { rows: Lead[] }) {
  const data = leadsByCargo(rows).map((d) => ({ label: d.cargo, total: d.total }))
  return (
    <Panel>
      <PanelTitle icon={<UserCheck size={16} className="text-sky-400" />}>
        Top 10 Cargos
      </PanelTitle>
      <MiniBars data={data} />
    </Panel>
  )
}

export function FaturamentoChart({ rows }: { rows: Lead[] }) {
  const data = leadsByFaturamento(rows).map((d) => ({
    label: d.faturamento,
    total: d.total,
  }))
  return (
    <Panel>
      <PanelTitle icon={<Wallet size={16} className="text-amber-400" />}>
        Distribuição por Faturamento
      </PanelTitle>
      <MiniBars data={data} />
    </Panel>
  )
}
