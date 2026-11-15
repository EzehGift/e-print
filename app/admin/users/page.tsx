import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { AdminUserActions } from './user-actions'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'User Management — Admin' }

export default async function AdminUsersPage() {
  const [session, users] = await Promise.all([
    getServerSession(authOptions),
    prisma.user.findMany({
      include: { faculty: true, _count: { select: { items: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User <span className="accent">management</span></h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left pb-3 font-semibold">Name</th>
              <th className="text-left pb-3 font-semibold">Email</th>
              <th className="text-left pb-3 font-semibold w-36">Faculty</th>
              <th className="text-left pb-3 font-semibold w-24">Role</th>
              <th className="text-left pb-3 font-semibold w-20">Items</th>
              <th className="text-left pb-3 font-semibold w-32">Joined</th>
              <th className="text-left pb-3 font-semibold w-40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-3 font-medium">
                  {user.firstName} {user.lastName}
                  {user.id === session?.user.id && <span className="ml-1 text-xs text-muted">(you)</span>}
                </td>
                <td className="py-3 text-muted">{user.email}</td>
                <td className="py-3 text-muted text-xs">{user.faculty?.name ?? '—'}</td>
                <td className="py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    user.role === 'ADMIN' ? 'bg-red-100 text-red-700'
                    : user.role === 'RESEARCHER' ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 text-muted">{user._count.items}</td>
                <td className="py-3 text-muted">{formatDate(user.createdAt)}</td>
                <td className="py-3">
                  {user.id !== session?.user.id && (
                    <AdminUserActions userId={user.id} currentRole={user.role} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
