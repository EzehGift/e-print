import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Browse by Author' }

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default async function BrowseCreatorsPage({
  searchParams,
}: {
  searchParams: { letter?: string }
}) {
  const letter = searchParams.letter ?? 'A'

  const authors = await prisma.author.findMany({
    where: {
      lastName: { startsWith: letter, mode: 'insensitive' },
      items: { some: { item: { status: 'PUBLISHED' } } },
    },
    include: { _count: { select: { items: { where: { item: { status: 'PUBLISHED' } } } } } },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  })

  return (
    <div className="max-w-content section-pad">

      <nav aria-label="Browse navigation" className="browse-nav">
        <Link href="/browse/divisions" className="browse-nav-link">By Faculty</Link>
        <Link href="/browse/year"      className="browse-nav-link">By Year</Link>
        <Link href="/browse/subjects"  className="browse-nav-link">By Subject</Link>
        <Link href="/browse/creators"  className="browse-nav-link browse-nav-link-active">By Author</Link>
      </nav>

      <h1 className="text-3xl mb-6">
        Browse by <span className="accent">author</span>
      </h1>

      {/* Letter index */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {LETTERS.map(l => (
          <Link
            key={l}
            href={`/browse/creators?letter=${l}`}
            className={`w-9 h-9 inline-flex items-center justify-center text-sm font-semibold rounded-lg border transition-colors hover:no-underline ${
              l === letter
                ? 'bg-navy text-white border-navy'
                : 'border-border text-slate-600 hover:border-slate-300 hover:text-ink bg-white'
            }`}
            aria-label={`Authors starting with ${l}`}
          >
            {l}
          </Link>
        ))}
      </div>

      {authors.length === 0 ? (
        <div className="card py-8 text-center">
          <p className="text-muted">No authors found starting with &ldquo;{letter}&rdquo;.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden divide-y divide-border">
          {authors.map(a => (
            <div key={a.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors">
              <Link
                href={`/search?authorId=${a.id}`}
                className="text-accent hover:underline font-medium text-sm"
              >
                {a.lastName}, {a.firstName}
              </Link>
              <span className="text-sm text-muted tabular-nums">
                {a._count.items} item{a._count.items !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
