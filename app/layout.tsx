import type { Metadata, Viewport } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fr',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://image-background-remover.pages.dev'),
  title: '背景消除 · AI 抠图',
  description: '上传图片，快速移除背景并导出透明 PNG，支持前后对比预览。',
  keywords: ['background remover', 'remove background', '抠图', '透明背景'],
  authors: [{ name: 'zhouxiao' }],
  openGraph: {
    title: '背景消除 · AI 抠图',
    description: '上传图片，快速移除背景并导出透明 PNG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '背景消除',
    description: 'AI 移除背景，透明 PNG 导出',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f4' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a09' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body
        className={`${dmSans.variable} ${fraunces.variable} min-h-screen font-sans antialiased`}
      >
        <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900">
          <div className="flex-1">{children}</div>
          <footer className="border-t border-stone-200 bg-white/70 px-4 py-6 text-center text-sm text-stone-600 backdrop-blur-sm">
            <p>© 2026 Image Background Remover. All rights reserved · zhouxiao 开发</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
