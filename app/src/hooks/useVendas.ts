import { useQuery } from '@tanstack/react-query'
import { supabase, VENDAS_TABLE } from '../lib/supabase'
import type { Venda } from '../types'

const PAGE_SIZE = 1000

async function fetchAllVendas(): Promise<Venda[]> {
  const all: Venda[] = []
  let from = 0
  while (true) {
    const to = from + PAGE_SIZE - 1
    const { data, error } = await supabase
      .from(VENDAS_TABLE)
      .select('*')
      .range(from, to)
    if (error) throw error
    if (!data || data.length === 0) break
    all.push(...(data as Venda[]))
    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }
  return all
}

export function useVendas() {
  return useQuery({
    queryKey: ['vendas'],
    queryFn: fetchAllVendas,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
