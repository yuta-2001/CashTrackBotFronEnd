'use client'
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { TTransaction } from "@/app/_libs/types";
import { TransactionType } from "@/app/_libs/enums";
import EditModalComponent from "@/app/_components/Transactions/Modal/EditModalComponent";
import { useOpponents } from "@/app/_context/OpponentsProvider";
import { useTransactions } from "@/app/_context/Transactions/TransactionsProvider";
import { useSearchConditions } from "@/app/_context/SearchConditionsProvider";
import { useSelectedTransactions, useSelectedTransactionsUpdate } from "@/app/_context/Transactions/SelectedTransactionsProvider";
import { Edit2 } from 'lucide-react';

export default function ResultListComponent() {

  const opponents = useOpponents();
  const transactions = useTransactions();
  const searchConditions = useSearchConditions();
  const selectedTransactions = useSelectedTransactions();
  const setSelectedTransactions = useSelectedTransactionsUpdate();

  const [targetEditTransaction, setTargetEditTransaction] = useState<TTransaction | null>(null);
  const [results, setResults] = useState<TTransaction[]>([]);

  useEffect(() => {
    if (
      transactions === undefined ||
      searchConditions === undefined
    ) {
      return;
    }

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
  }, [searchConditions.isSettled, searchConditions.opponent, searchConditions.type, transactions]);

  const handleCheck = useCallback((transaction: TTransaction, isChecked: boolean) => {
    if (
      selectedTransactions === undefined ||
      setSelectedTransactions === undefined
    ) {
      return;
    }

    if (isChecked) {
      setSelectedTransactions([...selectedTransactions, transaction]);
    } else {
      setSelectedTransactions(selectedTransactions.filter((exitTransaction) => exitTransaction.id !== transaction.id));
    }
  }, [selectedTransactions, setSelectedTransactions])


  const resultList = useMemo(() => {
    return (
      <>
        {results.map((result) => (
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
              <button
                onClick={() => setTargetEditTransaction(result)}
                className="py-6 w-24 text-md font-semibold text-blue-600 bg-blue-100 rounded hover:bg-blue-200 flex items-center justify-center"
              >
                <Edit2 className="w-5 h-5 mr-2" />
                編集
              </button>
            </div>
          </div>
        ))}
      </>
    )
  }, [results, opponents, handleCheck]);


  return (
    <div 
      className="flex-1 overflow-y-auto px-4 w-full mt-4"
      style = {{
        height: 'calc(100vh - 15rem)',
      }}
    >
      {resultList}
      {targetEditTransaction && (
        <EditModalComponent
          transaction={targetEditTransaction}
          onClose={() => setTargetEditTransaction(null)}
        />
      )}
    </div>
  )
}
