import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { updateItemSchema } from '@/lib/validation'
import { applyItemEdit } from '@/lib/apply-item-edit'

const ITEM_INCLUDE = {
  authors: { include: { author: true }, orderBy: { order: 'asc' as const } },
  subjects: { include: { subject: true } },
  keywords: { include: { keyword: true } },
  division: true,
  files: true,
  submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
} as const

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.item.findUnique({
    where: { id: params.id },
    include: ITEM_INCLUDE,
  })

  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }

  return NextResponse.json(item)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const item = await prisma.item.findUnique({ where: { id: params.id } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isOwner = item.submittedById === session.user.id
  const isAdmin = session.user.role === 'ADMIN'
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const parsed = updateItemSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 })
    }

    const { title, abstract, type, year, language, doi, divisionId, subjectIds, keywords, authors, status, rejectionReason } = parsed.data

    // Non-admin editing a submitted item → queue as pending edit for admin review
    if (!isAdmin && item.status !== 'DRAFT') {
      const editPayload = { title, abstract, type, year, language, doi, divisionId, subjectIds, keywords, authors }
      const clean = Object.fromEntries(Object.entries(editPayload).filter(([, v]) => v !== undefined))
      await prisma.item.update({
        where: { id: params.id },
        data: { pendingEdit: clean, pendingEditAt: new Date() },
      })
      revalidatePath('/manage')
      revalidatePath(`/items/${params.id}`)
      return NextResponse.json({ pendingEdit: true })
    }

    // Admin or DRAFT item → apply directly
    let newStatus = status
    if (!isAdmin && item.status === 'PUBLISHED' && !status) {
      newStatus = 'UNDER_REVIEW'
    }

    const updated = await applyItemEdit(params.id, parsed.data, newStatus)
    revalidatePath('/admin/items')
    revalidatePath(`/admin/items/${params.id}`)
    revalidatePath('/manage')
    revalidatePath(`/items/${params.id}`)
    return NextResponse.json(updated)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const item = await prisma.item.findUnique({ where: { id: params.id } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isOwner = item.submittedById === session.user.id
  const isAdmin = session.user.role === 'ADMIN'
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.item.delete({ where: { id: params.id } })
  revalidatePath('/admin/items')
  revalidatePath('/manage')
  revalidatePath('/search')
  revalidatePath('/')
  return NextResponse.json({ success: true })
}
