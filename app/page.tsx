'use client';
import { useEffect, useState } from 'react';
import { useUserUpdate } from './_contexts/UserProvider';
import { useTransactionsUpdate } from './_contexts/TransactionsProvider';
import { mockTransactions, mockOpponents, mockUser } from './_libs/placeholder-data';
import { TTransaction } from './_types/TTransaction';

enum TransactionType {
  Lend = 1,
  Borrow = 2,
}

enum CalculateTransactionType {
  Pay = 1,
  Receive = 2,
}

type SearchType = 'all' | TransactionType.Lend | TransactionType.Borrow;
type SearchOpponent = 'all' | number;

export default function Home() {
  const setUser = useUserUpdate();
  const setTransactions = useTransactionsUpdate();

  const [searchType, setSearchType] = useState<SearchType>('all');
  const [searchIsSettled, setSearchIsSettled] = useState<boolean>(false);
  const [sarchOpponent, setSearchOpponent] = useState<SearchOpponent>('all');
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [isOpenSettleConfirm, setIsOpenSettleConfirm] = useState<boolean>(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const [targetEditTransaction, setTargetEditTransaction] = useState<TTransaction | null>(null);

  // チェックのついている取引のIDを格納する配列
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<number[]>([]);

  // チェックのついている取引の精算額計算結果を格納する配列
  const [calculateSettled, setCalculateSettled] = useState<{
    name: string;
    amount: number;
    type: CalculateTransactionType;
  }[]>([]);

  const handleCheck = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedTransactionIds([...selectedTransactionIds, id]);
    } else {
      setSelectedTransactionIds(selectedTransactionIds.filter((selectedId) => selectedId !== id));
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
    if (selectedTransactionIds.length === 0) {
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
    const newTransactions = mockTransactions.filter((transaction) => !selectedTransactionIds.includes(transaction.id));
    console.log(newTransactions);
  }

  const handleSettleConfirm = () => {
    if (selectedTransactionIds.length === 0) {
      alert('清算する取引を選択してください');
      return;
    }

    const calculateTransactions = mockTransactions.filter((transaction) => selectedTransactionIds.includes(transaction.id));
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

      const payAmount = opponentTransactions.filter((transaction) => transaction.type === TransactionType.Lend).reduce((sum, transaction) => sum + transaction.amount, 0);
      const receiveAmount = opponentTransactions.filter((transaction) => transaction.type === TransactionType.Borrow).reduce((sum, transaction) => sum + transaction.amount, 0);

      const amount = payAmount - receiveAmount;

      if (amount > 0) {
        calculate.push({
          name: mockOpponents.find((opponent) => opponent.id === opponentId)?.name || '',
          amount,
          type: CalculateTransactionType.Pay,
        });
      } else if (amount < 0) {
        calculate.push({
          name: mockOpponents.find((opponent) => opponent.id === opponentId)?.name || '',
          amount: Math.abs(amount),
          type: CalculateTransactionType.Receive,
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
      if (selectedTransactionIds.includes(transaction.id)) {
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
      <div className="shadow p-4 py-3 flex items-center bg-green-500">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          <span className="text-sm text-white">画</span>
        </div>
        <h1 className="ml-4 text-lg text-white font-medium">{ user.name }</h1>
      </div>

      {/* 検索条件の表示 */}
      <div className="w-11/12 flex justify-between items-center mt-2 mx-auto relative">
        <div>
          {!searchIsSettled && (
            selectedTransactionIds.length > 0 ? (
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
            selectedTransactionIds.length > 0 ? (
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
          <div className="bg-white p-4 shadow-md w-2/3 absolute top-8 right-0 rounded-md">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* 取引タイプ選択 */}
              <div>
                <label htmlFor="searchType" className="text-sm font-bold text-gray-700">
                  取引タイプ
                </label>
                <select
                  id="searchType"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                >
                  <option value="all">全て</option>
                  <option value="1">貸し</option>
                  <option value="2">借り</option>
                </select>
              </div>

              {/* 清算ステータス選択 */}
              <div>
                <label htmlFor="settlementStatus" className="text-sm font-bold text-gray-700">
                  清算ステータス
                </label>
                <select
                  id="settlementStatus"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={searchIsSettled ? '1' : '0'}
                  onChange={(e) => setSearchIsSettled(e.target.value === '1')}
                >
                  <option value="0">未清算</option>
                  <option value="1">清算済み</option>
                </select>
              </div>

              {/* 相手タイプ選択 */}
              <div>
                <label htmlFor="partnerType" className="text-sm font-bold text-gray-700">
                  相手タイプ
                </label>
                <select
                  id="partnerType"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={sarchOpponent}
                  onChange={(e) => setSearchOpponent(e.target.value as SearchOpponent)}
                >
                  <option value="all">全て</option>
                  {
                    mockOpponents.map((opponent) => (
                      <option key={opponent.id} value={opponent.id}>{opponent.name}</option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 検索結果の一覧 */}
      <div className="flex-1 overflow-y-auto p-4">
      {results.map((result) => (
        <div key={result.id} className="mb-4 p-4 bg-white rounded-lg shadow flex items-center justify-between">
          <input
            type="checkbox"
            className="form-checkbox h-7 w-7 text-green-500 rounded focus:ring-0 focus:outline-none transition duration-150 ease-in-out"
            onChange={(e) => handleCheck(result.id, e.target.checked)}
          />

          <div className="flex-grow ml-4">
            <h3 className="text-sm font-semibold text-gray-800">{result.name}</h3>
            <p className="text-xs text-gray-600">相手: {mockOpponents.find((opponent) => opponent.id === result.opponent_id)?.name}</p>
            <p className="text-lg font-bold text-gray-800">¥{result.amount}</p>
          </div>

          <div className="flex items-center">
            <p className={`mr-4 text-lg font-bold ${result.type === 1 ? 'text-red-500' : 'text-blue-500'}`}>
              {result.type === 1 ? '貸し' : '借り'}
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-11/12 max-w-6xl h-85% overflow-auto rounded shadow-lg p-6 relative">
              <button onClick={handleSettleCancel} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">✖</button>
              <h2 className="text-lg font-bold mb-4">清算額を確認</h2>

              <table className="min-w-full table-auto text-center">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">From</th>
                    <th className="px-4 py-2 border">To</th>
                    <th className="px-4 py-2 border">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {calculateSettled.map((settlement, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">{settlement.type === CalculateTransactionType.Pay ? 'あなた' : settlement.name}</td>
                      <td className="px-4 py-2 border">{settlement.type === CalculateTransactionType.Receive ? 'あなた' : settlement.name}</td>
                      <td className="px-4 py-2 border font-bold">¥{settlement.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-center mt-4">
                <button onClick={handleSettleCancel} className="px-4 py-2 mr-2 bg-gray-300 rounded shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">キャンセル</button>
                <button onClick={handleSettle} className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors">清算する</button>
              </div>
            </div>
          </div>
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-11/12 max-w-6xl h-85% overflow-auto rounded shadow-lg p-6 relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-lg font-bold mb-4">作成</h2>
            <form>
              {/* Name field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  項目名
                </label>
                <input
                  id="name"
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="項目名"
                />
              </div>

              {/* Opponent field */}
              <div className="mb-4">
                <label htmlFor="opponent" className="block text-gray-700 text-sm font-bold mb-2">
                  相手
                </label>
                <select
                  id="opponent"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">全て</option>
                  <option value="1">個人A</option>
                  <option value="2">個人B</option>
                </select>
              </div>

              {/* Is_settled field */}
              <div className="mb-4">
                <label htmlFor="is_settled" className="block text-gray-700 text-sm font-bold mb-2">
                  清算ステータス
                </label>
                <select
                  id="is_settled"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="false">未清算</option>
                  <option value="true">清算済み</option>
                </select>
              </div>

              {/* Type field */}
              <div className="mb-4">
                <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
                  タイプ
                </label>
                <select
                  id="type"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">全て</option>
                  <option value="1">貸し</option>
                  <option value="2">借り</option>
                </select>
              </div>

              {/* Amount field */}
              <div className="mb-4">
                <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
                  金額
                </label>
                <input
                  id="amount"
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1000"
                />
              </div>

              {/* Memo field */}
              <div className="mb-4">
                <label htmlFor="memo" className="block text-gray-700 text-sm font-bold mb-2">
                  メモ
                </label>
                <input
                  id="memo"
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="メモ"
                />
              </div>

              <div className="flex justify-center mt-4">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 mr-2 bg-gray-300 rounded shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">キャンセル</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors">作成する</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* 編集画面モーダル */}
      {targetEditTransaction && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-11/12 max-w-6xl h-85% overflow-auto rounded shadow-lg p-6 relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">✖</button>
            <h2 className="text-lg font-bold mb-4">編集</h2>
            <form>
              {/* Name field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  項目名
                </label>
                <input
                  id="name"
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="項目名"
                />
              </div>

              {/* Opponent field */}
              <div className="mb-4">
                <label htmlFor="opponent" className="block text-gray-700 text-sm font-bold mb-2">
                  相手
                </label>
                <select
                  id="opponent"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">全て</option>
                  <option value="1">個人A</option>
                  <option value="2">個人B</option>
                </select>
              </div>

              {/* Is_settled field */}
              <div className="mb-4">
                <label htmlFor="is_settled" className="block text-gray-700 text-sm font-bold mb-2">
                  清算ステータス
                </label>
                <select
                  id="is_settled"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="false">未清算</option>
                  <option value="true">清算済み</option>
                </select>
              </div>

              {/* Type field */}
              <div className="mb-4">
                <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
                  タイプ
                </label>
                <select
                  id="type"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">全て</option>
                  <option value="1">貸し</option>
                  <option value="2">借り</option>
                </select>
              </div>

              {/* Amount field */}
              <div className="mb-4">
                <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
                  金額
                </label>
                <input
                  id="amount"
                  type="number"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1000"
                />
              </div>

              {/* Memo field */}
              <div className="mb-4">
                <label htmlFor="memo" className="block text-gray-700 text-sm font-bold mb-2">
                  メモ
                </label>
                <input
                  id="memo"
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="メモ"
                />
              </div>

              <div className="flex justify-center mt-4">
                <button className="px-4 py-2 mr-2 bg-gray-300 rounded shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">キャンセル</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors">更新する</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
