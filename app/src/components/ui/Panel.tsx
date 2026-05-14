import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Panel({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function PanelTitle({
  icon,
  children,
  tooltip,
}: {
  icon?: ReactNode
  children: ReactNode
  tooltip?: string
}) {
  return (
    <div
      title={tooltip}
      className={cn(
        'flex items-center gap-2 text-sm font-medium text-white/90 mb-4',
        tooltip && 'cursor-help',
      )}
    >
      {icon}
      <span>{children}</span>
    </div>
  )
}
