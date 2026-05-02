import { useMemo } from 'react'
import type { Filters, Lead } from '../types'
import { presetToRange } from '../lib/period'
import { safeDate } from '../lib/aggregations'

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
        const d = safeDate(r.data)
        if (!d) return false
        if (start && d < start) return false
        if (end && d > end) return false
      }
      if (funilSet.size && !funilSet.has((r.origem_primeira ?? '').trim()))
        return false
      if (statusSet.size && !statusSet.has((r.status_entrada ?? '').trim()))
        return false
      if (segSet.size && !segSet.has((r.segmento ?? '').trim())) return false
      return true
    })
  }, [rows, filters])
}
