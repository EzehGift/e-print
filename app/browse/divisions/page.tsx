import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Browse by Faculty',
  description: 'Browse GOREPO by academic faculty and department.',
}

async function getDivisionTree() {
  const all = await prisma.division.findMany({
    where: { level: { in: ['FACULTY', 'DEPARTMENT'] } },
    include: { _count: { select: { items: { where: { status: 'PUBLISHED' } } } } },
    orderBy: { name: 'asc' },
  })

  const faculties = all.filter(d => d.level === 'FACULTY')
  const departments = all.filter(d => d.level === 'DEPARTMENT')

  return faculties.map(f => ({
    ...f,
    departments: departments.filter(d => d.parentId === f.id),
  }))
}

export default async function BrowseDivisionsPage() {
  const tree = await getDivisionTree()

  return (
    <div className="max-w-content section-pad">

      <nav aria-label="Browse navigation" className="browse-nav">
        <Link href="/browse/divisions" className="browse-nav-link browse-nav-link-active">By Faculty</Link>
        <Link href="/browse/year"      className="browse-nav-link">By Year</Link>
        <Link href="/browse/subjects"  className="browse-nav-link">By Subject</Link>
        <Link href="/browse/creators"  className="browse-nav-link">By Author</Link>
      </nav>

      <h1 className="text-3xl mb-8">
        Browse by <span className="accent">faculty</span>
      </h1>

      <div className="space-y-3">
        {tree.map(faculty => (
          <details key={faculty.id} className="card group">
            <summary className="flex items-center cursor-pointer list-none -m-6 p-6 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="font-semibold text-[15px]">{faculty.name}</span>
              <span className="text-sm text-muted ml-auto mr-4 tabular-nums">
                {faculty._count.items} item{faculty._count.items !== 1 ? 's' : ''}
              </span>
              <span className="text-muted text-base transition-transform group-open:rotate-90 select-none">›</span>
            </summary>
            <div className="mt-5 pt-4 border-t border-border space-y-2.5">
              {faculty.departments.length === 0 ? (
                <Link
                  href={`/search?divisionId=${faculty.id}`}
                  className="block text-sm text-accent hover:underline"
                >
                  View all items ({faculty._count.items})
                </Link>
              ) : (
                faculty.departments.map(dept => (
                  <div key={dept.id} className="flex items-center justify-between py-1">
                    <Link
                      href={`/search?divisionId=${dept.id}`}
                      className="text-sm text-accent hover:underline"
                    >
                      {dept.name}
                    </Link>
                    <span className="text-xs text-muted tabular-nums">
                      {dept._count.items} item{dept._count.items !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
