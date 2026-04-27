import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Percent } from 'lucide-react'
import type { Lead } from '../../types'
import { dailySeries } from '../../lib/aggregations'
import { Panel, PanelTitle } from '../ui/Panel'

export function DailyRateChart({ rows }: { rows: Lead[] }) {
  const data = dailySeries(rows).map((p) => ({
    date: p.date,
    taxa: +(p.taxa * 100).toFixed(1),
    total: p.total,
  }))
  return (
    <Panel>
      <PanelTitle icon={<Percent size={16} className="text-emerald-400" />}>
        Taxa de Cadastro por Dia
      </PanelTitle>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
            <defs>
              <linearGradient id="taxaFill" x1="0" y1="0" x2="0" y2="1">
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
              minTickGap={32}
            />
            <YAxis
              stroke="#8a8a93"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#26262c' }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
            />
            <Tooltip
              formatter={(v) => `${v}%`}
              contentStyle={{
                background: '#16161a',
                border: '1px solid #26262c',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="taxa"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#taxaFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
