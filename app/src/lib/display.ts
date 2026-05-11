import type { Lead, Qualificacao } from '../types'
import { CARGO_LABEL, normalizeCargo } from './cargo'
import { FATURAMENTO_LABEL, normalizeFaturamento } from './faturamento'
import { CATEGORIA_LABEL, type Categoria } from './categorias'
import { QUALIFICACAO_LABEL } from './aggregations'

export function displayLeadValue(key: keyof Lead, value: unknown): unknown {
  if (key === 'cargo') {
    if (value == null) return value
    const s = String(value).trim()
    if (!s) return value
    return CARGO_LABEL[normalizeCargo(s)]
  }
  if (key === 'faturamento') {
    if (value == null) return value
    const s = String(value).trim()
    if (!s) return value
    return FATURAMENTO_LABEL[normalizeFaturamento(s)]
  }
  if (key === 'qualificacao') {
    if (value == null) return value
    return QUALIFICACAO_LABEL[value as Qualificacao] ?? String(value)
  }
  if (key === 'categoria') {
    if (value == null) return value
    return CATEGORIA_LABEL[value as Categoria] ?? String(value)
  }
  return value
}
