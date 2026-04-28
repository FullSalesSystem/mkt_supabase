import type { Venda } from '../../../types'
import { safeDate } from '../../../lib/aggregations'
import { toNumber } from '../../../lib/vendas-aggregations'
import type {
  VendaColumnFilterValue,
  VendaColumnKey,
  SortDir,
} from './types'

const stringify = (v: unknown): string => {
  if (v == null) return ''
  if (Array.isArray(v)) return v.join(' ')
  return String(v)
}

const SEARCHABLE_KEYS: (keyof Venda)[] = [
  'nome',
  'email',
  'telefone',
  'documento',
  'produto',
  'oferta',
  'status',
  'forma_pagamento',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
]

const NUMERIC_KEYS: VendaColumnKey[] = [
  'valor',
  'valor_liquido',
  'comissao',
  'parcelas',
]

const DATE_KEYS: VendaColumnKey[] = ['data_venda', 'data_pagamento']

export function searchMatches(row: Venda, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  for (const key of SEARCHABLE_KEYS) {
    if (stringify(row[key]).toLowerCase().includes(q)) return true
  }
  return false
}

export function columnMatches(
  row: Venda,
  key: VendaColumnKey,
  filter: VendaColumnFilterValue,
): boolean {
  const raw = row[key]
  switch (filter.kind) {
    case 'text': {
      if (!filter.query) return true
      return stringify(raw).toLowerCase().includes(filter.query.toLowerCase())
    }
    case 'multi': {
      if (!filter.values.length) return true
      const value = stringify(raw).trim()
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
      const n = toNumber(raw)
      if (filter.min && n < Number(filter.min)) return false
      if (filter.max && n > Number(filter.max)) return false
      return true
    }
  }
}

export function compareValues(
  a: Venda,
  b: Venda,
  key: VendaColumnKey,
  dir: SortDir,
): number {
  const ra = a[key]
  const rb = b[key]
  let cmp: number

  if (DATE_KEYS.includes(key)) {
    const da = safeDate(stringify(ra))?.getTime() ?? 0
    const db = safeDate(stringify(rb))?.getTime() ?? 0
    cmp = da - db
  } else if (NUMERIC_KEYS.includes(key) || key === 'id') {
    cmp = toNumber(ra) - toNumber(rb)
  } else {
    cmp = stringify(ra).localeCompare(stringify(rb), 'pt-BR', {
      numeric: true,
      sensitivity: 'base',
    })
  }
  return dir === 'asc' ? cmp : -cmp
}

export function applyVendasTable(
  rows: Venda[],
  search: string,
  filters: Partial<Record<VendaColumnKey, VendaColumnFilterValue>>,
  sort: { col: VendaColumnKey; dir: SortDir } | null,
): Venda[] {
  let out = rows
  if (search) out = out.filter((r) => searchMatches(r, search))
  for (const [key, filter] of Object.entries(filters) as [
    VendaColumnKey,
    VendaColumnFilterValue,
  ][]) {
    out = out.filter((r) => columnMatches(r, key, filter))
  }
  if (sort) {
    out = [...out].sort((a, b) => compareValues(a, b, sort.col, sort.dir))
  }
  return out
}

export function distinctVendaColumnValues(
  rows: Venda[],
  key: VendaColumnKey,
): string[] {
  const set = new Set<string>()
  for (const r of rows) {
    const v = r[key]
    if (Array.isArray(v)) {
      for (const x of v) set.add(String(x).trim())
    } else if (v != null) {
      const s = String(v).trim()
      if (s) set.add(s)
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
}
