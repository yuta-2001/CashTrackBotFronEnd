import React, { useState, useEffect, useCallback, useMemo } from "react"
import { TCalculateResult } from "@/app/_libs/types"
import { TransactionType, CalculateTransactionType } from "@/app/_libs/enums"
import SearchBoxModalComponent from "@/app/_components/Transactions/Modal/SearchBoxModalComponent"
import SettleConfirmModalComponent from "@/app/_components/Transactions/Modal/SettleConfirmModalComponent"
import { batchDeleteTransaction } from "@/app/_libs/data"
import { useSelectedTransactions, useSelectedTransactionsUpdate } from "@/app/_context/Transactions/SelectedTransactionsProvider"
import { useTransactions, useTransactionsUpdate } from "@/app/_context/Transactions/TransactionsProvider"
import { useOpponents } from "@/app/_context/OpponentsProvider"
import { useSearchConditions } from "@/app/_context/SearchConditionsProvider"
import { useLiff } from "@/app/_context/LiffProvider"
import { useToastUpdate } from "@/app/_context/ToastProvider"

export default function HeadBtnListComponent() {
  const [isOpenSettleConfirm, setIsOpenSettleConfirm] = useState<boolean>(false);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [calculateSettled, setCalculateSettled] = useState<TCalculateResult[]>([]);

  const selectedTransactions = useSelectedTransactions();
  const setSelectedTransactions = useSelectedTransactionsUpdate();
  const transactions = useTransactions();
  const setTransactions = useTransactionsUpdate();
  const opponents = useOpponents();
  const searchConditions = useSearchConditions();
  const liff = useLiff();
  const setToast = useToastUpdate();

  const handleDeleteConfirm = useCallback(async () => {
    if (
      transactions === undefined ||
      setTransactions === undefined ||
      selectedTransactions === undefined ||
      setSelectedTransactions === undefined ||
      liff === null ||
      setToast === undefined
    ) {
      return;
    }

    if (selectedTransactions.length === 0) {
      setToast({
        type: 'error',
        message: '削除する取引を選択してください'
      });
      return;
    }

    if (!confirm('選択した取引を削除しますか？')) {
      return;
    }

    const transactionIds = selectedTransactions.map((transaction) => {
      return transaction.id;
    });

    try {
      await batchDeleteTransaction(transactionIds, liff);
      setTransactions(transactions!.filter((transaction) => {
        return !transactionIds.includes(transaction.id);
      }));
  
      setSelectedTransactions([]);
      setToast({
        type: 'success',
        message: '選択した記録を削除しました'
      });

    } catch (e) {
      alert('エラーが発生しました');
    }

  }, [transactions, setTransactions, selectedTransactions, setSelectedTransactions, liff]);


  const handleSettleConfirm = useCallback(() => {
    if (
      setToast === undefined ||
      transactions === null ||
      opponents === null ||
      selectedTransactions === undefined
    ) {
      return;
    }

    if (selectedTransactions.length === 0) {
      setToast({
        type: 'error',
        message: '清算する取引を選択してください'
      });
      return;
    }

    const calculateTransactions = transactions.filter((transaction) => selectedTransactions.includes(transaction));
    const calculate: {
      name: string;
      amount: number;
      type: CalculateTransactionType;
    }[] = [];

    const opponentIds: number[] = [];
    calculateTransactions.forEach((transaction) => {
      if (!opponentIds.includes(transaction.opponent_id)) {
        opponentIds.push(transaction.opponent_id);
      }
    });

    opponentIds.forEach((opponentId) => {
      const opponentTransactions = calculateTransactions.filter((transaction) => transaction.opponent_id === opponentId);

      const payAmount = opponentTransactions.filter((transaction) => transaction.type === TransactionType.Borrow).reduce((sum, transaction) => sum + transaction.amount, 0);
      const receiveAmount = opponentTransactions.filter((transaction) => transaction.type === TransactionType.Lend).reduce((sum, transaction) => sum + transaction.amount, 0);

      const amount = receiveAmount - payAmount;

      if (amount > 0) {
        calculate.push({
          name: opponents.find((opponent) => opponent.id === opponentId)?.name || '',
          amount,
          type: CalculateTransactionType.Receive,
        });
      } else if (amount < 0) {
        calculate.push({
          name: opponents.find((opponent) => opponent.id === opponentId)?.name || '',
          amount: Math.abs(amount),
          type: CalculateTransactionType.Pay,
        });
      }
    });

    setCalculateSettled(calculate);
    setIsOpenSettleConfirm(true);
  }, [transactions, opponents, selectedTransactions, setCalculateSettled, setIsOpenSettleConfirm, setToast]);


  useEffect(() => {
    if (selectedTransactions === undefined ||
      setSelectedTransactions === undefined ||
      transactions === undefined ||
      setTransactions === undefined ||
      opponents === undefined ||
      liff === null ||
      setToast === undefined
    ) {
      return;
    }
  }, [selectedTransactions, setSelectedTransactions, transactions, setTransactions, opponents, liff, setToast]);


  const actionBtnList = useMemo(() => {
    return (
      <div>
        {!searchConditions.isSettled && (
          selectedTransactions.length > 0 ? (
            <button
              className="px-4 py-3 mr-2 bg-green-500 text-white text-md font-semibold rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors"
              onClick={handleSettleConfirm}
            >
              一括清算
            </button>
          ) : (
            <button
              className="px-4 py-3 mr-2 bg-gray-300 text-white text-md font-semibold rounded-lg shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
              disabled
            >
              一括清算
            </button>
          )
        )}

        {
          selectedTransactions.length > 0 ? (
            <button
              className="px-4 py-3 mr-2 bg-green-500 text-white text-md font-semibold rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors"
              onClick={handleDeleteConfirm}
            >
              一括削除
            </button>
          ) : (
            <button
              className="px-4 py-3 mr-2 bg-gray-300 text-white text-md font-semibold rounded-lg shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
              disabled
            >
              一括削除
            </button>
          )
        }
      </div>
    )
  }, [searchConditions.isSettled, selectedTransactions, handleSettleConfirm, handleDeleteConfirm]);

  const toggleSearchBoxBtn = useMemo(() => {
    return (
      <button
        onClick={() => setIsSearchVisible(!isSearchVisible)}
        className="px-4 py-3 bg-green-500 text-white text-md font-semibold rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors"
      >
        {isSearchVisible ? '閉じる' : '絞り込み'}
      </button>
    )
  }, [isSearchVisible, setIsSearchVisible]);

  return (
    <div className="w-full px-4 flex justify-between items-center mx-auto mt-24 relative">
      {actionBtnList}
      {toggleSearchBoxBtn}

      {isSearchVisible && (
        <SearchBoxModalComponent />
      )}

      {isOpenSettleConfirm && (
        <SettleConfirmModalComponent
          setIsOpenSettleConfirm={setIsOpenSettleConfirm}
          setCalculateSettled={setCalculateSettled}
          calculateResults={calculateSettled}
        />
      )}
    </div>
  )
}
