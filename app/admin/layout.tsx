import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const ADMIN_LINKS = [
  { href: '/admin',       label: 'Dashboard' },
  { href: '/admin/items', label: 'Items' },
  { href: '/admin/users', label: 'Users' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  return (
    <div className="max-w-content section-pad flex gap-8 items-start">
      <aside className="w-52 shrink-0">
        <div className="card p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted mb-3 px-2">
            Admin panel
          </p>
          <nav aria-label="Admin navigation">
            <ul className="space-y-0.5">
              {ADMIN_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-ink dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 hover:no-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
