import type { Metadata } from 'next'
import { Noto_Sans_SC } from 'next/font/google'
import './globals.css'

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI论文助手 - 降重/润色/参考文献',
  description: '基于AI的论文辅助工具，支持降重改写、学术润色、参考文献格式生成',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={notoSansSC.className}>{children}</body>
    </html>
  )
}
