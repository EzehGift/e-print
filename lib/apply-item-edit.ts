import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

const ITEM_INCLUDE = {
  authors: { include: { author: true }, orderBy: { order: 'asc' as const } },
  subjects: { include: { subject: true } },
  keywords: { include: { keyword: true } },
  division: true,
  files: true,
  submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
} as const

export async function applyItemEdit(
  itemId: string,
  data: { title?: string; abstract?: string; type?: string; year?: number; language?: string; doi?: string; divisionId?: string; subjectIds?: string[]; keywords?: string[]; authors?: { firstName: string; lastName: string; email?: string; orcid?: string }[]; status?: string; rejectionReason?: string },
  statusOverride?: string
) {
  const { title, abstract, type, year, language, doi, divisionId, subjectIds, keywords, authors } = data
  const newStatus = statusOverride ?? data.status

  return prisma.$transaction(async tx => {
    if (authors !== undefined) {
      await tx.itemAuthor.deleteMany({ where: { itemId } })
      const authorRecords = await Promise.all(
        authors.map(async (a, idx) => {
          const author = await tx.author.create({
            data: { firstName: a.firstName, lastName: a.lastName, email: a.email || null, orcid: a.orcid || null },
          })
          return { authorId: author.id, order: idx }
        })
      )
      await tx.itemAuthor.createMany({ data: authorRecords.map(a => ({ itemId, ...a })) })
    }

    if (subjectIds !== undefined) {
      await tx.itemSubject.deleteMany({ where: { itemId } })
      await tx.itemSubject.createMany({ data: subjectIds.map(id => ({ itemId, subjectId: id })) })
    }

    if (keywords !== undefined) {
      await tx.itemKeyword.deleteMany({ where: { itemId } })
      const kwRecords = await Promise.all(
        keywords.map(async v => {
          const kw = await tx.keyword.upsert({ where: { value: v }, update: {}, create: { value: v } })
          return kw.id
        })
      )
      await tx.itemKeyword.createMany({ data: kwRecords.map(id => ({ itemId, keywordId: id })) })
    }

    return tx.item.update({
      where: { id: itemId },
      data: {
        ...(title !== undefined && { title }),
        ...(abstract !== undefined && { abstract }),
        ...(type !== undefined && { type: type as never }),
        ...(year !== undefined && { year }),
        ...(language !== undefined && { language }),
        ...(doi !== undefined && { doi: doi || null }),
        ...(divisionId !== undefined && { divisionId }),
        ...(newStatus !== undefined && { status: newStatus as never }),
        ...(data.rejectionReason !== undefined && { rejectionReason: data.rejectionReason }),
        pendingEdit: Prisma.DbNull,
        pendingEditAt: null,
      },
      include: ITEM_INCLUDE,
    })
  })
}
