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
  title: 'EtherealAI — Premium AI Background Removal',
  description:
    'A calmer studio experience for AI background removal, Google sign-in, processing history, and customer-ready product pages.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${manrope.variable} antialiased`}>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(110,159,255,0.16),transparent_26%),linear-gradient(180deg,#f7f8fb_0%,#f6f7fb_100%)]">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
