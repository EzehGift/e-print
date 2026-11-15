import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { publicStorage, privateStorage, validateFile } from '@/lib/upload'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const itemId = form.get('itemId') as string | null
    const isPublicStr = form.get('isPublic') as string | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!itemId) return NextResponse.json({ error: 'itemId is required' }, { status: 400 })

    const validation = validateFile(file)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 422 })
    }

    // Verify item belongs to user (or user is admin)
    const item = await prisma.item.findUnique({ where: { id: itemId } })
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    if (item.submittedById !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const isPublic = isPublicStr !== 'false'
    const buffer = Buffer.from(await file.arrayBuffer())
    const storage = isPublic ? publicStorage : privateStorage
    const url = await storage.save(buffer, itemId, file.name)

    const fileRecord = await prisma.file.create({
      data: {
        itemId,
        filename: url.split('/').pop()!,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url,
        isPublic,
      },
    })

    return NextResponse.json(fileRecord, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
