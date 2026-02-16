import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Haraka Security Dashboard | لوحة مراقبة الأمان - منصة حركة',
  description: 'Real-time security monitoring dashboard for Haraka Platform - مراقبة الأمان في الوقت الفعلي لمنصة حركة',
  keywords: 'security, monitoring, audit, dashboard, حركة, أمان, مراقبة',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}