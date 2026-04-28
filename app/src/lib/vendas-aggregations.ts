import { format, startOfDay } from 'date-fns'
import type { Venda } from '../types'
import { safeDate } from './aggregations'

const APROVADA_TOKENS = [
  'aprovad',
  'paga',
  'pago',
  'paid',
  'authorized',
  'approved',
  'completed',
  'concluid',
]
const PENDENTE_TOKENS = [
  'pendente',
  'pending',
  'waiting',
  'aguardando',
  'em analise',
  'em análise',
  'iniciad',
  'gerad',
]
const REEMBOLSO_TOKENS = ['refund', 'reembolso', 'estorno', 'chargeback']
const CANCELADA_TOKENS = ['cancel', 'expirad', 'declin', 'recusad', 'failed']

const norm = (s: string | null | undefined) =>
  (s ?? '').toString().trim().toLowerCase()

export type VendaStatus =
  | 'aprovada'
  | 'pendente'
  | 'reembolso'
  | 'cancelada'
  | 'outro'

export function categorizeVendaStatus(
  status: string | null | undefined,
): VendaStatus {
  const s = norm(status)
  if (!s) return 'outro'
  if (REEMBOLSO_TOKENS.some((t) => s.includes(t))) return 'reembolso'
  if (CANCELADA_TOKENS.some((t) => s.includes(t))) return 'cancelada'
  if (APROVADA_TOKENS.some((t) => s.includes(t))) return 'aprovada'
  if (PENDENTE_TOKENS.some((t) => s.includes(t))) return 'pendente'
  return 'outro'
}

export function toNumber(v: unknown): number {
  if (v == null || v === '') return 0
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  let s = String(v).trim()
  if (!s) return 0
  s = s.replace(/[R$\s]/g, '')
  const hasComma = s.includes(',')
  const hasDot = s.includes('.')
  if (hasComma && hasDot) {
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      s = s.replace(/\./g, '').replace(',', '.')
    } else {
      s = s.replace(/,/g, '')
    }
  } else if (hasComma) {
    s = s.replace(/\./g, '').replace(',', '.')
  }
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

export function vendaDate(r: Venda): Date | null {
  return safeDate(r.data_pagamento) ?? safeDate(r.data_venda)
}

export function totalVendas(rows: Venda[]) {
  return rows.length
}

export function uniqueCompradores(rows: Venda[]) {
  const set = new Set<string>()
  for (const r of rows) {
    const key = (r.email || r.telefone || r.documento || String(r.id))
      .toString()
      .trim()
      .toLowerCase()
    if (key) set.add(key)
  }
  return set.size
}

export function countByVendaStatus(rows: Venda[]) {
  const counts: Record<VendaStatus, number> = {
    aprovada: 0,
    pendente: 0,
    reembolso: 0,
    cancelada: 0,
    outro: 0,
  }
  for (const r of rows) counts[categorizeVendaStatus(r.status)]++
  return counts
}

export function receitaTotal(rows: Venda[]) {
  let total = 0
  for (const r of rows) {
    if (categorizeVendaStatus(r.status) === 'aprovada') total += toNumber(r.valor)
  }
  return total
}

export function receitaLiquida(rows: Venda[]) {
  let total = 0
  for (const r of rows) {
    if (categorizeVendaStatus(r.status) !== 'aprovada') continue
    const liq = toNumber(r.valor_liquido)
    total += liq || toNumber(r.valor)
  }
  return total
}

export function ticketMedio(rows: Venda[]) {
  let total = 0
  let count = 0
  for (const r of rows) {
    if (categorizeVendaStatus(r.status) !== 'aprovada') continue
    total += toNumber(r.valor)
    count++
  }
  return count ? total / count : 0
}

export function taxaAprovacao(rows: Venda[]) {
  if (!rows.length) return 0
  const c = countByVendaStatus(rows)
  return c.aprovada / rows.length
}

