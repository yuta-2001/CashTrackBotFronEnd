'use client'
import React, { useEffect, useState } from "react";
import { TTransaction, TOpponent, TSearchCondition } from "@/app/_libs/types";
import { TransactionType } from "@/app/_libs/enums";
import EditModalComponent from "@/app/_components/Transactions/Modal/EditModalComponent";

type Props = {
  transactions: TTransaction[] | null;
  setTransactions: (transactions: TTransaction[] | []) => void;
  opponents: TOpponent[] | null;
  searchConditions: TSearchCondition;
  selectedTransactions: TTransaction[];
  setSelectedTransactions: (transactions: TTransaction[]) => void;
};

export default function ResultListComponent(props: Props) {
  const {
    transactions,
    setTransactions,
    opponents,
    searchConditions,
    selectedTransactions,
    setSelectedTransactions,
  } = props;

  const [targetEditTransaction, setTargetEditTransaction] = useState<TTransaction | null>(null);
  const [results, setResults] = useState<TTransaction[] | null | undefined>(transactions);

  useEffect(() => {
    if (transactions) {
      setResults(transactions.filter((transaction) => {
        if (searchConditions.type !== 'all' && transaction.type !== Number(searchConditions.type)) {
          return false;
        }

        if (transaction.is_settled !== searchConditions.isSettled) {
          return false;
        }

        if (searchConditions.opponent !== 'all' && transaction.opponent_id !== Number(searchConditions.opponent)) {
          return false;
        }

        return true;
      }));
    }
  }, [searchConditions, transactions]);

  const handleCheck = (transaction: TTransaction, isChecked: boolean) => {
    if (isChecked) {
      setSelectedTransactions([...selectedTransactions, transaction]);
    } else {
      setSelectedTransactions(selectedTransactions.filter((exitTransaction) => exitTransaction.id !== transaction.id));
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {results?.map((result) => (
        <div key={result.id} className="mb-4 p-4 bg-white rounded-lg shadow flex items-center justify-between">
          <input
            type="checkbox"
            className="form-checkbox h-10 w-10 text-green-500 rounded focus:ring-0 focus:outline-none transition duration-150 ease-in-out"
            onChange={(e) => handleCheck(result, e.target.checked)}
          />

          <div className="flex-grow ml-4">
            <h3 className="text-sm font-semibold text-gray-800">{result.name}</h3>
            <p className="text-xs text-gray-600">相手: {opponents?.find((opponent) => opponent.id === result.opponent_id)?.name}</p>
            <p className="text-lg font-bold text-gray-800">¥{result.amount}</p>
          </div>

          <div className="flex items-center">
            <p className={`mr-4 text-lg font-bold ${result.type === TransactionType.Lend ? 'text-blue-500' : 'text-red-500'}`}>
              {result.type === TransactionType.Lend ? '貸し' : '借り'}
            </p>
            <button onClick={() => setTargetEditTransaction(result)} className="py-6 px-4 text-md font-bold text-gray-500 bg-gray-200 rounded hover:bg-gray-300">
              編集
            </button>
          </div>
        </div>
      ))}

      {targetEditTransaction && (
        <EditModalComponent
          opponents={opponents}
          transaction={targetEditTransaction}
          onClose={() => setTargetEditTransaction(null)}
          transactions={transactions}
          setTransactions={setTransactions}
        />
      )}
    </div>
  )
}