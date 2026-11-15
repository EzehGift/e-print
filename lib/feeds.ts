import { prisma } from './prisma'

const BASE_URL = 'https://eprints.gouni.edu.ng'
const REPO_NAME = 'GOREPO'

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function getRecentItems() {
  return prisma.item.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      authors: { include: { author: true }, orderBy: { order: 'asc' } },
      division: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
}

export async function generateAtomFeed(): Promise<string> {
  const items = await getRecentItems()
  const updated = items[0]?.updatedAt ?? new Date()

  const entries = items
    .map(item => {
      const authorNames = [...item.authors]
        .sort((a, b) => a.order - b.order)
        .map(a => `<author><name>${xmlEscape(`${a.author.firstName} ${a.author.lastName}`)}</name></author>`)
        .join('\n    ')

      return `  <entry>
    <id>${BASE_URL}/items/${item.id}</id>
    <title>${xmlEscape(item.title)}</title>
    <link rel="alternate" href="${BASE_URL}/items/${item.id}"/>
    ${authorNames}
    <updated>${item.updatedAt.toISOString()}</updated>
    <published>${item.createdAt.toISOString()}</published>
    <summary>${xmlEscape(item.abstract.slice(0, 300))}...</summary>
    <category term="${item.type}"/>
  </entry>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${REPO_NAME}</title>
  <subtitle>Latest research from Godfrey Okoye University</subtitle>
  <link rel="alternate" href="${BASE_URL}"/>
  <link rel="self" href="${BASE_URL}/api/feed/atom"/>
  <id>${BASE_URL}/api/feed/atom</id>
  <updated>${updated.toISOString()}</updated>
  <author><name>GOREPO</name><email>eprints@gouni.edu.ng</email></author>
${entries}
</feed>`
}

export async function generateRssFeed(): Promise<string> {
  const items = await getRecentItems()

  const rssItems = items
    .map(item => {
      const authorNames = [...item.authors]
        .sort((a, b) => a.order - b.order)
        .map(a => `${a.author.firstName} ${a.author.lastName}`)
        .join(', ')

      return `    <item>
      <title>${xmlEscape(item.title)}</title>
      <link>${BASE_URL}/items/${item.id}</link>
      <guid isPermaLink="true">${BASE_URL}/items/${item.id}</guid>
      <description>${xmlEscape(item.abstract.slice(0, 300))}...</description>
      <author>${xmlEscape(authorNames)}</author>
      <pubDate>${item.createdAt.toUTCString()}</pubDate>
      <category>${item.type}</category>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${REPO_NAME}</title>
    <link>${BASE_URL}</link>
    <description>Latest research outputs from Godfrey Okoye University, Enugu, Nigeria</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>eprints@gouni.edu.ng (GOREPO)</managingEditor>
${rssItems}
  </channel>
</rss>`
}
