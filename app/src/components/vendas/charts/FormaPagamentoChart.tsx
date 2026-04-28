import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CreditCard } from 'lucide-react'
import type { Venda } from '../../../types'
import { vendasByPagamento } from '../../../lib/vendas-aggregations'
import { Panel, PanelTitle } from '../../ui/Panel'

export function FormaPagamentoChart({ rows }: { rows: Venda[] }) {
  const data = vendasByPagamento(rows)
  return (
    <Panel>
      <PanelTitle icon={<CreditCard size={16} className="text-sky-400" />}>
        Forma de Pagamento
      </PanelTitle>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 16, bottom: 4, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#26262c"
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke="#8a8a93"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#26262c' }}
            />
            <YAxis
              type="category"
              dataKey="forma"
              stroke="#8a8a93"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#26262c' }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                background: '#16161a',
                border: '1px solid #26262c',
                borderRadius: 8,
                fontSize: 12,
              }}
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            />
            <Bar dataKey="total" fill="#3b82f6" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
