import type { Venda } from '../../../types'

export type SortDir = 'asc' | 'desc'
export type VendaColumnKey = keyof Venda
export type FilterKind = 'text' | 'multi' | 'dateRange' | 'numberRange'

export type VendaColumnDef = {
  key: VendaColumnKey
  label: string
  filterKind: FilterKind
  width?: string
  align?: 'left' | 'right' | 'center'
  format?: 'money' | 'number'
}

export type TextFilter = { kind: 'text'; query: string }
export type MultiFilter = { kind: 'multi'; values: string[] }
export type DateRangeFilter = { kind: 'dateRange'; from: string; to: string }
export type NumberRangeFilter = {
  kind: 'numberRange'
  min: string
  max: string
}
export type VendaColumnFilterValue =
  | TextFilter
  | MultiFilter
  | DateRangeFilter
  | NumberRangeFilter

export type VendasTableState = {
  sort: { col: VendaColumnKey; dir: SortDir } | null
  search: string
  filters: Partial<Record<VendaColumnKey, VendaColumnFilterValue>>
  page: number
  pageSize: number
  visibleColumns: VendaColumnKey[]
  selectedIds: Set<string>
}

export const VENDA_COLUMNS: VendaColumnDef[] = [
  { key: 'nome', label: 'Comprador', filterKind: 'text', width: '14rem' },
  { key: 'email', label: 'E-mail', filterKind: 'text', width: '14rem' },
  { key: 'telefone', label: 'Telefone', filterKind: 'text', width: '10rem' },
  { key: 'documento', label: 'Documento', filterKind: 'text', width: '10rem' },
  { key: 'produto', label: 'Produto', filterKind: 'multi', width: '14rem' },
  { key: 'oferta', label: 'Oferta', filterKind: 'multi', width: '12rem' },
  { key: 'status', label: 'Status', filterKind: 'multi', width: '8rem' },
  {
    key: 'forma_pagamento',
    label: 'Pagamento',
    filterKind: 'multi',
    width: '9rem',
  },
  {
    key: 'parcelas',
    label: 'Parcelas',
    filterKind: 'numberRange',
    width: '6rem',
    align: 'right',
    format: 'number',
  },
  {
    key: 'valor',
    label: 'Valor',
    filterKind: 'numberRange',
    width: '8rem',
    align: 'right',
    format: 'money',
  },
  {
    key: 'valor_liquido',
    label: 'Valor Líquido',
    filterKind: 'numberRange',
    width: '8rem',
    align: 'right',
    format: 'money',
  },
  {
    key: 'comissao',
    label: 'Comissão',
    filterKind: 'numberRange',
    width: '8rem',
    align: 'right',
    format: 'money',
  },
  {
    key: 'data_venda',
    label: 'Data Venda',
    filterKind: 'dateRange',
    width: '7rem',
  },
  {
    key: 'data_pagamento',
    label: 'Data Pagamento',
    filterKind: 'dateRange',
    width: '7rem',
  },
  { key: 'utm_source', label: 'utm_source', filterKind: 'multi', width: '10rem' },
  { key: 'utm_medium', label: 'utm_medium', filterKind: 'multi', width: '10rem' },
  {
    key: 'utm_campaign',
    label: 'utm_campaign',
    filterKind: 'multi',
    width: '12rem',
  },
  { key: 'utm_term', label: 'utm_term', filterKind: 'text', width: '10rem' },
  { key: 'utm_content', label: 'utm_content', filterKind: 'text', width: '10rem' },
]

const HIDDEN_BY_DEFAULT: VendaColumnKey[] = [
  'documento',
  'valor_liquido',
  'comissao',
  'utm_term',
  'utm_content',
]

export const VENDA_DEFAULT_VISIBLE: VendaColumnKey[] = VENDA_COLUMNS.filter(
  (c) => !HIDDEN_BY_DEFAULT.includes(c.key),
).map((c) => c.key)

export const initialVendasTableState: VendasTableState = {
  sort: { col: 'data_venda', dir: 'desc' },
  search: '',
  filters: {},
  page: 1,
  pageSize: 50,
  visibleColumns: VENDA_DEFAULT_VISIBLE,
  selectedIds: new Set<string>(),
}
