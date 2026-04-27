import { Calendar } from 'lucide-react'
import type { Lead } from '../../types'
import { heatmapData } from '../../lib/aggregations'
import { Panel, PanelTitle } from '../ui/Panel'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function intensity(value: number, max: number) {
  if (!value) return 'bg-white/4'
  const ratio = value / max
  if (ratio < 0.2) return 'bg-emerald-900/60'
  if (ratio < 0.4) return 'bg-emerald-700/70'
  if (ratio < 0.6) return 'bg-emerald-600/80'
  if (ratio < 0.8) return 'bg-emerald-500/90'
  return 'bg-emerald-400'
}

export function Heatmap({ rows }: { rows: Lead[] }) {
  const cells = heatmapData(rows)
  if (!cells.length) {
    return (
      <Panel>
        <PanelTitle icon={<Calendar size={16} className="text-emerald-400" />}>
          Mapa de Calor: Atividade por Dia
        </PanelTitle>
        <div className="text-sm text-[var(--color-muted)]">Sem dados.</div>
      </Panel>
    )
  }

  const max = Math.max(...cells.map((c) => c.total), 1)
  const weeks = Math.max(...cells.map((c) => c.weekIndex)) + 1
  const grid: (typeof cells[number] | null)[][] = Array.from({ length: 7 }, () =>
    Array(weeks).fill(null),
  )
  for (const c of cells) grid[c.weekday][c.weekIndex] = c

  // Month labels: pick first occurrence per month at the top of week columns
  const monthLabels: { weekIndex: number; label: string }[] = []
  let lastMonth = ''
  for (let w = 0; w < weeks; w++) {
    const cell = grid.map((row) => row[w]).find(Boolean)
    if (!cell) continue
    const m = format(parseISO(cell.date), 'MMM', { locale: ptBR })
    if (m !== lastMonth) {
      monthLabels.push({ weekIndex: w, label: m })
      lastMonth = m
    }
  }

  return (
    <Panel>
      <PanelTitle icon={<Calendar size={16} className="text-emerald-400" />}>
        Mapa de Calor: Atividade por Dia
      </PanelTitle>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex pl-8 mb-1 text-[10px] text-[var(--color-muted)]">
            {monthLabels.map((m, i) => {
              const next = monthLabels[i + 1]?.weekIndex ?? weeks
              const span = next - m.weekIndex
              return (
                <div
                  key={`${m.label}-${m.weekIndex}`}
                  style={{ width: `${span * 14}px` }}
                  className="capitalize"
                >
                  {m.label}
                </div>
              )
            })}
          </div>
          <div className="flex">
            <div className="flex flex-col mr-1 gap-[2px] text-[10px] text-[var(--color-muted)]">
              {WEEKDAYS.map((w) => (
                <div key={w} className="h-3 leading-3">
                  {w}
                </div>
              ))}
            </div>
            <div
              className="grid gap-[2px]"
              style={{
                gridTemplateColumns: `repeat(${weeks}, 12px)`,
                gridAutoRows: '12px',
              }}
            >
              {grid.flatMap((row, weekday) =>
                row.map((cell, w) => (
                  <div
                    key={`${weekday}-${w}`}
                    title={
                      cell
                        ? `${cell.date} — ${cell.total} leads`
                        : ''
                    }
                    className={`h-3 w-3 rounded-[2px] ${
                      cell ? intensity(cell.total, max) : 'bg-transparent'
                    }`}
                  />
                )),
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-[var(--color-muted)]">
            <span>Menos</span>
            <span className="h-3 w-3 rounded-[2px] bg-white/4" />
            <span className="h-3 w-3 rounded-[2px] bg-emerald-900/60" />
            <span className="h-3 w-3 rounded-[2px] bg-emerald-700/70" />
            <span className="h-3 w-3 rounded-[2px] bg-emerald-500/90" />
            <span className="h-3 w-3 rounded-[2px] bg-emerald-400" />
            <span>Mais</span>
          </div>
        </div>
      </div>
    </Panel>
  )
}
