'use client';
import { useEffect, useState } from 'react';
import { useUserUpdate } from '../_contexts/UserProvider';
import { useTransactionsUpdate } from '../_contexts/TransactionsProvider';
import { mockTransactions, mockOpponents, mockUser } from '../_libs/placeholder-data';
import { TTransaction, TOpponentSelect, TTypeSelect } from '../_libs/types';
import { TransactionType, CalculateTransactionType } from '../_libs/enums';
import CreateModalComponent from '../_components/modal/transaction/CreateModalComponent';
import EditModalComponent from '../_components/modal/transaction/EditModalComponent';
import SettleConfirmModalComponent from '../_components/modal/transaction/SettleConfirmModalComponent';
import HeaderComponent from '../_components/common/HeaderComponent';
import SearchBoxModalComponent from '../_components/modal/transaction/SearchBoxModalComponent';


export default function Home() {
  const setUser = useUserUpdate();
  const setTransactions = useTransactionsUpdate();

  const [searchType, setSearchType] = useState<TTypeSelect>('all');
  const [searchIsSettled, setSearchIsSettled] = useState<boolean>(false);
  const [sarchOpponent, setSearchOpponent] = useState<TOpponentSelect>('all');
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [isOpenSettleConfirm, setIsOpenSettleConfirm] = useState<boolean>(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const [targetEditTransaction, setTargetEditTransaction] = useState<TTransaction | null>(null);

  // チェックのついている取引のIDを格納する配列
  const [selectedTransactions, setSelectedTransactions] = useState<TTransaction[]>([]);

  // チェックのついている取引の精算額計算結果を格納する配列
  const [calculateSettled, setCalculateSettled] = useState<{
    name: string;
    amount: number;
    type: CalculateTransactionType;
  }[]>([]);

  const handleCheck = (transaction: TTransaction, isChecked: boolean) => {
    if (isChecked) {
      setSelectedTransactions([...selectedTransactions, transaction]);
    } else {
      setSelectedTransactions(selectedTransactions.filter((exitTransaction) => exitTransaction.id !== transaction.id));
    }
  }

  const results = mockTransactions.filter((transaction) => {
    if (searchType !== 'all' && transaction.type !== Number(searchType)) {
      return false;
    }

    if (transaction.is_settled !== searchIsSettled) {
      return false;
    }

    if (sarchOpponent !== 'all' && transaction.opponent_id !== Number(sarchOpponent)) {
      return false;
    }

    return true;
  });

  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleDeleteConfirm = () => {
    if (selectedTransactions.length === 0) {
      alert('削除する取引を選択してください');
      return;
    }

    if (!confirm('選択した取引を削除しますか？')) {
      return;
    }

    handleDelete();
  };

  const handleDelete = () => {
    // deleteのAPIを叩く
    // 成功したら、selectedTransactionIdsを空にする。また、取引一覧を更新する。
    // 失敗したら、エラーを表示する。
    const newTransactions = mockTransactions.filter((transaction) => !selectedTransactions.includes(transaction));
    console.log(newTransactions);
  }

  const handleSettleConfirm = () => {
    if (selectedTransactions.length === 0) {
      alert('清算する取引を選択してください');
      return;
    }

    const calculateTransactions = mockTransactions.filter((transaction) => selectedTransactions.includes(transaction));
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
          name: mockOpponents.find((opponent) => opponent.id === opponentId)?.name || '',
          amount,
          type: CalculateTransactionType.Receive,
        });
      } else if (amount < 0) {
        calculate.push({
          name: mockOpponents.find((opponent) => opponent.id === opponentId)?.name || '',
          amount: Math.abs(amount),
          type: CalculateTransactionType.Pay,
        });
      }
    });

    setCalculateSettled(calculate);
    setIsOpenSettleConfirm(true);
  }

  const handleSettleCancel = () => {
    setIsOpenSettleConfirm(false);
    setCalculateSettled([]);
  }

  const handleSettle = () => {
    // settleのAPIを叩く
    // 成功したら、selectedTransactionIdsを空にする。また、取引一覧を更新する。
    // 失敗したら、エラーを表示する。
    const newTransactions = mockTransactions.map((transaction) => {
      if (selectedTransactions.includes(transaction)) {
        return {
          ...transaction,
          is_settled: true,
        };
      }
      return transaction;
    });
  }

  const user = mockUser;

  useEffect(() => {
    setUser?.(user);
    setTransactions?.(mockTransactions);
  }, [setUser, setTransactions]);

  return (
    <div>
      {/* ヘッダー */}
      <HeaderComponent user={mockUser} />

      {/* 検索条件の表示 */}
      <div className="w-11/12 flex justify-between items-center mt-2 mx-auto relative">
        <div>
          {!searchIsSettled && (
            selectedTransactions.length > 0 ? (
              <button
                className="px-3 py-1 mr-2 bg-green-500 text-white text-xs font-semibold rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors"
                onClick={handleSettleConfirm}
              >
                清算額を計算
              </button>
            ) : (
              <button
                className="px-3 py-1 mr-2 bg-gray-300 text-white text-xs font-semibold rounded-lg shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
                disabled
              >
                清算額を計算
              </button>
            )
          )}

          {
            selectedTransactions.length > 0 ? (
              <button
                className="px-3 py-1 mr-2 bg-green-500 text-white text-xs font-semibold rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors"
                onClick={handleDeleteConfirm}
              >
                選択した取引を削除
              </button>
            ) : (
              <button
                className="px-3 py-1 mr-2 bg-gray-300 text-white text-xs font-semibold rounded-lg shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
                disabled
              >
                選択した取引を削除
              </button>
            )
          }
        </div>

        {/* 条件変更ボタン */}
        <button
          onClick={toggleSearchVisibility}
          className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors"
        >
          {isSearchVisible ? '閉じる' : '絞り込み'}
        </button>

        {isSearchVisible && (
          <SearchBoxModalComponent
            opponents={mockOpponents}
            searchType={searchType}
            setSearchType={setSearchType}
            searchIsSettled={searchIsSettled}
            setSearchIsSettled={setSearchIsSettled}
            sarchOpponent={sarchOpponent}
            setSearchOpponent={setSearchOpponent}
          />
        )}
      </div>

      {/* 検索結果の一覧 */}
      <div className="flex-1 overflow-y-auto p-4">
      {results.map((result) => (
        <div key={result.id} className="mb-4 p-4 bg-white rounded-lg shadow flex items-center justify-between">
          <input
            type="checkbox"
            className="form-checkbox h-7 w-7 text-green-500 rounded focus:ring-0 focus:outline-none transition duration-150 ease-in-out"
            onChange={(e) => handleCheck(result, e.target.checked)}
          />

          <div className="flex-grow ml-4">
            <h3 className="text-sm font-semibold text-gray-800">{result.name}</h3>
            <p className="text-xs text-gray-600">相手: {mockOpponents.find((opponent) => opponent.id === result.opponent_id)?.name}</p>
            <p className="text-lg font-bold text-gray-800">¥{result.amount}</p>
          </div>

          <div className="flex items-center">
            <p className={`mr-4 text-lg font-bold ${result.type === TransactionType.Lend ? 'text-blue-500' : 'text-red-500'}`}>
              {result.type === TransactionType.Lend ? '貸し' : '借り'}
            </p>
            <button onClick={() => setTargetEditTransaction(result)} className="py-6 px-3 text-xs text-gray-500 bg-gray-200 rounded hover:bg-gray-300">
              編集
            </button>
          </div>
        </div>
      ))}

      </div>

      {/* 清算確認モーダル */}
      {isOpenSettleConfirm && (
        <SettleConfirmModalComponent
          onClose={handleSettleCancel}
          onSubmit={handleSettle}
          calculateResults={calculateSettled}
        />
      )}

      {/* 作成用ボタン */}
      <button
        onClick={() => setIsCreateModalOpen(true)} 
        className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 hover:bg-green-600 text-white font-bold w-10 h-10 rounded-full leading-none text-3xl "
        aria-label="Add"
      >
        +
      </button>

      {/* 取引作成モーダル */}
      {isCreateModalOpen && (
        <CreateModalComponent
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {/* 編集画面モーダル */}
      {targetEditTransaction && (
        <EditModalComponent
          transaction={targetEditTransaction}
          onClose={() => setTargetEditTransaction(null)}
        />
      )}
    </div>
  );
};
