import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '404 — Not Found' }

export default function NotFound() {
  return (
    <div className="max-w-content section-pad text-center min-h-[60vh] flex flex-col items-center justify-center">
      <p className="text-[7rem] font-display font-bold text-slate-100 leading-none mb-4 select-none" aria-hidden>
        404
      </p>
      <h1 className="text-2xl mb-2">Page not found</h1>
      <p className="text-muted mb-8 max-w-sm leading-relaxed">
        The page you&apos;re looking for may have been moved, removed, or never existed.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">Go to homepage</Link>
        <Link href="/search" className="btn-ghost">Search the repository</Link>
      </div>
    </div>
  )
}
