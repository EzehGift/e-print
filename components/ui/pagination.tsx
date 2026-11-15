import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  buildHref: (page: number) => string
}

export function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | null)[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push(null)
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push(null)
    pages.push(totalPages)
  }

  const linkBase = 'inline-flex items-center justify-center h-9 min-w-[2.25rem] px-3 text-sm rounded-lg border transition-colors hover:no-underline'

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-10">
      {page > 1 && (
        <Link
          href={buildHref(page - 1)}
          className={cn(linkBase, 'border-border text-slate-600 hover:bg-slate-50 hover:border-slate-300 px-4')}
          aria-label="Previous page"
        >
          ← Prev
        </Link>
      )}
      {pages.map((p, i) =>
        p === null ? (
          <span key={`ellipsis-${i}`} className="px-1.5 text-slate-400 text-sm">…</span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={cn(
              linkBase,
              p === page
                ? 'bg-navy text-white border-navy font-semibold'
                : 'border-border text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            )}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      )}
      {page < totalPages && (
        <Link
          href={buildHref(page + 1)}
          className={cn(linkBase, 'border-border text-slate-600 hover:bg-slate-50 hover:border-slate-300 px-4')}
          aria-label="Next page"
        >
          Next →
        </Link>
      )}
    </nav>
  )
}
