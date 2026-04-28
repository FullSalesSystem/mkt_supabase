export type Lead = {
  id: number | string
  nome: string | null
  email: string | null
  telefone: string | null
  cargo: string | null
  segmento: string | null
  faturamento: string | null
  data_original: string | null
  origem_primeira: string | null
  origem_todas: string[] | string | null
  status_entrada: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
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
