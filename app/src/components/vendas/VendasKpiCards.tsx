import { type ReactNode } from 'react'
import {
  CheckCircle2,
  CircleDollarSign,
  Receipt,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'
import type { Venda } from '../../types'
import {
  countByVendaStatus,
  receitaTotal,
  taxaAprovacao,
  ticketMedio,
  totalVendas,
} from '../../lib/vendas-aggregations'
import { fmtMoney, fmtNumber, fmtPercent } from '../../lib/utils'
import { cn } from '../../lib/utils'

type CardProps = {
  label: string
  value: string
  icon: ReactNode
  tone: 'green' | 'blue' | 'red' | 'amber' | 'purple' | 'teal'
}

const TONES: Record<CardProps['tone'], string> = {
  green: 'from-emerald-500/15 to-emerald-500/0 ring-emerald-500/30',
  blue: 'from-sky-500/15 to-sky-500/0 ring-sky-500/30',
  red: 'from-rose-500/15 to-rose-500/0 ring-rose-500/30',
  amber: 'from-amber-500/15 to-amber-500/0 ring-amber-500/30',
  purple: 'from-violet-500/15 to-violet-500/0 ring-violet-500/30',
  teal: 'from-teal-500/15 to-teal-500/0 ring-teal-500/30',
}

const ICON_BG: Record<CardProps['tone'], string> = {
  green: 'bg-emerald-500/15 text-emerald-400',
  blue: 'bg-sky-500/15 text-sky-400',
  red: 'bg-rose-500/15 text-rose-400',
  amber: 'bg-amber-500/15 text-amber-400',
  purple: 'bg-violet-500/15 text-violet-400',
  teal: 'bg-teal-500/15 text-teal-400',
}

function Card({ label, value, icon, tone }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--color-border)] bg-gradient-to-br p-5',
        'ring-1 ring-inset',
        TONES[tone],
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-xs text-[var(--color-muted)]">{label}</div>
          <div className="mt-2 truncate text-3xl font-semibold tracking-tight text-white">
            {value}
          </div>
        </div>
        <div className={cn('rounded-lg p-2', ICON_BG[tone])}>{icon}</div>
      </div>
    </div>
  )
}

export function VendasKpiCards({ rows }: { rows: Venda[] }) {
  const total = totalVendas(rows)
  const status = countByVendaStatus(rows)
  const receita = receitaTotal(rows)
  const ticket = ticketMedio(rows)
  const taxa = taxaAprovacao(rows)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card
        label="Total de Vendas"
        value={fmtNumber(total)}
        icon={<ShoppingCart size={18} />}
        tone="green"
      />
      <Card
        label="Receita Total"
        value={fmtMoney(receita)}
        icon={<CircleDollarSign size={18} />}
        tone="teal"
      />
      <Card
        label="Ticket Médio"
        value={fmtMoney(ticket)}
        icon={<Receipt size={18} />}
        tone="blue"
      />
      <Card
        label="Aprovadas"
        value={fmtNumber(status.aprovada)}
        icon={<CheckCircle2 size={18} />}
        tone="purple"
      />
      <Card
        label="Taxa de Aprovação"
        value={fmtPercent(taxa)}
        icon={<TrendingUp size={18} />}
        tone="amber"
      />
      <Card
        label="Reembolsos"
        value={fmtNumber(status.reembolso)}
        icon={<RotateCcw size={18} />}
        tone="red"
      />
    </div>
  )
}
