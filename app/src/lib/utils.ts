import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fmtNumber = (n: number) =>
  new Intl.NumberFormat('pt-BR').format(Math.round(n))

export const fmtPercent = (n: number, digits = 1) =>
  `${(n * 100).toFixed(digits)}%`
