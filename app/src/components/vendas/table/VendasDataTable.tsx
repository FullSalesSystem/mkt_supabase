import { useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  Download,
  Minus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react'
import type { Venda } from '../../../types'
import {
  VENDA_COLUMNS,
  initialVendasTableState,
  type VendaColumnFilterValue,
  type VendaColumnKey,
  type VendasTableState,
} from './types'
import { applyVendasTable, distinctVendaColumnValues } from './logic'
import { VendaColumnFilter } from './VendaColumnFilter'
import { VendaColumnsMenu } from './VendaColumnsMenu'
import { Pagination } from '../../table/Pagination'
import { ConfirmDelete } from '../../table/ConfirmDelete'
import { downloadVendasCSV, toVendasCSV } from '../../../lib/vendas-csv'
import { cn, fmtMoney, fmtNumber } from '../../../lib/utils'
import { useDeleteVendas } from '../../../hooks/useDeleteVendas'
import { categorizeVendaStatus, toNumber } from '../../../lib/vendas-aggregations'

type Props = {
  rows: Venda[]
}

export function VendasDataTable({ rows }: Props) {
  const [state, setState] = useState<VendasTableState>(initialVendasTableState)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const deleteMutation = useDeleteVendas()

  const filtered = useMemo(
    () => applyVendasTable(rows, state.search, state.filters, state.sort),
    [rows, state.search, state.filters, state.sort],
  )

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / state.pageSize))
  const safePage = Math.min(state.page, totalPages)
  const slice = useMemo(
    () =>
      filtered.slice(
        (safePage - 1) * state.pageSize,
        safePage * state.pageSize,
      ),
    [filtered, safePage, state.pageSize],
  )

  const distinctCache = useMemo(() => {
    const cache: Partial<Record<VendaColumnKey, string[]>> = {}
    for (const c of VENDA_COLUMNS) {
      if (c.filterKind === 'multi')
        cache[c.key] = distinctVendaColumnValues(rows, c.key)
    }
    return cache
  }, [rows])

  const visibleCols = useMemo(
    () => VENDA_COLUMNS.filter((c) => state.visibleColumns.includes(c.key)),
    [state.visibleColumns],
  )

  const setSort = (col: VendaColumnKey) => {
    setState((s) => {
      if (!s.sort || s.sort.col !== col)
        return { ...s, sort: { col, dir: 'asc' } }
      if (s.sort.dir === 'asc') return { ...s, sort: { col, dir: 'desc' } }
      return { ...s, sort: null }
    })
  }

  const setFilter = (
    col: VendaColumnKey,
    v: VendaColumnFilterValue | undefined,
  ) =>
    setState((s) => {
      const next = { ...s.filters }
      if (v === undefined) delete next[col]
      else next[col] = v
      return { ...s, filters: next, page: 1 }
    })

  const filterCount = Object.keys(state.filters).length + (state.search ? 1 : 0)

  const exportCsv = () => {
    const csv = toVendasCSV(filtered, state.visibleColumns)
    const stamp = new Date().toISOString().slice(0, 10)
    downloadVendasCSV(`vendas-${stamp}.csv`, csv)
  }

  const selectedCount = state.selectedIds.size

  const toggleRow = (id: string) =>
    setState((s) => {
      const next = new Set(s.selectedIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { ...s, selectedIds: next }
    })

  const pageIds = slice.map((r) => String(r.id))
  const pageSelectedCount = pageIds.filter((id) => state.selectedIds.has(id)).length
  const pageAllSelected = pageIds.length > 0 && pageSelectedCount === pageIds.length
  const pageSomeSelected = pageSelectedCount > 0 && !pageAllSelected

  const togglePage = () =>
    setState((s) => {
      const next = new Set(s.selectedIds)
      if (pageAllSelected) {
        for (const id of pageIds) next.delete(id)
      } else {
        for (const id of pageIds) next.add(id)
      }
      return { ...s, selectedIds: next }
    })

  const clearSelection = () =>
    setState((s) => ({ ...s, selectedIds: new Set() }))

  const handleConfirmDelete = () => {
    const ids = Array.from(state.selectedIds)
    deleteMutation.mutate(ids, {
      onSuccess: () => {
        setState((s) => ({ ...s, selectedIds: new Set() }))
        setConfirmOpen(false)
      },
    })
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] p-3">
        <div className="relative flex-1 min-w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            type="text"
            placeholder="Buscar em comprador, e-mail, telefone, produto..."
            value={state.search}
            onChange={(e) =>
              setState((s) => ({ ...s, search: e.target.value, page: 1 }))
            }
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] py-2 pl-9 pr-3 text-sm outline-none focus:border-white/20"
          />
        </div>

        <div className="text-xs text-[var(--color-muted)] tabular-nums">
          {fmtNumber(total)} de {fmtNumber(rows.length)} linhas
          {filterCount > 0 && (
            <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300">
              {filterCount} {filterCount === 1 ? 'filtro' : 'filtros'}
            </span>
          )}
        </div>

        <VendaColumnsMenu
          visible={state.visibleColumns}
          onChange={(v) => setState((s) => ({ ...s, visibleColumns: v }))}
        />

        <button
          onClick={exportCsv}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3 py-1.5 text-xs hover:border-white/20"
        >
          <Download size={14} />
          Exportar CSV
        </button>

        <button
          onClick={() => setState(initialVendasTableState)}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3 py-1.5 text-xs hover:border-white/20"
          disabled={
            filterCount === 0 &&
            state.sort?.col === initialVendasTableState.sort?.col &&
            state.sort?.dir === initialVendasTableState.sort?.dir &&
            state.selectedIds.size === 0
          }
        >
          <RotateCcw size={12} />
          Resetar
        </button>
      </div>

      {selectedCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-500/20 bg-rose-500/5 px-4 py-2">
          <div className="text-xs text-rose-200">
            <span className="font-medium tabular-nums">
              {fmtNumber(selectedCount)}
            </span>{' '}
            {selectedCount === 1 ? 'venda selecionada' : 'vendas selecionadas'}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearSelection}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3 py-1.5 text-xs text-white/80 hover:border-white/20"
            >
              Limpar seleção
            </button>
            <button
              onClick={() => {
                deleteMutation.reset()
                setConfirmOpen(true)
              }}
              className="flex items-center gap-1.5 rounded-lg bg-rose-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-500"
            >
              <Trash2 size={12} />
              Excluir selecionadas
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-[var(--color-panel)]">
            <tr className="border-b border-[var(--color-border)]">
              <th className="w-10 px-3 py-2 text-left">
                <SelectionCheckbox
                  checked={pageAllSelected}
                  indeterminate={pageSomeSelected}
                  onChange={togglePage}
                  ariaLabel="Selecionar todas as linhas da página"
                />
              </th>
              {visibleCols.map((col) => {
                const sorted = state.sort?.col === col.key
                const dir = sorted ? state.sort?.dir : null
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={cn(
                      'group px-3 py-2 text-left font-medium text-white/80 select-none',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center',
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-1',
                        col.align === 'right' && 'justify-end',
                        col.align === 'center' && 'justify-center',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSort(col.key)}
                        className="flex items-center gap-1 hover:text-white"
                        title="Ordenar"
                      >
                        <span>{col.label}</span>
                        {dir === 'asc' && <ArrowUp size={12} />}
                        {dir === 'desc' && <ArrowDown size={12} />}
                        {!dir && (
                          <ArrowUpDown
                            size={12}
                            className="text-[var(--color-muted)] opacity-0 group-hover:opacity-100"
                          />
                        )}
                      </button>
                      <VendaColumnFilter
                        col={col}
                        options={distinctCache[col.key] ?? []}
                        value={state.filters[col.key]}
                        onChange={(v) => setFilter(col.key, v)}
                      />
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 && (
              <tr>
                <td
                  colSpan={visibleCols.length + 1}
                  className="px-3 py-12 text-center text-sm text-[var(--color-muted)]"
                >
                  Nenhuma linha corresponde aos filtros.
                </td>
              </tr>
            )}
            {slice.map((row, i) => {
              const id = String(row.id)
              const checked = state.selectedIds.has(id)
              return (
                <tr
                  key={id + '-' + i}
                  className={cn(
                    'border-b border-[var(--color-border)]/50 hover:bg-white/[0.02]',
                    checked && 'bg-rose-500/5',
                  )}
                >
                  <td className="w-10 px-3 py-2">
                    <SelectionCheckbox
                      checked={checked}
                      onChange={() => toggleRow(id)}
                      ariaLabel="Selecionar linha"
                    />
                  </td>
                  {visibleCols.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-3 py-2 text-white/80',
                        col.align === 'right' && 'text-right tabular-nums',
                        col.align === 'center' && 'text-center',
                      )}
                    >
                      <CellValue
                        value={row[col.key]}
                        colKey={col.key}
                        format={col.format}
                      />
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        page={safePage}
        pageSize={state.pageSize}
        total={total}
        onPage={(p) => setState((s) => ({ ...s, page: p }))}
        onPageSize={(ps) => setState((s) => ({ ...s, pageSize: ps, page: 1 }))}
      />

      <ConfirmDelete
        count={selectedCount}
        open={confirmOpen}
        onClose={() => !deleteMutation.isPending && setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        error={
          deleteMutation.isError
            ? (deleteMutation.error as Error)?.message ?? 'Falha ao excluir.'
            : null
        }
      />
    </div>
  )
}

function SelectionCheckbox({
  checked,
  indeterminate,
  onChange,
  ariaLabel,
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={cn(
        'flex h-4 w-4 items-center justify-center rounded border transition-colors',
        checked || indeterminate
          ? 'border-emerald-500 bg-emerald-500 text-white'
          : 'border-[var(--color-border)] bg-[var(--color-panel-2)] hover:border-white/30',
      )}
    >
      {indeterminate ? (
        <Minus size={10} strokeWidth={3} />
      ) : checked ? (
        <Check size={10} strokeWidth={3} />
      ) : null}
    </button>
  )
}

function CellValue({
  value,
  colKey,
  format,
}: {
  value: unknown
  colKey: VendaColumnKey
  format?: 'money' | 'number'
}) {
  if (value == null || value === '') {
    return <span className="text-[var(--color-muted)]">—</span>
  }

  if (format === 'money') {
    return <span>{fmtMoney(toNumber(value))}</span>
  }
  if (format === 'number') {
    return <span>{fmtNumber(toNumber(value))}</span>
  }

  let display: string
  if (Array.isArray(value)) display = value.join(', ')
  else display = String(value)

  if (colKey === 'status') {
    const cat = categorizeVendaStatus(display)
    const tone =
      cat === 'aprovada'
        ? 'bg-emerald-500/15 text-emerald-300'
        : cat === 'pendente'
          ? 'bg-amber-500/15 text-amber-300'
          : cat === 'reembolso'
            ? 'bg-rose-500/15 text-rose-300'
            : cat === 'cancelada'
              ? 'bg-zinc-500/15 text-zinc-300'
              : 'bg-violet-500/15 text-violet-300'
    return (
      <span
        className={cn(
          'inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium',
          tone,
        )}
      >
        {display}
      </span>
    )
  }

  return (
    <span className="block truncate" title={display}>
      {display}
    </span>
  )
}
