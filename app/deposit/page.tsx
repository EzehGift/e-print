'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ItemType } from '@prisma/client'
import { WizardProgress } from '@/components/deposit/wizard-progress'
import { StepType } from '@/components/deposit/step-type'
import { StepMetadata } from '@/components/deposit/step-metadata'
import { StepFiles } from '@/components/deposit/step-files'
import { CreateItemInput } from '@/lib/validation'
import Link from 'next/link'

interface Subject { id: string; name: string }

const STEPS = ['Item type', 'Details', 'Files']

export default function DepositPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [selectedType, setSelectedType] = useState<ItemType | null>(null)
  const [itemId, setItemId] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/subjects')
      .then(r => r.json())
      .then(setSubjects)
  }, [])

  function handleTypeSelect(type: ItemType) {
    setSelectedType(type)
    setStep(1)
  }

  async function handleMetadataNext(data: CreateItemInput) {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const e = await res.json()
      throw new Error(e.error ?? 'Failed to save item')
    }
    const item = await res.json()
    setItemId(item.id)
    setStep(2)
  }

  async function handleFilesSubmit() {
    if (!itemId) return
    await fetch(`/api/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'UNDER_REVIEW' }),
    })
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="max-w-content section-pad text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="text-2xl mb-2">Submission received</h1>
        <p className="text-muted mb-8 max-w-sm mx-auto leading-relaxed">
          Your item has been submitted for review. You&apos;ll be notified once it is published.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push('/manage')} className="btn-primary">
            View my deposits
          </button>
          {itemId && (
            <button onClick={() => router.push(`/items/${itemId}`)} className="btn-ghost">
              Preview item
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-content section-pad">
      <div className="max-w-2xl mx-auto">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-2">
          Deposit
        </p>
        <h1 className="text-3xl mb-8">
          Submit a <span className="accent">new item</span>
        </h1>

        <WizardProgress currentStep={step} steps={STEPS} />

        {step === 0 && (
          <StepType selectedType={selectedType} onNext={handleTypeSelect} />
        )}
        {step === 1 && selectedType && (
          <StepMetadata
            itemType={selectedType}
            subjects={subjects}
            onNext={handleMetadataNext}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && itemId && (
          <StepFiles
            itemId={itemId}
            onBack={() => setStep(1)}
            onSubmit={handleFilesSubmit}
          />
        )}
      </div>
    </div>
  )
}
