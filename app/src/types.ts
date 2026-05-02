export type Lead = {
  id: number | string
  nome: string | null
  email: string | null
  telefone: string | null
  cargo: string | null
  segmento: string | null
  faturamento: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  url: string | null
  data: string | null
  origem_primeira: string | null
  origem_total: string | null
  status_entrada: string | null
}

export type Venda = {
  id?: number | string | null
  nome: string | null
  email: string | null
  telefone: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  produto: string | null
  oferta: string | null
  valor: number | string | null
  valor_liquido: number | string | null
  data: string | null
  status?: string | null
  forma_pagamento?: string | null
  documento?: string | null
  parcelas?: number | string | null
  comissao?: number | string | null
  data_venda?: string | null
  data_pagamento?: string | null
}

export type PeriodPreset =
  | 'ontem'
  | '7d'
  | '15d'
  | '30d'
  | '90d'
  | 'all'
  | 'custom'

export type Filters = {
  preset: PeriodPreset
  startDate: string | null
  endDate: string | null
  funis: string[]
  statuses: string[]
  segmentos: string[]
}

export const initialFilters: Filters = {
  preset: 'all',
  startDate: null,
  endDate: null,
  funis: [],
  statuses: [],
  segmentos: [],
}

export type VendasFilters = {
  preset: PeriodPreset
  startDate: string | null
  endDate: string | null
  produtos: string[]
  statuses: string[]
  formasPagamento: string[]
}

export const initialVendasFilters: VendasFilters = {
  preset: 'all',
  startDate: null,
  endDate: null,
  produtos: [],
  statuses: [],
  formasPagamento: [],
}
