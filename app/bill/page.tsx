'use client';
import { useState } from "react";
import { useEffect } from "react";
import { useOpponents } from "../_context/OpponentsProvider";
import { useTransactions } from "../_context/Transactions/TransactionsProvider";


export default function BillPage() {

  const opponents = useOpponents();
  const transactions = useTransactions();

  useEffect(() => {
    if (opponents === undefined || transactions === undefined) {
      return;
    }
  }, [opponents, transactions]);

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

      {/* プレビュー画像表示エリア */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">プレビュー:</p>
        <div className="border border-gray-300 rounded-md p-3">
          <img src="/template.png" />
        </div>
      </div>

      {/* 発行ボタン */}
      <div>
        <button
          type="button"
          className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          友達に送付する
        </button>
      </div>
    </div>
  );
}