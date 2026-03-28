'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import BeforeAfterCompare from '@/components/BeforeAfterCompare'
import ImageUploader from '@/components/ImageUploader'
import ProcessingHistory from '@/components/ProcessingHistory'
import ProcessingResult from '@/components/ProcessingResult'
import PricingGrid from '@/components/pricing/PricingGrid'
import { formatUsd, monthlyPlans } from '@/lib/pricing'

type ProcessedResult = {
  image: string
  size: number
  jobId?: string | null
}

function getOrCreateSessionId() {
  if (typeof window === 'undefined') return ''

  const storageKey = 'ethereal-cutout-session-id'
  const existing = window.localStorage.getItem(storageKey)
  if (existing) return existing

  const nextValue = window.crypto.randomUUID()
  window.localStorage.setItem(storageKey, nextValue)
  return nextValue
}

function formatOutputBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function Home() {
  const [sessionId, setSessionId] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null)
  const [processedResult, setProcessedResult] = useState<ProcessedResult | null>(null)
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)

  useEffect(() => {
    setSessionId(getOrCreateSessionId())
  }, [])

  useEffect(() => {
    if (!selectedImage) {
      setSelectedPreview(null)
      return
    }

    const url = URL.createObjectURL(selectedImage)
    setSelectedPreview(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [selectedImage])

  const featuredPlan = useMemo(
    () => monthlyPlans.find((plan) => plan.highlight) ?? monthlyPlans[1],
    [],
  )

  function handleSelectImage({ file }: { file: File | null }) {
    setSelectedImage(file)
    setProcessedResult(null)
  }

  function handleReset() {
    setSelectedImage(null)
    setProcessedResult(null)
  }

  return (
    <>
      <section className="shell pb-16 pt-8 sm:pb-24">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)] shadow-sm backdrop-blur">
              Premium editorial AI for clean product imagery
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl font-headline text-5xl font-extrabold leading-[0.95] tracking-[-0.07em] text-[var(--ink)] sm:text-6xl lg:text-7xl">
                Remove backgrounds with a product experience that feels{' '}
                <span className="gradient-text">more premium than a demo.</span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                Ethereal Cutout turns background removal into a polished SaaS workflow — premium landing page, clear credits pricing, and Cloudflare D1-backed job history for the images you actually process.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="#tool"
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#0057bd_0%,#004ca6_100%)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(0,87,189,0.24)] transition hover:-translate-y-0.5"
              >
                Start with an image
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[var(--ink)] shadow-[0_16px_32px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
              >
                Explore pricing
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-panel p-5">
                <p className="eyebrow">Pay as you go</p>
                <p className="mt-3 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                  {formatUsd(3.49)}
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">Entry bundle for 3 credits.</p>
              </div>
              <div className="glass-panel p-5">
                <p className="eyebrow">Most popular</p>
                <p className="mt-3 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                  {formatUsd(featuredPlan.price)}
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">{featuredPlan.credits} credits each month.</p>
              </div>
              <div className="glass-panel p-5">
                <p className="eyebrow">Data layer</p>
                <p className="mt-3 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                  D1
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">Job history stored for repeat workflows.</p>
              </div>
            </div>
          </div>

          <div className="editorial-card relative overflow-hidden p-7 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(110,159,255,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(137,60,146,0.10),transparent_35%)]" />
            <div className="relative">
              <p className="eyebrow">Why this rebuild matters</p>
              <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                A full product shell, not just a single upload widget.
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--ink)]">
                {[
                  'Editorial-inspired homepage with more premium positioning.',
                  'Dedicated pricing page with monthly plans and pay-as-you-go credits.',
                  'Cloudflare D1 processing history so data survives beyond the current tab.',
                  'Same remove.bg core, packaged like a real SaaS product.',
                ].map((item) => (
                  <div key={item} className="flex gap-3 rounded-[22px] bg-white/80 p-4 backdrop-blur">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[var(--brand)]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="shell pb-20 sm:pb-24">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Upload a source image',
              body: 'Drag in a product photo, campaign visual, or profile shot. The UI gives the asset room to breathe instead of boxing it into a generic template.',
            },
            {
              step: '02',
              title: 'Process through remove.bg',
              body: 'We validate the file, call remove.bg, and return a transparent PNG cutout with one-click download.',
            },
            {
              step: '03',
              title: 'Persist job history in D1',
              body: 'When D1 is configured, every job can be recorded so the app feels stateful, operational, and ready for future billing or reporting layers.',
            },
          ].map((item) => (
            <article key={item.step} className="editorial-card p-8">
              <p className="eyebrow">Step {item.step}</p>
              <h3 className="mt-4 font-headline text-2xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="tool" className="shell pb-20 sm:pb-24">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Tool stage</p>
            <h2 className="mt-3 font-headline text-4xl font-extrabold tracking-[-0.06em] text-[var(--ink)] sm:text-5xl">
              The actual background-removal workflow, rebuilt in the new product shell.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--muted)]">
            Upload, process, download, then review the job in your D1-backed history sidebar.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
          <section className="editorial-card overflow-hidden p-6 sm:p-8">
            {!selectedImage && <ImageUploader onImageSelect={handleSelectImage} />}

            {selectedImage && !processedResult && (
              <ProcessingResult
                image={selectedImage}
                sessionId={sessionId}
                onReset={handleReset}
                onSuccess={setProcessedResult}
                onHistoryRefresh={() => setHistoryRefreshKey((value) => value + 1)}
              />
            )}

            {selectedImage && processedResult && selectedPreview && (
              <div className="space-y-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="eyebrow">Result</p>
                    <h3 className="mt-3 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                      Background removed successfully.
                    </h3>
                  </div>
                  <div className="rounded-[22px] bg-[var(--surface-low)] px-4 py-3 text-sm text-[var(--muted)]">
                    Output size: <span className="font-semibold text-[var(--ink)]">{formatOutputBytes(processedResult.size)}</span>
                  </div>
                </div>

                <BeforeAfterCompare beforeSrc={selectedPreview} afterSrc={processedResult.image} />

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = processedResult.image
                      link.download = 'ethereal-cutout.png'
                      link.click()
                    }}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0057bd_0%,#004ca6_100%)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(0,87,189,0.22)] transition hover:-translate-y-0.5"
                  >
                    Download transparent PNG
                  </button>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--surface-low)] px-6 py-3.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-high)]"
                  >
                    Process another image
                  </button>
                </div>
              </div>
            )}
          </section>

          <ProcessingHistory sessionId={sessionId} refreshKey={historyRefreshKey} />
        </div>
      </section>

      <section className="shell pb-24">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Pricing preview</p>
            <h2 className="mt-3 font-headline text-4xl font-extrabold tracking-[-0.06em] text-[var(--ink)] sm:text-5xl">
              Monthly plans lightly above the official benchmark. Per-use pricing still clearly structured.
            </h2>
          </div>
          <Link href="/pricing" className="text-sm font-semibold text-[var(--brand)] transition hover:text-[var(--brand-deep)]">
            Open the full pricing page →
          </Link>
        </div>

        <PricingGrid compact />
      </section>
    </>
  )
}
