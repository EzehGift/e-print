import Link from 'next/link'
import { searchItems } from '@/lib/search'
import { ItemCard } from '@/components/items/item-card'
import { Pagination } from '@/components/ui/pagination'
import { prisma } from '@/lib/prisma'
import { ItemType } from '@prisma/client'
import { ITEM_TYPE_LABELS } from '@/lib/utils'
import { SearchAutocomplete } from '@/components/ui/search-autocomplete'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Search' }

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest',    label: 'Newest first' },
  { value: 'oldest',    label: 'Oldest first' },
  { value: 'title',     label: 'Title A–Z' },
]

interface SearchPageProps {
  searchParams: {
    q?: string
    type?: string
    yearFrom?: string
    yearTo?: string
    divisionId?: string
    subjectId?: string
    authorId?: string
    page?: string
    sort?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const {
    q,
    type,
    yearFrom,
    yearTo,
    divisionId,
    subjectId,
    authorId,
    sort = q ? 'relevance' : 'newest',
    page = '1',
  } = searchParams

  const pageNum = parseInt(page)
  const typeArr = type ? (type.split(',').filter(Boolean) as ItemType[]) : undefined

  const [result, faculties, subjects] = await Promise.all([
    searchItems({
      q,
      type: typeArr,
      yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
      yearTo:   yearTo   ? parseInt(yearTo)   : undefined,
      divisionId,
      subjectId,
      authorId,
      page: pageNum,
      limit: 20,
      sort: sort as 'relevance' | 'newest' | 'oldest' | 'title',
    }),
    prisma.division.findMany({ where: { level: 'FACULTY' }, orderBy: { name: 'asc' } }),
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
  ])

  function buildHref(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams()
    const all = { q, type, yearFrom, yearTo, divisionId, subjectId, authorId, sort, page, ...overrides }
    for (const [k, v] of Object.entries(all)) {
      if (v) params.set(k, v)
    }
    return `/search?${params.toString()}`
  }

  const activeTypes = type ? type.split(',').filter(Boolean) : []
  const hasFilters = !!(type || yearFrom || yearTo || divisionId || subjectId)

  return (
    <div className="max-w-content section-pad">
      <h1 className="text-2xl mb-7">
        {q ? (
          <>Results for <span className="accent">&ldquo;{q}&rdquo;</span></>
        ) : (
          <>Browse all <span className="accent">items</span></>
        )}
      </h1>

      <div className="flex gap-8 items-start">

        {/* ── Sidebar ─────────────────────────────── */}
        <aside className="w-56 shrink-0 hidden md:block">
          <form method="GET" action="/search" className="space-y-6">
            {q && <input type="hidden" name="q" value={q} />}

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted mb-3">
                Sort by
              </h3>
              <div className="space-y-1.5">
                {SORT_OPTIONS.map(o => (
                  <label key={o.value} className="flex items-center gap-2.5 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value={o.value}
                      defaultChecked={sort === o.value}
                      className="accent-accent"
                    />
                    <span className="text-slate-700 dark:text-slate-300">{o.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted mb-3">
                Item type
              </h3>
              <div className="space-y-1.5">
                {Object.entries(ITEM_TYPE_LABELS).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2.5 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      name="type"
                      value={value}
                      defaultChecked={activeTypes.includes(value)}
                      className="accent-accent rounded"
                    />
                    <span className="text-slate-700 dark:text-slate-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted mb-3">
                Year range
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="yearFrom"
                  placeholder="From"
                  defaultValue={yearFrom}
                  className="input text-xs"
                  min={1900}
                  max={2030}
                />
                <input
                  type="number"
                  name="yearTo"
                  placeholder="To"
                  defaultValue={yearTo}
                  className="input text-xs"
                  min={1900}
                  max={2030}
                />
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted mb-3">
                Faculty
              </h3>
              <select name="divisionId" className="input text-sm" defaultValue={divisionId ?? ''}>
                <option value="">All faculties</option>
                {faculties.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted mb-3">
                Subject
              </h3>
              <select name="subjectId" className="input text-sm" defaultValue={subjectId ?? ''}>
                <option value="">All subjects</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <button type="submit" className="btn-primary w-full text-sm py-2">
                Apply filters
              </button>
              {hasFilters && (
                <Link
                  href={q ? `/search?q=${q}` : '/search'}
                  className="block text-center text-sm text-accent hover:underline"
                >
                  Clear filters
                </Link>
              )}
            </div>
          </form>
        </aside>

        {/* ── Results ─────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <SearchAutocomplete defaultValue={q ?? ''} wrapperClassName="mb-7" />
          <p className="text-sm text-muted mb-5">
            {result.total === 0
              ? 'No items found'
              : `${result.total.toLocaleString()} item${result.total !== 1 ? 's' : ''} found`}
          </p>

          {result.total === 0 ? (
            <div className="card text-center py-12">
              <p className="font-semibold text-lg mb-2">No items found</p>
              <p className="text-muted text-sm mb-5">
                Try broadening your search or removing filters.
              </p>
              <Link href="/browse" className="btn-ghost text-sm">
                Browse the collection
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {result.items.map((item: unknown) => {
                const i = item as {
                  id: string; title: string; abstract: string; type: ItemType;
                  year: number; uri: string; division: { name: string } | null;
                  authors: { author: { firstName: string; lastName: string }; order: number }[]
                }
                return (
                  <ItemCard
                    key={i.id}
                    id={i.id}
                    title={i.title}
                    abstract={i.abstract}
                    type={i.type}
                    year={i.year}
                    uri={i.uri}
                    division={i.division}
                    authors={i.authors}
                  />
                )
              })}
            </div>
          )}

          <Pagination
            page={pageNum}
            totalPages={result.totalPages}
            buildHref={p => buildHref({ page: p.toString() })}
          />
        </div>

      </div>
    </div>
  )
}
