'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function WithdrawButton({ itemId }: { itemId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this item permanently? This cannot be undone.')) return
    setLoading(true)
    await fetch(`/api/items/${itemId}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-500 hover:underline disabled:opacity-50"
      aria-label="Delete item"
    >
      {loading ? 'Deleting…' : 'Delete'}
    </button>
  )
}
