import Link from 'next/link'
import BrandMark from '@/components/BrandMark'

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'History', href: '/history' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/#about' },
      { label: 'Terms', href: '/#about' },
      { label: 'Contact', href: '/#about' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Login', href: '/login' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
]

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-white px-4 py-14 sm:px-6">
      <div className="shell grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <BrandMark />
          <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">
            Transforming the digital canvas through high-end AI precision and a calmer,
            customer-ready creative workflow.
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              {column.title}
            </p>
            <div className="mt-4 space-y-3 text-sm text-[var(--ink)]">
              {column.links.map((link) => (
                <Link key={link.label} href={link.href} className="block hover:text-[var(--brand)]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="shell mt-10 flex flex-col gap-3 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 EtherealAI. The Ethereal Canvas.</p>
        <p>Clean image workflows, thoughtful pricing, and a studio feel that leaves room to breathe.</p>
      </div>
    </footer>
  )
}
