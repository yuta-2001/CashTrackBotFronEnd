'use client';
import { TTransaction } from '../../../_libs/types';

type CreateModalProps = {
	onClose: () => void;
};

const CreateModalComponent = (props: CreateModalProps) => {
	return (
		<div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
			<div className="bg-white w-11/12 max-w-6xl h-85% overflow-auto rounded shadow-lg p-6 relative">
				<button
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
						<button className="px-4 py-2 mr-2 bg-gray-300 rounded shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">キャンセル</button>
						<button type="submit" className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors">作成する</button>
					</div>
				</form>
			</div>
		</div>
	)
};

export default CreateModalComponent;
