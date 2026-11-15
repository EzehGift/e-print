import { Suspense } from 'react'
import LoginForm from './login-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><div className="animate-pulse text-muted text-sm">Loading…</div></div>}>
      <LoginForm />
    </Suspense>
  )
}