export type ProdutoStat = {
  produto: string
  total: number
  receita: number
  aprovadas: number
}

export function vendasByProduto(rows: Venda[]): ProdutoStat[] {
  const map = new Map<string, ProdutoStat>()
  for (const r of rows) {
    const key = (r.produto || 'Sem produto').trim() || 'Sem produto'
    const cur =
      map.get(key) ?? { produto: key, total: 0, receita: 0, aprovadas: 0 }
    cur.total++
    if (categorizeVendaStatus(r.status) === 'aprovada') {
      cur.receita += toNumber(r.valor)
      cur.aprovadas++
    }
    map.set(key, cur)
  }
  return Array.from(map.values()).sort((a, b) => b.receita - a.receita || b.total - a.total)
}

export function vendasByOferta(rows: Venda[]) {
  const map = new Map<string, { oferta: string; total: number; receita: number }>()
  for (const r of rows) {
    const key = (r.oferta || 'Sem oferta').trim() || 'Sem oferta'
    const cur = map.get(key) ?? { oferta: key, total: 0, receita: 0 }
    cur.total++
    if (categorizeVendaStatus(r.status) === 'aprovada') {
      cur.receita += toNumber(r.valor)
    }
    map.set(key, cur)
  }
  return Array.from(map.values())
    .sort((a, b) => b.receita - a.receita || b.total - a.total)
    .slice(0, 10)
}

export function vendasByPagamento(rows: Venda[]) {
  const map = new Map<string, { forma: string; total: number; receita: number }>()
  for (const r of rows) {
    const key = (r.forma_pagamento || 'Não informado').trim() || 'Não informado'
    const cur = map.get(key) ?? { forma: key, total: 0, receita: 0 }
    cur.total++
    if (categorizeVendaStatus(r.status) === 'aprovada') {
      cur.receita += toNumber(r.valor)
    }
    map.set(key, cur)
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total)
}

export function vendasByUtmSource(rows: Venda[]) {
  const map = new Map<string, { source: string; total: number; receita: number }>()
  for (const r of rows) {
    const key = (r.utm_source || 'Direto').trim() || 'Direto'
    const cur = map.get(key) ?? { source: key, total: 0, receita: 0 }
    cur.total++
    if (categorizeVendaStatus(r.status) === 'aprovada') {
      cur.receita += toNumber(r.valor)
    }
    map.set(key, cur)
  }
  return Array.from(map.values())
    .sort((a, b) => b.receita - a.receita || b.total - a.total)
    .slice(0, 10)
}

export type DailyVendas = {
  date: string
  Aprovada: number
  Pendente: number
  Reembolso: number
  Cancelada: number
  total: number
  receita: number
}

export function dailyVendasSeries(rows: Venda[]): DailyVendas[] {
  const map = new Map<string, DailyVendas>()
  for (const r of rows) {
    const d = vendaDate(r)
    if (!d) continue
    const key = format(startOfDay(d), 'yyyy-MM-dd')
    const cur =
      map.get(key) ??
      ({
        date: key,
        Aprovada: 0,
        Pendente: 0,
        Reembolso: 0,
        Cancelada: 0,
        total: 0,
        receita: 0,
      } as DailyVendas)
    const cat = categorizeVendaStatus(r.status)
    if (cat === 'aprovada') {
      cur.Aprovada++
      cur.receita += toNumber(r.valor)
    } else if (cat === 'pendente') cur.Pendente++
    else if (cat === 'reembolso') cur.Reembolso++
    else if (cat === 'cancelada') cur.Cancelada++
    cur.total++
    map.set(key, cur)
  }
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
}

export function distinctVendaValues(rows: Venda[], key: keyof Venda): string[] {
  const set = new Set<string>()
  for (const r of rows) {
    const v = r[key] as unknown as string | null | undefined
    if (v == null) continue
    const s = String(v).trim()
    if (s) set.add(s)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
}
