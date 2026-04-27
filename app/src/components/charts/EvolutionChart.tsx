import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import type { Lead } from '../../types'
import { dailySeries } from '../../lib/aggregations'
import { Panel, PanelTitle } from '../ui/Panel'

export function EvolutionChart({ rows }: { rows: Lead[] }) {
  const data = dailySeries(rows)
  return (
    <Panel>
      <PanelTitle icon={<TrendingUp size={16} className="text-sky-400" />}>
        Evolução de Leads ao Longo do Tempo
      </PanelTitle>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
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
            />
            <Tooltip
              contentStyle={{
                background: '#16161a',
                border: '1px solid #26262c',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="Novo"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Entrada"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Reentrada"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Parou"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
