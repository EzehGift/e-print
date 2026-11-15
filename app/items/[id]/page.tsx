import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ItemTypeBadge } from '@/components/ui/badge'
import { CitationBox } from '@/components/ui/citation-box'
import { generateCitations } from '@/lib/citation'
import { formatDate, formatFileSize } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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
      submittedBy: { select: { firstName: true, lastName: true } },
    },
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getItem(params.id)
  if (!item) return { title: 'Item not found' }

  const authorNames = item.authors.map(a => `${a.author.lastName}, ${a.author.firstName}`)
  const pdfFile = item.files.find(f => f.mimeType === 'application/pdf' && f.isPublic)

  return {
    title: item.title,
    description: item.abstract.slice(0, 160),
    other: {
      'citation_title': item.title,
      ...Object.fromEntries(authorNames.map((n, i) => [`citation_author_${i}`, n])),
      'citation_publication_date': item.year.toString(),
      'citation_abstract_html_url': `https://eprints.gouni.edu.ng/items/${item.id}`,
      ...(pdfFile ? { 'citation_pdf_url': `https://eprints.gouni.edu.ng${pdfFile.url}` } : {}),
    },
  }
}

export default async function ItemDetailPage({ params }: PageProps) {
  const [item, session] = await Promise.all([getItem(params.id), getServerSession(authOptions)])

  const isAdmin = session?.user?.role === 'ADMIN'
  const isOwner = session?.user?.id === item?.submittedById
  const canPreview = isAdmin || isOwner

  if (!item || (item.status !== 'PUBLISHED' && !canPreview)) notFound()

  const citations = generateCitations(
    {
      id: item.id,
      title: item.title,
      abstract: item.abstract,
      type: item.type,
      year: item.year,
      uri: item.uri,
      doi: item.doi,
      language: item.language,
      division: item.division,
    },
    item.authors.map(a => ({
      firstName: a.author.firstName,
      lastName:  a.author.lastName,
      order:     a.order,
    }))
  )

  const relatedItems = await prisma.item.findMany({
    where: { divisionId: item.divisionId, NOT: { id: item.id }, status: 'PUBLISHED' },
    include: { authors: { include: { author: true }, orderBy: { order: 'asc' } } },
    take: 5,
  })

  const breadcrumb = [item.division?.parent?.name, item.division?.name]
    .filter(Boolean).join(' › ')

  return (
    <div className="max-w-content section-pad">
      <div className="flex gap-8 items-start">

        {/* ── Main content ────────────────────────── */}
        <div className="flex-1 min-w-0">

          {item.status !== 'PUBLISHED' && (
            <div className={`mb-5 rounded-lg border px-4 py-3 text-sm flex items-center gap-2.5 ${
              item.status === 'UNDER_REVIEW'
                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                : item.status === 'REJECTED'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400'
            }`}>
              <span className="font-semibold">
                {item.status === 'UNDER_REVIEW' && 'Pending review'}
                {item.status === 'DRAFT' && 'Draft'}
                {item.status === 'REJECTED' && 'Rejected'}
              </span>
              <span className="text-current/70">
                {item.status === 'UNDER_REVIEW' && '— This item is awaiting admin approval and is not yet publicly visible.'}
                {item.status === 'DRAFT' && '— This item has not been submitted for review yet.'}
                {item.status === 'REJECTED' && `— ${item.rejectionReason ?? 'This item was not approved.'}`}
              </span>
              {isAdmin && item.status === 'UNDER_REVIEW' && (
                <Link href={`/admin/items/${item.id}`} className="ml-auto shrink-0 text-xs font-semibold underline hover:no-underline">
                  Review in admin →
                </Link>
              )}
            </div>
          )}

          {breadcrumb && (
            <p className="text-xs text-muted mb-3">{breadcrumb}</p>
          )}

          <ItemTypeBadge type={item.type} className="mb-3" />

          <h1 className="text-[1.6rem] leading-snug mb-4" style={{ letterSpacing: '-0.02em' }}>
            {item.title}
          </h1>

          <p className="text-sm text-muted mb-5">
            {item.authors.map((a, i) => (
              <span key={a.author.id}>
                {i > 0 && <span className="mx-1 text-slate-300">·</span>}
                <Link
                  href={`/search?authorId=${a.author.id}`}
                  className="hover:underline"
                >
                  {a.author.firstName} {a.author.lastName}
                </Link>
                {a.author.orcid && (
                  <a
                    href={`https://orcid.org/${a.author.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-xs text-emerald-600 font-medium"
                    aria-label={`ORCID for ${a.author.firstName} ${a.author.lastName}`}
                  >
                    ORCID
                  </a>
                )}
              </span>
            ))}
          </p>

          {/* Abstract */}
          <div className="mb-7">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted mb-3">
              Abstract
            </h2>
            <p className="text-[0.9375rem] leading-relaxed text-slate-700 dark:text-slate-300">{item.abstract}</p>
          </div>

          {/* Metadata table */}
          <div className="rounded-xl overflow-hidden border border-border dark:border-slate-700 mb-7">
            <table className="w-full text-sm table-fixed">
              <tbody>
                {[
                  ['Type',       <ItemTypeBadge key="type" type={item.type} />],
                  ['Year',       item.year.toString()],
                  ['Language',   item.language],
                  ['Faculty',    item.division?.parent?.name ?? item.division?.name ?? '—'],
                  ['Department', item.division?.parent ? item.division.name : '—'],
                  ['URI',        <a key="uri" href={item.uri} target="_blank" rel="noopener noreferrer" className="font-mono text-xs break-all text-accent hover:underline">{item.uri}</a>],
                  ...(item.doi ? [['DOI', <a key="doi" href={`https://doi.org/${item.doi}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{item.doi}</a>]] : []),
                  ['Added',      formatDate(item.createdAt)],
                ].map(([key, value]) => (
                  <tr key={String(key)} className="border-b border-border dark:border-slate-700 last:border-0">
                    <td className="px-4 py-2.5 font-semibold bg-slate-50 dark:bg-slate-700/50 w-32 text-xs uppercase tracking-wide text-muted dark:text-slate-400 align-top whitespace-nowrap">
                      {key}
                    </td>
                    <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subjects & keywords */}
          {(item.subjects.length > 0 || item.keywords.length > 0) && (
            <div className="mb-7">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted mb-3">
                Keywords & Subjects
              </h2>
              <div className="flex flex-wrap gap-2">
                {item.subjects.map(s => (
                  <Link
                    key={s.subject.id}
                    href={`/search?subjectId=${s.subject.id}`}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full hover:no-underline hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-100 dark:border-blue-800"
                  >
                    {s.subject.name}
                  </Link>
                ))}
                {item.keywords.map(k => (
                  <Link
                    key={k.keyword.id}
                    href={`/search?q=${encodeURIComponent(k.keyword.value)}`}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full hover:no-underline hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    {k.keyword.value}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-muted dark:text-slate-400 border-t border-border dark:border-slate-700 pt-4">
            Permanent URI:{' '}
            <a
              href={`https://eprints.gouni.edu.ng/id/eprint/${item.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-accent hover:underline break-all"
            >
              https://eprints.gouni.edu.ng/id/eprint/{item.id}
            </a>
          </div>
        </div>

        {/* ── Right sidebar ───────────────────────── */}
        <aside className="w-72 shrink-0 space-y-4">

          {/* Files */}
          <div className="card">
            <h3 className="text-sm font-semibold text-ink dark:text-slate-100 mb-3">Files</h3>
            {item.files.length === 0 ? (
              <p className="text-sm text-muted">No files attached.</p>
            ) : (
              <ul className="space-y-3">
                {item.files.map(file => (
                  <li key={file.id}>
                    <div className="font-medium text-sm truncate mb-0.5">{file.originalName}</div>
                    <div className="text-xs text-muted mb-2">{formatFileSize(file.size)}</div>
                    {file.isPublic ? (
                      <a
                        href={file.url}
                        download={file.originalName}
                        className="btn-primary text-xs px-3.5 py-1.5 h-auto"
                        aria-label={`Download ${file.originalName}`}
                      >
                        ↓ Download
                      </a>
                    ) : session ? (
                      <a
                        href={`/api/files/${file.id}`}
                        className="btn-primary text-xs px-3.5 py-1.5 h-auto"
                        aria-label={`Download restricted file ${file.originalName}`}
                      >
                        ↓ Download
                      </a>
                    ) : (
                      <div>
                        <span className="text-xs text-red-600 block mb-1">Access restricted</span>
                        <Link
                          href={`/auth/login?callbackUrl=/items/${item.id}`}
                          className="text-xs text-accent hover:underline"
                        >
                          Log in to download
                        </Link>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Citation */}
          <CitationBox apa={citations.apa} mla={citations.mla} bibtex={citations.bibtex} />

          {/* Share */}
          <div className="card">
            <h3 className="text-sm font-semibold text-ink dark:text-slate-100 mb-2">Share</h3>
            <p className="text-xs text-muted break-all font-mono leading-relaxed">
              https://eprints.gouni.edu.ng/items/{item.id}
            </p>
          </div>

          {/* Related */}
          {relatedItems.length > 0 && (
            <div className="card">
              <h3 className="text-sm font-semibold text-ink dark:text-slate-100 mb-3">Related items</h3>
              <ul className="space-y-3">
                {relatedItems.map(r => (
                  <li key={r.id}>
                    <Link
                      href={`/items/${r.id}`}
                      className="text-xs text-accent hover:underline line-clamp-2 leading-snug block"
                    >
                      {r.title}
                    </Link>
                    <span className="text-xs text-muted mt-0.5 block tabular-nums">{r.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </aside>
      </div>
    </div>
  )
}
