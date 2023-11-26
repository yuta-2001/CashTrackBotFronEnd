import type { Metadata } from 'next'
import './globals.css';
import { OpponentsProvider } from './_context/OpponentsProvider';
import HeaderComponent from './_components/common/HeaderComponent';
import FooterComponent from './_components/common/FooterComponent';
import { LiffProvider } from './_context/LiffProvider';
import { SearchConditionsProvider } from './_context/SearchConditionsProvider';
import { ToastProvider } from './_context/ToastProvider';
import ToastNotification from './_components/common/ToastNotification';

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
    <LiffProvider>
      <OpponentsProvider>
        <SearchConditionsProvider>
          <ToastProvider>
            <html lang="en">
              <body className="bg-gray-100">
                <HeaderComponent />
                <ToastNotification />
                {children}
                <FooterComponent />
              </body>
            </html>
          </ToastProvider>
        </SearchConditionsProvider>
      </OpponentsProvider>
    </LiffProvider>
  )
}
