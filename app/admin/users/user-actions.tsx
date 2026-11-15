'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ROLES = ['VIEWER', 'RESEARCHER', 'ADMIN'] as const
type Role = typeof ROLES[number]

export function AdminUserActions({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function changeRole(role: Role) {
    setLoading(true)
    await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <select
      value={currentRole}
      onChange={e => changeRole(e.target.value as Role)}
      disabled={loading}
      className="text-xs border border-border rounded px-2 py-1 bg-white"
      aria-label="Change user role"
    >
      {ROLES.map(r => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>
  )
}
