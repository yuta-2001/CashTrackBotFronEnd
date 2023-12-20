'use client';
import Link from 'next/link';
import { useCallback } from 'react';
import { Users, CreditCard, MessageSquare, Receipt } from 'lucide-react'; 
import { useLiff } from '@/app/_context/LiffProvider';

export default function FooterComponent () {
  const liff = useLiff();

  const closeApp = useCallback(() => {
    if (liff === null) {
      return;
    }

    liff.closeWindow();
  }, [liff])

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-green-500 text-white">
      <div className="flex w-full items-center">
        <Link
          href="/transactions"
          className="w-1/4 text-center h-20 flex justify-center items-center"
        >
          <div>
            <CreditCard className="mx-auto w-10 h-10" />
            <span className="text-xs font-bold">
              貸借り管理
            </span>
          </div>
        </Link>
        <Link
          href="/opponents"
          className="w-1/4 text-center h-20 flex justify-center items-center"
        >
          <div>
            <Users className="mx-auto w-10 h-10" />
            <span className="text-xs font-bold">
              相手管理
            </span>
          </div>
        </Link>
        <Link
          href="/bill"
          className="w-1/4 text-center h-20 flex justify-center items-center"
        >
          <div>
            <Receipt className="mx-auto w-10 h-10" />
            <span className="text-xs font-bold">
              請求書発行
            </span>
          </div>
        </Link>
        <button
          onClick={closeApp}
          className="w-1/4 text-center h-20 flex justify-center items-center"
        >
          <div>
            <MessageSquare className="mx-auto w-10 h-10" />
            <span className="text-xs font-bold">
              トークに戻る
            </span>
          </div>
        </button>
      </div>
    </footer>
  )
}
