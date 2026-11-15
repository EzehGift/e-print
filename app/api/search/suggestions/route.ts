import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() ?? ''

  if (q.length < 2) {
    return NextResponse.json({ items: [] })
  }

  const items = await prisma.item.findMany({
    where: {
      status: 'PUBLISHED',
      title: { contains: q, mode: 'insensitive' },
    },
    select: {
      id: true,
      title: true,
      type: true,
      year: true,
      authors: {
        include: { author: { select: { firstName: true, lastName: true } } },
        orderBy: { order: 'asc' },
        take: 1,
      },
    },
    take: 7,
    orderBy: { title: 'asc' },
  })

  return NextResponse.json({
    items: items.map(i => ({
      id:         i.id,
      title:      i.title,
      type:       i.type,
      year:       i.year,
      authorName: i.authors[0]
        ? `${i.authors[0].author.firstName} ${i.authors[0].author.lastName}`
        : null,
    })),
  })
}
