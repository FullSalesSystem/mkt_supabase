import { Trophy } from 'lucide-react'
import type { Lead } from '../../types'
import { leadsByFunil } from '../../lib/aggregations'
import { Panel, PanelTitle } from '../ui/Panel'
import { fmtNumber } from '../../lib/utils'

const ACCENTS = [
  'bg-emerald-500/15 text-emerald-300',
  'bg-sky-500/15 text-sky-300',
  'bg-violet-500/15 text-violet-300',
  'bg-amber-500/15 text-amber-300',
  'bg-rose-500/15 text-rose-300',
  'bg-teal-500/15 text-teal-300',
  'bg-indigo-500/15 text-indigo-300',
  'bg-pink-500/15 text-pink-300',
]

export function FunilRanking({ rows }: { rows: Lead[] }) {
  const data = leadsByFunil(rows)
  const max = data[0]?.total ?? 1

  return (
    <Panel>
      <PanelTitle
        icon={<Trophy size={16} className="text-amber-400" />}
        tooltip="Ordena os funis pela quantidade de aparições de leads. Reentradas contam em cada funil do histórico, então a soma pode ser maior que o 'Total de Leads'."
      >
        Ranking de Funis
      </PanelTitle>
      <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
        {data.length === 0 && (
          <div className="text-sm text-[var(--color-muted)]">Sem dados.</div>
        )}
        {data.map((d, i) => (
          <div
            key={d.funil}
            className="relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3 py-2"
          >
            <div
              className="absolute inset-y-0 left-0 bg-emerald-500/8"
              style={{ width: `${(d.total / max) * 100}%` }}
            />
            <div className="relative flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-medium ${
                    ACCENTS[i % ACCENTS.length]
                  }`}
                >
                  {i + 1}
                </span>
                <span className="truncate text-white/90">{d.funil}</span>
              </div>
              <span className="font-medium tabular-nums text-white/80">
                {fmtNumber(d.total)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
