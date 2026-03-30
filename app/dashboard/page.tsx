'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import StudioSidebar from '@/components/studio/StudioSidebar'
import type { SessionUser } from '@/lib/auth-shared'
import { getOrCreateBrowserSessionId } from '@/lib/browser-session'

type HistoryItem = {
  id: string
  sourceFilename: string | null
  fileSize: number | null
  outputBytes: number | null
  status: 'processing' | 'completed' | 'failed'
  createdAt: string
}

type HistoryResponse = {
  configured: boolean
  items: HistoryItem[]
  summary: {
    totalJobs: number
    completedJobs: number
    failedJobs: number
    creditsUsed: number
  }
}

type SessionResponse = {
  configured: boolean
  authenticated: boolean
  user: SessionUser | null
}

const gradientCards = [
  'bg-[linear-gradient(135deg,#111827_0%,#29303e_100%)] text-white',
  'bg-[linear-gradient(135deg,#ffffff_0%,#edf2f7_100%)] text-[var(--ink)]',
  'bg-[linear-gradient(135deg,#0f172a_0%,#25407a_100%)] text-white',
  'bg-[linear-gradient(135deg,#202938_0%,#111827_100%)] text-white',
]

function formatBytes(bytes: number | null) {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function DashboardPage() {
  const [session, setSession] = useState<SessionResponse | null>(null)
  const [history, setHistory] = useState<HistoryResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const clientSessionId = getOrCreateBrowserSessionId()
        const [sessionResponse, historyResponse] = await Promise.all([
          fetch('/api/auth/session', { cache: 'no-store' }),
          fetch(`/api/history?sessionId=${encodeURIComponent(clientSessionId)}`, {
            cache: 'no-store',
            headers: {
              'x-client-session-id': clientSessionId,
            },
          }),
        ])

        const sessionData = (await sessionResponse.json()) as SessionResponse
        const historyData = historyResponse.ok
          ? ((await historyResponse.json()) as HistoryResponse)
          : null

        if (!active) return
        setSession(sessionData)
        setHistory(historyData)
      } catch (error) {
        console.error('Failed to load dashboard:', error)
        if (!active) return
        setSession({ configured: false, authenticated: false, user: null })
        setHistory(null)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      active = false
    }
  }, [])

  const user = session?.user ?? null
  const stats = history?.summary
  const recentItems = useMemo(() => history?.items?.slice(0, 4) ?? [], [history])

  if (loading) {
    return (
      <div className="shell py-12">
        <div className="editorial-card p-10 text-center text-sm text-[var(--muted)]">Loading dashboard…</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="shell py-12">
        <div className="editorial-card mx-auto max-w-2xl p-10 text-center">
          <p className="eyebrow">Google sign-in</p>
          <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
            Sign in to open your dashboard.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Your dashboard brings back account access, history, and the studio flow from your original design.
          </p>
          <Link href="/login" className="primary-button mt-8 inline-flex">
            Continue with Google
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="shell py-8 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <StudioSidebar stats={stats} />

        <div className="space-y-8">
          <section className="editorial-card p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[var(--surface-low)] shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name || user.email} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-[var(--brand)]">{(user.name || user.email).slice(0, 1).toUpperCase()}</span>
                  )}
                </div>

                <div>
                  <h1 className="font-headline text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                    {user.name || 'Studio Member'}
                  </h1>
                  <p className="mt-2 text-sm text-[var(--muted)]">{user.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[rgba(110,159,255,0.16)] px-3 py-1 text-xs font-semibold text-[var(--brand)]">
                      Google Member
                    </span>
                    <span className="rounded-full bg-[var(--surface-low)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                      Active workspace
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/#tool" className="primary-button">
                  New Project
                </Link>
                <Link href="/history" className="secondary-button">
                  View History
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <article className="editorial-card p-6">
              <p className="eyebrow">Current access</p>
              <h2 className="mt-4 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                Creative Workspace
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Designed for clean image production, returning sessions, and a calmer studio workflow.
              </p>
              <div className="mt-6 rounded-[22px] bg-[var(--surface-low)] p-4 text-sm text-[var(--ink)]">
                <p>Completed jobs: <span className="font-semibold">{stats?.completedJobs ?? 0}</span></p>
                <p className="mt-2">Credits used: <span className="font-semibold">{stats?.creditsUsed ?? 0}</span></p>
              </div>
            </article>

            <article className="editorial-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Recent history</p>
                  <h2 className="mt-4 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                    Your latest cutouts
                  </h2>
                </div>
                <Link href="/history" className="text-sm font-semibold text-[var(--brand)]">
                  View all
                </Link>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                {recentItems.length ? (
                  recentItems.map((item, index) => (
                    <div key={item.id} className="space-y-3">
                      <div className={`flex aspect-square items-end rounded-[22px] p-4 shadow-[0_14px_28px_rgba(15,23,42,0.08)] ${gradientCards[index % gradientCards.length]}`}>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] opacity-70">{item.status}</p>
                          <p className="mt-2 text-sm font-semibold">{(item.sourceFilename || 'Untitled').slice(0, 18)}</p>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--muted)]">{formatBytes(item.outputBytes || item.fileSize)}</p>
                    </div>
                  ))
                ) : (
                  <div className="soft-panel col-span-full p-6 text-sm text-[var(--muted)]">
                    Process your first image and the dashboard will start filling up.
                  </div>
                )}
              </div>
            </article>
          </section>

          <section>
            <div>
              <h2 className="font-headline text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                Processing History
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Manage your previously removed backgrounds in one editorial library.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {recentItems.length ? (
                <>
                  {recentItems.map((item, index) => (
                    <article key={item.id} className="editorial-card overflow-hidden p-3">
                      <div className={`flex aspect-square items-end rounded-[20px] p-4 ${gradientCards[index % gradientCards.length]}`}>
                        <span className="rounded-full bg-white/18 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                          {item.status}
                        </span>
                      </div>
                      <div className="p-2 pb-1 pt-4">
                        <p className="text-sm font-semibold text-[var(--ink)]">{item.sourceFilename || 'Untitled upload'}</p>
                        <p className="mt-1 text-xs text-[var(--muted)]">{formatBytes(item.outputBytes || item.fileSize)}</p>
                      </div>
                    </article>
                  ))}
                  <Link href="/#tool" className="soft-panel flex min-h-[250px] flex-col items-center justify-center rounded-[28px] p-6 text-center text-[var(--muted)] transition hover:bg-white">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-4xl text-[var(--brand)]">+</span>
                    <p className="mt-5 text-lg font-semibold text-[var(--ink)]">Upload New</p>
                    <p className="mt-2 text-sm leading-7">Start another background removal workflow.</p>
                  </Link>
                </>
              ) : (
                <div className="soft-panel p-8 text-sm text-[var(--muted)]">No processed files yet.</div>
              )}
            </div>
          </section>

          <section className="editorial-card p-6 sm:p-8">
            <h2 className="font-headline text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
              Account Settings
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Personalize your studio profile and security details.</p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--ink)]">Full Name</label>
                <input className="soft-input" value={user.name || ''} readOnly />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--ink)]">Company / Organization</label>
                <input className="soft-input" value="Optional" readOnly />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--ink)]">Email Address</label>
                <input className="soft-input" value={user.email} readOnly />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--ink)]">Security</label>
                <input className="soft-input" value="Protected by Google sign-in" readOnly />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
