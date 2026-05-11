import { useMemo } from 'react'
import type { Filters, Lead } from '../types'
import { presetToRange } from '../lib/period'
import {
  categorizarQualificacao,
  leadFunis,
  parseHistorico,
  safeDate,
} from '../lib/aggregations'
import { normalizeCargo } from '../lib/cargo'
import { normalizeFaturamento } from '../lib/faturamento'
import { categoryOfLead } from '../lib/categorias'

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
    const catSet = new Set(filters.categorias)
    const qualiSet = new Set(filters.qualificacoes)
    const cargoSet = new Set(filters.cargos)
    const fatSet = new Set(filters.faturamentos)

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
      if (catSet.size && !catSet.has(r.categoria ?? categoryOfLead(r)))
        return false
      if (
        qualiSet.size &&
        !qualiSet.has(r.qualificacao ?? categorizarQualificacao(r))
      )
        return false
      if (cargoSet.size && !cargoSet.has(normalizeCargo(r.cargo))) return false
      if (fatSet.size && !fatSet.has(normalizeFaturamento(r.faturamento)))
        return false
      return true
    })
  }, [rows, filters])
}
