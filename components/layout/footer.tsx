import Link from 'next/link'
import Image from 'next/image'

const COLUMNS = [
  {
    heading: 'Repository',
    links: [
      { href: '/',       label: 'Home' },
      { href: '/search', label: 'Search' },
      { href: '/browse', label: 'Browse' },
      { href: '/deposit',label: 'Submit Item' },
    ],
  },
  {
    heading: 'Browse by',
    links: [
      { href: '/browse/divisions', label: 'Faculty' },
      { href: '/browse/year',      label: 'Year' },
      { href: '/browse/subjects',  label: 'Subject' },
      { href: '/browse/creators',  label: 'Author' },
    ],
  },
  {
    heading: 'Information',
    links: [
      { href: '/about',                  label: 'About' },
      { href: '/policies',               label: 'Policies' },
      { href: '/eprints',                label: 'Platform' },
      { href: '/api/oai?verb=Identify',  label: 'OAI-PMH' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-[#111827] text-white/60 mt-auto">

      {/* Main content */}
      <div className="max-w-content py-14">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5 hover:no-underline group">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10">
                <Image
                  src="/my-logo.svg"
                  alt="GOREPO"
                  width={24}
                  height={24}
                  className="h-6 w-auto brightness-0 invert opacity-80"
                  unoptimized
                />
              </span>
              <span className="font-display font-bold text-white text-[17px] tracking-tight leading-none group-hover:text-white/80 transition-colors">
                GOREPO
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/50 max-w-[260px] mb-6">
              The open-access institutional repository of Godfrey Okoye University, preserving and sharing the university&apos;s scholarly output.
            </p>
            <div className="space-y-1.5 text-[13px] text-white/40">
              <p>Godfrey Okoye University</p>
              <p>Enugu, Enugu State, Nigeria</p>
              <a
                href="mailto:eprints@gouni.edu.ng"
                className="block hover:text-white/70 transition-colors"
              >
                eprints@gouni.edu.ng
              </a>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map(col => (
            <div key={col.heading}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/30 mb-5">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/55 hover:text-white hover:no-underline transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-content py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-white/30">
          <p>© {new Date().getFullYear()} Godfrey Okoye University. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/policies" className="hover:text-white/55 hover:no-underline transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/15">·</span>
            <Link href="/api/feed/atom" className="hover:text-white/55 hover:no-underline transition-colors">
              Atom Feed
            </Link>
            <span className="text-white/15">·</span>
            <Link href="/api/feed/rss" className="hover:text-white/55 hover:no-underline transition-colors">
              RSS Feed
            </Link>
          </div>
        </div>
      </div>

    </footer>
  )
}
