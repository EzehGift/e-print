'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminPendingEditActionsProps {
  itemId: string
}

export function AdminPendingEditActions({ itemId }: AdminPendingEditActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleAction(action: 'approve' | 'reject') {
    setLoading(true)
    await fetch(`/api/items/${itemId}/pending-edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    router.refresh()
    setLoading(false)
  }

  if (loading) return <span className="text-xs text-muted">Updating…</span>

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction('approve')}
        className="flex-1 text-xs px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-medium"
      >
        Approve edit
      </button>
      <button
        onClick={() => handleAction('reject')}
        className="flex-1 text-xs px-3 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded hover:bg-slate-300 dark:hover:bg-slate-500 font-medium"
      >
        Reject edit
      </button>
    </div>
  )
}
