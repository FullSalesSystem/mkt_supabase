import { Users, UserPlus, RotateCcw, TrendingUp, Fingerprint } from 'lucide-react'
import { type ReactNode } from 'react'
import type { Lead } from '../types'
import {
  countByStatus,
  taxaCadastro,
  totalLeads,
  uniqueLeads,
} from '../lib/aggregations'
import { fmtNumber, fmtPercent } from '../lib/utils'
import { cn } from '../lib/utils'

type CardProps = {
  label: string
  value: string
  icon: ReactNode
  tone: 'green' | 'blue' | 'red' | 'amber' | 'purple'
}

const TONES: Record<CardProps['tone'], string> = {
  green: 'from-emerald-500/15 to-emerald-500/0 ring-emerald-500/30',
  blue: 'from-sky-500/15 to-sky-500/0 ring-sky-500/30',
  red: 'from-rose-500/15 to-rose-500/0 ring-rose-500/30',
  amber: 'from-amber-500/15 to-amber-500/0 ring-amber-500/30',
  purple: 'from-violet-500/15 to-violet-500/0 ring-violet-500/30',
}

const ICON_BG: Record<CardProps['tone'], string> = {
  green: 'bg-emerald-500/15 text-emerald-400',
  blue: 'bg-sky-500/15 text-sky-400',
  red: 'bg-rose-500/15 text-rose-400',
  amber: 'bg-amber-500/15 text-amber-400',
  purple: 'bg-violet-500/15 text-violet-400',
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
        <div>
          <div className="text-xs text-[var(--color-muted)]">{label}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {value}
          </div>
        </div>
        <div
          className={cn(
            'rounded-lg p-2',
            ICON_BG[tone],
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

export function KpiCards({ rows }: { rows: Lead[] }) {
  const total = totalLeads(rows)
  const unique = uniqueLeads(rows)
  const status = countByStatus(rows)
  const novos = status.novo + status.entrada
  const reentradas = status.reentrada
  const taxa = taxaCadastro(rows)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card
        label="Total de Leads"
        value={fmtNumber(total)}
        icon={<Users size={18} />}
        tone="green"
      />
      <Card
        label="Leads Únicos"
        value={fmtNumber(unique)}
        icon={<Fingerprint size={18} />}
        tone="purple"
      />
      <Card
        label="Taxa de Cadastro"
        value={fmtPercent(taxa)}
        icon={<TrendingUp size={18} />}
        tone="blue"
      />
      <Card
        label="Novos Leads"
        value={fmtNumber(novos)}
        icon={<UserPlus size={18} />}
        tone="amber"
      />
      <Card
        label="Reentradas"
        value={fmtNumber(reentradas)}
        icon={<RotateCcw size={18} />}
        tone="red"
      />
    </div>
  )
}
