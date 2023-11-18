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
    { id: 1, type: 'borrow', status: 'unsettled', partner: 'John Doe' },
    // さらに結果を追加...
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
      <div className="w-11/12 flex justify-end items-center mt-2 mx-auto relative">
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
          <div
            key={result.id}
            className="p-4 mb-4 bg-white rounded shadow"
          >
            <p>タイプ: {result.type === 'borrow' ? '借り' : '貸し'}</p>
            <p>ステータス: {result.status === 'unsettled' ? '未清算' : '清算済み'}</p>
            <p>相手: {result.partner}</p>
          </div>
        ))}
      </div>
    </div>
  );
};