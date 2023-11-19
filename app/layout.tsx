import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'お金貸し借り管理アプリ',
  description: 'お金の貸し借りを管理するアプリです',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
