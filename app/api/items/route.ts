import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { searchItems } from '@/lib/search'
import { createItemSchema } from '@/lib/validation'
import { ItemType, ItemStatus } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') ?? undefined
  const type = searchParams.get('type')
  const yearFrom = searchParams.get('yearFrom')
  const yearTo = searchParams.get('yearTo')
  const divisionId = searchParams.get('divisionId') ?? undefined
  const subjectId = searchParams.get('subjectId') ?? undefined
  const authorId = searchParams.get('authorId') ?? undefined
  const statusParam = searchParams.get('status')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const sort = (searchParams.get('sort') ?? 'newest') as 'relevance' | 'newest' | 'oldest' | 'title'

  const status = (statusParam as ItemStatus) || ItemStatus.PUBLISHED

  const typeValues = type ? (type.split(',').filter(Boolean) as ItemType[]) : undefined

  const result = await searchItems({
    q,
    type: typeValues,
    yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
    yearTo: yearTo ? parseInt(yearTo) : undefined,
    divisionId,
    subjectId,
    authorId,
    status,
    page,
    limit,
    sort,
  })

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = createItemSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message, details: parsed.error.errors },
        { status: 422 }
      )
    }

    const { title, abstract, type, year, language, doi, divisionId, subjectIds, keywords, authors } =
      parsed.data

    // Generate URI
    const count = await prisma.item.count()
    const uri = `gouni-eprint-${year}-${String(count + 1).padStart(4, '0')}`

    // Create authors (each deposit creates fresh author records for the item)
    const authorRecords = await Promise.all(
      authors.map(async (a, idx) => {
        const author = await prisma.author.create({
          data: {
            firstName: a.firstName,
            lastName: a.lastName,
            email: a.email || null,
            orcid: a.orcid || null,
          },
        })
        return { authorId: author.id, order: idx }
      })
    )

    // Upsert keywords
    const keywordRecords = await Promise.all(
      (keywords ?? []).map(async v => {
        const kw = await prisma.keyword.upsert({
          where: { value: v },
          update: {},
          create: { value: v },
        })
        return kw.id
      })
    )

    const item = await prisma.item.create({
      data: {
        title,
        abstract,
        type,
        year,
        language,
        doi: doi || null,
        uri,
        status: ItemStatus.DRAFT,
        submittedById: session.user.id,
        divisionId,
        authors: {
          create: authorRecords.map(a => ({ authorId: a.authorId, order: a.order })),
        },
        subjects: {
          create: (subjectIds ?? []).map(id => ({ subjectId: id })),
        },
        keywords: {
          create: keywordRecords.map(id => ({ keywordId: id })),
        },
      },
      include: {
        authors: { include: { author: true }, orderBy: { order: 'asc' } },
        subjects: { include: { subject: true } },
        keywords: { include: { keyword: true } },
        division: true,
        files: true,
      },
    })

    revalidatePath('/manage')
    revalidatePath('/admin/items')
    return NextResponse.json(item, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
