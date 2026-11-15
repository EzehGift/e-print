'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ItemType } from '@prisma/client'
import { StepMetadata } from '@/components/deposit/step-metadata'
import { CreateItemInput } from '@/lib/validation'

interface Subject { id: string; name: string }

interface EditDepositClientProps {
  itemId: string
  itemStatus: string
  defaultValues: Partial<CreateItemInput>
  subjects: Subject[]
}

type SuccessType = 'saved' | 'pending'

export function EditDepositClient({ itemId, itemStatus, defaultValues, subjects }: EditDepositClientProps) {
  const router = useRouter()
  const [success, setSuccess] = useState<SuccessType | null>(null)

  const isDraft = itemStatus === 'DRAFT'

  async function handleSave(data: CreateItemInput) {
    const res = await fetch(`/api/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Save failed')
    const json = await res.json()
    setSuccess(json.pendingEdit ? 'pending' : 'saved')
    setTimeout(() => router.push('/manage'), 2500)
  }

  if (success === 'saved') {
    return (
      <div className="max-w-content section-pad text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Changes saved</h2>
        <p className="text-muted">Redirecting to your deposits…</p>
      </div>
    )
  }

  if (success === 'pending') {
    return (
      <div className="max-w-content section-pad text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Edit request submitted</h2>
        <p className="text-muted">Your changes have been sent to an administrator for review. Redirecting…</p>
      </div>
    )
  }

  return (
    <div className="max-w-content section-pad max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">
        Edit <span className="accent">deposit</span>
      </h1>
      {!isDraft && (
        <div className="card border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 mb-6 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Your edit request will be sent to an administrator for approval before any changes take effect.
        </div>
      )}
      <StepMetadata
        itemType={(defaultValues.type as ItemType) ?? ItemType.OTHER}
        defaultValues={defaultValues}
        subjects={subjects}
        onNext={handleSave}
        onBack={() => router.push('/manage')}
      />
    </div>
  )
}
