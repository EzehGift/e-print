import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge, ItemTypeBadge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { SignOutButton } from './sign-out-button'
import type { Metadata } from 'next'

function IconDoc() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  )
}
function IconFolder() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  )
}
function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}
function IconSettings() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'My Profile' }

const ROLE_LABELS: Record<string, string> = {
  ADMIN:      'Administrator',
  RESEARCHER: 'Researcher',
  VIEWER:     'Viewer',
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/login')

  const [user, depositCounts, recentDeposits] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { faculty: true },
    }),
    prisma.item.groupBy({
      by: ['status'],
      where: { submittedById: session.user.id },
      _count: true,
    }),
    prisma.item.findMany({
      where: { submittedById: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, type: true, status: true, createdAt: true },
    }),
  ])

  if (!user) redirect('/auth/login')

  const countByStatus = Object.fromEntries(depositCounts.map(d => [d.status, d._count]))
  const totalDeposits = depositCounts.reduce((s, d) => s + d._count, 0)
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  return (
    <div className="max-w-content section-pad">
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-2">Account</p>
      <h1 className="text-3xl mb-10">
        My <span className="accent">Profile</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ── Left column ─────────────────────────── */}
        <div className="md:col-span-1 space-y-5">

          {/* Identity card */}
          <div className="card text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-navy text-white font-display font-bold text-2xl mx-auto mb-4 select-none">
              {initials}
            </div>
            <h2 className="font-semibold text-lg text-ink dark:text-slate-100 leading-snug">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-muted mt-1 break-all">{user.email}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-wide bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </div>
            {user.faculty && (
              <p className="text-xs text-muted mt-3 leading-snug">{user.faculty.name}</p>
            )}
            <p className="text-xs text-muted mt-2">Member since {formatDate(user.createdAt)}</p>
          </div>

          {/* Quick actions */}
          <div className="card space-y-1 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted mb-3">Quick actions</p>

            <Link
              href="/deposit"
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-accent dark:hover:text-blue-400 hover:no-underline transition-colors"
            >
              <IconDoc />
              Submit new item
            </Link>

            <Link
              href="/manage"
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-accent dark:hover:text-blue-400 hover:no-underline transition-colors"
            >
              <IconFolder />
              My deposits
            </Link>

            <Link
              href="/search"
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-accent dark:hover:text-blue-400 hover:no-underline transition-colors"
            >
              <IconSearch />
              Search repository
            </Link>

            {session.user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-accent dark:hover:text-blue-400 hover:no-underline transition-colors"
              >
                <IconSettings />
                Admin panel
              </Link>
            )}

            <div className="pt-1 border-t border-border dark:border-slate-700 mt-1">
              <SignOutButton />
            </div>
          </div>
        </div>

        {/* ── Right column ─────────────────────────── */}
        <div className="md:col-span-2 space-y-5">

          {/* Stats */}
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-border dark:border-slate-700">
              <h3 className="font-semibold text-[15px] text-ink dark:text-slate-100">Deposit statistics</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border dark:divide-slate-700">
              {[
                { label: 'Total',       value: totalDeposits,                          color: 'text-ink dark:text-slate-100' },
                { label: 'Published',   value: countByStatus['PUBLISHED']   ?? 0,      color: 'text-emerald-600' },
                { label: 'Under Review',value: countByStatus['UNDER_REVIEW'] ?? 0,     color: 'text-amber-600' },
                { label: 'Draft',       value: (countByStatus['DRAFT'] ?? 0) + (countByStatus['REJECTED'] ?? 0), color: 'text-slate-500' },
              ].map(stat => (
                <div key={stat.label} className="text-center px-4 py-5">
                  <div className={`font-display text-3xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent deposits */}
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-border dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-[15px] text-ink dark:text-slate-100">Recent deposits</h3>
              <Link href="/manage" className="text-sm text-accent hover:underline font-medium">
                View all →
              </Link>
            </div>

            {recentDeposits.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-muted text-sm mb-4">No deposits yet.</p>
                <Link href="/deposit" className="btn-primary text-sm">
                  Submit your first item
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border dark:divide-slate-700">
                {recentDeposits.map(item => (
                  <li key={item.id} className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink dark:text-slate-200 line-clamp-1">
                        {item.status === 'PUBLISHED'
                          ? <Link href={`/items/${item.id}`} className="hover:text-accent hover:underline">{item.title}</Link>
                          : item.title
                        }
                      </p>
                      <p className="text-xs text-muted mt-0.5">{formatDate(item.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ItemTypeBadge type={item.type} />
                      <StatusBadge status={item.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Account info */}
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-border dark:border-slate-700">
              <h3 className="font-semibold text-[15px] text-ink dark:text-slate-100">Account details</h3>
            </div>
            <dl className="divide-y divide-border dark:divide-slate-700">
              {[
                { label: 'Full name',  value: `${user.firstName} ${user.lastName}` },
                { label: 'Email',      value: user.email },
                { label: 'Role',       value: ROLE_LABELS[user.role] ?? user.role },
                { label: 'Faculty',    value: user.faculty?.name ?? '—' },
                { label: 'Joined',     value: formatDate(user.createdAt) },
              ].map(row => (
                <div key={row.label} className="px-5 py-3.5 flex items-center gap-4">
                  <dt className="w-32 text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-400 shrink-0">
                    {row.label}
                  </dt>
                  <dd className="text-sm text-ink dark:text-slate-200">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

        </div>
      </div>
    </div>
  )
}
