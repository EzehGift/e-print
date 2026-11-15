import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATHS = ['/deposit', '/manage', '/admin']
const ADMIN_PATHS = ['/admin']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(loginUrl)
  }

  const isAdmin = ADMIN_PATHS.some(p => pathname.startsWith(p))
  if (isAdmin && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/deposit/:path*', '/manage/:path*', '/admin/:path*'],
}
