import { useCallback } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useOpponents, useOpponentsUpdate } from '../../../_context/OpponentsProvider';
import { useLiff } from '../../../_context/LiffProvider';
import { storeOpponent } from '../../../_libs/data';
import ValidationErrorText from '../../common/ValidationErrorText';
import { useToastUpdate } from '@/app/_context/ToastProvider';

type FormData = {
  name: string;
};

type CreateModalProps = {
  onClose: () => void;
};

export default function CreateModalComponent (props: CreateModalProps) {
  const { onClose } = props;

  const opponents = useOpponents();
  const setOpponents = useOpponentsUpdate();
  const liff = useLiff();
  const setToast = useToastUpdate();

  const {
    register,
    handleSubmit,
    formState: { errors }
	} = useForm<FormData>();

  const onSubmitCreate = useCallback<SubmitHandler<FormData>>(async (data) => {
    if (liff === null || opponents === undefined || setOpponents === undefined || setToast === undefined) {
      return;
    }

    const createdOpponent = await storeOpponent(data, liff);

    if (createdOpponent) {
      setOpponents([createdOpponent, ...opponents]);
      onClose();
      setToast({
        type: 'success',
        message: '相手を新規作成しました',
      });
    }
  }, [liff, opponents, setOpponents]);


  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div style={{ maxHeight: '90%' }} className="bg-white w-11/12 max-w-6xl h-auto overflow-auto rounded shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
        <h2 className="text-lg font-bold mb-4">作成</h2>
        <form onSubmit={handleSubmit(onSubmitCreate)}>
          {/* Name field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              名前
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
            <button type="button" onClick={onClose} className="px-4 py-3 mr-2 bg-gray-300 rounded shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">キャンセル</button>
            <button type="submit" className="px-4 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors">作成する</button>
          </div>
        </form>
      </div>
    </div>
  )
}
