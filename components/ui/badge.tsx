import { ItemType } from '@prisma/client'
import { cn } from '@/lib/utils'
import { ITEM_TYPE_LABELS, ITEM_TYPE_COLORS } from '@/lib/utils'

interface BadgeProps {
  type: ItemType
  className?: string
}

export function ItemTypeBadge({ type, className }: BadgeProps) {
  const colors = ITEM_TYPE_COLORS[type]
  const label = ITEM_TYPE_LABELS[type]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide',
        colors.bg,
        colors.text,
        className
      )}
    >
      {label}
    </span>
  )
}

interface StatusBadgeProps {
  status: string
  className?: string
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT:        'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  UNDER_REVIEW: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  PUBLISHED:    'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  REJECTED:     'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT:        'Draft',
  UNDER_REVIEW: 'Under Review',
  PUBLISHED:    'Published',
  REJECTED:     'Rejected',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide',
        STATUS_COLORS[status] ?? 'bg-slate-100 text-slate-600',
        className
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
