'use client';
import { useState } from 'react';
import { mockTransactions, mockOpponents } from './_libs/placeholder-data';

enum TransactionType {
  Lend = 1,
  Borrow = 2,
}
type SearchType = 'all' | TransactionType.Lend | TransactionType.Borrow;
type SearchOpponent = 'all' | number;

export default function Home() {

  const [searchType, setSearchType] = useState<SearchType>('all');
  const [searchIsSettled, setSearchIsSettled] = useState<boolean>(false);
  const [sarchOpponent, setSearchOpponent] = useState<SearchOpponent>('all');
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

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

  return (
    <div>
      <div className="shadow p-4 py-3 flex items-center bg-green-500">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          <span className="text-sm text-white">画</span>
        </div>
        <h1 className="ml-4 text-lg text-white font-medium">杉峯悠太</h1>
      </div>

      {/* 検索条件の表示 */}
      <div className="w-11/12 flex justify-between items-center mt-2 mx-auto relative">
        <div>
          {!searchIsSettled && (
            <button
            className="px-3 py-1 mr-2 bg-green-500 text-white text-xs font-semibold rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors"
            >
              清算額を計算
            </button>
          )}

          <button
            className="px-3 py-1 mr-2 bg-green-500 text-white text-xs font-semibold rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors"
          >
            削除
          </button>
        </div>

        {/* 条件変更ボタン */}
        <button
          onClick={toggleSearchVisibility}
          className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors"
        >
          {isSearchVisible ? '閉じる' : '絞り込み'}
        </button>

        {isSearchVisible && (
          <div className="bg-white p-4 shadow-md w-2/3 absolute top-8 right-0 rounded-sm">
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
                      <option value={opponent.id}>{opponent.name}</option>
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
          {/* 左端：チェックボックス */}
          <input
            type="checkbox"
            className="form-checkbox h-7 w-7 text-green-500 rounded focus:ring-0 focus:outline-none transition duration-150 ease-in-out"
          />

          {/* 中央の内容 */}
          <div className="flex-grow ml-4">
            {/* 項目名 */}
            <h3 className="text-sm font-semibold text-gray-800">{result.name}</h3>

            {/* 相手 */}
            <p className="text-xs text-gray-600">相手: {result.opponent_name}</p>

            {/* 金額 */}
            <p className="text-lg font-bold text-gray-800">¥{result.amount}</p>
          </div>

          {/* 右端：編集ボタンと貸し借りステータス */}
          <div className="flex items-center">
            <p className={`mr-4 text-lg font-bold ${result.type === 1 ? 'text-red-500' : 'text-blue-500'}`}>
              {result.type === 1 ? '貸し' : '借り'}
            </p>

            {/* 編集ボタン */}
            <button className="py-6 px-3 text-xs text-gray-500 bg-gray-200 rounded hover:bg-gray-300">
              編集
            </button>
          </div>
        </div>
      ))}

      </div>
    </div>
  );
};
