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
}
