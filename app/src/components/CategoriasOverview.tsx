import { useMemo, useState } from 'react'
import { Layers, Target, Wallet } from 'lucide-react'
import type { Lead } from '../types'
import {
  CATEGORIA_LABEL,
  type Categoria,
} from '../lib/categorias'
import { statsByCategoria, type CategoriaStats } from '../lib/aggregations'
import { cpl, useInvestimento } from '../lib/investimento'
import { cn, fmtMoney, fmtNumber, fmtPercent } from '../lib/utils'
import { Panel, PanelTitle } from './ui/Panel'

const CATEGORIA_THEME: Record<Categoria, {
  ring: string
  accent: string
  bar: string
  dot: string
}> = {
  aplicacao: {
    ring: 'ring-sky-500/30',
    accent: 'text-sky-300',
    bar: 'bg-sky-500/70',
    dot: 'bg-sky-400',
  },
  aquisicao: {
    ring: 'ring-emerald-500/30',
    accent: 'text-emerald-300',
    bar: 'bg-emerald-500/70',
    dot: 'bg-emerald-400',
  },
  outro: {
    ring: 'ring-zinc-500/30',
    accent: 'text-zinc-300',
    bar: 'bg-zinc-500/70',
    dot: 'bg-zinc-400',
  },
}

function Chip({
  label,
  value,
  tone = 'neutral',
}: {
  label: string
  value: string
  tone?: 'positive' | 'warn' | 'negative' | 'neutral'
}) {
  const tones: Record<string, string> = {
    positive: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    warn: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
    negative: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
    neutral: 'border-[var(--color-border)] bg-[var(--color-panel-2)] text-white/80',
  }
  return (
    <div className={cn('rounded-xl border px-3 py-2', tones[tone])}>
      <div className="text-[10px] uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-base font-semibold tabular-nums">{value}</div>
    </div>
  )
}

function CategoriaCard({
  stats,
  investimento,
  onInvestimentoChange,
}: {
  stats: CategoriaStats
  investimento: number
  onInvestimentoChange: (v: number) => void
}) {
  const theme = CATEGORIA_THEME[stats.categoria]
  const maxFunil = stats.funis[0]?.total ?? 0
  const cplValor = cpl(investimento, stats.total)
  const cplQuali = cpl(investimento, stats.qualificados)
  const taxaQuali = stats.total ? stats.qualificados / stats.total : 0

  const [draft, setDraft] = useState<string>(investimento ? String(investimento) : '')

  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5 ring-1 ring-inset',
        theme.ring,
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className={cn('h-2.5 w-2.5 rounded-full', theme.dot)} />
          <h3 className={cn('text-sm font-semibold', theme.accent)}>
            {CATEGORIA_LABEL[stats.categoria]}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
            Total
          </div>
          <div className="text-3xl font-bold tracking-tight text-white tabular-nums">
            {fmtNumber(stats.total)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <Chip label="Qualificados" value={fmtNumber(stats.qualificados)} tone="positive" />
        <Chip label="Semi-quali" value={fmtNumber(stats.semi)} tone="warn" />
        <Chip label="Desquali" value={fmtNumber(stats.desquali)} tone="negative" />
      </div>

      <div className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-2)] p-3">
        <label className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-[var(--color-muted)] mb-1.5">
          <Wallet size={12} /> Investimento (R$)
        </label>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0,00"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => onInvestimentoChange(Number(draft.replace(',', '.')) || 0)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
          }}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 text-base font-semibold tabular-nums text-white outline-none focus:border-white/30"
        />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-[var(--color-panel)] p-2">
            <div className="text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
              CPL
            </div>
            <div className="text-sm font-semibold tabular-nums text-white">
              {cplValor != null ? fmtMoney(cplValor) : '—'}
            </div>
          </div>
          <div className="rounded-lg bg-[var(--color-panel)] p-2">
            <div className="text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
              CPL Qualificado
            </div>
            <div className="text-sm font-semibold tabular-nums text-white">
              {cplQuali != null ? fmtMoney(cplQuali) : '—'}
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--color-muted)]">
          <span className="flex items-center gap-1">
            <Target size={11} /> Taxa de qualificação
          </span>
          <span className={cn('font-medium tabular-nums', theme.accent)}>
            {fmtPercent(taxaQuali)}
          </span>
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wide text-[var(--color-muted)] mb-2">
          Funis ({stats.funis.length})
        </div>
        {stats.funis.length === 0 ? (
          <div className="text-xs text-[var(--color-muted)]">Nenhum lead nesta categoria no período.</div>
        ) : (
          <ul className="space-y-1.5">
            {stats.funis.map((f) => {
              const pct = maxFunil ? (f.total / maxFunil) * 100 : 0
              return (
                <li key={f.funil} className="text-xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="truncate text-white/85" title={f.funil}>
                      {f.funil}
                    </span>
                    <span className="tabular-nums text-white/90 font-medium">
                      {fmtNumber(f.total)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[var(--color-panel-2)] overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', theme.bar)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export function CategoriasOverview({ rows }: { rows: Lead[] }) {
  const stats = useMemo(() => statsByCategoria(rows), [rows])
  const [investimento, setInvestimento] = useInvestimento()

  return (
    <Panel>
      <PanelTitle icon={<Layers size={16} className="text-[var(--color-muted)]" />}>
        Visão por Categoria
      </PanelTitle>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CategoriaCard
          stats={stats.aplicacao}
          investimento={investimento.aplicacao}
          onInvestimentoChange={(v) => setInvestimento('aplicacao', v)}
        />
        <CategoriaCard
          stats={stats.aquisicao}
          investimento={investimento.aquisicao}
          onInvestimentoChange={(v) => setInvestimento('aquisicao', v)}
        />
      </div>
      {stats.outro.total > 0 && (
        <div className="mt-4">
          <CategoriaCard
            stats={stats.outro}
            investimento={investimento.outro}
            onInvestimentoChange={(v) => setInvestimento('outro', v)}
          />
          <p className="mt-2 text-[11px] text-[var(--color-muted)]">
            Funis sem categoria mapeada. Edite{' '}
            <code className="rounded bg-[var(--color-panel-2)] px-1">src/lib/categorias.ts</code>{' '}
            para adicioná-los a Aplicação ou Aquisição.
          </p>
        </div>
      )}
    </Panel>
  )
}
