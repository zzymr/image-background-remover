import PricingGrid from '@/components/pricing/PricingGrid'

export default function PricingPage() {
  return (
    <div className="shell pb-24 pt-8 sm:pb-28">
      <section className="editorial-card overflow-hidden p-8 sm:p-10 lg:p-14">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="eyebrow">Pricing</p>
            <h1 className="mt-4 max-w-4xl font-headline text-5xl font-extrabold leading-[0.95] tracking-[-0.07em] text-[var(--ink)] sm:text-6xl">
              Transparent credits pricing for background removal that can scale beyond a single page.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              We keep the remove.bg mental model because it works: 1 image equals 1 credit. Then we add a cleaner product shell, slightly elevated pricing, and a D1-backed processing ledger you can grow into billing, analytics, or customer history.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] bg-[var(--surface-low)] p-6">
              <p className="eyebrow">How it works</p>
              <h2 className="mt-3 font-headline text-2xl font-bold text-[var(--ink)]">1 image = 1 credit</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Keep the model simple for users and flexible for future product extensions.
              </p>
            </div>
            <div className="rounded-[28px] bg-[var(--surface-low)] p-6">
              <p className="eyebrow">Billing shape</p>
              <h2 className="mt-3 font-headline text-2xl font-bold text-[var(--ink)]">Monthly + one-time</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Subscription plans for repeat workflows, and pay-as-you-go bundles for irregular volume.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <PricingGrid />
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-3">
        {[
          {
            title: 'Do one-time credits expire?',
            body: 'No. Pay-as-you-go credits stay available until they are used, which keeps project-based work easy to manage.',
          },
          {
            title: 'Do monthly credits roll over?',
            body: 'No. Subscription credits renew each billing cycle. This keeps the pricing model predictable and encourages upgrade paths when usage increases.',
          },
          {
            title: 'Why store processing history in D1?',
            body: 'Because a serious product needs durable state. D1 gives this app a foundation for job history, analytics, and future billing logic.',
          },
        ].map((faq) => (
          <article key={faq.title} className="editorial-card p-8">
            <h3 className="font-headline text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
              {faq.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{faq.body}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
