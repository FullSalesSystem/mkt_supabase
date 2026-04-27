import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Layers } from 'lucide-react'
import type { Lead } from '../../types'
import { statusByFunil } from '../../lib/aggregations'
import { Panel, PanelTitle } from '../ui/Panel'

export function StatusByFunilChart({ rows }: { rows: Lead[] }) {
  const data = statusByFunil(rows)
  return (
    <Panel>
      <PanelTitle icon={<Layers size={16} className="text-violet-400" />}>
        Entrada vs Reentrada por Funil
      </PanelTitle>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#26262c" vertical={false} />
            <XAxis
              dataKey="funil"
              stroke="#8a8a93"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#26262c' }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
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
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Novo" stackId="a" fill="#22c55e" />
            <Bar dataKey="Reentrada" stackId="a" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
