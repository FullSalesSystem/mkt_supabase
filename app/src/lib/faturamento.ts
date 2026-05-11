export type FaturamentoFaixa =
  | 'ate-30k'
  | '30k-50k'
  | '50k-100k'
  | '100k-300k'
  | '300k-1m'
  | 'acima-1m'
  | 'outro'

export const FATURAMENTO_FAIXAS: FaturamentoFaixa[] = [
  'ate-30k',
  '30k-50k',
  '50k-100k',
  '100k-300k',
  '300k-1m',
  'acima-1m',
]

export const FATURAMENTO_LABEL: Record<FaturamentoFaixa, string> = {
  'ate-30k': 'Até R$ 30 mil',
  '30k-50k': 'R$ 30 mil – R$ 50 mil',
  '50k-100k': 'R$ 50 mil – R$ 100 mil',
  '100k-300k': 'R$ 100 mil – R$ 300 mil',
  '300k-1m': 'R$ 300 mil – R$ 1 milhão',
  'acima-1m': 'Acima de R$ 1 milhão',
  outro: 'Não informado',
}

export const FATURAMENTO_ORDER: Record<FaturamentoFaixa, number> = {
  'ate-30k': 0,
  '30k-50k': 1,
  '50k-100k': 2,
  '100k-300k': 3,
  '300k-1m': 4,
  'acima-1m': 5,
  outro: 99,
}

const COMBINING_MARKS = /[̀-ͯ]/g

const norm = (s: string | null | undefined) =>
  (s ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .trim()

function parseThousands(text: string): number[] {
  const regex = /(\d+(?:[.,]\d+)?)\s*(milhao|milhoes|milhões|milhão|mil|k\b|m\b)?/gi
  const results: number[] = []
  for (const match of text.matchAll(regex)) {
    const num = Number(match[1].replace(',', '.'))
    if (!Number.isFinite(num)) continue
    const unit = (match[2] || '').toLowerCase()
    if (unit.startsWith('milh') || unit === 'm') results.push(num * 1000)
    else results.push(num)
  }
  return results
}

function faixaFromMinThousands(min: number): FaturamentoFaixa {
  if (min < 30) return 'ate-30k'
  if (min < 50) return '30k-50k'
  if (min < 100) return '50k-100k'
  if (min < 300) return '100k-300k'
  if (min < 1000) return '300k-1m'
  return 'acima-1m'
}

export function normalizeFaturamento(
  raw: string | null | undefined,
): FaturamentoFaixa {
  if (raw == null) return 'outro'
  const s = norm(raw)
  if (!s) return 'outro'

  const isAbove =
    /\b(acima|mais\s*de|maior\s*que)\b/.test(s) || /\+\s*$|>/.test(s)
  const isBelow = /\b(abaixo|ate|menos)\b/.test(s) || /</.test(s)

  const nums = parseThousands(s)
  if (nums.length === 0) return 'outro'

  if (isBelow) return 'ate-30k'

  const min = isAbove ? nums[0] : Math.min(...nums)
  return faixaFromMinThousands(min)
}
