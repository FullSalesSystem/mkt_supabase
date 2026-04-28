import type { Lead } from '../../types'

export type SortDir = 'asc' | 'desc'
export type ColumnKey = keyof Lead
export type FilterKind = 'text' | 'multi' | 'dateRange' | 'numberRange'

export type ColumnDef = {
  key: ColumnKey
  label: string
  filterKind: FilterKind
  width?: string
  align?: 'left' | 'right' | 'center'
}

export type TextFilter = { kind: 'text'; query: string }
export type MultiFilter = { kind: 'multi'; values: string[] }
export type DateRangeFilter = { kind: 'dateRange'; from: string; to: string }
export type NumberRangeFilter = {
  kind: 'numberRange'
  min: string
  max: string
}
export type ColumnFilterValue =
  | TextFilter
  | MultiFilter
  | DateRangeFilter
  | NumberRangeFilter

export type TableState = {
  sort: { col: ColumnKey; dir: SortDir } | null
  search: string
  filters: Partial<Record<ColumnKey, ColumnFilterValue>>
  page: number
  pageSize: number
  visibleColumns: ColumnKey[]
  selectedIds: Set<string>
}

export const COLUMNS: ColumnDef[] = [
  { key: 'nome', label: 'Nome', filterKind: 'text', width: '14rem' },
  { key: 'email', label: 'E-mail', filterKind: 'text', width: '14rem' },
  { key: 'telefone', label: 'Telefone', filterKind: 'text', width: '10rem' },
  { key: 'cargo', label: 'Cargo', filterKind: 'multi', width: '10rem' },
  { key: 'segmento', label: 'Segmento', filterKind: 'multi', width: '10rem' },
  { key: 'faturamento', label: 'Faturamento', filterKind: 'multi', width: '10rem' },
  { key: 'data_original', label: 'Data', filterKind: 'dateRange', width: '7rem' },
  { key: 'origem_primeira', label: 'Funil (1ª)', filterKind: 'multi', width: '14rem' },
  { key: 'origem_todas', label: 'Origens', filterKind: 'text', width: '16rem' },
  { key: 'status_entrada', label: 'Status', filterKind: 'multi', width: '8rem' },
  { key: 'utm_source', label: 'utm_source', filterKind: 'multi', width: '10rem' },
  { key: 'utm_medium', label: 'utm_medium', filterKind: 'multi', width: '10rem' },
  { key: 'utm_campaign', label: 'utm_campaign', filterKind: 'multi', width: '12rem' },
  { key: 'utm_term', label: 'utm_term', filterKind: 'text', width: '10rem' },
  { key: 'utm_content', label: 'utm_content', filterKind: 'text', width: '10rem' },
]

const HIDDEN_BY_DEFAULT: ColumnKey[] = ['origem_todas', 'utm_term', 'utm_content']

export const DEFAULT_VISIBLE: ColumnKey[] = COLUMNS.filter(
  (c) => !HIDDEN_BY_DEFAULT.includes(c.key),
).map((c) => c.key)

export const initialTableState: TableState = {
  sort: { col: 'data_original', dir: 'desc' },
  search: '',
  filters: {},
  page: 1,
  pageSize: 50,
  visibleColumns: DEFAULT_VISIBLE,
  selectedIds: new Set<string>(),
}
