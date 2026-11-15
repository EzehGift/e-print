import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [totalItems, totalFaculties, totalAuthors, yearRange] = await prisma.$transaction([
    prisma.item.count({ where: { status: 'PUBLISHED' } }),
    prisma.division.count({ where: { level: 'FACULTY' } }),
    prisma.author.count(),
    prisma.item.aggregate({
      _min: { year: true },
      _max: { year: true },
      where: { status: 'PUBLISHED' },
    }),
  ])

  return NextResponse.json({
    totalItems,
    totalFaculties,
    totalAuthors,
    yearMin: yearRange._min.year ?? new Date().getFullYear(),
    yearMax: yearRange._max.year ?? new Date().getFullYear(),
  })
}
