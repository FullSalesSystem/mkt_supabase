import type { Lead } from '../types'

export const COLUMN_LABELS: Record<keyof Lead, string> = {
  id: 'ID',
  nome: 'Nome',
  email: 'E-mail',
  telefone: 'Telefone',
  cargo: 'Cargo',
  segmento: 'Segmento',
  faturamento: 'Faturamento',
  utm_source: 'utm_source',
  utm_medium: 'utm_medium',
  utm_campaign: 'utm_campaign',
  utm_content: 'utm_content',
  utm_term: 'utm_term',
  url: 'URL',
  data: 'Data',
  origem_primeira: 'Funil (1ª)',
  origem_total: 'Origens',
  status_entrada: 'Status',
  historico_reentradas: 'Histórico',
}

export function toCSV(rows: Lead[], columns: (keyof Lead)[]): string {
  const escape = (val: unknown) => {
    if (val == null) return ''
    let s: string
    if (Array.isArray(val)) s = val.join('; ')
    else s = String(val)
    if (/["\n,;]/.test(s)) s = `"${s.replace(/"/g, '""')}"`
    return s
  }
  const header = columns.map((c) => escape(COLUMN_LABELS[c])).join(',')
  const body = rows
    .map((r) => columns.map((c) => escape(r[c])).join(','))
    .join('\n')
  return `${header}\n${body}`
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
