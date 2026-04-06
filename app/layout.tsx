import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Image Generator - 專業 AI 圖片生成平台',
  description: '使用先進的 AI 技術生成高質量圖片，支持多種風格和模型',
  keywords: ['AI', '圖片生成', 'Image Generation', 'SDXL', 'Stable Diffusion'],
  authors: [{ name: 'AI Image Generator' }],
  openGraph: {
    title: 'AI Image Generator',
    description: '使用先進的 AI 技術生成高質量圖片',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
