import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fmtNumber = (n: number) =>
  new Intl.NumberFormat('pt-BR').format(Math.round(n))

export const fmtPercent = (n: number, digits = 1) =>
  `${(n * 100).toFixed(digits)}%`

export const fmtMoney = (n: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0)

export const fmtMoneyCompact = (n: number) => {
  const abs = Math.abs(n)
  if (abs >= 1_000_000)
    return `R$ ${(n / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}M`
  if (abs >= 1_000)
    return `R$ ${(n / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k`
  return fmtMoney(n)
}

const BR_DATE_FMT = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const BR_DATE_ONLY_FMT = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export function fmtBRDate(value: unknown, withTime = true): string {
  if (value == null || value === '') return ''
  const d = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(d.getTime())) return String(value)
  return (withTime ? BR_DATE_FMT : BR_DATE_ONLY_FMT).format(d)
}
