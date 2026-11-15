import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ItemTypeBadge, StatusBadge } from '@/components/ui/badge'
import { formatDate, formatFileSize } from '@/lib/utils'
import { AdminItemActions } from '../item-actions'
import { AdminPendingEditActions } from '../pending-edit-actions'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps { params: { id: string } }

async function getItem(id: string) {
  return prisma.item.findUnique({
    where: { id },
    include: {
      authors:     { include: { author: true }, orderBy: { order: 'asc' } },
      subjects:    { include: { subject: true } },
      keywords:    { include: { keyword: true } },
      division:    { include: { parent: true } },
      files:       true,
      submittedBy: { select: { firstName: true, lastName: true, email: true } },
    },
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getItem(params.id)
  return { title: item ? `Review: ${item.title}` : 'Item not found' }
}

export default async function AdminItemDetailPage({ params }: PageProps) {
  const item = await getItem(params.id)
  if (!item) notFound()

  const breadcrumb = [item.division?.parent?.name, item.division?.name].filter(Boolean).join(' › ')

  const STATUS_BANNER: Record<string, { bg: string; label: string }> = {
    UNDER_REVIEW: { bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300', label: 'Awaiting review' },
    PUBLISHED:    { bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300', label: 'Published' },
    DRAFT:        { bg: 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400', label: 'Draft' },
    REJECTED:     { bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400', label: 'Rejected' },
  }
  const banner = STATUS_BANNER[item.status] ?? STATUS_BANNER.DRAFT

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/items"
        className="inline-flex items-center gap-1.5 text-sm text-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-200 hover:no-underline mb-6"
      >
        ← Back to items
      </Link>

      {/* Status banner */}
      <div className={`mb-6 rounded-lg border px-4 py-3 text-sm flex items-center gap-3 ${banner.bg}`}>
        <StatusBadge status={item.status} />
        <span>{banner.label}</span>
        {item.rejectionReason && (
          <span className="text-current/70 ml-1">— {item.rejectionReason}</span>
        )}
      </div>

      <div className="flex gap-6 items-start">

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Header */}
          <div className="card">
            {breadcrumb && (
              <p className="text-xs text-muted dark:text-slate-400 mb-2">{breadcrumb}</p>
            )}
            <div className="flex items-start gap-3 mb-3">
              <ItemTypeBadge type={item.type} />
              <span className="text-xs text-muted dark:text-slate-400 pt-0.5">{item.year} · {item.language}</span>
            </div>
            <h1 className="text-xl font-bold text-ink dark:text-slate-100 mb-3 leading-snug">
              {item.title}
            </h1>
            <p className="text-sm text-muted dark:text-slate-400">
              {item.authors.map((a, i) => (
                <span key={a.author.id}>
                  {i > 0 && <span className="mx-1">·</span>}
                  {a.author.firstName} {a.author.lastName}
                  {a.author.orcid && (
                    <span className="ml-1 text-xs text-emerald-600 dark:text-emerald-400">[ORCID]</span>
                  )}
                </span>
              ))}
            </p>
            {item.doi && (
              <p className="text-xs text-muted dark:text-slate-400 mt-1">DOI: {item.doi}</p>
            )}
          </div>

          {/* Abstract */}
          <div className="card">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted dark:text-slate-400 mb-3">Abstract</h2>
            <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">
              {item.abstract}
            </p>
          </div>

          {/* Files */}
          <div className="card">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted dark:text-slate-400 mb-4">
              Attached files ({item.files.length})
            </h2>
            {item.files.length === 0 ? (
              <p className="text-sm text-muted dark:text-slate-400 italic">No files attached to this item.</p>
            ) : (
              <ul className="space-y-3">
                {item.files.map(file => (
                  <li key={file.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-border dark:border-slate-700">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink dark:text-slate-200 truncate">{file.originalName}</p>
                      <p className="text-xs text-muted dark:text-slate-400 mt-0.5">
                        {formatFileSize(file.size)} · {file.mimeType} · {file.isPublic ? 'Public' : 'Restricted'}
                      </p>
                    </div>
                    <a
                      href={file.url}
                      download={file.originalName}
                      className="btn-ghost text-xs px-3 py-1.5 h-auto shrink-0"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Keywords & Subjects */}
          {(item.subjects.length > 0 || item.keywords.length > 0) && (
            <div className="card">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted dark:text-slate-400 mb-3">
                Keywords & Subjects
              </h2>
              <div className="flex flex-wrap gap-2">
                {item.subjects.map(s => (
                  <span
                    key={s.subject.id}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-100 dark:border-blue-800"
                  >
                    {s.subject.name}
                  </span>
                ))}
                {item.keywords.map(k => (
                  <span
                    key={k.keyword.id}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full"
                  >
                    {k.keyword.value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pending edit diff */}
          {item.pendingEdit && (
            <div className="card border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/10">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-400 mb-3">
                Pending edit request
              </h2>
              {item.pendingEditAt && (
                <p className="text-xs text-muted dark:text-slate-400 mb-3">Submitted {formatDate(item.pendingEditAt)}</p>
              )}
              <div className="space-y-2 text-sm">
                {(() => {
                  const edit = item.pendingEdit as Record<string, unknown>
                  const fields = [
                    { label: 'Title', key: 'title', current: item.title },
                    { label: 'Type', key: 'type', current: item.type },
                    { label: 'Year', key: 'year', current: String(item.year) },
                    { label: 'Language', key: 'language', current: item.language },
                    { label: 'DOI', key: 'doi', current: item.doi ?? '' },
                  ]
                  return fields
                    .filter(f => edit[f.key] !== undefined && String(edit[f.key]) !== f.current)
                    .map(f => (
                      <div key={f.key}>
                        <p className="text-xs font-semibold text-muted dark:text-slate-400 uppercase tracking-wide">{f.label}</p>
                        <p className="text-xs text-red-600 dark:text-red-400 line-through">{f.current || '—'}</p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400">{String(edit[f.key])}</p>
                      </div>
                    ))
                })()}
                {(() => {
                  const edit = item.pendingEdit as Record<string, unknown>
                  if (edit.abstract && edit.abstract !== item.abstract) {
                    return (
                      <div>
                        <p className="text-xs font-semibold text-muted dark:text-slate-400 uppercase tracking-wide">Abstract</p>
                        <p className="text-xs text-muted dark:text-slate-400 italic">Abstract changed (see approval to view full text)</p>
                      </div>
                    )
                  }
                  return null
                })()}
              </div>
              <div className="mt-4">
                <AdminPendingEditActions itemId={item.id} />
              </div>
            </div>
          )}

        </div>

        {/* ── Sidebar ── */}
        <aside className="w-64 shrink-0 space-y-4">

          {/* Review actions */}
          {(item.status === 'UNDER_REVIEW' || item.status === 'PUBLISHED' || item.status === 'REJECTED') && (
            <div className="card">
              <h3 className="text-sm font-semibold text-ink dark:text-slate-100 mb-3">Review actions</h3>
              <AdminItemActions itemId={item.id} currentStatus={item.status} />
              {item.status === 'PUBLISHED' && (
                <Link
                  href={`/items/${item.id}`}
                  className="mt-3 block text-xs text-accent hover:underline"
                >
                  View public page →
                </Link>
              )}
            </div>
          )}

          {/* Submission info */}
          <div className="card">
            <h3 className="text-sm font-semibold text-ink dark:text-slate-100 mb-3">Submission info</h3>
            <dl className="space-y-2.5 text-sm">
              {[
                { label: 'Submitted by', value: `${item.submittedBy.firstName} ${item.submittedBy.lastName}` },
                { label: 'Email',        value: item.submittedBy.email },
                { label: 'Submitted',    value: formatDate(item.createdAt) },
                { label: 'Last updated', value: formatDate(item.updatedAt) },
                { label: 'Faculty',      value: item.division?.parent?.name ?? item.division?.name ?? '—' },
                { label: 'Department',   value: item.division?.parent ? item.division.name : '—' },
              ].map(row => (
                <div key={row.label}>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted dark:text-slate-400">{row.label}</dt>
                  <dd className="text-ink dark:text-slate-200 text-[13px] break-all">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

        </aside>
      </div>
    </div>
  )
}
