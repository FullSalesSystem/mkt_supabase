import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Activity } from 'lucide-react'
import type { Lead } from '../../types'
import { countByStatus } from '../../lib/aggregations'
import { Panel, PanelTitle } from '../ui/Panel'
import { fmtNumber } from '../../lib/utils'

const COLORS: Record<string, string> = {
  Novo: '#22c55e',
  Reentrada: '#3b82f6',
}

export function StatusDonut({ rows }: { rows: Lead[] }) {
  const c = countByStatus(rows)
  const data = [
    { name: 'Novo', value: c.novo },
    { name: 'Reentrada', value: c.reentrada },
  ].filter((d) => d.value > 0)

  return (
    <Panel>
      <PanelTitle icon={<Activity size={16} className="text-emerald-400" />}>
        Distribuição por Status
      </PanelTitle>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              stroke="#0a0a0b"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name] ?? '#6b7280'} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => fmtNumber(Number(v))}
              contentStyle={{
                background: '#16161a',
                border: '1px solid #26262c',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
