'use client'

import { useEffect, useState } from 'react'

type ProcessSuccessPayload = {
  image: string
  size: number
  jobId?: string | null
}

interface ProcessingResultProps {
  image: File
  sessionId?: string | null
  onSuccess: (payload: ProcessSuccessPayload) => void
  onReset: () => void
  onHistoryRefresh?: () => void
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function ProcessingResult({
  image,
  sessionId,
  onSuccess,
  onReset,
  onHistoryRefresh,
}: ProcessingResultProps) {
  const [preview, setPreview] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(image)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [image])

  async function handleProcess() {
    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', image)

      if (sessionId) {
        formData.append('sessionId', sessionId)
      }

      const response = await fetch('/api/remove-background', {
        method: 'POST',
        headers: sessionId
          ? {
              'x-client-session-id': sessionId,
            }
          : undefined,
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove background.')
      }

      onSuccess({
        image: data.image,
        size: data.size,
        jobId: data.jobId,
      })
      onHistoryRefresh?.()
    } catch (processingError) {
      setError(
        processingError instanceof Error
          ? processingError.message
          : 'An unexpected error occurred while removing the background.',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div className="overflow-hidden rounded-[30px] bg-[var(--surface-low)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Selected image
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)] shadow-sm">
            Ready to process
          </span>
        </div>
        <div className="overflow-hidden rounded-[24px] bg-white">
          <img src={preview} alt={image.name} className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="eyebrow">Processing setup</p>
          <h3 className="mt-3 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
            One high-resolution cutout. One credit.
          </h3>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Your file is validated before processing so the experience stays quick, clear, and easy to trust. Once the cutout is ready, you can download it immediately and review it in recent activity.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] bg-[var(--surface-low)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              File name
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--ink)]">{image.name}</p>
          </div>
          <div className="rounded-[24px] bg-[var(--surface-low)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              File size
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--ink)]">{formatFileSize(image.size)}</p>
          </div>
          <div className="rounded-[24px] bg-[var(--surface-low)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              MIME type
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--ink)]">{image.type}</p>
          </div>
          <div className="rounded-[24px] bg-[var(--surface-low)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Output
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--ink)]">Transparent PNG</p>
          </div>
        </div>

        {error && (
          <div className="rounded-[24px] bg-[rgba(179,27,37,0.06)] p-5 text-sm leading-7 text-[var(--error)]">
            <p className="font-semibold">We couldn&apos;t process this image.</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0057bd_0%,#004ca6_100%)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(0,87,189,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isProcessing ? 'Removing background…' : 'Remove background'}
          </button>
          <button
            onClick={onReset}
            disabled={isProcessing}
            className="inline-flex items-center justify-center rounded-full bg-[var(--surface-low)] px-5 py-3.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-high)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            Choose another image
          </button>
        </div>
      </div>
    </div>
  )
}
