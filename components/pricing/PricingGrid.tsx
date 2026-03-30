import Link from 'next/link'
import { creditBundles, formatUsd, monthlyPlans, pricingHighlights } from '@/lib/pricing'

type PricingGridProps = {
  compact?: boolean
}

export default function PricingGrid({ compact = false }: PricingGridProps) {
  const bundles = compact ? creditBundles.slice(0, 2) : creditBundles

  return (
    <div className="space-y-16">
      <section className="grid gap-6 lg:grid-cols-3">
        {monthlyPlans.map((plan) => (
          <article
            key={plan.name}
            className={`editorial-card relative p-8 ${plan.highlight ? 'translate-y-[-8px]' : ''}`}
          >
            {plan.highlight && (
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand)] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                Most popular
              </div>
            )}

            <p className="font-headline text-2xl font-bold text-[var(--ink)]">{plan.name}</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="font-headline text-5xl font-extrabold tracking-[-0.06em] text-[var(--ink)]">
                {formatUsd(plan.price)}
              </span>
              <span className="pb-2 text-sm text-[var(--muted)]">/mo</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{plan.description}</p>

            <ul className="mt-6 space-y-3 text-sm leading-7 text-[var(--ink)]">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--brand)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${
                plan.highlight
                  ? 'bg-[linear-gradient(135deg,#0057bd_0%,#004ca6_100%)] text-white shadow-[0_18px_35px_rgba(0,87,189,0.2)] hover:-translate-y-0.5'
                  : 'bg-[var(--surface-low)] text-[var(--ink)] hover:bg-[var(--surface-high)]'
              }`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </section>

      {!compact && (
        <section className="space-y-6">
          <div className="text-center">
            <p className="eyebrow">Pay as you go</p>
            <h2 className="mt-4 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)] sm:text-4xl">
              Flexible credit bundles for less predictable demand.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {bundles.map((bundle) => (
              <article key={bundle.credits} className="soft-panel p-6">
                <p className="text-sm font-semibold text-[var(--ink)]">{bundle.credits} credits</p>
                <p className="mt-3 font-headline text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                  {formatUsd(bundle.price)}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{bundle.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {!compact && (
        <section className="editorial-card p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">Pricing rules</p>
              <h3 className="mt-4 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                Clear enough for customers. Structured enough to scale.
              </h3>
            </div>
            <ul className="space-y-3 text-sm leading-7 text-[var(--ink)]">
              {pricingHighlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--brand)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
