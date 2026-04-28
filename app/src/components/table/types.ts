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
]

export const DEFAULT_VISIBLE: ColumnKey[] = COLUMNS.filter(
  (c) => c.key !== 'origem_todas',
).map((c) => c.key)

export const initialTableState: TableState = {
  sort: { col: 'data_original', dir: 'desc' },
  search: '',
  filters: {},
  page: 1,
  pageSize: 50,
  visibleColumns: DEFAULT_VISIBLE,
}
