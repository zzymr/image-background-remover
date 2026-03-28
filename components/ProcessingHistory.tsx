'use client'

import { useEffect, useMemo, useState } from 'react'

type ProcessingHistoryItem = {
  id: string
  sourceFilename: string | null
  fileSize: number | null
  outputBytes: number | null
  status: 'processing' | 'completed' | 'failed'
  errorMessage: string | null
  creditsCharged: number
  createdAt: string
}

type HistoryResponse = {
  configured: boolean
  items: ProcessingHistoryItem[]
  summary: {
    totalJobs: number
    completedJobs: number
    failedJobs: number
    creditsUsed: number
  }
}

type ProcessingHistoryProps = {
  sessionId?: string | null
  refreshKey?: number
}

function formatBytes(bytes: number | null) {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

const statusClasses: Record<ProcessingHistoryItem['status'], string> = {
  processing: 'bg-[rgba(0,87,189,0.08)] text-[var(--brand)]',
  completed: 'bg-[rgba(43,122,79,0.10)] text-[var(--success)]',
  failed: 'bg-[rgba(179,27,37,0.08)] text-[var(--error)]',
}

export default function ProcessingHistory({ sessionId, refreshKey = 0 }: ProcessingHistoryProps) {
  const [history, setHistory] = useState<HistoryResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) return

    const currentSessionId = sessionId
    let isCancelled = false

    async function loadHistory() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/history?sessionId=${encodeURIComponent(currentSessionId)}`, {
          headers: {
            'x-client-session-id': currentSessionId,
          },
          cache: 'no-store',
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load processing history.')
        }

        if (!isCancelled) {
          setHistory(data)
        }
      } catch (historyError) {
        if (!isCancelled) {
          setError(
            historyError instanceof Error
              ? historyError.message
              : 'Failed to load processing history.',
          )
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    void loadHistory()

    return () => {
      isCancelled = true
    }
  }, [sessionId, refreshKey])

  const summary = useMemo(
    () =>
      history?.summary ?? {
        totalJobs: 0,
        completedJobs: 0,
        failedJobs: 0,
        creditsUsed: 0,
      },
    [history],
  )

  return (
    <aside id="history" className="editorial-card h-full p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">D1 activity</p>
          <h3 className="mt-3 font-headline text-2xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
            Processing history
          </h3>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Every completed job can be written to Cloudflare D1, giving this tool a real data layer instead of a throwaway demo feel.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-[22px] bg-[var(--surface-low)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Jobs</p>
          <p className="mt-2 text-2xl font-bold text-[var(--ink)]">{summary.totalJobs}</p>
        </div>
        <div className="rounded-[22px] bg-[var(--surface-low)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Credits used</p>
          <p className="mt-2 text-2xl font-bold text-[var(--ink)]">{summary.creditsUsed}</p>
        </div>
        <div className="rounded-[22px] bg-[var(--surface-low)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Completed</p>
          <p className="mt-2 text-2xl font-bold text-[var(--ink)]">{summary.completedJobs}</p>
        </div>
        <div className="rounded-[22px] bg-[var(--surface-low)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Failed</p>
          <p className="mt-2 text-2xl font-bold text-[var(--ink)]">{summary.failedJobs}</p>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-[22px] bg-[rgba(179,27,37,0.06)] p-4 text-sm leading-7 text-[var(--error)]">
          {error}
        </div>
      )}

      {history && !history.configured && !loading && (
        <div className="mt-6 rounded-[22px] bg-[rgba(137,60,146,0.08)] p-4 text-sm leading-7 text-[var(--ink)]">
          <p className="font-semibold">Cloudflare D1 is not configured yet.</p>
          <p className="mt-1 text-[var(--muted)]">
            Add <code>CLOUDFLARE_ACCOUNT_ID</code>, <code>CLOUDFLARE_D1_DATABASE_ID</code>, and <code>CLOUDFLARE_API_TOKEN</code> to persist history.
          </p>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {loading && !history ? (
          <div className="rounded-[22px] bg-[var(--surface-low)] p-5 text-sm text-[var(--muted)]">
            Loading recent jobs…
          </div>
        ) : history?.items?.length ? (
          history.items.map((item) => (
            <div key={item.id} className="rounded-[24px] bg-[var(--surface-low)] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {item.sourceFilename || 'Untitled upload'}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{formatDate(item.createdAt)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${statusClasses[item.status]}`}>
                  {item.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-[var(--muted)]">
                <div>
                  <p className="uppercase tracking-[0.16em]">Input</p>
                  <p className="mt-1 text-sm font-medium text-[var(--ink)]">{formatBytes(item.fileSize)}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.16em]">Output</p>
                  <p className="mt-1 text-sm font-medium text-[var(--ink)]">{formatBytes(item.outputBytes)}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.16em]">Credits</p>
                  <p className="mt-1 text-sm font-medium text-[var(--ink)]">{item.creditsCharged || 0}</p>
                </div>
              </div>

              {item.errorMessage && (
                <p className="mt-3 text-xs leading-6 text-[var(--error)]">{item.errorMessage}</p>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-[22px] bg-[var(--surface-low)] p-5 text-sm leading-7 text-[var(--muted)]">
            Process your first image and the recent activity list will appear here.
          </div>
        )}
      </div>
    </aside>
  )
}
