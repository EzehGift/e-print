import { NextRequest } from 'next/server'
import { handleOaiRequest } from '@/lib/oai'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const verb = searchParams.get('verb') ?? ''
  const params: Record<string, string> = {}
  searchParams.forEach((v, k) => { if (k !== 'verb') params[k] = v })

  const xml = await handleOaiRequest(verb, params)
  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  })
}
