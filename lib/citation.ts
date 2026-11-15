import { ItemType } from '@prisma/client'

export interface CitationAuthor {
  firstName: string
  lastName: string
  order: number
}

export interface CitationItem {
  id: string
  title: string
  abstract: string
  type: ItemType
  year: number
  uri: string
  doi?: string | null
  language: string
  division?: { name: string } | null
}

const INSTITUTION = 'Godfrey Okoye University'
const BASE_URL = 'https://eprints.gouni.edu.ng'

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map(n => n[0].toUpperCase() + '.')
    .join(' ')
}

function apaAuthor(a: CitationAuthor, index: number): string {
  if (index === 0) {
    return `${a.lastName}, ${initials(a.firstName)}`
  }
  return `${initials(a.firstName)} ${a.lastName}`
}

const APA_TYPE_LABELS: Record<ItemType, string> = {
  THESIS: 'Doctoral dissertation',
  ARTICLE: 'Journal article',
  BOOK: 'Book',
  BOOK_CHAPTER: 'Book chapter',
  CONFERENCE_PAPER: 'Conference paper',
  REPORT: 'Technical report',
  OTHER: 'Work',
}

const BIBTEX_ENTRY_TYPES: Record<ItemType, string> = {
  THESIS: 'phdthesis',
  ARTICLE: 'article',
  BOOK: 'book',
  BOOK_CHAPTER: 'inbook',
  CONFERENCE_PAPER: 'inproceedings',
  REPORT: 'techreport',
  OTHER: 'misc',
}

function makeCiteKey(item: CitationItem, authors: CitationAuthor[]): string {
  const first = authors[0]
  const lastName = first ? first.lastName.replace(/[^a-zA-Z]/g, '') : 'unknown'
  const titleWord = item.title.split(/\s+/)[0].replace(/[^a-zA-Z]/g, '')
  return `${lastName}${item.year}${titleWord}`.toLowerCase()
}

export function generateCitations(
  item: CitationItem,
  authors: CitationAuthor[]
): { apa: string; mla: string; bibtex: string } {
  const sorted = [...authors].sort((a, b) => a.order - b.order)
  const url = `${BASE_URL}/id/eprint/${item.id}`

  // ─── APA ────────────────────────────────────────────────────────────────────
  let apaAuthors = ''
  if (sorted.length === 1) {
    apaAuthors = apaAuthor(sorted[0], 0)
  } else {
    const parts = sorted.map((a, i) => apaAuthor(a, i))
    apaAuthors = parts.slice(0, -1).join(', ') + ', & ' + parts[parts.length - 1]
  }
  const apaType = APA_TYPE_LABELS[item.type]
  const apa = `${apaAuthors} (${item.year}). ${item.title} [${apaType}, ${INSTITUTION}]. ${url}`

  // ─── MLA ────────────────────────────────────────────────────────────────────
  let mlaAuthors = ''
  if (sorted.length === 0) {
    mlaAuthors = 'Unknown'
  } else if (sorted.length === 1) {
    const a = sorted[0]
    mlaAuthors = `${a.lastName}, ${a.firstName}`
  } else {
    const first = sorted[0]
    const rest = sorted.slice(1).map(a => `${a.firstName} ${a.lastName}`)
    mlaAuthors = `${first.lastName}, ${first.firstName}, and ${rest.join(', and ')}`
  }
  const mla = `${mlaAuthors}. "${item.title}." ${INSTITUTION}, ${item.year}, ${url}.`

  // ─── BibTeX ─────────────────────────────────────────────────────────────────
  const entryType = BIBTEX_ENTRY_TYPES[item.type]
  const citeKey = makeCiteKey(item, sorted)
  const bibtexAuthors = sorted.map(a => `${a.lastName}, ${a.firstName}`).join(' and ')
  const bibtexLines = [
    `@${entryType}{${citeKey},`,
    `  author = {${bibtexAuthors}},`,
    `  title = {${item.title}},`,
    `  year = {${item.year}},`,
    `  school = {${INSTITUTION}},`,
    item.doi ? `  doi = {${item.doi}},` : null,
    `  url = {${url}},`,
    `  note = {${item.uri}}`,
    `}`,
  ]
    .filter(Boolean)
    .join('\n')

  return { apa, mla, bibtex: bibtexLines }
}
