import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Browse by Year' }

export default async function BrowseYearPage() {
  const years = await prisma.item.groupBy({
    by: ['year'],
    where: { status: 'PUBLISHED' },
    _count: { _all: true },
    orderBy: { year: 'desc' },
  })

  const max = Math.max(...years.map(y => y._count._all), 1)

  return (
    <div className="max-w-content section-pad">

      <nav aria-label="Browse navigation" className="browse-nav">
        <Link href="/browse/divisions" className="browse-nav-link">By Faculty</Link>
        <Link href="/browse/year"      className="browse-nav-link browse-nav-link-active">By Year</Link>
        <Link href="/browse/subjects"  className="browse-nav-link">By Subject</Link>
        <Link href="/browse/creators"  className="browse-nav-link">By Author</Link>
      </nav>

      <h1 className="text-3xl mb-8">
        Browse by <span className="accent">year</span>
      </h1>

      <div className="space-y-3 max-w-lg">
        {years.map(y => (
          <Link
            key={y.year}
            href={`/search?yearFrom=${y.year}&yearTo=${y.year}`}
            className="flex items-center gap-4 group hover:no-underline"
            aria-label={`Year ${y.year}: ${y._count._all} items`}
          >
            <span className="w-12 text-sm font-mono font-semibold text-ink tabular-nums">
              {y.year}
            </span>
            <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-accent rounded-full group-hover:bg-blue-700 transition-colors"
                style={{ width: `${(y._count._all / max) * 100}%` }}
              />
            </div>
            <span className="text-sm text-muted w-16 text-right tabular-nums">
              {y._count._all} item{y._count._all !== 1 ? 's' : ''}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
