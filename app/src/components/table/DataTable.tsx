import { useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  RotateCcw,
  Search,
} from 'lucide-react'
import type { Lead } from '../../types'
import {
  COLUMNS,
  initialTableState,
  type ColumnFilterValue,
  type ColumnKey,
  type TableState,
} from './types'
import { applyTable, distinctColumnValues } from './logic'
import { ColumnFilter } from './ColumnFilter'
import { ColumnsMenu } from './ColumnsMenu'
import { Pagination } from './Pagination'
import { COLUMN_LABELS, downloadCSV, toCSV } from '../../lib/csv'
import { cn, fmtNumber } from '../../lib/utils'

type Props = {
  rows: Lead[]
}

export function DataTable({ rows }: Props) {
  const [state, setState] = useState<TableState>(initialTableState)

  const filtered = useMemo(
    () => applyTable(rows, state.search, state.filters, state.sort),
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
    const cache: Partial<Record<ColumnKey, string[]>> = {}
    for (const c of COLUMNS) {
      if (c.filterKind === 'multi') cache[c.key] = distinctColumnValues(rows, c.key)
    }
    return cache
  }, [rows])

  const visibleCols = useMemo(
    () => COLUMNS.filter((c) => state.visibleColumns.includes(c.key)),
    [state.visibleColumns],
  )

  const setSort = (col: ColumnKey) => {
    setState((s) => {
      if (!s.sort || s.sort.col !== col) return { ...s, sort: { col, dir: 'asc' } }
      if (s.sort.dir === 'asc') return { ...s, sort: { col, dir: 'desc' } }
      return { ...s, sort: null }
    })
  }

  const setFilter = (col: ColumnKey, v: ColumnFilterValue | undefined) =>
    setState((s) => {
      const next = { ...s.filters }
      if (v === undefined) delete next[col]
      else next[col] = v
      return { ...s, filters: next, page: 1 }
    })

  const filterCount = Object.keys(state.filters).length + (state.search ? 1 : 0)

  const exportCsv = () => {
    const csv = toCSV(filtered, state.visibleColumns)
    const stamp = new Date().toISOString().slice(0, 10)
    downloadCSV(`leads-${stamp}.csv`, csv)
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] p-3">
        <div className="relative flex-1 min-w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            type="text"
            placeholder="Buscar em nome, e-mail, telefone, segmento..."
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

        <ColumnsMenu
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
          onClick={() => setState(initialTableState)}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3 py-1.5 text-xs hover:border-white/20"
          disabled={
            filterCount === 0 &&
            state.sort?.col === initialTableState.sort?.col &&
            state.sort?.dir === initialTableState.sort?.dir
          }
        >
          <RotateCcw size={12} />
          Resetar
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-[var(--color-panel)]">
            <tr className="border-b border-[var(--color-border)]">
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
                    <div className="flex items-center gap-1">
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
                      <ColumnFilter
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
                  colSpan={visibleCols.length}
                  className="px-3 py-12 text-center text-sm text-[var(--color-muted)]"
                >
                  Nenhuma linha corresponde aos filtros.
                </td>
              </tr>
            )}
            {slice.map((row, i) => (
              <tr
                key={String(row.id) + '-' + i}
                className="border-b border-[var(--color-border)]/50 hover:bg-white/[0.02]"
              >
                {visibleCols.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-3 py-2 text-white/80',
                      col.align === 'right' && 'text-right tabular-nums',
                      col.align === 'center' && 'text-center',
                    )}
                  >
                    <CellValue value={row[col.key]} colKey={col.key} />
                  </td>
                ))}
              </tr>
            ))}
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
    </div>
  )
}

function CellValue({
  value,
  colKey,
}: {
  value: unknown
  colKey: ColumnKey
}) {
  if (value == null || value === '') {
    return <span className="text-[var(--color-muted)]">—</span>
  }
  let display: string
  if (Array.isArray(value)) display = value.join(', ')
  else display = String(value)

  if (colKey === 'status_entrada') {
    const s = display.toLowerCase()
    const tone =
      s.includes('reentrada')
        ? 'bg-sky-500/15 text-sky-300'
        : s.includes('parou')
          ? 'bg-rose-500/15 text-rose-300'
          : 'bg-emerald-500/15 text-emerald-300'
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

export { COLUMN_LABELS }
