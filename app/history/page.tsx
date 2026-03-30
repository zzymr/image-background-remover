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
  'bg-[linear-gradient(135deg,#16181d_0%,#111827_100%)] text-white',
  'bg-[linear-gradient(135deg,#fafafa_0%,#e8eef7_100%)] text-[var(--ink)]',
  'bg-[linear-gradient(135deg,#1f3a7c_0%,#0b1220_100%)] text-white',
  'bg-[linear-gradient(135deg,#2d1d18_0%,#8b1f14_100%)] text-white',
]

function formatBytes(bytes: number | null) {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export default function HistoryPage() {
  const [session, setSession] = useState<SessionResponse | null>(null)
  const [history, setHistory] = useState<HistoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

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
        console.error('Failed to load history page:', error)
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
  const filteredItems = useMemo(() => {
    const items = history?.items ?? []
    if (!query.trim()) return items
    const needle = query.trim().toLowerCase()
    return items.filter((item) => (item.sourceFilename || 'untitled upload').toLowerCase().includes(needle))
  }, [history, query])

  if (loading) {
    return (
      <div className="shell py-12">
        <div className="editorial-card p-10 text-center text-sm text-[var(--muted)]">Loading history…</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="shell py-12">
        <div className="editorial-card mx-auto max-w-2xl p-10 text-center">
          <p className="eyebrow">Google sign-in</p>
          <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
            Sign in to view your processing history.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            History is tied back into the account flow so you can return to a calmer studio library.
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
          <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="font-headline text-5xl font-extrabold tracking-[-0.07em] text-[var(--ink)]">
                Processing History
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">
                Manage your previously isolated assets and refined imagery in one editorial library.
              </p>
            </div>

            <div className="flex w-full max-w-[360px] items-center gap-3 rounded-[22px] bg-white px-4 py-3 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search history…"
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
              />
              <span className="text-sm font-medium text-[var(--muted)]">Sort</span>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item, index) => (
              <article key={item.id} className="editorial-card overflow-hidden p-4">
                <div className={`flex aspect-[1.14/1] items-start justify-end rounded-[24px] p-4 ${gradientCards[index % gradientCards.length]}`}>
                  <span className="rounded-full bg-white/16 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                    {item.status}
                  </span>
                </div>

                <div className="px-2 pb-2 pt-5">
                  <p className="text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                    {item.sourceFilename || 'untitled_upload.png'}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Processed: {formatDate(item.createdAt)} · {formatBytes(item.outputBytes || item.fileSize)}
                  </p>
                </div>

                <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-2 pb-2 pt-3">
                  <Link href="/#tool" className="primary-button !rounded-xl !px-4 !py-2.5 !text-sm">
                    Open in Tool
                  </Link>
                  <button className="secondary-button !rounded-xl !px-3 !py-2.5" type="button">
                    ↓
                  </button>
                  <button className="secondary-button !rounded-xl !px-3 !py-2.5" type="button">
                    •••
                  </button>
                </div>
              </article>
            ))}

            <Link href="/#tool" className="soft-panel flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[rgba(105,115,132,0.18)] p-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-4xl text-[var(--muted)]">+</span>
              <h2 className="mt-6 font-headline text-3xl font-bold tracking-[-0.05em] text-[var(--ink)]">
                New Process
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-7 text-[var(--muted)]">
                Upload more images to expand your working library.
              </p>
            </Link>
          </section>

          {!filteredItems.length && (
            <div className="soft-panel p-8 text-sm text-[var(--muted)]">
              No files matched your search yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
