import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { applyItemEdit } from '@/lib/apply-item-edit'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const item = await prisma.item.findUnique({ where: { id: params.id } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!item.pendingEdit) return NextResponse.json({ error: 'No pending edit' }, { status: 400 })

  const { action } = await req.json()

  if (action === 'reject') {
    await prisma.item.update({
      where: { id: params.id },
      data: { pendingEdit: Prisma.DbNull, pendingEditAt: null },
    })
    revalidatePath('/admin/items')
    revalidatePath(`/admin/items/${params.id}`)
    revalidatePath('/manage')
    return NextResponse.json({ success: true })
  }

  if (action === 'approve') {
    const editData = item.pendingEdit as Record<string, unknown>
    const updated = await applyItemEdit(params.id, editData as Parameters<typeof applyItemEdit>[1])
    revalidatePath('/admin/items')
    revalidatePath(`/admin/items/${params.id}`)
    revalidatePath('/manage')
    revalidatePath(`/items/${params.id}`)
    revalidatePath('/search')
    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
