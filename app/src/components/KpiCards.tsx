import {
  Users,
  UserPlus,
  RotateCcw,
  TrendingUp,
  Fingerprint,
  CheckCircle2,
  CircleDot,
  XCircle,
} from 'lucide-react'
import { type ReactNode } from 'react'
import type { Lead } from '../types'
import {
  countByStatus,
  countQualificacao,
  taxaCadastro,
  totalLeads,
  uniqueLeads,
} from '../lib/aggregations'
import { fmtNumber, fmtPercent } from '../lib/utils'
import { cn } from '../lib/utils'

type Tone = 'green' | 'blue' | 'red' | 'amber' | 'purple' | 'sky' | 'orange' | 'rose'

type CardProps = {
  label: string
  value: string
  hint?: string
  icon: ReactNode
  tone: Tone
}

const TONES: Record<Tone, string> = {
  green: 'from-emerald-500/15 to-emerald-500/0 ring-emerald-500/30',
  blue: 'from-sky-500/15 to-sky-500/0 ring-sky-500/30',
  red: 'from-rose-500/15 to-rose-500/0 ring-rose-500/30',
  amber: 'from-amber-500/15 to-amber-500/0 ring-amber-500/30',
  purple: 'from-violet-500/15 to-violet-500/0 ring-violet-500/30',
  sky: 'from-sky-500/15 to-sky-500/0 ring-sky-500/30',
  orange: 'from-orange-500/15 to-orange-500/0 ring-orange-500/30',
  rose: 'from-rose-500/15 to-rose-500/0 ring-rose-500/30',
}

const ICON_BG: Record<Tone, string> = {
  green: 'bg-emerald-500/15 text-emerald-400',
  blue: 'bg-sky-500/15 text-sky-400',
  red: 'bg-rose-500/15 text-rose-400',
  amber: 'bg-amber-500/15 text-amber-400',
  purple: 'bg-violet-500/15 text-violet-400',
  sky: 'bg-sky-500/15 text-sky-400',
  orange: 'bg-orange-500/15 text-orange-400',
  rose: 'bg-rose-500/15 text-rose-400',
}

function Card({ label, value, hint, icon, tone }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--color-border)] bg-gradient-to-br p-4',
        'ring-1 ring-inset',
        TONES[tone],
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[11px] text-[var(--color-muted)] truncate">{label}</div>
          <div className="mt-1.5 text-2xl font-semibold tracking-tight text-white tabular-nums">
            {value}
          </div>
          {hint && (
            <div className="mt-1 text-[10px] text-[var(--color-muted)] truncate">{hint}</div>
          )}
        </div>
        <div className={cn('rounded-lg p-1.5 shrink-0', ICON_BG[tone])}>{icon}</div>
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

  const q = countQualificacao(rows)
  const taxaQuali = total ? q.quali / total : 0

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8">
      <Card
        label="Total de Leads"
        value={fmtNumber(total)}
        icon={<Users size={16} />}
        tone="green"
      />
      <Card
        label="Leads Únicos"
        value={fmtNumber(unique)}
        icon={<Fingerprint size={16} />}
        tone="purple"
      />
      <Card
        label="Novos Leads"
        value={fmtNumber(novos)}
        icon={<UserPlus size={16} />}
        tone="amber"
      />
      <Card
        label="Reentradas"
        value={fmtNumber(reentradas)}
        icon={<RotateCcw size={16} />}
        tone="red"
      />
      <Card
        label="Taxa de Cadastro"
        value={fmtPercent(taxa)}
        icon={<TrendingUp size={16} />}
        tone="blue"
      />
      <Card
        label="Qualificados"
        hint={`${fmtPercent(taxaQuali)} dos leads`}
        value={fmtNumber(q.quali)}
        icon={<CheckCircle2 size={16} />}
        tone="green"
      />
      <Card
        label="Semi-quali"
        value={fmtNumber(q.semi)}
        icon={<CircleDot size={16} />}
        tone="orange"
      />
      <Card
        label="Desqualificados"
        value={fmtNumber(q.desquali)}
        icon={<XCircle size={16} />}
        tone="rose"
      />
    </div>
  )
}
