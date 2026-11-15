import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse',
  description: 'Browse GOREPO by faculty, year, subject, or author.',
}

const TABS = [
  {
    href: '/browse/divisions',
    title: 'By Faculty',
    desc: 'Browse by academic faculty and department hierarchy',
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
    desc: 'Browse items grouped by publication year',
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
    desc: 'Browse using Library of Congress subject classifications',
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
    desc: 'Find works by contributor name',
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

export default function BrowsePage() {
  return (
    <div className="max-w-content section-pad">
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-2">
        Repository
      </p>
      <h1 className="text-3xl mb-2">
        Browse the <span className="accent">collection</span>
      </h1>
      <p className="text-muted mb-10">
        Explore research by faculty, year, subject, or author.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {TABS.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className="card hover:shadow-md hover:border-slate-300 hover:no-underline group transition-all"
          >
            <div className="mb-4 text-slate-400 group-hover:text-accent transition-colors">
              {tab.icon}
            </div>
            <h2 className="text-lg font-semibold mb-1.5 group-hover:text-accent transition-colors">
              {tab.title}
            </h2>
            <p className="text-sm text-muted leading-snug">{tab.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
