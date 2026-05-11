import { useEffect, useState } from 'react'
import type { Categoria } from './categorias'

const STORAGE_KEY = 'mkt_supabase.investimento.v2'

export type InvestimentoStore = Record<Categoria, number>

const DEFAULT: InvestimentoStore = {
  aplicacao: 0,
  aquisicao: 0,
  outro: 0,
}

function read(): InvestimentoStore {
  if (typeof window === 'undefined') return DEFAULT
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT
    const parsed = JSON.parse(raw) as Partial<InvestimentoStore>
    return {
      aplicacao: Number(parsed.aplicacao) || 0,
      aquisicao: Number(parsed.aquisicao) || 0,
      outro: Number(parsed.outro) || 0,
    }
  } catch {
    return DEFAULT
  }
}

function write(store: InvestimentoStore) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function useInvestimento(): [
  InvestimentoStore,
  (categoria: Categoria, valor: number) => void,
] {
  const [store, setStore] = useState<InvestimentoStore>(read)

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setStore(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const set = (categoria: Categoria, valor: number) => {
    setStore((prev) => {
      const next = { ...prev, [categoria]: Number.isFinite(valor) ? valor : 0 }
      write(next)
      return next
    })
  }

  return [store, set]
}

export function cpl(investimento: number, total: number): number | null {
  if (!total || !Number.isFinite(investimento) || investimento <= 0) return null
  return investimento / total
}
