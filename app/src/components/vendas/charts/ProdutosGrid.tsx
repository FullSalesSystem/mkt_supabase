import { Package } from 'lucide-react'
import type { Venda } from '../../../types'
import { vendasByProduto } from '../../../lib/vendas-aggregations'
import { Panel, PanelTitle } from '../../ui/Panel'
import { fmtMoney, fmtNumber } from '../../../lib/utils'

export function ProdutosGrid({ rows }: { rows: Venda[] }) {
  const data = vendasByProduto(rows)
  return (
    <Panel>
      <PanelTitle icon={<Package size={16} className="text-emerald-400" />}>
        Vendas por Produto
      </PanelTitle>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {data.length === 0 && (
          <div className="col-span-full text-sm text-[var(--color-muted)]">
            Sem dados para os filtros atuais.
          </div>
        )}
        {data.map((d) => (
          <div
            key={d.produto}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-2)] p-4 text-center transition-colors hover:border-white/15"
          >
            <div className="text-xs text-[var(--color-muted)] truncate" title={d.produto}>
              {d.produto}
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight text-white">
              {fmtNumber(d.aprovadas)}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
              vendas aprovadas
            </div>
            <div className="mt-2 text-xs text-emerald-300 tabular-nums">
              {fmtMoney(d.receita)}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
