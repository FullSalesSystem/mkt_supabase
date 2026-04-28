import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import type { Venda } from '../../../types'
import { dailyVendasSeries } from '../../../lib/vendas-aggregations'
import { Panel, PanelTitle } from '../../ui/Panel'
import { fmtMoneyCompact } from '../../../lib/utils'

export function ReceitaTimeline({ rows }: { rows: Venda[] }) {
  const data = dailyVendasSeries(rows)
  return (
    <Panel>
      <PanelTitle icon={<TrendingUp size={16} className="text-emerald-400" />}>
        Receita por Dia
      </PanelTitle>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
            <defs>
              <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#26262c" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#8a8a93"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#26262c' }}
              minTickGap={24}
            />
            <YAxis
              stroke="#8a8a93"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#26262c' }}
              tickFormatter={(v) => fmtMoneyCompact(Number(v))}
            />
            <Tooltip
              contentStyle={{
                background: '#16161a',
                border: '1px solid #26262c',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v, name) =>
                name === 'receita' ? fmtMoneyCompact(Number(v)) : Number(v)
              }
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="receita"
              name="Receita"
              stroke="#22c55e"
              fill="url(#receitaGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
