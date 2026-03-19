import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

''

export const metadata: Metadata = {
  title: 'Background Remover - Remove Image Backgrounds with AI',
  description: 'Remove image backgrounds instantly with AI. Upload any image and get a transparent background in seconds. Free, fast, and easy to use.',
  keywords: ['background remover', 'remove background', 'AI image processing', 'transparent background'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Background Remover - AI-Powered Image Processing',
    description: 'Remove image backgrounds instantly with AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Background Remover',
    description: 'Remove image backgrounds instantly with AI',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
          {children}
        </div>
      </body>
    </html>
  )
}
