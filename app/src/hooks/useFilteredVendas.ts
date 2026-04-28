import { useMemo } from 'react'
import type { Venda, VendasFilters } from '../types'
import { presetToRange } from '../lib/period'
import { vendaDate } from '../lib/vendas-aggregations'

export function useFilteredVendas(
  rows: Venda[] | undefined,
  filters: VendasFilters,
): Venda[] {
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

    const produtoSet = new Set(filters.produtos)
    const statusSet = new Set(filters.statuses)
    const formaSet = new Set(filters.formasPagamento)

    return rows.filter((r) => {
      if (start || end) {
        const d = vendaDate(r)
        if (!d) return false
        if (start && d < start) return false
        if (end && d > end) return false
      }
      if (produtoSet.size && !produtoSet.has((r.produto ?? '').trim()))
        return false
      if (statusSet.size && !statusSet.has((r.status ?? '').trim()))
        return false
      if (
        formaSet.size &&
        !formaSet.has((r.forma_pagamento ?? '').trim())
      )
        return false
      return true
    })
  }, [rows, filters])
}
