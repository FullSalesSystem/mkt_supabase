import { Zap } from 'lucide-react'
import type { Lead } from '../../types'
import { leadsByFunil } from '../../lib/aggregations'
import { Panel, PanelTitle } from '../ui/Panel'
import { fmtNumber } from '../../lib/utils'

export function LeadsByFunilGrid({ rows }: { rows: Lead[] }) {
  const data = leadsByFunil(rows)
  return (
    <Panel>
      <PanelTitle
        icon={<Zap size={16} className="text-emerald-400" />}
        tooltip="Cada lead é contado uma vez, no seu funil de origem (origem_primeira). A soma bate com o 'Total de Leads' do filtro atual."
      >
        Leads por Funil
      </PanelTitle>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {data.length === 0 && (
          <div className="col-span-full text-sm text-[var(--color-muted)]">
            Sem dados para os filtros atuais.
          </div>
        )}
        {data.map((d) => (
          <div
            key={d.funil}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-2)] p-4 text-center transition-colors hover:border-white/15"
          >
            <div className="text-xs text-[var(--color-muted)] truncate">
              {d.funil}
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight text-white">
              {fmtNumber(d.total)}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
              leads
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
