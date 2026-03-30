'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type StudioSidebarProps = {
  stats?: {
    totalJobs?: number
    creditsUsed?: number
    completedJobs?: number
  }
}

const navItems = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Remove BG', href: '/' },
  { label: 'History', href: '/history' },
  { label: 'Pricing', href: '/pricing' },
]

export default function StudioSidebar({ stats }: StudioSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="space-y-6">
      <div className="soft-panel p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Main navigation
        </p>
        <div className="mt-4 space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? 'bg-white text-[var(--brand)] shadow-[0_14px_30px_rgba(15,23,42,0.06)]'
                    : 'text-[var(--muted)] hover:bg-white/70 hover:text-[var(--ink)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="rounded-[24px] bg-[linear-gradient(135deg,rgba(137,60,146,0.14)_0%,rgba(110,159,255,0.12)_100%)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          Workspace usage
        </p>
        <div className="mt-4 space-y-2">
          <p className="text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
            {stats?.completedJobs ?? 0}
          </p>
          <p className="text-sm text-[var(--muted)]">Completed cutouts in your current workspace.</p>
        </div>

        <div className="mt-5 rounded-full bg-white/70 px-4 py-3 text-sm text-[var(--ink)]">
          Credits used: <span className="font-semibold">{stats?.creditsUsed ?? 0}</span>
        </div>
      </div>
    </aside>
  )
}
