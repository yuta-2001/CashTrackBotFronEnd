'use client';
import { useForm, SubmitHandler } from "react-hook-form";
import { TransactionType } from "@/app/_libs/enums";
import ValidationErrorText from "../../common/ValidationErrorText";
import { TTransaction, TTransactionForm } from "@/app/_libs/types";
import { updateTransaction } from "@/app/_libs/data";
import { useLiff } from "@/app/_context/LiffProvider";
import { useTransactions, useTransactionsUpdate } from "@/app/_context/Transactions/TransactionsProvider";
import { useOpponents } from "@/app/_context/OpponentsProvider";
import { useEffect, useCallback } from "react";
import { useToastUpdate } from "@/app/_context/ToastProvider";

type EditModalProps = {
  transaction: TTransaction;
	onClose: () => void;
};

type FormData = {
	name: string;
	opponent_id: number;
	is_settled: boolean;
	type: TransactionType;
	amount: number;
	memo: string;
};

const EditModalComponent = (props: EditModalProps) => {
	const { transaction, onClose } = props;
	const liff = useLiff();
	const transactions = useTransactions();
	const setTransactions = useTransactionsUpdate();
	const opponents = useOpponents();
	const setToast = useToastUpdate();

	const {
    register,
    handleSubmit,
    formState: { errors }
	} = useForm<FormData>();

	const onSubmit = useCallback<SubmitHandler<TTransactionForm>>(
		async (data: TTransactionForm) => {
			if (liff === null || transactions === undefined || setTransactions === undefined || setToast === undefined) return;
	
			try {
				const updatedTransaction: TTransaction = await updateTransaction(transaction.id, data, liff);
				if (updatedTransaction && transactions) {
					setTransactions(transactions.map((transaction) => {
						return transaction.id === updatedTransaction.id ? updatedTransaction : transaction;
					}));
					setToast({
						type: 'success',
						message: '記録を更新しました'
					});
				}
			} catch (e) {
				liff.sendMessages([{
					type: 'text',
					text: 'エラーが発生しました。時間をおいて再度お試しください。'
				}]).then(() => {
					liff.closeWindow();
				}).catch((error) => {
					console.log(error);
				});
			}

			onClose();
		},
		[liff, transactions, setTransactions, onClose, setToast]
	);

	useEffect(() => {
		if (opponents === undefined || setTransactions === undefined || liff === null) return;
	}, [opponents, setTransactions, liff]);

	return (
		<div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
			<div style={{ maxHeight: '90%' }} className="bg-white w-11/12 max-w-6xl h-auto overflow-auto rounded shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
				<h2 className="text-lg font-bold mb-4">編集</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					{/* Name field */}
					<div className="mb-4">
						<label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
							項目名
						</label>
						<input
							id="name"
							type="text"
							className="mt-1 block w-full h-10 p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							placeholder="項目名"
              defaultValue={transaction.name}
							{...register("name", { required: '項目名は必須です' })} 
						/>
						{errors.name && <ValidationErrorText message={errors.name.message} />}
					</div>

					{/* Opponent field */}
					<div className="mb-4">
						<label htmlFor="opponent" className="block text-gray-700 text-sm font-bold mb-2">
							相手
						</label>
						<select
							id="opponent"
							className="mt-1 block w-full h-10 p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							{...register("opponent_id", { required: '相手の選択は必須です' })}
              defaultValue={transaction.opponent_id}
						>
							{
								opponents.map((opponent) => (
									<option 
                    key={opponent.id}
                    value={opponent.id}
                  >
                    {opponent.name}
                  </option>
								))
							}
						</select>
						{errors.opponent_id && <ValidationErrorText message={errors.opponent_id.message} />}
					</div>

					{/* Is_settled field */}
					<div className="mb-4">
						<label htmlFor="is_settled" className="block text-gray-700 text-sm font-bold mb-2">
							清算ステータス
						</label>
						<select
							id="is_settled"
							className="mt-1 block w-full h-10 p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							{...register("is_settled", { required: '清算ステータスの選択は必須です' })} 
              defaultValue={transaction.is_settled ? 1 : 0}
						>
							<option value="0">未清算</option>
							<option value="1">清算済み</option>
						</select>
						{errors.is_settled && <ValidationErrorText message={errors.is_settled.message} />}
					</div>

					{/* Type field */}
					<div className="mb-4">
						<label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
							タイプ
						</label>
						<select
							id="type"
							className="mt-1 block w-full h-10 p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							{...register("type", { required: 'タイプの選択は必須です' })}
              defaultValue={transaction.type}
						>
							<option value={TransactionType.Lend}>貸し</option>
							<option value={TransactionType.Borrow}>借り</option>
						</select>
						{errors.type && <ValidationErrorText message={errors.type.message} />}
					</div>

					{/* Amount field */}
					<div className="mb-4">
						<label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
							金額
						</label>
						<input
							id="amount"
							type="number"
							className="mt-1 block w-full h-10 p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							placeholder="1000"
              defaultValue={transaction.amount}
							{...register("amount", { required: '金額の設定は必須です', valueAsNumber: true })} 
						/>
						{errors.amount && <ValidationErrorText message={errors.amount.message} />}
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
              defaultValue={transaction.memo || ''}
							{...register("memo")} 
						/>
					</div>

					<div className="flex justify-center mt-4">
						<button onClick={onClose} className="px-5 py-3 mr-2 bg-gray-300 rounded shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">キャンセル</button>
						<button type="submit" className="px-5 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors">更新する</button>
					</div>
				</form>
			</div>
		</div>
	)
};

export default EditModalComponent;
