import type { Metadata } from 'next'
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
  title: '背景消除 · AI 抠图',
  description: '上传图片，快速移除背景并导出透明 PNG，支持前后对比预览。',
  keywords: ['background remover', 'remove background', '抠图', '透明背景'],
  authors: [{ name: 'Your Name' }],
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
  viewport: 'width=device-width, initial-scale=1',
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
        {children}
      </body>
    </html>
  )
}
