import Link from 'next/link'
import { creditBundles, formatUsd, monthlyPlans, pricingHighlights } from '@/lib/pricing'

type PricingGridProps = {
  compact?: boolean
}

export default function PricingGrid({ compact = false }: PricingGridProps) {
  const visibleCreditBundles = compact ? creditBundles.slice(0, 2) : creditBundles

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Monthly plans</p>
            <h2 className="font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)] sm:text-4xl">
              Subscription pricing designed for repeat creative output.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--muted)]">
            Monthly credits refresh every billing cycle. A clean structure for repeat production, catalog updates, and campaign output.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {monthlyPlans.map((plan) => (
            <article
              key={plan.name}
              className={`editorial-card relative h-full p-8 ${plan.highlight ? 'ring-1 ring-[rgba(0,87,189,0.12)] shadow-[0_28px_60px_rgba(0,87,189,0.12)]' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute right-6 top-6 rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  Most popular
                </div>
              )}

              <p className="font-headline text-2xl font-bold text-[var(--ink)]">{plan.name}</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="font-headline text-5xl font-extrabold tracking-[-0.06em] text-[var(--ink)]">
                  {formatUsd(plan.price)}
                </span>
                <span className="pb-2 text-sm text-[var(--muted)]">/ month</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{plan.description}</p>
              <div className="mt-6 rounded-[22px] bg-[var(--surface-low)] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  Included
                </p>
                <p className="mt-2 text-2xl font-bold text-[var(--ink)]">{plan.credits} credits / month</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm leading-7 text-[var(--ink)]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[var(--brand)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/#tool"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  plan.highlight
                    ? 'bg-[linear-gradient(135deg,#0057bd_0%,#004ca6_100%)] text-white shadow-[0_20px_40px_rgba(0,87,189,0.22)] hover:-translate-y-0.5'
                    : 'bg-[var(--surface-low)] text-[var(--ink)] hover:bg-[var(--surface-high)]'
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Pay as you go</p>
            <h2 className="font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)] sm:text-4xl">
              One-time credits that stay available when your volume is less predictable.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--muted)]">
            Use bundles for ad hoc shoots, seasonal peaks, or external client work. Credits never expire.
          </p>
        </div>

        <div className={`grid gap-6 ${compact ? 'lg:grid-cols-2' : 'lg:grid-cols-4'}`}>
          {visibleCreditBundles.map((bundle) => (
            <article key={bundle.credits} className="editorial-card h-full p-7">
              <p className="eyebrow">Flexible credits</p>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-headline text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                  {formatUsd(bundle.price)}
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold text-[var(--ink)]">{bundle.credits} credits</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{bundle.description}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--ink)]">
                {bundle.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[var(--spark)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/#tool"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[var(--surface-low)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-high)]"
              >
                {bundle.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {!compact && (
        <section className="editorial-card grid gap-6 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow">Pricing rules</p>
            <h3 className="font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
              Clear enough for customers. Structured enough to scale.
            </h3>
          </div>
          <ul className="space-y-3 text-sm leading-7 text-[var(--ink)]">
            {pricingHighlights.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[var(--brand)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
