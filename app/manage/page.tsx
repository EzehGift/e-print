import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ItemTypeBadge, StatusBadge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Pagination } from '@/components/ui/pagination'
import { WithdrawButton } from './withdraw-button'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'My Deposits' }

interface Props { searchParams: { page?: string } }

export default async function ManagePage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/login')

  const page = parseInt(searchParams.page ?? '1')
  const limit = 20
  const offset = (page - 1) * limit

  const [items, total] = await prisma.$transaction([
    prisma.item.findMany({
      where: { submittedById: session.user.id },
      include: { division: true },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.item.count({ where: { submittedById: session.user.id } }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="max-w-content section-pad">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl">
          My <span className="accent">deposits</span>
        </h1>
        <Link href="/deposit" className="btn-primary text-sm">
          + New deposit
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="card text-center py-14">
          <p className="font-semibold text-[15px] mb-2">No deposits yet</p>
          <p className="text-sm text-muted mb-6">Start by submitting your research to the repository.</p>
          <Link href="/deposit" className="btn-primary text-sm">Submit an item</Link>
        </div>
      ) : (
        <>
          <div className="card p-0 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                  <th className="text-left px-5 py-3 font-semibold text-[11px] uppercase tracking-wide text-muted dark:text-slate-400">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wide text-muted dark:text-slate-400 w-32">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wide text-muted dark:text-slate-400 w-32">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wide text-muted dark:text-slate-400 w-36">Submitted</th>
                  <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wide text-muted dark:text-slate-400 w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-slate-700">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-5 py-3.5 pr-4">
                      <Link
                        href={item.status === 'PUBLISHED' ? `/items/${item.id}` : '#'}
                        className={
                          item.status !== 'PUBLISHED'
                            ? 'pointer-events-none text-ink dark:text-slate-200 text-[13px]'
                            : 'text-accent hover:underline text-[13px]'
                        }
                      >
                        {item.title.length > 80 ? item.title.slice(0, 80) + '…' : item.title}
                      </Link>
                      {item.rejectionReason && (
                        <p className="text-xs text-red-500 mt-1">Reason: {item.rejectionReason}</p>
                      )}
                      {item.pendingEdit && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Edit request pending admin review</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5"><ItemTypeBadge type={item.type} /></td>
                    <td className="px-4 py-3.5"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3.5 text-muted text-[13px]">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-3 items-center flex-wrap">
                        {item.status === 'PUBLISHED' && (
                          <Link href={`/items/${item.id}`} className="text-xs text-accent hover:underline font-medium">View</Link>
                        )}
                        <Link href={`/deposit/edit/${item.id}`} className="text-xs text-accent hover:underline font-medium">Edit</Link>
                        <WithdrawButton itemId={item.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} buildHref={p => `/manage?page=${p}`} />
        </>
      )}
    </div>
  )
}
