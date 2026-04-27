import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { fmtNumber } from '../../lib/utils'

type Props = {
  page: number
  pageSize: number
  total: number
  onPage: (p: number) => void
  onPageSize: (s: number) => void
}

const PAGE_SIZES = [25, 50, 100, 200, 500]

export function Pagination({ page, pageSize, total, onPage, onPageSize }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(total, page * pageSize)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2">
      <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
        <span>Linhas:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-panel-2)] px-2 py-1 text-xs outline-none focus:border-white/20"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="ml-3 tabular-nums">
          {fmtNumber(start)}–{fmtNumber(end)} de {fmtNumber(total)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <PageBtn disabled={page <= 1} onClick={() => onPage(1)}>
          <ChevronsLeft size={14} />
        </PageBtn>
        <PageBtn disabled={page <= 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft size={14} />
        </PageBtn>
        <span className="px-2 text-xs tabular-nums text-white/80">
          {page} / {totalPages}
        </span>
        <PageBtn
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
        >
          <ChevronRight size={14} />
        </PageBtn>
        <PageBtn
          disabled={page >= totalPages}
          onClick={() => onPage(totalPages)}
        >
          <ChevronsRight size={14} />
        </PageBtn>
      </div>
    </div>
  )
}

function PageBtn({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-panel-2)] text-white/80 hover:border-white/20 disabled:opacity-30 disabled:hover:border-[var(--color-border)]"
    >
      {children}
    </button>
  )
}
