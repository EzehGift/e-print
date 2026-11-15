import { prisma } from './prisma'
import { ItemType } from '@prisma/client'

const BASE_URL = 'https://eprints.gouni.edu.ng'
const OAI_BASE = `${BASE_URL}/api/oai`
const ADMIN_EMAIL = 'eprints@gouni.edu.ng'
const REPO_NAME = 'GOREPO'

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function oaiHeader(verb: string, params: Record<string, string> = {}): string {
  const paramStr = Object.entries(params)
    .map(([k, v]) => ` ${k}="${xmlEscape(v)}"`)
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/
           http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">
  <responseDate>${new Date().toISOString()}</responseDate>
  <request verb="${verb}"${paramStr}>${OAI_BASE}</request>`
}

const oaiFooter = `\n</OAI-PMH>`

function oaiError(code: string, message: string, verb?: string): string {
  return `${oaiHeader(verb ?? '')}
  <error code="${code}">${xmlEscape(message)}</error>${oaiFooter}`
}

const DC_TYPE_MAP: Record<ItemType, string> = {
  THESIS: 'Text',
  ARTICLE: 'Text',
  BOOK: 'Text',
  BOOK_CHAPTER: 'Text',
  CONFERENCE_PAPER: 'Text',
  REPORT: 'Text',
  OTHER: 'Text',
}

function itemToDC(item: {
  id: string
  title: string
  abstract: string
  type: ItemType
  year: number
  uri: string
  doi?: string | null
  language: string
  updatedAt: Date
  authors: { author: { firstName: string; lastName: string }; order: number }[]
  subjects: { subject: { name: string } }[]
  keywords: { keyword: { value: string } }[]
  files: { mimeType: string }[]
}): string {
  const identifier = `oai:eprints.gouni.edu.ng:${item.id}`
  const datestamp = item.updatedAt.toISOString()
  const sortedAuthors = [...item.authors].sort((a, b) => a.order - b.order)

  const dcCreators = sortedAuthors
    .map(a => `      <dc:creator>${xmlEscape(`${a.author.lastName}, ${a.author.firstName}`)}</dc:creator>`)
    .join('\n')

  const dcSubjects = [
    ...item.subjects.map(s => `      <dc:subject>${xmlEscape(s.subject.name)}</dc:subject>`),
    ...item.keywords.map(k => `      <dc:subject>${xmlEscape(k.keyword.value)}</dc:subject>`),
  ].join('\n')

  const dcIdentifiers = [
    `      <dc:identifier>${xmlEscape(`${BASE_URL}/items/${item.id}`)}</dc:identifier>`,
    item.doi ? `      <dc:identifier>${xmlEscape(item.doi)}</dc:identifier>` : null,
  ].filter(Boolean).join('\n')

  const dcFormats = item.files
    .map(f => `      <dc:format>${xmlEscape(f.mimeType)}</dc:format>`)
    .join('\n')

  return `    <record>
      <header>
        <identifier>${identifier}</identifier>
        <datestamp>${datestamp}</datestamp>
      </header>
      <metadata>
        <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
                   xmlns:dc="http://purl.org/dc/elements/1.1/"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/
                     http://www.openarchives.org/OAI/2.0/oai_dc.xsd">
          <dc:title>${xmlEscape(item.title)}</dc:title>
${dcCreators}
${dcSubjects}
          <dc:description>${xmlEscape(item.abstract)}</dc:description>
          <dc:date>${item.year}</dc:date>
          <dc:type>${DC_TYPE_MAP[item.type]}</dc:type>
          <dc:language>${xmlEscape(item.language)}</dc:language>
${dcIdentifiers}
${dcFormats}
          <dc:publisher>${xmlEscape('Godfrey Okoye University')}</dc:publisher>
        </oai_dc:dc>
      </metadata>
    </record>`
}

export async function handleOaiRequest(
  verb: string,
  params: Record<string, string>
): Promise<string> {
  if (!verb) return oaiError('badVerb', 'Missing verb parameter')

  if (verb === 'Identify') {
    const earliest = await prisma.item.findFirst({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    })
    return `${oaiHeader('Identify')}
  <Identify>
    <repositoryName>${REPO_NAME}</repositoryName>
    <baseURL>${OAI_BASE}</baseURL>
    <protocolVersion>2.0</protocolVersion>
    <adminEmail>${ADMIN_EMAIL}</adminEmail>
    <earliestDatestamp>${earliest?.createdAt.toISOString() ?? '2018-01-01T00:00:00Z'}</earliestDatestamp>
    <deletedRecord>no</deletedRecord>
    <granularity>YYYY-MM-DDThh:mm:ssZ</granularity>
  </Identify>${oaiFooter}`
  }

  if (verb === 'ListMetadataFormats') {
    return `${oaiHeader('ListMetadataFormats')}
  <ListMetadataFormats>
    <metadataFormat>
      <metadataPrefix>oai_dc</metadataPrefix>
      <schema>http://www.openarchives.org/OAI/2.0/oai_dc.xsd</schema>
      <metadataNamespace>http://www.openarchives.org/OAI/2.0/oai_dc/</metadataNamespace>
    </metadataFormat>
  </ListMetadataFormats>${oaiFooter}`
  }

  if (verb === 'ListSets') {
    return oaiError('noSetHierarchy', 'This repository does not support sets', verb)
  }

  if (verb === 'ListRecords' || verb === 'ListIdentifiers') {
    const { metadataPrefix, from, until } = params
    if (!metadataPrefix) {
      return oaiError('badArgument', 'metadataPrefix is required', verb)
    }
    if (metadataPrefix !== 'oai_dc') {
      return oaiError('cannotDisseminateFormat', `Format ${metadataPrefix} is not supported`, verb)
    }

    const where: Record<string, unknown> = { status: 'PUBLISHED' }
    if (from || until) {
      where.updatedAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(until ? { lte: new Date(until) } : {}),
      }
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        authors: { include: { author: true }, orderBy: { order: 'asc' } },
        subjects: { include: { subject: true } },
        keywords: { include: { keyword: true } },
        files: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    })

    if (items.length === 0) {
      return oaiError('noRecordsMatch', 'No records match the given criteria', verb)
    }

    if (verb === 'ListIdentifiers') {
      const headers = items
        .map(item => `    <header>
      <identifier>oai:eprints.gouni.edu.ng:${item.id}</identifier>
      <datestamp>${item.updatedAt.toISOString()}</datestamp>
    </header>`)
        .join('\n')
      return `${oaiHeader('ListIdentifiers', { metadataPrefix })}
  <ListIdentifiers>
${headers}
  </ListIdentifiers>${oaiFooter}`
    }

    const records = items.map(item => itemToDC(item as Parameters<typeof itemToDC>[0])).join('\n')
    return `${oaiHeader('ListRecords', { metadataPrefix })}
  <ListRecords>
${records}
  </ListRecords>${oaiFooter}`
  }

  if (verb === 'GetRecord') {
    const { identifier, metadataPrefix } = params
    if (!identifier) return oaiError('badArgument', 'identifier is required', verb)
    if (!metadataPrefix) return oaiError('badArgument', 'metadataPrefix is required', verb)
    if (metadataPrefix !== 'oai_dc') {
      return oaiError('cannotDisseminateFormat', `Format ${metadataPrefix} is not supported`, verb)
    }

    const itemId = identifier.replace('oai:eprints.gouni.edu.ng:', '')
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        authors: { include: { author: true }, orderBy: { order: 'asc' } },
        subjects: { include: { subject: true } },
        keywords: { include: { keyword: true } },
        files: true,
      },
    })

    if (!item || item.status !== 'PUBLISHED') {
      return oaiError('idDoesNotExist', `No record with identifier ${identifier}`, verb)
    }

    return `${oaiHeader('GetRecord', { identifier, metadataPrefix })}
  <GetRecord>
${itemToDC(item as Parameters<typeof itemToDC>[0])}
  </GetRecord>${oaiFooter}`
  }

  return oaiError('badVerb', `Illegal OAI verb: ${verb}`)
}
