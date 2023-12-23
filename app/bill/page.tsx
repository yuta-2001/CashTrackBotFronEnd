'use client';
import { useState, useMemo, useEffect, useCallback } from "react";
import { useLiff } from "../_context/LiffProvider";
import { useOpponents } from "../_context/OpponentsProvider";
import { useTransactions } from "../_context/Transactions/TransactionsProvider";
import { generateTransactionsBill } from "../_libs/data";
import { TBillInfo } from "../_libs/types";
import { TransactionType } from "../_libs/enums";
import { useToastUpdate } from "../_context/ToastProvider";

export default function BillPage() {

  const opponents = useOpponents();
  const transactions = useTransactions();
  const liff = useLiff();
  const setToast = useToastUpdate();

  const [selectedOpponent, setSelectedOpponent] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (opponents === undefined || transactions === undefined || liff === null) {
      return;
    }
  }, [opponents, transactions, liff]);


  const handleSelectOpponent = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (opponents === undefined || liff === null) {
      return;
    }

    const opponentId = e.target.value;
    if (opponentId === '') {
      setSelectedOpponent(null);
      setPreviewImage(null);
      return;
    }
    setSelectedOpponent(Number(opponentId));

    const culculateAmount = ((opponentId: number) => {
      if (transactions === undefined) {
        return null;
      }
  
      const filteredTransactions = transactions.filter((transaction) => transaction.opponent_id === opponentId && !transaction.is_settled);
      if (filteredTransactions.length === 0) {
        return null;
      }
  
      // 相手がuserに対して借りている金額の計算
      const borrowAmount = filteredTransactions.reduce((prev, current) => {
        if (current.type === TransactionType.Lend) {
          return prev + current.amount;
        }
        return prev;
      }, 0);
  
      // 相手がuserに対して貸している金額の計算
      const lendAmount = filteredTransactions.reduce((prev, current) => {
        if (current.type === TransactionType.Borrow) {
          return prev + current.amount;
        }
        return prev;
      }, 0);
  
      return {
        amount: borrowAmount - lendAmount,
        borrowAmount,
        lendAmount,
      }
    });

    const calculatedAmount = culculateAmount(Number(opponentId));

    if (calculatedAmount === null) {
      alert('相手との取引がありません');
      setPreviewImage(null);
      return;
    } else if (calculatedAmount.amount <= 0) {
      alert('精算額が0を下回っているため請求書を発行できません。');
      setPreviewImage(null);
      return;
    }

    const billInfo: TBillInfo = {
      opponent_id: Number(opponentId),
      opponent_name: opponents.find((opponent) => opponent.id === Number(opponentId))?.name!,
      total_amount: calculatedAmount.amount!,
      borrow_amount: calculatedAmount.borrowAmount!,
      lend_amount: calculatedAmount.lendAmount!,
    }

    const previewUrl = await generateTransactionsBill(billInfo, liff)
    setPreviewImage(previewUrl);
  }


  const sendBillToFriend = () => {
    if (liff === null || previewImage === null || setToast === undefined) {
      return;
    }

    const encodeJapanese = (str: string) => {
      // 日本語にマッチする正規表現
      const japaneseRegex = /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\u3400-\u4DBF]/g;
  
      // 日本語の部分を検出してエンコード
      return str.replace(japaneseRegex, match => encodeURIComponent(match));
    }

    const sendImageUrl = encodeJapanese(previewImage);

    liff
      .shareTargetPicker(
        [
          {
            type: "text",
            text: "お金貸し借り管理BOTからの請求書です。\n精算額を確認し、速やかな対応をお願いします。",
          },
          {
            type: "text",
            text: "請求書の詳細に関しましてはご本人様にご確認ください。",
          },
          {
            type: "image",
            originalContentUrl: sendImageUrl,
            previewImageUrl: sendImageUrl,
          },
        ],
        {
          isMultiple: false,
        }
      )
      .then((res) => {
        if (res) {
          // succeeded in sending a message through TargetPicker
          console.log(`[${res.status}] Message sent!`);
          setToast({
            type: 'success',
            message: '請求書を送信しました。',
          });
        } else {
          // sending message canceled
          console.log("TargetPicker was closed!");
        }
      })
      .catch((err) => {
        alert(err);
        setToast({
          type: 'error',
          message: '請求書の送信に失敗しました。',
        });
      })
  }


  const previewBillImageBlock = useMemo(() => {
    return (
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">プレビュー:</p>
        <div className="border border-gray-300 rounded-md p-3">
          {previewImage === null ? <img src="/template.png" /> : <img src={previewImage} />}
        </div>
      </div>
    )
  }, [previewImage])

  return (
    <div
      className="flex-1 overflow-y-auto p-4 w-full mt-20"
      style={{
        height: 'calc(100vh - 15rem)',
      }}
    >
      {/* メッセージエリア */}
      <div className="mb-4">
        <p className="text-lg font-bold text-gray-700">
          こちらで相手を選択するとプレビューが表示されます。
        </p>
      </div>

      {/* 相手選択セレクトボックス */}
      <div className="mb-4">
        <label htmlFor="recipient-select" className="block text-md font-medium text-gray-700">相手の選択</label>
        <select
          id="recipient-select"
          onChange={handleSelectOpponent}
          className="mt-1 block w-full pl-3 h-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md rounded-md"
        >
          <option value=''>相手を選択してください</option>
          {
            opponents?.map((opponent) => {
              return (
                <option key={opponent.id} value={opponent.id}>{opponent.name}</option>
              )
            })
          }
        </select>
      </div>

      {previewBillImageBlock}

      <div>
        {
          previewImage !== null && selectedOpponent !== null ? (
            <button
              type="button"
              onClick={sendBillToFriend}
              className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              友達に送付する
            </button>
          ) : (
            <button
              type="button"
              className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-300 cursor-not-allowed"
              disabled
            >
              友達に送付する
            </button>
          )
        }
      </div>
    </div>
  );
}
