'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useOpponents } from '../_context/OpponentsProvider';
import { useSearchConditionsUpdate } from '../_context/Transactions/SearchConditionsProvider';

export default function OpponentsPage() {
  const router = useRouter();
  const opponents = useOpponents();
  const setSearchConditions = useSearchConditionsUpdate();

  if (
    opponents === undefined ||
    setSearchConditions === undefined ||
    router === undefined
  ) {
    return null;
  }

  const checkTransaction = (opponentId: number) => {
    setSearchConditions({
      type: 'all',
      isSettled: false,
      opponent: opponentId,
    });
    router.push('/transactions');
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-4 w-full fixed top-20"
      style={{
        height: 'calc(100vh - 10rem)',
      }}
    >
      {opponents.map((opponent) => {
        return (
          <div className="mb-4 p-4 bg-white rounded-lg shadow flex items-center justify-between">
            <div className="flex-grow ml-4">
              <h3 className="text-lg font-semibold text-gray-800">中山ゆい</h3>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => checkTransaction(opponent.id)}
                className="py-6 px-4 mr-2 text-md font-bold text-gray-500 bg-gray-200 rounded hover:bg-gray-300"
              >
                貸借り確認
              </button>
              <button className="py-6 px-4 text-md font-bold text-gray-500 bg-gray-200 rounded hover:bg-gray-300">
                編集
              </button>
            </div>
          </div>
        )
      })}
    </div>
  );
}
