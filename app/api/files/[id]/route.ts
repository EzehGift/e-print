import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const file = await prisma.file.findUnique({ where: { id: params.id } })
  if (!file) return NextResponse.json({ error: 'File not found' }, { status: 404 })

  if (file.isPublic) {
    return NextResponse.redirect(new URL(file.url, process.env.NEXTAUTH_URL!))
  }

  // Private file — require authentication
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Authentication required to download this file' }, { status: 401 })
  }

  const filePath = path.join(process.cwd(), 'private-uploads', file.url.replace('/private-uploads/', ''))

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found on disk' }, { status: 404 })
  }

  const fileBuffer = fs.readFileSync(filePath)
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalName)}"`,
      'Content-Length': String(file.size),
    },
  })
}
