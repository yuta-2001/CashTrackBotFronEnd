import Link from 'next/link';
import { Users, CreditCard, MessageSquare } from 'lucide-react'; 

export default function FooterComponent () {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-green-500 text-white">
      <div className="flex w-full items-center">
        <Link
          href="/transactions"
          className="w-1/3 text-center h-20 flex justify-center items-center"
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
          className="w-1/3 text-center h-20 flex justify-center items-center"
        >
          <div>
            <Users className="mx-auto w-10 h-10" />
            <span className="text-xs font-bold">
              相手管理
            </span>
          </div>
        </Link>
        <button
          className="w-1/3 text-center h-20 flex justify-center items-center"
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
