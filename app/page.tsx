'use client';
import { useState } from 'react';

export default function Home() {
  // 状態管理用のフック
  const [searchType, setSearchType] = useState('all'); // 'all', 'lend', 'borrow'
  const [settlementStatus, setSettlementStatus] = useState('unsettled'); // 'unsettled', 'settled'
  const [partnerType, setPartnerType] = useState('all'); // 'all', 'individual'
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // 検索結果を表示する配列（ここではダミーデータを使用）
  const results = [
    // ダミーデータ
    { id: 1, name: 'A', type: 'borrow', status: 'unsettled', partner: 'John Doe', amount: 1000 },
    { id: 2, name: 'B', type: 'borrow', status: 'unsettled', partner: 'John Doe', amount: 1000 },
    { id: 3, name: 'C', type: 'borrow', status: 'unsettled', partner: 'John Doe', amount: 1000 },
    { id: 4, name: 'D', type: 'borrow', status: 'unsettled', partner: 'John Doe', amount: 1000 },
    { id: 5, name: 'E', type: 'borrow', status: 'unsettled', partner: 'John Doe', amount: 1000 },
    { id: 6, name: 'F', type: 'borrow', status: 'unsettled', partner: 'John Doe', amount: 1000 },
    { id: 7, name: 'G', type: 'borrow', status: 'unsettled', partner: 'John Doe', amount: 1000 },
    { id: 8, name: 'H', type: 'borrow', status: 'unsettled', partner: 'John Doe', amount: 1000 },
    { id: 9, name: 'I', type: 'borrow', status: 'unsettled', partner: 'John Doe', amount: 1000 },
    { id: 10, name: 'J', type: 'borrow', status: 'unsettled', partner: 'John Doe', amount: 1000 },
  ];

  // 検索を実行する関数（ここではダミーの実装）
  const handleSearch = () => {
    console.log('Search with:', { searchType, settlementStatus, partnerType });
    // 実際の検索処理をここで実行...
  };

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
          {settlementStatus === 'unsettled' && (
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
          <form onSubmit={handleSearch} className="bg-white p-4 shadow-md w-2/3 absolute top-8 right-0 rounded-sm">
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
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="all">全て</option>
                  <option value="lend">貸し</option>
                  <option value="borrow">借り</option>
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
                  value={settlementStatus}
                  onChange={(e) => setSettlementStatus(e.target.value)}
                >
                  <option value="unsettled">未清算</option>
                  <option value="settled">清算済み</option>
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
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value)}
                >
                  <option value="all">全て</option>
                  <option value="individual">個人</option>
                </select>
              </div>
            </div>

            {/* 検索ボタン */}
            <div className="mt-4">
              <button
                type="submit"
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                検索
              </button>
            </div>
          </form>
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
            <p className="text-xs text-gray-600">相手: {result.partner}</p>

            {/* 金額 */}
            <p className="text-lg font-bold text-gray-800">¥{result.amount}</p>
          </div>

          {/* 右端：編集ボタンと貸し借りステータス */}
          <div className="flex items-center">
            <p className={`mr-4 text-lg font-bold ${result.type === 'borrow' ? 'text-red-500' : 'text-blue-500'}`}>
              {result.type === 'borrow' ? '借り' : '貸し'}
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
