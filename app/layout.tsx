import type { Metadata } from 'next'
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
        {children}
      </body>
    </html>
  )
}
