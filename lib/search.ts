import { prisma } from './prisma'
import { ItemStatus, ItemType, Prisma } from '@prisma/client'

export interface SearchFilters {
  q?: string
  type?: ItemType | ItemType[]
  yearFrom?: number
  yearTo?: number
  divisionId?: string
  subjectId?: string
  authorId?: string
  status?: ItemStatus
  page?: number
  limit?: number
  sort?: 'relevance' | 'newest' | 'oldest' | 'title'
}

export interface SearchResult {
  id: string
  title: string
  abstract: string
  type: ItemType
  status: ItemStatus
  year: number
  uri: string
  doi: string | null
  divisionId: string
  createdAt: Date
  updatedAt: Date
}

export async function searchItems(filters: SearchFilters) {
  const {
    q,
    type,
    yearFrom,
    yearTo,
    divisionId,
    subjectId,
    authorId,
    status = ItemStatus.PUBLISHED,
    page = 1,
    limit = 20,
    sort = 'newest',
  } = filters

  const offset = (page - 1) * limit

  // Build where clause for Prisma
  const where: Record<string, unknown> = { status }

  if (type) {
    where.type = Array.isArray(type) ? { in: type } : type
  }
  if (yearFrom || yearTo) {
    where.year = {
      ...(yearFrom ? { gte: yearFrom } : {}),
      ...(yearTo ? { lte: yearTo } : {}),
    }
  }
  if (divisionId) {
    where.divisionId = divisionId
  }
  if (subjectId) {
    where.subjects = { some: { subjectId } }
  }
  if (authorId) {
    where.authors = { some: { authorId } }
  }

  if (q && q.trim()) {
    // Full-text search via raw SQL for the tsvector column
    const query = q.trim()

    const divisionFilter = divisionId
      ? Prisma.sql`AND i."divisionId" = ${divisionId}`
      : Prisma.sql``

    const countResult = await prisma.$queryRaw<[{ count: bigint }]>(
      Prisma.sql`
        SELECT COUNT(*)::bigint as count
        FROM "Item" i
        WHERE i.search_vector @@ plainto_tsquery('english', ${query})
          AND i.status = ${status}::"ItemStatus"
          ${divisionFilter}
      `
    )

    let orderClause = 'ORDER BY ts_rank(i.search_vector, plainto_tsquery(\'english\', $1)) DESC'
    if (sort === 'newest') orderClause = 'ORDER BY i.year DESC, i."createdAt" DESC'
    if (sort === 'oldest') orderClause = 'ORDER BY i.year ASC, i."createdAt" ASC'
    if (sort === 'title') orderClause = 'ORDER BY i.title ASC'

    // Use raw query for full-text search
    const rawItems = await prisma.$queryRawUnsafe<SearchResult[]>(
      `SELECT i.id, i.title, i.abstract, i.type, i.status, i.year, i.uri, i.doi,
              i."divisionId", i."createdAt", i."updatedAt"
       FROM "Item" i
       WHERE i.search_vector @@ plainto_tsquery('english', $1)
         AND i.status = $2::"ItemStatus"
       ${orderClause}
       LIMIT $3 OFFSET $4`,
      query,
      status,
      limit,
      offset
    )

    const total = Number(countResult[0]?.count ?? 0)

    // Fetch full relations for these items
    const items = await prisma.item.findMany({
      where: { id: { in: rawItems.map(r => r.id) } },
      include: {
        authors: { include: { author: true }, orderBy: { order: 'asc' } },
        subjects: { include: { subject: true } },
        keywords: { include: { keyword: true } },
        division: true,
        files: true,
      },
    })

    // Preserve search rank order
    const orderedItems = rawItems
      .map(r => items.find(i => i.id === r.id))
      .filter(Boolean)

    return { items: orderedItems, total, page, totalPages: Math.ceil(total / limit) }
  }

  // Standard listing (no full-text)
  const orderBy = sort === 'newest'
    ? [{ year: 'desc' as const }, { createdAt: 'desc' as const }]
    : sort === 'oldest'
    ? [{ year: 'asc' as const }, { createdAt: 'asc' as const }]
    : sort === 'title'
    ? [{ title: 'asc' as const }]
    : [{ createdAt: 'desc' as const }]

  const [items, total] = await prisma.$transaction([
    prisma.item.findMany({
      where,
      include: {
        authors: { include: { author: true }, orderBy: { order: 'asc' } },
        subjects: { include: { subject: true } },
        keywords: { include: { keyword: true } },
        division: true,
        files: true,
      },
      orderBy,
      skip: offset,
      take: limit,
    }),
    prisma.item.count({ where }),
  ])

  return { items, total, page, totalPages: Math.ceil(total / limit) }
}
