'use client'
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { TTransaction } from "@/app/_libs/types";
import { TransactionType } from "@/app/_libs/enums";
import EditModalComponent from "@/app/_components/Transactions/Modal/EditModalComponent";
import { getOpponents, getTransactions } from '@/app/_libs/data';
import { useOpponents, useOpponentsUpdate } from "@/app/_context/OpponentsProvider";
import { useTransactions, useTransactionsUpdate } from "@/app/_context/TransactionsProvider";
import { useSearchConditions } from "@/app/_context/Transactions/SearchConditionsProvider";
import { useSelectedTransactions, useSelectedTransactionsUpdate } from "@/app/_context/Transactions/SelectedTransactionsProvider";
import { useLiff } from "@/app/_context/LiffProvider";

export default function ResultListComponent() {

  const opponents = useOpponents();
  const setOpponents = useOpponentsUpdate();
  const transactions = useTransactions();
  const setTransactions = useTransactionsUpdate();
  const searchConditions = useSearchConditions();
  const selectedTransactions = useSelectedTransactions();
  const setSelectedTransactions = useSelectedTransactionsUpdate();
  const liff = useLiff();

  const [targetEditTransaction, setTargetEditTransaction] = useState<TTransaction | null>(null);
  const [results, setResults] = useState<TTransaction[]>([]);

  useEffect(() => {
    if (opponents === undefined ||
        setOpponents === undefined ||
        setTransactions === undefined ||
        liff === null
    ) {
      return;
    }

    const fetchData = async () => {
      const opponentsData = await getOpponents(liff);
      const transactionsData = await getTransactions(liff);
      
      setOpponents(opponentsData);
      setTransactions(transactionsData);
    }

    fetchData();
  }, [liff, setOpponents, setTransactions]);

  useEffect(() => {
    if (
      transactions === undefined ||
      searchConditions === undefined ||
      liff === null
    ) {
      return;
    }

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
  }, [liff, searchConditions, transactions]);

  const handleCheck = useCallback((transaction: TTransaction, isChecked: boolean) => {
    if (
      selectedTransactions === undefined ||
      setSelectedTransactions === undefined ||
      liff === null
    ) {
      return;
    }

    if (isChecked) {
      setSelectedTransactions([...selectedTransactions, transaction]);
    } else {
      setSelectedTransactions(selectedTransactions.filter((exitTransaction) => exitTransaction.id !== transaction.id));
    }
  }, [liff, selectedTransactions, setSelectedTransactions])


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
              <button onClick={() => setTargetEditTransaction(result)} className="py-6 px-4 text-md font-bold text-gray-500 bg-gray-200 rounded hover:bg-gray-300">
                編集
              </button>
            </div>
          </div>
        ))}
      </>
    )
  }, [results, opponents, handleCheck]);



  return (
    <div className="flex-1 overflow-y-auto p-4">
      {resultList}
      {targetEditTransaction && (
        <EditModalComponent
          opponents={opponents}
          transaction={targetEditTransaction}
          onClose={() => setTargetEditTransaction(null)}
        />
      )}
    </div>
  )
}