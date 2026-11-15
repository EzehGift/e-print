'use client'

import Link from 'next/link'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="max-w-content section-pad text-center min-h-[60vh] flex flex-col items-center justify-center">
      <p className="text-[7rem] font-display font-bold text-slate-100 leading-none mb-4 select-none" aria-hidden>
        500
      </p>
      <h1 className="text-2xl mb-2">Something went wrong</h1>
      <p className="text-muted mb-8 max-w-sm leading-relaxed">
        An unexpected error occurred. Please try again or return to the homepage.
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary">Try again</button>
        <Link href="/" className="btn-ghost">Go to homepage</Link>
      </div>
    </div>
  )
}
