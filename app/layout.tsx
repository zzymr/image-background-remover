import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import SiteFooter from '@/components/site/SiteFooter'
import SiteHeader from '@/components/site/SiteHeader'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-headline',
})

export const metadata: Metadata = {
  title: 'Ethereal Cutout — Premium AI Background Removal',
  description:
    'A premium editorial AI experience for fast, high-quality background removal, flexible credits, and D1-backed processing history.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${manrope.variable} bg-[var(--surface)] text-[var(--ink)] antialiased`}>
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(110,159,255,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(137,60,146,0.12),transparent_24%),linear-gradient(180deg,#f5f7f9_0%,#eef1f3_55%,#f5f7f9_100%)]" />
          <SiteHeader />
          <main className="pt-28">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
