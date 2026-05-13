import { subDays, startOfDay, endOfDay, format } from 'date-fns'
import type { PeriodPreset } from '../types'

export function presetToRange(
  preset: PeriodPreset,
): { start: Date; end: Date } | null {
  const now = new Date()
  const end = endOfDay(now)
  switch (preset) {
    case 'hoje':
      return { start: startOfDay(now), end: endOfDay(now) }
    case 'ontem': {
      const y = subDays(now, 1)
      return { start: startOfDay(y), end: endOfDay(y) }
    }
    case '7d':
      return { start: startOfDay(subDays(now, 6)), end }
    case '15d':
      return { start: startOfDay(subDays(now, 14)), end }
    case '30d':
      return { start: startOfDay(subDays(now, 29)), end }
    case '90d':
      return { start: startOfDay(subDays(now, 89)), end }
    case 'all':
    case 'custom':
      return null
  }
}

export const fmtDateInput = (d: Date) => format(d, 'yyyy-MM-dd')
