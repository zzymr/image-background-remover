'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BrandMark from '@/components/BrandMark'

const navItems = [
  { label: 'Product', href: '/#tool', match: '/' },
  { label: 'Workflow', href: '/#workflow', match: '/' },
  { label: 'Pricing', href: '/pricing', match: '/pricing' },
]

export default function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-[28px] border border-white/55 bg-white/80 px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-6">
        <Link href="/" className="shrink-0">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.match

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-headline text-sm font-semibold tracking-tight transition-colors ${
                  active ? 'text-[var(--ink)]' : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/pricing" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--surface-low)] sm:inline-flex">
            View pricing
          </Link>
          <Link
            href="/#tool"
            className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#0057bd_0%,#004ca6_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(0,87,189,0.28)] transition hover:-translate-y-0.5"
          >
            Try the workflow
          </Link>
        </div>
      </div>
    </header>
  )
}
