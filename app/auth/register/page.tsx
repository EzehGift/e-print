'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterInput } from '@/lib/validation'

interface Faculty { id: string; name: string }

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  useEffect(() => {
    fetch('/api/divisions')
      .then(r => r.json())
      .then((tree: { id: string; name: string; level: string; children: { id: string; name: string; level: string }[] }[]) => {
        const facs = tree.flatMap(node =>
          node.level === 'FACULTY' ? [node] : node.children.filter(c => c.level === 'FACULTY')
        )
        setFaculties(facs)
      })
  }, [])

  async function onSubmit(data: RegisterInput) {
    setServerError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()

    if (!res.ok) {
      setServerError(json.error ?? 'Registration failed')
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/auth/login'), 2500)
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="card text-center max-w-sm w-full p-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl mb-2">Account created</h2>
          <p className="text-sm text-muted">Redirecting you to sign in…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2 hover:no-underline mb-2">
            <Image
              src="/my-logo.svg"
              alt="GOREPO"
              width={48}
              height={48}
              className="h-12 w-auto"
              priority
              unoptimized
            />
            <span className="font-display font-bold text-ink dark:text-slate-100 text-lg tracking-tight leading-none">
              GOREPO
            </span>
          </Link>
          <h1 className="text-2xl mt-4 mb-1">Create an account</h1>
          <p className="text-sm text-muted">GOUNI institutional email required</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="label">First name</label>
                <input id="firstName" type="text" className="input" {...register('firstName')} />
                {errors.firstName && <p className="field-error">{errors.firstName.message}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="label">Last name</label>
                <input id="lastName" type="text" className="input" {...register('lastName')} />
                {errors.lastName && <p className="field-error">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="label">Institutional email</label>
              <input
                id="reg-email"
                type="email"
                className="input"
                placeholder="you@gouni.edu.ng"
                {...register('email')}
              />
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="facultyId" className="label">
                Faculty <span className="text-muted font-normal">(optional)</span>
              </label>
              <select id="facultyId" className="input" {...register('facultyId')}>
                <option value="">— Select faculty —</option>
                {faculties.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reg-password" className="label">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Minimum 8 characters"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">Confirm password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className="input pr-10"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
            </div>

            {serverError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3" role="alert">
                <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3"
              aria-label="Create account"
            >
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>

          </form>

          <div className="mt-6 pt-5 border-t border-border dark:border-slate-700 text-center">
            <p className="text-sm text-muted">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-accent hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
