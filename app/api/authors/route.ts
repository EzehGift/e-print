import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const letter = searchParams.get('letter')

  const where = letter
    ? { lastName: { startsWith: letter, mode: 'insensitive' as const } }
    : {}

  const authors = await prisma.author.findMany({
    where,
    include: {
      _count: {
        select: { items: { where: { item: { status: 'PUBLISHED' } } } },
      },
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  })

  return NextResponse.json(
    authors.map(a => ({
      id: a.id,
      firstName: a.firstName,
      lastName: a.lastName,
      email: a.email,
      orcid: a.orcid,
      itemCount: a._count.items,
    }))
  )
}
