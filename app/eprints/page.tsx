import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About the Platform' }

export default function EprintsPage() {
  return (
    <div className="max-w-content section-pad">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-2">
          Platform
        </p>
        <h1 className="text-3xl mb-2">
          Repository <span className="accent">software</span>
        </h1>

        <div className="space-y-4 text-[0.9375rem] leading-relaxed text-slate-600 mt-8">
          <p>
            GOREPO is built on a modern open-source stack developed for Godfrey Okoye
            University. The platform is a full-stack Next.js application with a PostgreSQL database,
            providing open access to the university&apos;s research outputs.
          </p>
          <p>
            The system is compatible with the OAI-PMH 2.0 protocol and exposes Dublin Core metadata for
            harvesting by aggregators such as BASE, OpenDOAR, and Google Scholar.
          </p>
          <p>
            Technical credits: Next.js (Vercel), Prisma ORM, PostgreSQL, NextAuth.js, Tailwind CSS.
            The repository design was inspired by EPrints 3, developed by the University of Southampton.
          </p>
          <p>
            <Link href="/about" className="text-accent hover:underline font-medium">
              Read more about the repository →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
