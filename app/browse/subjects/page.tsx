import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Browse by Subject' }

export default async function BrowseSubjectsPage() {
  const subjects = await prisma.subject.findMany({
    include: { _count: { select: { items: { where: { item: { status: 'PUBLISHED' } } } } } },
    orderBy: { name: 'asc' },
  })

  const withItems = subjects.filter(s => s._count.items > 0)

  return (
    <div className="max-w-content section-pad">

      <nav aria-label="Browse navigation" className="browse-nav">
        <Link href="/browse/divisions" className="browse-nav-link">By Faculty</Link>
        <Link href="/browse/year"      className="browse-nav-link">By Year</Link>
        <Link href="/browse/subjects"  className="browse-nav-link browse-nav-link-active">By Subject</Link>
        <Link href="/browse/creators"  className="browse-nav-link">By Author</Link>
      </nav>

      <h1 className="text-3xl mb-8">
        Browse by <span className="accent">subject</span>
      </h1>

      {withItems.length === 0 ? (
        <p className="text-muted">No subjects with published items yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {withItems.map(s => (
            <Link
              key={s.id}
              href={`/search?subjectId=${s.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-white text-sm hover:border-accent hover:text-accent hover:no-underline transition-colors shadow-sm"
            >
              <span className="font-medium">{s.name}</span>
              <span className="text-xs text-muted tabular-nums">({s._count.items})</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
