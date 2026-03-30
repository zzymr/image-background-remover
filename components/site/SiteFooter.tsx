import Link from 'next/link'
import BrandMark from '@/components/BrandMark'

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/60 bg-[var(--surface-low)]/90 px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.4fr_0.6fr_0.6fr]">
        <div className="space-y-4">
          <BrandMark />
          <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
            A premium AI background-removal experience for creators, catalog teams, and modern ecommerce workflows. Fast cutouts, thoughtful pricing, and a polished product story from first visit to download.
          </p>
        </div>

        <div>
          <h3 className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
            Explore
          </h3>
          <div className="mt-4 space-y-3 text-sm text-[var(--ink)]">
            <Link href="/#tool" className="block hover:text-[var(--brand)]">
              Product
            </Link>
            <Link href="/#workflow" className="block hover:text-[var(--brand)]">
              Workflow
            </Link>
            <Link href="/pricing" className="block hover:text-[var(--brand)]">
              Pricing
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-headline text-sm font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
            Built for
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-[var(--ink)]">
            <li>Product photography</li>
            <li>Marketplace listings</li>
            <li>Campaign asset cleanup</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
