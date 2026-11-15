import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { EditDepositClient } from './edit-client'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Edit deposit' }

export default async function EditDepositPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/login')

  const item = await prisma.item.findUnique({
    where: { id: params.id },
    include: {
      authors: { include: { author: true }, orderBy: { order: 'asc' } },
      subjects: { include: { subject: true } },
      keywords: { include: { keyword: true } },
      division: true,
    },
  })

  if (!item) notFound()

  const isOwner = item.submittedById === session.user.id
  const isAdmin = session.user.role === 'ADMIN'
  if (!isOwner && !isAdmin) redirect('/')

  const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })

  const defaultValues = {
    title: item.title,
    abstract: item.abstract,
    type: item.type,
    year: item.year,
    language: item.language,
    doi: item.doi ?? '',
    divisionId: item.divisionId,
    subjectIds: item.subjects.map(s => s.subjectId),
    keywords: item.keywords.map(k => k.keyword.value),
    authors: item.authors.map(a => ({
      firstName: a.author.firstName,
      lastName: a.author.lastName,
      email: a.author.email ?? '',
      orcid: a.author.orcid ?? '',
    })),
  }

  return (
    <EditDepositClient
      itemId={params.id}
      itemStatus={item.status}
      defaultValues={defaultValues}
      subjects={subjects}
    />
  )
}
