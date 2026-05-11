import { format, parseISO, startOfDay, isValid } from 'date-fns'
import type { HistoricoEntrada, Lead } from '../types'
import { categoryOfLead, type Categoria } from './categorias'
import {
  FATURAMENTO_LABEL,
  FATURAMENTO_ORDER,
  normalizeFaturamento,
  type FaturamentoFaixa,
} from './faturamento'

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
  for (const r of rows) counts[categorizeStatus(r.status_entrada)]++
  return counts
}

export function taxaCadastro(rows: Lead[]) {
  if (!rows.length) return 0
  const c = countByStatus(rows)
  const novos = c.novo + c.entrada
  const denom = novos + c.reentrada
  return denom ? novos / denom : 0
}

export function parseHistorico(value: unknown): HistoricoEntrada[] {
  if (!value) return []
  let raw: unknown = value
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw)
    } catch {
      return []
    }
  }
  if (!Array.isArray(raw)) return []
  return raw.filter((x): x is HistoricoEntrada => !!x && typeof x === 'object')
}

export function parseOrigens(value: string | null | undefined): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function leadFunis(lead: Lead): string[] {
  const historico = parseHistorico(lead.historico_reentradas)
  const fromHistorico = historico
    .map((h) => (h.origem ?? '').toString().trim())
    .filter(Boolean)
  if (fromHistorico.length) return fromHistorico
  const fromTotal = parseOrigens(lead.origem_total)
  if (fromTotal.length) return fromTotal
  const primeira = (lead.origem_primeira ?? '').trim()
  return primeira ? [primeira] : []
}

export function distinctFunis(rows: Lead[]): string[] {
  const set = new Set<string>()
  for (const r of rows) for (const f of leadFunis(r)) set.add(f)
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export function leadsByFunil(rows: Lead[]) {
  const map = new Map<string, number>()
  for (const r of rows) {
    const funis = leadFunis(r)
    const keys = funis.length ? funis : ['Sem funil']
    for (const k of keys) map.set(k, (map.get(k) ?? 0) + 1)
  }
  return Array.from(map, ([funil, total]) => ({ funil, total })).sort(
    (a, b) => b.total - a.total,
  )
}

export function statusByFunil(rows: Lead[]) {
  const map = new Map<string, { Entrada: number; Reentrada: number }>()
  for (const r of rows) {
    const historico = parseHistorico(r.historico_reentradas)
    if (historico.length > 0) {
      historico.forEach((h, i) => {
        const key = (h.origem ?? '').toString().trim() || 'Sem funil'
        const cur = map.get(key) ?? { Entrada: 0, Reentrada: 0 }
        if (i === 0) cur.Entrada++
        else cur.Reentrada++
        map.set(key, cur)
      })
    } else {
      const key = (r.origem_primeira ?? '').trim() || 'Sem funil'
      const cur = map.get(key) ?? { Entrada: 0, Reentrada: 0 }
      const cat = categorizeStatus(r.status_entrada)
      if (cat === 'reentrada') cur.Reentrada++
      else cur.Entrada++
      map.set(key, cur)
    }
  }
  return Array.from(map, ([funil, c]) => ({
    funil,
    Entrada: c.Entrada,
    Reentrada: c.Reentrada,
    total: c.Entrada + c.Reentrada,
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
  const map = new Map<FaturamentoFaixa, number>()
  for (const r of rows) {
    const faixa = normalizeFaturamento(r.faturamento)
    map.set(faixa, (map.get(faixa) ?? 0) + 1)
  }
  return Array.from(map, ([faixa, total]) => ({
    faixa,
    faturamento: FATURAMENTO_LABEL[faixa],
    total,
  })).sort((a, b) => FATURAMENTO_ORDER[a.faixa] - FATURAMENTO_ORDER[b.faixa])
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
    const d = safeDate(r.data)
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
    const cat = categorizeStatus(r.status_entrada)
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

export type Qualificacao = 'quali' | 'semi' | 'desquali' | 'outro'

const STRIP_ACCENTS = (s: string) =>
  s.normalize('NFD').replace(/[?-?]/g, '')

const normLower = (s: string | null | undefined) =>
  STRIP_ACCENTS((s ?? '').toString().toLowerCase()).trim()

const QUALI_CARGO_TOKENS = ['socio', 'empresario']

export function categorizarQualificacao(lead: Lead): Qualificacao {
  const cargo = normLower(lead.cargo)
  if (cargo && QUALI_CARGO_TOKENS.some((t) => cargo.includes(t))) return 'quali'

  const faixa = normalizeFaturamento(lead.faturamento)
  if (faixa === 'ate-30k') return 'desquali'
  if (faixa === '30k-50k') return 'semi'
  return 'outro'
}

export function countQualificacao(rows: Lead[]) {
  const c: Record<Qualificacao, number> = { quali: 0, semi: 0, desquali: 0, outro: 0 }
  for (const r of rows) c[categorizarQualificacao(r)]++
  return c
}

export type CategoriaStats = {
  categoria: Categoria
  leads: Lead[]
  total: number
  quali: number
  semi: number
  desquali: number
  outro: number
  qualificados: number
  funis: { funil: string; total: number }[]
}

export function statsByCategoria(rows: Lead[]): Record<Categoria, CategoriaStats> {
  const buckets: Record<Categoria, Lead[]> = {
    aplicacao: [],
    aquisicao: [],
    outro: [],
  }
  for (const r of rows) buckets[categoryOfLead(r)].push(r)

  const build = (cat: Categoria, leads: Lead[]): CategoriaStats => {
    const q = countQualificacao(leads)
    const funMap = new Map<string, number>()
    for (const lead of leads) {
      const k = (lead.origem_primeira ?? '').trim() || 'Sem funil'
      funMap.set(k, (funMap.get(k) ?? 0) + 1)
    }
    const funis = Array.from(funMap, ([funil, total]) => ({ funil, total })).sort(
      (a, b) => b.total - a.total,
    )
    return {
      categoria: cat,
      leads,
      total: leads.length,
      quali: q.quali,
      semi: q.semi,
      desquali: q.desquali,
      outro: q.outro,
      qualificados: q.quali,
      funis,
    }
  }

  return {
    aplicacao: build('aplicacao', buckets.aplicacao),
    aquisicao: build('aquisicao', buckets.aquisicao),
    outro: build('outro', buckets.outro),
  }
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

