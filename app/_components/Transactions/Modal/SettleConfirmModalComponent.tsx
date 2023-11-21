import { TCalculateResult, TTransaction } from '../../../_libs/types';
import { CalculateTransactionType } from '../../../_libs/enums';
import { batchSettleTransaction } from '../../../_libs/data';
import liff from '@line/liff';

type SettleConfirmModalComponentProps = {
  setIsOpenSettleConfirm: (isOpen: boolean) => void;
  setCalculateSettled: (calculate: TCalculateResult[]) => void;
  calculateResults: TCalculateResult[];
  selectedTransactions: TTransaction[];
  setSelectedTransactions: (transactions: TTransaction[] | []) => void;
  transactions: TTransaction[] | null;
  setTransactions: (transactions: TTransaction[] | null) => void;
}

const SettleConfirmModalComponent = (props: SettleConfirmModalComponentProps) => {
  const { 
    setIsOpenSettleConfirm,
    setCalculateSettled,
    calculateResults,
    selectedTransactions,
    setSelectedTransactions,
    transactions,
    setTransactions,
  } = props;
  const onClose = () => {
    setIsOpenSettleConfirm(false);
    setCalculateSettled([]);
  }

  const onSubmit = async () => {
    const transactionIds = selectedTransactions.map((settlement) => {
      return settlement.id;
    });

    const accessToken = liff.getAccessToken();
    if (!accessToken) return;

    try {
      await batchSettleTransaction(transactionIds, accessToken);
    } catch (e) {
      alert('エラーが発生しました');
    }

    setTransactions(transactions!.map((transaction) => {
      if (transactionIds.includes(transaction.id)) {
        return {
          ...transaction,
          isSettled: true,
        }
      }
      return transaction;
    }));

    setSelectedTransactions([]);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-11/12 max-w-6xl h-85% overflow-auto rounded shadow-lg p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">✖</button>
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
            {calculateResults.map((settlement, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{settlement.type === CalculateTransactionType.Pay ? 'あなた' : settlement.name}</td>
                <td className="px-4 py-2 border">{settlement.type === CalculateTransactionType.Receive ? 'あなた' : settlement.name}</td>
                <td className="px-4 py-2 border font-bold">¥{settlement.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-4">
          <button onClick={onClose} className="px-4 py-2 mr-2 bg-gray-300 rounded shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">キャンセル</button>
          <button onClick={onSubmit} className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors">清算する</button>
        </div>
      </div>
    </div>
  )
};

export default SettleConfirmModalComponent;
