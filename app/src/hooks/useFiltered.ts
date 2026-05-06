import { useMemo } from 'react'
import type { Filters, Lead } from '../types'
import { presetToRange } from '../lib/period'
import { leadFunis, parseHistorico, safeDate } from '../lib/aggregations'

export function useFiltered(rows: Lead[] | undefined, filters: Filters): Lead[] {
  return useMemo(() => {
    if (!rows) return []
    let start: Date | null = null
    let end: Date | null = null

    if (filters.preset === 'custom') {
      if (filters.startDate) start = new Date(filters.startDate + 'T00:00:00')
      if (filters.endDate) end = new Date(filters.endDate + 'T23:59:59')
    } else {
      const r = presetToRange(filters.preset)
      if (r) {
        start = r.start
        end = r.end
      }
    }

    const funilSet = new Set(filters.funis)
    const statusSet = new Set(filters.statuses)
    const segSet = new Set(filters.segmentos)

    return rows.filter((r) => {
      if (start || end) {
        const dates: Date[] = []
        const main = safeDate(r.data)
        if (main) dates.push(main)
        for (const h of parseHistorico(r.historico_reentradas)) {
          const d = safeDate(h.data ?? null)
          if (d) dates.push(d)
        }
        if (dates.length === 0) return false
        const inRange = dates.some(
          (d) => (!start || d >= start) && (!end || d <= end),
        )
        if (!inRange) return false
      }
      if (funilSet.size) {
        const funis = leadFunis(r)
        if (!funis.some((f) => funilSet.has(f))) return false
      }
      if (statusSet.size && !statusSet.has((r.status_entrada ?? '').trim()))
        return false
      if (segSet.size && !segSet.has((r.segmento ?? '').trim())) return false
      return true
    })
  }, [rows, filters])
}
