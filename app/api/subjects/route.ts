import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const subjects = await prisma.subject.findMany({
    include: {
      _count: {
        select: { items: { where: { item: { status: 'PUBLISHED' } } } },
      },
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(
    subjects.map(s => ({
      id: s.id,
      name: s.name,
      code: s.code,
      itemCount: s._count.items,
    }))
  )
}
