import type { Lead } from '../types'
import { CARGO_LABEL, normalizeCargo } from './cargo'
import { FATURAMENTO_LABEL, normalizeFaturamento } from './faturamento'

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
  return value
}
