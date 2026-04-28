import { Tag } from 'lucide-react'
import type { Venda } from '../../../types'
import { vendasByOferta } from '../../../lib/vendas-aggregations'
import { Panel, PanelTitle } from '../../ui/Panel'
import { fmtMoney, fmtNumber } from '../../../lib/utils'

export function OfertasChart({ rows }: { rows: Venda[] }) {
  const data = vendasByOferta(rows)
  const max = Math.max(...data.map((d) => d.receita), 1)
  return (
    <Panel>
      <PanelTitle icon={<Tag size={16} className="text-amber-400" />}>
        Top 10 Ofertas
      </PanelTitle>
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {data.length === 0 && (
          <div className="text-sm text-[var(--color-muted)]">Sem dados.</div>
        )}
        {data.map((d) => (
          <div key={d.oferta}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-white/80 truncate pr-2">{d.oferta}</span>
              <span className="text-[var(--color-muted)] tabular-nums">
                {fmtNumber(d.total)} · {fmtMoney(d.receita)}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
                style={{ width: `${(d.receita / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
