import PricingGrid from '@/components/pricing/PricingGrid'

const faqs = [
  {
    title: 'Can I cancel my subscription anytime?',
    body: 'Yes. You can cancel at any time from your account settings and continue using your current plan until the billing period ends.',
  },
  {
    title: 'Do one-time credits expire?',
    body: 'No. Credit bundles stay available until they are used, which keeps project-based work flexible.',
  },
  {
    title: 'Do monthly credits roll over?',
    body: 'No. Monthly credits refresh every billing cycle so the pricing stays predictable and easy to manage.',
  },
  {
    title: 'What file formats are supported?',
    body: 'PNG, JPG, and WEBP are supported today, with transparent PNG export for completed cutouts.',
  },
]

export default function PricingPage() {
  return (
    <div className="shell pb-20 pt-12 sm:pb-24 sm:pt-16">
      <section className="mx-auto max-w-4xl text-center">
        <h1 className="font-headline text-5xl font-extrabold leading-[0.96] tracking-[-0.07em] text-[var(--ink)] sm:text-6xl lg:text-7xl">
          Choose the plan that&apos;s <span className="gradient-text">right for you</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
          Simple, transparent pricing designed to scale with your creative workflow.
          No hidden fees, just cleaner image production.
        </p>
      </section>

      <section className="mt-16">
        <PricingGrid />
      </section>

      <section className="mx-auto mt-20 max-w-4xl">
        <div className="text-center">
          <p className="eyebrow">Frequently asked questions</p>
          <h2 className="mt-4 font-headline text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)] sm:text-4xl">
            A few answers before you start.
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <article key={faq.title} className={`rounded-[24px] px-6 py-5 ${index === 0 ? 'editorial-card' : 'soft-panel'}`}>
              <h3 className="text-lg font-semibold text-[var(--ink)]">{faq.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{faq.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="cta-banner text-center">
          <h2 className="font-headline text-3xl font-extrabold tracking-[-0.05em] sm:text-4xl">
            Still have questions about our plans?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/86 sm:text-base">
            Start with Google sign-in, test the workflow, and upgrade once you know which volume matches your studio.
          </p>
          <a href="/login" className="secondary-button mt-8 inline-flex">
            Talk to the product
          </a>
        </div>
      </section>
    </div>
  )
}
