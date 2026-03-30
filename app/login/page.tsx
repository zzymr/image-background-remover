'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { SessionUser } from '@/lib/auth-shared'
import { getAuthErrorMessage } from '@/lib/auth-shared'

type SessionResponse = {
  configured: boolean
  authenticated: boolean
  user: SessionUser | null
}

export default function LoginPage() {
  const [session, setSession] = useState<SessionResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadSession() {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' })
        const data = (await response.json()) as SessionResponse
        if (active) {
          setSession(data)
        }
      } catch (error) {
        console.error('Failed to load session:', error)
        if (active) {
          setSession({ configured: false, authenticated: false, user: null })
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
  }, [])

  const authErrorMessage = useMemo(() => {
    if (typeof window === 'undefined') return null
    const params = new URL(window.location.href).searchParams
    const authError = params.get('authError')
    return authError ? getAuthErrorMessage(authError) : null
  }, [])

  const isConfigured = session?.configured ?? false
  const user = session?.user ?? null

  return (
    <div className="shell py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="editorial-card mx-auto max-w-[440px] px-8 py-10 sm:px-10">
          <div className="text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
              Welcome Back
            </h1>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Step back into the Ethereal Canvas.
            </p>
          </div>

          {authErrorMessage && (
            <div className="mt-6 rounded-[20px] bg-[rgba(179,27,37,0.06)] px-4 py-3 text-sm leading-7 text-[var(--error)]">
              {authErrorMessage}
            </div>
          )}

          {loading ? (
            <div className="mt-8 soft-panel p-5 text-center text-sm text-[var(--muted)]">
              Checking your studio access…
            </div>
          ) : user ? (
            <div className="mt-8 space-y-5 text-center">
              <div className="soft-panel p-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name || user.email} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-[var(--brand)]">{(user.name || user.email).slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
                <p className="mt-4 text-lg font-semibold text-[var(--ink)]">{user.name || user.email}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">You are already signed in.</p>
              </div>

              <Link href="/dashboard" className="primary-button w-full">
                Continue to Dashboard
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/api/auth/google/start'
                }}
                disabled={!isConfigured}
                className="secondary-button w-full !justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-3">
                  <path d="M21.8 12.23c0-.72-.06-1.25-.19-1.8H12v3.39h5.65c-.11.84-.72 2.1-2.08 2.95l-.02.11 3.02 2.34.21.02c1.9-1.75 3.02-4.33 3.02-7.01Z" fill="#4285F4"/>
                  <path d="M12 22c2.76 0 5.07-.91 6.76-2.47l-3.22-2.48c-.86.6-2.02 1.02-3.54 1.02-2.7 0-4.99-1.75-5.81-4.18l-.1.01-3.14 2.44-.03.1A10 10 0 0 0 12 22Z" fill="#34A853"/>
                  <path d="M6.19 13.89A6.07 6.07 0 0 1 5.85 12c0-.66.12-1.3.32-1.89l-.01-.13-3.17-2.48-.1.05A10 10 0 0 0 2 12c0 1.61.39 3.13 1.09 4.45l3.1-2.56Z" fill="#FBBC05"/>
                  <path d="M12 5.93c1.91 0 3.19.82 3.92 1.5l2.86-2.79C17.06 3.03 14.76 2 12 2a10 10 0 0 0-8.91 5.55l3.27 2.56c.84-2.43 3.12-4.18 5.64-4.18Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative text-center text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                <span className="relative z-10 bg-white px-3">or use email</span>
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--surface-high)]" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--ink)]">Email Address</label>
                  <input className="soft-input" placeholder="name@company.com" disabled />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-[var(--ink)]">Password</label>
                    <span className="text-xs font-semibold text-[var(--brand)]">Coming soon</span>
                  </div>
                  <input className="soft-input" placeholder="••••••••" disabled />
                </div>
              </div>

              <button type="button" className="primary-button w-full opacity-60" disabled>
                Sign In
              </button>
            </div>
          )}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-6 text-[var(--muted)]">
          By continuing, you agree to EtherealAI&apos;s terms and privacy expectations.
          AI generation time may vary slightly depending on file size and queue state.
        </p>
      </div>
    </div>
  )
}
