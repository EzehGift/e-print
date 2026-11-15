'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTheme } from './theme-provider'

const NAV_LINKS = [
  { href: '/',         label: 'Home' },
  { href: '/browse',   label: 'Browse' },
  { href: '/search',   label: 'Search' },
  { href: '/about',    label: 'About' },
  { href: '/policies', label: 'Policies' },
]

function ProfileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { theme, toggle } = useTheme()

  return (
    <header
      className="sticky top-0 z-50 bg-white dark:bg-slate-900 h-[70px] flex items-center border-b border-slate-200 dark:border-slate-700/60"
      style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.07)' }}
    >
      <div className="relative w-full flex items-center justify-between px-6 md:px-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover:no-underline shrink-0 z-10">
          <Image
            src="/my-logo.svg"
            alt="GOREPO"
            width={2}
            height={22}
            className="h-8 w-auto"
            priority
            unoptimized
          />
          <span className="font-display font-bold text-ink text-[17px] tracking-tight leading-none">
            GOREPO
          </span>
        </Link>

        {/* Primary nav — absolutely centred */}
        <nav
          className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hover:no-underline',
                pathname === link.href
                  ? 'text-navy dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
              )}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth section */}
        <div className="flex items-center gap-2 shrink-0 z-10">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          {session ? (
            <>
              {session.user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className={cn(
                    'text-sm font-medium px-3 py-1.5 rounded-lg hover:no-underline transition-colors',
                    pathname.startsWith('/admin')
                      ? 'text-navy dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-ink dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                title="My Profile"
                className={cn(
                  'flex items-center justify-center w-9 h-9 rounded-full border transition-colors hover:no-underline',
                  pathname === '/profile'
                    ? 'bg-navy text-white border-navy'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-navy hover:text-white hover:border-navy'
                )}
                aria-label="My profile"
              >
                <ProfileIcon />
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost text-sm px-4 py-2 h-9 hover:no-underline">
                Sign In
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm px-4 py-2 h-9 hover:no-underline">
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  )
}
