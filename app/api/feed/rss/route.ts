import { generateRssFeed } from '@/lib/feeds'

export const dynamic = 'force-dynamic'

export async function GET() {
  const xml = await generateRssFeed()
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
