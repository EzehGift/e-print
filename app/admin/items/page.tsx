import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ItemTypeBadge, StatusBadge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { formatDate } from '@/lib/utils'
import { AdminItemActions } from './item-actions'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Item Management — Admin' }

const STATUS_TABS = [
  { value: '',             label: 'All' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'PUBLISHED',    label: 'Published' },
  { value: 'DRAFT',        label: 'Draft' },
  { value: 'REJECTED',     label: 'Rejected' },
]

interface Props { searchParams: { status?: string; page?: string } }

export default async function AdminItemsPage({ searchParams }: Props) {
  const status = searchParams.status ?? ''
  const page = parseInt(searchParams.page ?? '1')
  const limit = 20

  const where = status
    ? { status: status as 'UNDER_REVIEW' | 'PUBLISHED' | 'DRAFT' | 'REJECTED' }
    : {}

  const [items, total] = await prisma.$transaction([
    prisma.item.findMany({
      where,
      include: {
        division:    true,
        submittedBy: { select: { firstName: true, lastName: true } },
        authors:     { include: { author: true }, orderBy: { order: 'asc' }, take: 2 },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.item.count({ where }),
  ])

  return (
    <div>
      <h1 className="text-2xl mb-6">
        Item <span className="accent">management</span>
      </h1>

      {/* Status tabs */}
      <div className="flex gap-0 border-b border-border dark:border-slate-700 mb-6">
        {STATUS_TABS.map(t => (
          <Link
            key={t.value}
            href={`/admin/items${t.value ? `?status=${t.value}` : ''}`}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors hover:no-underline ${
              status === t.value
                ? 'border-navy dark:border-blue-400 text-navy dark:text-blue-400 font-semibold'
                : 'border-transparent text-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-200'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="card py-10 text-center">
          <p className="text-muted">No items found.</p>
        </div>
      ) : (
        <>
          <div className="card p-0 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                  <th className="text-left px-5 py-3 font-semibold text-[11px] uppercase tracking-wide text-muted dark:text-slate-400">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wide text-muted dark:text-slate-400 w-28">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wide text-muted dark:text-slate-400 w-28">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wide text-muted dark:text-slate-400 w-36">Submitted by</th>
                  <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wide text-muted dark:text-slate-400 w-28">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wide text-muted dark:text-slate-400 w-48">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-slate-700">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-5 py-3.5 pr-4">
                      <Link
                        href={`/admin/items/${item.id}`}
                        className="text-accent hover:underline line-clamp-2 text-[13px] font-medium"
                      >
                        {item.title}
                      </Link>
                      <div className="text-[11px] text-muted mt-0.5 flex items-center gap-2">
                        {item.division?.name ?? '—'}
                        {item.pendingEdit && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                            Edit pending
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><ItemTypeBadge type={item.type} /></td>
                    <td className="px-4 py-3.5"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3.5 text-muted text-[13px]">
                      {item.submittedBy.firstName} {item.submittedBy.lastName}
                    </td>
                    <td className="px-4 py-3.5 text-muted text-[13px]">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1.5">
                        <Link
                          href={`/admin/items/${item.id}`}
                          className="text-xs text-accent hover:underline font-medium"
                        >
                          View details
                        </Link>
                        <AdminItemActions itemId={item.id} currentStatus={item.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            totalPages={Math.ceil(total / limit)}
            buildHref={p => `/admin/items?${status ? `status=${status}&` : ''}page=${p}`}
          />
        </>
      )}
    </div>
  )
}
