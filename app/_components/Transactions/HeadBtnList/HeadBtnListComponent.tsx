import { TTransaction, TOpponent, TCalculateResult, TSearchCondition } from "@/app/_libs/types"
import { TransactionType, CalculateTransactionType } from "@/app/_libs/enums"
import SearchBoxModalComponent from "@/app/_components/Transactions/Modal/SearchBoxModalComponent"
import liff from "@line/liff"
import { batchDeleteTransaction } from "@/app/_libs/data"

type Props = {
  opponents: TOpponent[] | null;
  transactions: TTransaction[] | null;
  setTransactions: (transactions: TTransaction[]) => void;
  searchConditions: TSearchCondition;
  setSearchConditions: (condition: TSearchCondition) => void;
  isSearchVisible: boolean;
  setIsSearchVisible: (isVisible: boolean) => void;
  selectedTransactions: TTransaction[];
  setSelectedTransactions: (transactions: TTransaction[] | []) => void;
  setCalculateSettled: (calculate: TCalculateResult[]) => void;
  setIsOpenSettleConfirm: (isOpen: boolean) => void;
}

export default function HeadBtnListComponent(props: Props) {

  const {
    opponents,
    transactions,
    setTransactions,
    searchConditions,
    setSearchConditions,
    isSearchVisible,
    setIsSearchVisible,
    selectedTransactions,
    setSelectedTransactions,
    setCalculateSettled,
    setIsOpenSettleConfirm,
  } = props;


  const handleDeleteConfirm = async () => {
    if (selectedTransactions.length === 0) {
      alert('削除する取引を選択してください');
      return;
    }

    if (!confirm('選択した取引を削除しますか？')) {
      return;
    }

    const transactionIds = selectedTransactions.map((transaction) => {
      return transaction.id;
    });

    const accessToken = liff.getAccessToken();
    if (!accessToken) return;

    try {
      await batchDeleteTransaction(transactionIds, accessToken);
    } catch (e) {
      alert('エラーが発生しました');
    }

    setTransactions(transactions!.filter((transaction) => {
      return !transactionIds.includes(transaction.id);
    }));

    setSelectedTransactions([]);
  };

  const handleSettleConfirm = () => {
    if (transactions === null) {
      return;
    }

    if (opponents === null) {
      return;
    }

    if (selectedTransactions.length === 0) {
      alert('清算する取引を選択してください');
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
  }

  return (
    <div className="w-11/12 flex justify-between items-center mt-4 mx-auto relative">
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
      {/* 条件変更ボタン */}
      <button
        onClick={() => setIsSearchVisible(!isSearchVisible)}
        className="px-4 py-3 bg-green-500 text-white text-md font-semibold rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors"
      >
        {isSearchVisible ? '閉じる' : '絞り込み'}
      </button>

      {isSearchVisible && (
        <SearchBoxModalComponent
          opponents={opponents}
          searchConditions={searchConditions}
          setSearchConditions={setSearchConditions}
        />
      )}
    </div>
  )
}