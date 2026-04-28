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
