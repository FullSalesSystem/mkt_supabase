import { useMemo, useState } from 'react'
import type { Venda, VendasFilters } from '../../types'
import { initialVendasFilters } from '../../types'
import { distinctVendaValues } from '../../lib/vendas-aggregations'
import { useFilteredVendas } from '../../hooks/useFilteredVendas'
import { VendasFiltersPanel } from './VendasFilters'
import { VendasKpiCards } from './VendasKpiCards'
import { StatusVendasDonut } from './charts/StatusVendasDonut'
import { ProdutosRanking } from './charts/ProdutosRanking'
import { ProdutosGrid } from './charts/ProdutosGrid'
import { FormaPagamentoChart } from './charts/FormaPagamentoChart'
import { ReceitaTimeline } from './charts/ReceitaTimeline'
import { OfertasChart } from './charts/OfertasChart'
import { UtmSourceChart } from './charts/UtmSourceChart'

type Props = {
  rows: Venda[]
}

export function VendasCharts({ rows }: Props) {
  const [filters, setFilters] = useState<VendasFilters>(initialVendasFilters)
  const filtered = useFilteredVendas(rows, filters)

  const produtoOptions = useMemo(
    () => distinctVendaValues(rows, 'produto'),
    [rows],
  )
  const statusOptions = useMemo(
    () => distinctVendaValues(rows, 'status'),
    [rows],
  )
  const formaPagamentoOptions = useMemo(
    () => distinctVendaValues(rows, 'forma_pagamento'),
    [rows],
  )

  return (
    <div className="space-y-4">
      <VendasKpiCards rows={filtered} />
      <VendasFiltersPanel
        filters={filters}
        onChange={setFilters}
        produtoOptions={produtoOptions}
        statusOptions={statusOptions}
        formaPagamentoOptions={formaPagamentoOptions}
      />
      <ReceitaTimeline rows={filtered} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StatusVendasDonut rows={filtered} />
        <FormaPagamentoChart rows={filtered} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProdutosGrid rows={filtered} />
        </div>
        <ProdutosRanking rows={filtered} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <OfertasChart rows={filtered} />
        <UtmSourceChart rows={filtered} />
      </div>
    </div>
  )
}
