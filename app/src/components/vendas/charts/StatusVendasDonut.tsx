import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Activity } from 'lucide-react'
import type { Venda } from '../../../types'
import { countByVendaStatus } from '../../../lib/vendas-aggregations'
import { Panel, PanelTitle } from '../../ui/Panel'
import { fmtNumber } from '../../../lib/utils'

const COLORS: Record<string, string> = {
  Aprovada: '#22c55e',
  Pendente: '#f59e0b',
  Reembolso: '#ef4444',
  Cancelada: '#6b7280',
  Outro: '#a855f7',
}

export function StatusVendasDonut({ rows }: { rows: Venda[] }) {
  const c = countByVendaStatus(rows)
  const data = [
    { name: 'Aprovada', value: c.aprovada },
    { name: 'Pendente', value: c.pendente },
    { name: 'Reembolso', value: c.reembolso },
    { name: 'Cancelada', value: c.cancelada },
    { name: 'Outro', value: c.outro },
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
