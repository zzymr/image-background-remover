'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import BeforeAfterCompare from '@/components/BeforeAfterCompare'
import ImageUploader from '@/components/ImageUploader'
import ProcessingResult from '@/components/ProcessingResult'
import type { SessionUser } from '@/lib/auth-shared'
import { getOrCreateBrowserSessionId } from '@/lib/browser-session'
import { formatUsd, monthlyPlans } from '@/lib/pricing'

type ProcessedResult = {
  image: string
  size: number
  jobId?: string | null
}

type SessionResponse = {
  configured: boolean
  authenticated: boolean
  user: SessionUser | null
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
  const [user, setUser] = useState<SessionUser | null>(null)
  const [authConfigured, setAuthConfigured] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    setSessionId(getOrCreateBrowserSessionId())
  }, [])

  useEffect(() => {
    let active = true

    async function loadSession() {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' })
        const data = (await response.json()) as SessionResponse
        if (!active) return
        setAuthConfigured(data.configured)
        setUser(data.user)
      } catch (error) {
        console.error('Failed to load session:', error)
        if (!active) return
        setAuthConfigured(false)
        setUser(null)
      } finally {
        if (active) {
          setAuthLoading(false)
        }
      }
    }

    void loadSession()

    return () => {
      active = false
    }
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
      <section className="shell pb-14 pt-10 sm:pb-20 sm:pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance font-headline text-5xl font-extrabold leading-[0.95] tracking-[-0.07em] text-[var(--ink)] sm:text-6xl lg:text-7xl">
            The easiest way to remove <span className="gradient-text">background</span> from any image.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Effortless precision in seconds. Our AI handles the details so you can
            focus on the creative vision.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="#tool" className="primary-button">
              Try the tool
            </Link>
            <Link href="/pricing" className="secondary-button">
              View pricing
            </Link>
          </div>
        </div>
      </section>

      <section id="tool" className="shell pb-20 sm:pb-24">
        <div className="hero-stage mx-auto max-w-4xl">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex flex-col gap-3 rounded-[24px] bg-[var(--surface-low)] px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-[var(--ink)]">
                  {authLoading
                    ? 'Checking your studio access…'
                    : user
                      ? `Signed in as ${user.name || user.email}`
                      : authConfigured
                        ? 'Sign in with Google to process and save your work.'
                        : 'Anonymous mode is active while login is not configured.'}
                </p>
                <p className="mt-1 text-[var(--muted)]">
                  {user
                    ? 'Your dashboard and history are available from the top navigation.'
                    : authConfigured
                      ? 'Login unlocks processing history, dashboard access, and returning sessions.'
                      : 'You can still test the tool and generate clean PNG cutouts.'}
                </p>
              </div>

              {!authLoading && !user && authConfigured && (
                <Link href="/login" className="primary-button">
                  Continue with Google
                </Link>
              )}
            </div>

            {!selectedImage && <ImageUploader onImageSelect={handleSelectImage} />}

            {selectedImage && !processedResult && authConfigured && !user && selectedPreview && (
              <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                <div className="rounded-[28px] bg-[var(--surface-low)] p-4">
                  <div className="overflow-hidden rounded-[22px] bg-white">
                    <img src={selectedPreview} alt={selectedImage.name} className="h-full w-full object-cover" />
                  </div>
                </div>

                <div className="editorial-card p-8">
                  <p className="eyebrow">Sign in required</p>
                  <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                    Your image is ready. Sign in to generate the cutout.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                    Google sign-in restores your dashboard, processing history, and the
                    account flow from your original product design.
                  </p>

                  <div className="mt-8 flex flex-col gap-3">
                    <Link href="/login" className="primary-button w-full">
                      Continue with Google
                    </Link>
                    <button onClick={handleReset} className="secondary-button w-full">
                      Choose another image
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedImage && !processedResult && (!authConfigured || user) && (
              <ProcessingResult
                image={selectedImage}
                sessionId={sessionId}
                onReset={handleReset}
                onSuccess={setProcessedResult}
              />
            )}

            {selectedImage && processedResult && selectedPreview && (
              <div className="space-y-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="eyebrow">Result</p>
                    <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)] sm:text-4xl">
                      Background removed successfully.
                    </h2>
                  </div>
                  <div className="rounded-full bg-[var(--surface-low)] px-4 py-3 text-sm text-[var(--muted)]">
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
                    className="primary-button"
                  >
                    Download transparent PNG
                  </button>
                  <button onClick={handleReset} className="secondary-button">
                    Process another image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="features" className="shell pb-20 sm:pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-5">
            <p className="eyebrow">Pixel-perfect precision</p>
            <h2 className="text-balance font-headline text-4xl font-extrabold tracking-[-0.06em] text-[var(--ink)] sm:text-5xl">
              Pixel-perfect edges, even for the finest hair.
            </h2>
            <p className="max-w-xl text-sm leading-8 text-[var(--muted)] sm:text-base">
              Our proprietary neural matte refinement engine is designed from the ground up
              to preserve clean contours, soft textures, and the details that make product
              imagery feel premium.
            </p>

            <div className="space-y-3 text-sm text-[var(--ink)]">
              {[
                'No manual masking required',
                'HQ resolution output up to 4K',
                `Most popular plan starts at ${formatUsd(featuredPlan.price)} / month`,
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="editorial-card overflow-hidden p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative min-h-[280px] rounded-[24px] bg-[linear-gradient(180deg,#ff694d_0%,#4b1511_100%)] p-5 text-white">
                <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
                  Original
                </span>
                <div className="absolute inset-x-5 bottom-5 rounded-[20px] bg-white/12 p-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold">Source photo</p>
                  <p className="mt-1 text-xs text-white/80">Keep the subject intact before cleanup begins.</p>
                </div>
              </div>

              <div className="relative min-h-[280px] rounded-[24px] bg-[linear-gradient(180deg,#1e2d4d_0%,#090c12_100%)] p-5 text-white">
                <span className="rounded-full bg-[var(--brand)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  Ethereal AI
                </span>
                <div className="absolute inset-x-5 bottom-5 rounded-[20px] bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold">Clean cutout</p>
                  <p className="mt-1 text-xs text-white/80">Output built for product pages, campaigns, and storefronts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="shell pb-20 sm:pb-24">
        <div className="text-center">
          <p className="eyebrow">Three steps to transparency</p>
          <h2 className="mt-4 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)] sm:text-4xl">
            A calmer workflow from upload to export.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Upload',
              body: 'Select any image from your device in PNG, JPG, or WEBP format.',
            },
            {
              step: '2',
              title: 'Process',
              body: 'Our AI analyzes and removes the background in seconds with clean edges.',
            },
            {
              step: '3',
              title: 'Download',
              body: 'Export your final transparent PNG and continue editing anywhere.',
            },
          ].map((item) => (
            <article key={item.step} className="editorial-card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-low)] text-xl font-bold text-[var(--brand)]">
                {item.step}
              </div>
              <h3 className="mt-6 font-headline text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="shell pb-20 sm:pb-24">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <article className="editorial-card min-h-[220px] p-8">
            <p className="eyebrow">Lightning fast</p>
            <h3 className="mt-4 font-headline text-2xl font-extrabold tracking-[-0.04em] text-[var(--ink)]">
              Results that keep momentum on your side.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)]">
              Built for modern creators and catalog teams who want the job done cleanly without losing the editorial feel.
            </p>
          </article>

          <article className="rounded-[28px] bg-[linear-gradient(135deg,#0f172a_0%,#162547_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
            <p className="eyebrow !text-white/70">Retain quality</p>
            <h3 className="mt-4 font-headline text-2xl font-extrabold tracking-[-0.04em] text-white">
              Keep detail where it matters.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/78">
              Preserve soft gradients, reflective surfaces, and product contours that make premium imagery feel trustworthy.
            </p>
          </article>

          {[
            ['API Ready', 'Integrates cleanly into production workflows when you want to scale beyond manual uploads.'],
            ['Privacy First', 'Your sessions stay organized, and account access is protected behind Google sign-in.'],
            ['Ecommerce Optimized', 'Designed for listings, PDP images, creator kits, and fast campaign cleanup.'],
          ].map(([title, body]) => (
            <article key={title} className="soft-panel p-8">
              <h3 className="font-headline text-xl font-bold tracking-[-0.04em] text-[var(--ink)]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell pb-10 sm:pb-16">
        <div className="cta-banner text-center">
          <h2 className="font-headline text-3xl font-extrabold tracking-[-0.05em] sm:text-4xl">
            Ready to clear the clutter?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/86 sm:text-base">
            Sign in with Google, upload your image, and step into the cleaner studio flow your original design was aiming for.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/login" className="secondary-button">
              Start for free
            </Link>
            <Link href="/pricing" className="secondary-button">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
