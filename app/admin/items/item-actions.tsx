'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminItemActionsProps {
  itemId: string
  currentStatus: string
}

export function AdminItemActions({ itemId, currentStatus }: AdminItemActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function updateStatus(status: string, rejectionReason?: string) {
    setLoading(true)
    await fetch(`/api/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...(rejectionReason ? { rejectionReason } : {}) }),
    })
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/items/${itemId}`, { method: 'DELETE' })
    router.refresh()
    router.push('/admin/items')
  }

  async function handleReject() {
    const reason = prompt('Reason for rejection (optional):') ?? undefined
    await updateStatus('REJECTED', reason)
  }

  if (loading) return <span className="text-xs text-muted">Updating…</span>

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1.5">
        {currentStatus === 'UNDER_REVIEW' && (
          <>
            <button
              onClick={() => updateStatus('PUBLISHED')}
              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={handleReject}
              className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reject
            </button>
          </>
        )}
        {currentStatus === 'PUBLISHED' && (
          <button
            onClick={() => updateStatus('UNDER_REVIEW')}
            className="text-xs px-2 py-1 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200 rounded hover:bg-gray-300 dark:hover:bg-slate-500"
          >
            Unpublish
          </button>
        )}
        {currentStatus === 'REJECTED' && (
          <button
            onClick={() => updateStatus('UNDER_REVIEW')}
            className="text-xs px-2 py-1 bg-amber-500 text-white rounded hover:bg-amber-600"
          >
            Re-review
          </button>
        )}
      </div>

      {/* Delete */}
      {!confirmDelete ? (
        <button
          onClick={() => setConfirmDelete(true)}
          className="w-full text-xs px-2 py-1 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 mt-2"
        >
          Delete permanently
        </button>
      ) : (
        <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 space-y-1.5">
          <p className="text-xs text-red-700 dark:text-red-400 font-medium">This cannot be undone.</p>
          <div className="flex gap-1.5">
            <button
              onClick={handleDelete}
              className="flex-1 text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 text-xs px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
