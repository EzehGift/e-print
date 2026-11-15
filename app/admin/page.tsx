import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboard() {
  const [total, pending, published, totalUsers] = await prisma.$transaction([
    prisma.item.count(),
    prisma.item.count({ where: { status: 'UNDER_REVIEW' } }),
    prisma.item.count({ where: { status: 'PUBLISHED' } }),
    prisma.user.count(),
  ])

  const stats = [
    { label: 'Total items',    value: total,      href: '/admin/items',                        highlight: false },
    { label: 'Pending review', value: pending,     href: '/admin/items?status=UNDER_REVIEW',    highlight: pending > 0 },
    { label: 'Published',      value: published,   href: '/admin/items?status=PUBLISHED',       highlight: false },
    { label: 'Total users',    value: totalUsers,  href: '/admin/users',                        highlight: false },
  ]

  return (
    <div>
      <h1 className="text-2xl mb-8">
        Admin <span className="accent">dashboard</span>
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Link
            key={s.label}
            href={s.href}
            className={`card hover:no-underline hover:shadow-md transition-all ${
              s.highlight
                ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20'
                : 'hover:border-slate-300 dark:hover:border-slate-500'
            }`}
          >
            <div
              className={`font-display text-3xl font-bold mb-1 ${
                s.highlight ? 'text-amber-600 dark:text-amber-400' : 'text-navy dark:text-blue-400'
              }`}
            >
              {s.value}
            </div>
            <div className="text-xs font-medium text-muted uppercase tracking-wide">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="flex gap-3">
        <Link href="/admin/items?status=UNDER_REVIEW" className="btn-primary text-sm">
          Review pending items
        </Link>
        <Link href="/admin/users" className="btn-ghost text-sm">
          Manage users
        </Link>
      </div>
    </div>
  )
}
