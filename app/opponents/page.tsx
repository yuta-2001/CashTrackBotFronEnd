'use client';
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form";
import { useOpponents, useOpponentsUpdate } from '../_context/OpponentsProvider';
import { useSearchConditionsUpdate } from '../_context/SearchConditionsProvider';
import { TOpponent } from '../_libs/types';
import ValidationErrorText from '../_components/common/ValidationErrorText';
import { updateOpponent, storeOpponent } from '../_libs/data';
import { useLiff } from '../_context/LiffProvider';
import { deleteOpponent } from '../_libs/data';

type FormData = {
  name: string;
};

export default function OpponentsPage() {
  const router = useRouter();
  const opponents = useOpponents();
  const setOpponents = useOpponentsUpdate();
  const setSearchConditions = useSearchConditionsUpdate();
  const liff = useLiff();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [targetEditOpponent, setTargetEditOpponent] = useState<TOpponent | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
	} = useForm<FormData>();

  if (
    opponents === undefined ||
    setSearchConditions === undefined ||
    router === undefined
  ) {
    return null;
  }

  const checkTransaction = (opponentId: number) => {
    setSearchConditions({
      type: 'all',
      isSettled: false,
      opponent: opponentId,
    });
    router.push('/transactions');
  }

  const onSubmit = useCallback<SubmitHandler<FormData>>(async (data) => {
    if (targetEditOpponent === null || liff === null　|| opponents === undefined || setOpponents === undefined) {
      return;
    }

    const editedOpponent = await updateOpponent(targetEditOpponent.id, data, liff);
    if (editedOpponent) {
      setTargetEditOpponent(null);
      setOpponents(opponents.map((opponent) => {
        if (opponent.id === targetEditOpponent.id) {
          return editedOpponent;
        }
        return opponent;
      }));
    }
  }
  , [targetEditOpponent, liff, opponents, setOpponents]);


  const onSubmitCreate = useCallback<SubmitHandler<FormData>>(async (data) => {
    if (liff === null || opponents === undefined || setOpponents === undefined) {
      return;
    }

    const createdOpponent = await storeOpponent(data, liff);

    if (createdOpponent) {
      setOpponents([createdOpponent, ...opponents]);
      setIsCreateModalOpen(false);
    }
  }, [liff, opponents, setOpponents]);


  const submitDeleteOpponent = useCallback(async (targetOpponent: TOpponent) => {
    if (liff === null || opponents === undefined || setOpponents === undefined) {
      return;
    }

    if (!confirm('選択した相手を削除しますか？削除した場合、相手に紐づいている取引も自動的に削除されます。')) {
      return;
    }

    try {
      await deleteOpponent(targetOpponent, liff);
      setTargetEditOpponent(null);
      setOpponents(opponents.filter((opponent) => {
        return opponent.id !== targetOpponent.id;
      }));
    } catch (e) {
      alert('エラーが発生しました');
    }
    
  }, [liff, opponents, setOpponents]);


  return (
    <>
      <div
        className="flex-1 overflow-y-auto p-4 w-full fixed top-20"
        style={{
          height: 'calc(100vh - 10rem)',
        }}
      >
        {opponents.map((opponent) => {
          return (
            <div key={opponent.id} className="mb-4 p-4 bg-white rounded-lg shadow flex items-center justify-between">
              <div className="flex-grow ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{opponent.name}</h3>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => checkTransaction(opponent.id)}
                  className="py-6 px-4 mr-2 text-md font-bold text-gray-500 bg-gray-200 rounded hover:bg-gray-300"
                >
                  貸借り確認
                </button>
                <button
                  onClick={() => setTargetEditOpponent(opponent)}
                  className="py-6 px-4 text-md font-bold text-gray-500 bg-gray-200 rounded hover:bg-gray-300"
                >
                  編集
                </button>
              </div>
            </div>
          )
        })}

        {targetEditOpponent && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div style={{ maxHeight: '90%' }} className="bg-white w-11/12 max-w-6xl h-auto overflow-auto rounded shadow-lg p-6 relative">
              <button
                onClick={() => setTargetEditOpponent(null)}
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
                    defaultValue={targetEditOpponent.name}
                    {...register("name", { required: '項目名は必須です' })} 
                  />
                  {errors.name && <ValidationErrorText message={errors.name.message} />}
                </div>
                <div className="flex justify-center mt-4">
                  <button onClick={() => setTargetEditOpponent(null)} className="px-3 py-3 mr-2 bg-gray-300 rounded shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">キャンセル</button>
                  <button type="submit" className="px-3 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors">更新する</button>
                  <button onClick={() => submitDeleteOpponent(targetEditOpponent)} className="px-3 py-3 ml-2 bg-red-500 text-white rounded shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 transition-colors">削除する</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>


      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed z-10 bottom-24 left-1/2 transform -translate-x-1/2 bg-green-500 hover:bg-green-600 text-white font-bold w-16 h-16 rounded-full leading-none text-3xl"
        aria-label="Add"
      >
      +
      </button>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div style={{ maxHeight: '90%' }} className="bg-white w-11/12 max-w-6xl h-auto overflow-auto rounded shadow-lg p-6 relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-lg font-bold mb-4">編集</h2>
            <form onSubmit={handleSubmit(onSubmitCreate)}>
              {/* Name field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  項目名
                </label>
                <input
                  id="name"
                  type="text"
                  className="mt-1 block w-full h-10 p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="名前"
                  {...register("name", { required: '名前は必須です' })} 
                />
                {errors.name && <ValidationErrorText message={errors.name.message} />}
              </div>
              <div className="flex justify-center mt-4">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-3 mr-2 bg-gray-300 rounded shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">キャンセル</button>
                <button type="submit" className="px-4 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors">作成する</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
