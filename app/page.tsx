import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ItemCard } from '@/components/items/item-card'
import { SearchAutocomplete } from '@/components/ui/search-autocomplete'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const BROWSE_CARDS = [
  {
    href: '/browse/divisions',
    title: 'By Faculty',
    desc: 'Browse by academic faculty and department',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/browse/year',
    title: 'By Year',
    desc: 'Explore output by publication year',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    href: '/browse/subjects',
    title: 'By Subject',
    desc: 'Discover items by subject classification',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    href: '/browse/creators',
    title: 'By Author',
    desc: 'Find works by a specific author',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
]

export const metadata: Metadata = {
  title: 'GOREPO — Open Access Institutional Repository',
  description:
    'Explore research outputs from Godfrey Okoye University. Browse theses, journal articles, books, and conference papers in open access.',
}

async function getStats() {
  const [totalItems, totalFaculties, totalAuthors, yearRange] = await Promise.all([
    prisma.item.count({ where: { status: 'PUBLISHED' } }),
    prisma.division.count({ where: { level: 'FACULTY' } }),
    prisma.author.count(),
    prisma.item.aggregate({
      _min: { year: true },
      _max: { year: true },
      where: { status: 'PUBLISHED' },
    }),
  ])
  return { totalItems, totalFaculties, totalAuthors, yearRange }
}

async function getLatestItems() {
  return prisma.item.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      authors: { include: { author: true }, orderBy: { order: 'asc' } },
      division: true,
      files: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
}

export default async function HomePage() {
  const [stats, latestItems] = await Promise.all([getStats(), getLatestItems()])

  const yearMin = stats.yearRange._min.year ?? 2018
  const yearMax = stats.yearRange._max.year ?? new Date().getFullYear()

  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0" />
        <div className="relative max-w-content py-20 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300/80 mb-5">
            Godfrey Okoye University · Open Access
          </p>
          <h1
            className="font-display font-bold text-white mb-5 leading-[1.15]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', letterSpacing: '-0.02em' }}
          >
            Open access to GOREPO{' '}
            <span className="text-blue-300">research</span>
          </h1>
          <p className="text-[1.05rem] text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
            The institutional repository preserving and sharing the scholarly
            output of Godfrey Okoye University, Enugu, Nigeria.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-5">
            <SearchAutocomplete
              inputClassName="flex-1 h-12 px-4 rounded-lg text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-slate-400 shadow-sm"
              buttonClassName="h-12 px-7 bg-white text-navy font-bold text-sm rounded-lg hover:bg-blue-50 transition-colors shrink-0 shadow-sm"
              buttonText="Search"
            />
          </div>

          <p className="text-xs text-white/35">
            Browse by{' '}
            <Link href="/browse/divisions" className="text-white/55 hover:text-white/80 hover:no-underline underline underline-offset-2 decoration-white/30 transition-colors">faculty</Link>
            {', '}
            <Link href="/browse/year"      className="text-white/55 hover:text-white/80 hover:no-underline underline underline-offset-2 decoration-white/30 transition-colors">year</Link>
            {', '}
            <Link href="/browse/subjects"  className="text-white/55 hover:text-white/80 hover:no-underline underline underline-offset-2 decoration-white/30 transition-colors">subject</Link>
            {', or '}
            <Link href="/browse/creators"  className="text-white/55 hover:text-white/80 hover:no-underline underline underline-offset-2 decoration-white/30 transition-colors">author</Link>
          </p>
        </div>
      </section>

      {/* ── Stats band ──────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-800 border-b border-border dark:border-slate-700">
        <div className="max-w-content py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border dark:divide-slate-700">
            {[
              { label: 'Published Items',  value: stats.totalItems.toLocaleString() },
              { label: 'Faculties',        value: stats.totalFaculties.toString() },
              { label: 'Authors',          value: stats.totalAuthors.toLocaleString() },
              { label: 'Years Covered',    value: `${yearMin}–${yearMax}` },
            ].map(stat => (
              <div key={stat.label} className="text-center px-6 first:pl-0">
                <div className="font-display text-3xl font-bold text-navy dark:text-blue-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest additions ────────────────────────────── */}
      <section className="max-w-content section-pad">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl">
            Latest <span className="accent">additions</span>
          </h2>
          <Link href="/search" className="text-sm text-accent hover:underline font-medium">
            View all →
          </Link>
        </div>

        {latestItems.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-muted">No published items yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {latestItems.map(item => (
              <ItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                abstract={item.abstract}
                type={item.type}
                year={item.year}
                uri={item.uri}
                division={item.division}
                authors={item.authors}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Browse cards ────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-800 border-t border-border dark:border-slate-700">
        <div className="max-w-content section-pad">
          <h2 className="text-2xl mb-8">
            Browse the <span className="accent">collection</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {BROWSE_CARDS.map(card => (
              <Link
                key={card.href}
                href={card.href}
                className="card hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500 hover:no-underline group transition-all"
              >
                <div className="mb-4 text-slate-400 dark:text-slate-500 group-hover:text-accent transition-colors">
                  {card.icon}
                </div>
                <h3 className="font-semibold text-[15px] mb-1.5 text-ink dark:text-slate-100 group-hover:text-accent dark:group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-muted dark:text-slate-400 leading-snug">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
