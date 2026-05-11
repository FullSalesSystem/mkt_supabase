import type { Lead } from '../types'

export type Categoria = 'aplicacao' | 'aquisicao' | 'outro'

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  aplicacao: 'Aplicação',
  aquisicao: 'Aquisição',
  outro: 'Outros',
}

const APLICACAO_TOKENS = ['fap', 'site', 'leadster']
const AQUISICAO_TOKENS = [
  'playbook',
  'pop-up',
  'popup',
  'quizz',
  'quiz mss',
  'mss compra',
  'mss-compra',
  'flix',
  'aula gratuita',
]

const COMBINING_MARKS = /[?-?]/g

const norm = (s: string | null | undefined) =>
  (s ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .trim()

export function categoryOfFunil(funil: string | null | undefined): Categoria {
  const s = norm(funil)
  if (!s) return 'outro'
  if (APLICACAO_TOKENS.some((t) => s.includes(t))) return 'aplicacao'
  if (AQUISICAO_TOKENS.some((t) => s.includes(t))) return 'aquisicao'
  return 'outro'
}

export function categoryOfLead(lead: Lead): Categoria {
  return categoryOfFunil(lead.origem_primeira)
}
