import type { Venda } from '../types'

export const VENDA_COLUMN_LABELS: Record<keyof Venda, string> = {
  id: 'ID',
  nome: 'Comprador',
  email: 'E-mail',
  telefone: 'Telefone',
  produto: 'Produto',
  oferta: 'Oferta',
  valor: 'Valor',
  valor_liquido: 'Valor Líquido',
  data: 'Data',
  utm_source: 'utm_source',
  utm_medium: 'utm_medium',
  utm_campaign: 'utm_campaign',
  utm_term: 'utm_term',
  utm_content: 'utm_content',
  status: 'Status',
  forma_pagamento: 'Pagamento',
  documento: 'Documento',
  parcelas: 'Parcelas',
  comissao: 'Comissão',
  data_venda: 'Data Venda',
  data_pagamento: 'Data Pagamento',
}

export function toVendasCSV(rows: Venda[], columns: (keyof Venda)[]): string {
  const escape = (val: unknown) => {
    if (val == null) return ''
    let s: string
    if (Array.isArray(val)) s = val.join('; ')
    else s = String(val)
    if (/["\n,;]/.test(s)) s = `"${s.replace(/"/g, '""')}"`
    return s
  }
  const header = columns.map((c) => escape(VENDA_COLUMN_LABELS[c])).join(',')
  const body = rows
    .map((r) => columns.map((c) => escape(r[c])).join(','))
    .join('\n')
  return `${header}\n${body}`
}

export function downloadVendasCSV(filename: string, csv: string) {
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
