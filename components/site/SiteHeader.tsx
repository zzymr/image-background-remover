'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import BrandMark from '@/components/BrandMark'
import type { SessionUser } from '@/lib/auth-shared'

type SessionResponse = {
  configured: boolean
  authenticated: boolean
  user: SessionUser | null
}

export default function SiteHeader() {
  const pathname = usePathname()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadSession() {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' })
        const data = (await response.json()) as SessionResponse
        if (active) {
          setUser(data.user)
        }
      } catch {
        if (active) {
          setUser(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadSession()

    return () => {
      active = false
    }
  }, [pathname])

  const studioMode = pathname.startsWith('/dashboard') || pathname.startsWith('/history')

  const navItems = useMemo(
    () =>
      studioMode
        ? [
            { label: 'Tools', href: '/' },
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'History', href: '/history' },
            { label: 'Pricing', href: '/pricing' },
          ]
        : [
            { label: 'Features', href: '/#features' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'About', href: '/#about' },
          ],
    [studioMode],
  )

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Failed to logout:', error)
    } finally {
      window.location.href = '/'
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/92 backdrop-blur-xl">
      <div className="shell flex min-h-[72px] items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <BrandMark compact={studioMode} />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : item.href.includes('#')
                  ? pathname === '/'
                  : pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${
                  active ? 'text-[var(--ink)]' : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-10 w-24 rounded-full bg-[var(--surface-low)]" />
          ) : user ? (
            <>
              <Link href="/dashboard" className="secondary-button hidden sm:inline-flex">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="primary-button">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="secondary-button hidden sm:inline-flex">
                Sign In
              </Link>
              <Link href="/login" className="primary-button">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
