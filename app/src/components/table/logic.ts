import type { Lead } from '../../types'
import { safeDate } from '../../lib/aggregations'
import { displayLeadValue } from '../../lib/display'
import type { ColumnFilterValue, ColumnKey, SortDir } from './types'

const NORMALIZED_KEYS = new Set<ColumnKey>([
  'cargo',
  'faturamento',
  'qualificacao',
  'categoria',
])

const stringify = (v: unknown): string => {
  if (v == null) return ''
  if (Array.isArray(v)) return v.join(' ')
  return String(v)
}

const SEARCHABLE_KEYS: (keyof Lead)[] = [
  'nome',
  'email',
  'telefone',
  'cargo',
  'segmento',
  'faturamento',
  'origem_primeira',
  'origem_total',
  'status_entrada',
  'url',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
]

export function searchMatches(row: Lead, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  for (const key of SEARCHABLE_KEYS) {
    if (stringify(row[key]).toLowerCase().includes(q)) return true
  }
  return false
}

export function columnMatches(
  row: Lead,
  key: ColumnKey,
  filter: ColumnFilterValue,
): boolean {
  const raw = row[key]
  switch (filter.kind) {
    case 'text': {
      if (!filter.query) return true
      return stringify(raw).toLowerCase().includes(filter.query.toLowerCase())
    }
    case 'multi': {
      if (!filter.values.length) return true
      const v = NORMALIZED_KEYS.has(key) ? displayLeadValue(key, raw) : raw
      const value = stringify(v).trim()
      return filter.values.includes(value)
    }
    case 'dateRange': {
      if (!filter.from && !filter.to) return true
      const d = safeDate(stringify(raw))
      if (!d) return false
      if (filter.from && d < new Date(filter.from + 'T00:00:00')) return false
      if (filter.to && d > new Date(filter.to + 'T23:59:59')) return false
      return true
    }
    case 'numberRange': {
      if (!filter.min && !filter.max) return true
      const n = Number(raw)
      if (Number.isNaN(n)) return false
      if (filter.min && n < Number(filter.min)) return false
      if (filter.max && n > Number(filter.max)) return false
      return true
    }
  }
}

export function compareValues(
  a: Lead,
  b: Lead,
  key: ColumnKey,
  dir: SortDir,
): number {
  const ra = a[key]
  const rb = b[key]
  let cmp = 0

  if (key === 'data') {
    const da = safeDate(stringify(a.data))?.getTime() ?? 0
    const db = safeDate(stringify(b.data))?.getTime() ?? 0
    cmp = da - db
  } else if (key === 'id') {
    cmp = Number(ra ?? 0) - Number(rb ?? 0)
  } else {
    cmp = stringify(ra).localeCompare(stringify(rb), 'pt-BR', {
      numeric: true,
      sensitivity: 'base',
    })
  }
  return dir === 'asc' ? cmp : -cmp
}

export function applyTable(
  rows: Lead[],
  search: string,
  filters: Partial<Record<ColumnKey, ColumnFilterValue>>,
  sort: { col: ColumnKey; dir: SortDir } | null,
): Lead[] {
  let out = rows
  if (search) out = out.filter((r) => searchMatches(r, search))
  for (const [key, filter] of Object.entries(filters) as [
    ColumnKey,
    ColumnFilterValue,
  ][]) {
    out = out.filter((r) => columnMatches(r, key, filter))
  }
  if (sort) {
    out = [...out].sort((a, b) => compareValues(a, b, sort.col, sort.dir))
  }
  return out
}

export function distinctColumnValues(rows: Lead[], key: ColumnKey): string[] {
  const set = new Set<string>()
  const normalize = NORMALIZED_KEYS.has(key)
  for (const r of rows) {
    const raw = r[key]
    const v = normalize ? displayLeadValue(key, raw) : raw
    if (Array.isArray(v)) {
      for (const x of v) set.add(String(x).trim())
    } else if (v != null) {
      const s = String(v).trim()
      if (s) set.add(s)
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
}
