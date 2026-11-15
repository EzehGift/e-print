import { generateAtomFeed } from '@/lib/feeds'

export const dynamic = 'force-dynamic'

export async function GET() {
  const xml = await generateAtomFeed()
  return new Response(xml, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  })
}
