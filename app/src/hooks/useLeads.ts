import { useQuery } from '@tanstack/react-query'
import { supabase, TABLE } from '../lib/supabase'
import type { Lead } from '../types'
import { categorizarQualificacao } from '../lib/aggregations'
import { categoryOfLead } from '../lib/categorias'

const PAGE_SIZE = 1000

function enrich(lead: Lead): Lead {
  return {
    ...lead,
    qualificacao: categorizarQualificacao(lead),
    categoria: categoryOfLead(lead),
  }
}

async function fetchAllLeads(): Promise<Lead[]> {
  const all: Lead[] = []
  let from = 0
  while (true) {
    const to = from + PAGE_SIZE - 1
    const { data, error } = await supabase
      .from(TABLE)
      .select(
        'id, nome, email, telefone, cargo, segmento, faturamento, utm_source, utm_medium, utm_campaign, utm_content, utm_term, url, data, origem_primeira, origem_total, status_entrada, historico_reentradas',
      )
      .order('id', { ascending: true })
      .range(from, to)
    if (error) throw error
    if (!data || data.length === 0) break
    all.push(...(data as Lead[]).map(enrich))
    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }
  return all
}

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: fetchAllLeads,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
