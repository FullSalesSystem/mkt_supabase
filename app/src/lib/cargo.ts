export type CargoCategoria =
  | 'socio-empresario'
  | 'diretor'
  | 'gerente-lider'
  | 'vendedor'
  | 'colaborador'
  | 'prestador'
  | 'outro'

export const CARGO_CATEGORIAS: CargoCategoria[] = [
  'socio-empresario',
  'diretor',
  'gerente-lider',
  'vendedor',
  'colaborador',
  'prestador',
  'outro',
]

export const CARGO_LABEL: Record<CargoCategoria, string> = {
  'socio-empresario': 'Sócio/Empresário',
  diretor: 'Diretor',
  'gerente-lider': 'Gerente/Líder',
  vendedor: 'Vendedor',
  colaborador: 'Colaborador/Funcionário',
  prestador: 'Prestador/Freelancer',
  outro: 'Outro / Não atua',
}

export const CARGO_ORDER: Record<CargoCategoria, number> = {
  'socio-empresario': 0,
  diretor: 1,
  'gerente-lider': 2,
  vendedor: 3,
  colaborador: 4,
  prestador: 5,
  outro: 99,
}

const COMBINING_MARKS = /[̀-ͯ]/g

const norm = (s: string | null | undefined) =>
  (s ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const TOKENS: { categoria: CargoCategoria; tokens: string[] }[] = [
  {
    categoria: 'socio-empresario',
    tokens: ['socio', 'empresario', 'empreendedor', 'fundador'],
  },
  { categoria: 'diretor', tokens: ['diretor'] },
  {
    categoria: 'gerente-lider',
    tokens: ['gerente', 'lider', 'head', 'superior'],
  },
  { categoria: 'prestador', tokens: ['prestador', 'freelancer', 'freela'] },
  { categoria: 'vendedor', tokens: ['profissional de vendas', 'vendedor'] },
  { categoria: 'colaborador', tokens: ['colaborador', 'funcionario'] },
]

export function normalizeCargo(raw: string | null | undefined): CargoCategoria {
  if (raw == null) return 'outro'
  const s = norm(raw)
  if (!s) return 'outro'

  for (const { categoria, tokens } of TOKENS) {
    if (tokens.some((t) => s.includes(t))) return categoria
  }
  return 'outro'
}
