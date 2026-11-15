import Link from 'next/link'
import { ItemTypeBadge } from '@/components/ui/badge'
import { ItemType } from '@prisma/client'
import { truncate } from '@/lib/utils'

export interface ItemCardProps {
  id: string
  title: string
  abstract: string
  type: ItemType
  year: number
  uri: string
  division?: { name: string } | null
  authors: { author: { firstName: string; lastName: string }; order: number }[]
}

export function ItemCard({ id, title, abstract, type, year, division, authors }: ItemCardProps) {
  const sortedAuthors = [...authors].sort((a, b) => a.order - b.order)
  const authorStr = sortedAuthors
    .map(a => `${a.author.firstName} ${a.author.lastName}`)
    .join('; ')

  return (
    <article className="card hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <ItemTypeBadge type={type} />
        <span className="text-slate-300 select-none">·</span>
        <span className="text-xs text-muted tabular-nums">{year}</span>
        {division && (
          <>
            <span className="text-slate-300 select-none">·</span>
            <span className="text-xs text-muted truncate max-w-[220px]">{division.name}</span>
          </>
        )}
      </div>
      <h3 className="font-semibold text-[15px] leading-snug mb-1.5">
        <Link
          href={`/items/${id}`}
          className="text-ink dark:text-slate-100 hover:text-accent dark:hover:text-blue-400 hover:no-underline transition-colors"
        >
          {title}
        </Link>
      </h3>
      {authorStr && (
        <p className="text-sm text-muted mb-2.5">{authorStr}</p>
      )}
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {truncate(abstract, 220)}
      </p>
    </article>
  )
}
