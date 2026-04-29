import { format, parseISO, startOfDay, isValid } from 'date-fns'
import type { Lead } from '../types'

const REENTRADA_TOKENS = ['reentrada', 're-entrada', 're entrada']
const NOVO_TOKENS = ['novo', 'lead novo', 'lead-novo']
const ENTRADA_TOKENS = ['entrada', 'lead entrada']
const PAROU_TOKENS = ['parou', 'regras', 'parou nas regras']

const norm = (s: string | null | undefined) =>
  (s ?? '').toString().trim().toLowerCase()

export type StatusCategory = 'novo' | 'reentrada' | 'entrada' | 'parou' | 'outro'

export function categorizeStatus(status: string | null | undefined): StatusCategory {
  const s = norm(status)
  if (!s) return 'outro'
  if (REENTRADA_TOKENS.some((t) => s.includes(t))) return 'reentrada'
  if (PAROU_TOKENS.some((t) => s.includes(t))) return 'parou'
  if (NOVO_TOKENS.some((t) => s.includes(t))) return 'novo'
  if (ENTRADA_TOKENS.some((t) => s.includes(t))) return 'entrada'
  return 'outro'
}

const BR_DATE = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/

export function safeDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const s = String(value).trim()
  const br = s.match(BR_DATE)
  if (br) {
    const [, dd, mm, yyyy, h = '0', mi = '0', se = '0'] = br
    const d = new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      Number(h),
      Number(mi),
      Number(se),
    )
    return isValid(d) ? d : null
  }
  const iso = parseISO(s)
  if (isValid(iso)) return iso
  const fallback = new Date(s)
  return isValid(fallback) ? fallback : null
}

export function totalLeads(rows: Lead[]) {
  return rows.length
}

export function uniqueLeads(rows: Lead[]) {
  const set = new Set<string>()
  for (const r of rows) {
    const key = (r.email || r.telefone || String(r.id)).toString().trim().toLowerCase()
    if (key) set.add(key)
  }
  return set.size
}

export function countByStatus(rows: Lead[]) {
  const counts: Record<StatusCategory, number> = {
    novo: 0,
    reentrada: 0,
    entrada: 0,
    parou: 0,
    outro: 0,
  }
  for (const r of rows) counts[categorizeStatus(r.status)]++
  return counts
}

export function taxaCadastro(rows: Lead[]) {
  if (!rows.length) return 0
  const c = countByStatus(rows)
  const novos = c.novo + c.entrada
  const denom = novos + c.reentrada
  return denom ? novos / denom : 0
}

export function leadsByFunil(rows: Lead[]) {
  const map = new Map<string, number>()
  for (const r of rows) {
    const key = (r.origem || 'Sem funil').trim() || 'Sem funil'
    map.set(key, (map.get(key) ?? 0) + 1)
  }
  return Array.from(map, ([funil, total]) => ({ funil, total })).sort(
    (a, b) => b.total - a.total,
  )
}

export function statusByFunil(rows: Lead[]) {
  const map = new Map<string, Record<StatusCategory, number>>()
  for (const r of rows) {
    const key = (r.origem || 'Sem funil').trim() || 'Sem funil'
    const cur =
      map.get(key) ??
      ({ novo: 0, reentrada: 0, entrada: 0, parou: 0, outro: 0 } as Record<
        StatusCategory,
        number
      >)
    cur[categorizeStatus(r.status)]++
    map.set(key, cur)
  }
  return Array.from(map, ([funil, c]) => ({
    funil,
    Novo: c.novo,
    Entrada: c.entrada,
    Reentrada: c.reentrada,
    Parou: c.parou,
    Outro: c.outro,
    total: c.novo + c.entrada + c.reentrada + c.parou + c.outro,
  })).sort((a, b) => b.total - a.total)
}

export function leadsBySegmento(rows: Lead[]) {
  const map = new Map<string, number>()
  for (const r of rows) {
    const key = (r.segmento || 'Não informado').trim() || 'Não informado'
    map.set(key, (map.get(key) ?? 0) + 1)
  }
  return Array.from(map, ([segmento, total]) => ({ segmento, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
}

export function leadsByCargo(rows: Lead[]) {
  const map = new Map<string, number>()
  for (const r of rows) {
    const key = (r.cargo || 'Não informado').trim() || 'Não informado'
    map.set(key, (map.get(key) ?? 0) + 1)
  }
  return Array.from(map, ([cargo, total]) => ({ cargo, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
}

export function leadsByFaturamento(rows: Lead[]) {
  const map = new Map<string, number>()
  for (const r of rows) {
    const key = (r.faturamento || 'Não informado').trim() || 'Não informado'
    map.set(key, (map.get(key) ?? 0) + 1)
  }
  return Array.from(map, ([faturamento, total]) => ({ faturamento, total })).sort(
    (a, b) => b.total - a.total,
  )
}

export type DailyPoint = {
  date: string
  Novo: number
  Entrada: number
  Reentrada: number
  Parou: number
  total: number
  taxa: number
}

export function dailySeries(rows: Lead[]): DailyPoint[] {
  const map = new Map<string, DailyPoint>()
  for (const r of rows) {
    const d = safeDate(r.data_normalizada) ?? safeDate(r.data)
    if (!d) continue
    const key = format(startOfDay(d), 'yyyy-MM-dd')
    const cur =
      map.get(key) ??
      ({
        date: key,
        Novo: 0,
        Entrada: 0,
        Reentrada: 0,
        Parou: 0,
        total: 0,
        taxa: 0,
      } as DailyPoint)
    const cat = categorizeStatus(r.status)
    if (cat === 'novo') cur.Novo++
    else if (cat === 'entrada') cur.Entrada++
    else if (cat === 'reentrada') cur.Reentrada++
    else if (cat === 'parou') cur.Parou++
    cur.total++
    map.set(key, cur)
  }
  const arr = Array.from(map.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  )
  for (const p of arr) {
    const novos = p.Novo + p.Entrada
    const denom = novos + p.Reentrada
    p.taxa = denom ? novos / denom : 0
  }
  return arr
}

export function distinctValues(rows: Lead[], key: keyof Lead): string[] {
  const set = new Set<string>()
  for (const r of rows) {
    const v = r[key] as unknown as string | null | undefined
    if (v == null) continue
    const s = String(v).trim()
    if (s) set.add(s)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

