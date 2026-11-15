import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DivisionLevel } from '@prisma/client'

export const dynamic = 'force-dynamic'

export interface DivisionNode {
  id: string
  name: string
  code: string
  level: DivisionLevel
  parentId: string | null
  itemCount: number
  children: DivisionNode[]
}

export async function GET() {
  const all = await prisma.division.findMany({
    include: {
      _count: {
        select: { items: { where: { status: 'PUBLISHED' } } },
      },
    },
    orderBy: [{ level: 'asc' }, { name: 'asc' }],
  })

  // Build tree in memory
  const map = new Map<string, DivisionNode>()
  for (const d of all) {
    map.set(d.id, {
      id: d.id,
      name: d.name,
      code: d.code,
      level: d.level,
      parentId: d.parentId,
      itemCount: d._count.items,
      children: [],
    })
  }

  const roots: DivisionNode[] = []
  for (const node of Array.from(map.values())) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node)
    } else if (!node.parentId) {
      roots.push(node)
    }
  }

  // Sort children alphabetically
  function sortTree(nodes: DivisionNode[]) {
    nodes.sort((a, b) => a.name.localeCompare(b.name))
    for (const n of nodes) sortTree(n.children)
  }
  sortTree(roots)

  return NextResponse.json(roots)
}
