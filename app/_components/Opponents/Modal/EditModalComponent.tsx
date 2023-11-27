import { useCallback, useEffect } from "react";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { TOpponent } from "@/app/_libs/types";
import { useOpponents, useOpponentsUpdate } from "@/app/_context/OpponentsProvider";
import { useLiff } from "@/app/_context/LiffProvider";
import { updateOpponent, deleteOpponent } from "@/app/_libs/data";
import ValidationErrorText from "../../common/ValidationErrorText";
import { useToastUpdate } from "@/app/_context/ToastProvider";


type EditModalProps = {
  targetOpponent: TOpponent;
  onClose: () => void
};

type FormData = {
  name: string;
};

export default function EditModalComponent(props: EditModalProps) {
  const { targetOpponent, onClose } = props;

  const liff = useLiff();
  const opponents = useOpponents();
  const setOpponents = useOpponentsUpdate();
  const setToast = useToastUpdate();

  const {
    register,
    handleSubmit,
    formState: { errors }
	} = useForm<FormData>();

  const onSubmit = useCallback<SubmitHandler<FormData>>(async (data) => {
    if (targetOpponent === null || liff === null || opponents === undefined || setOpponents === undefined) {
      return;
    }

    const editedOpponent = await updateOpponent(targetOpponent.id, data, liff);
    if (editedOpponent) {
      onClose();
      setOpponents(opponents.map((opponent) => {
        if (opponent.id === targetOpponent.id) {
          return editedOpponent;
        }
        return opponent;
      }));
    }
  }, [targetOpponent, liff, opponents, setOpponents]);


  const submitDeleteOpponent = useCallback(async (targetOpponent: TOpponent) => {
    if (liff === null || opponents === undefined || setOpponents === undefined || setToast === undefined) {
      return;
    }

    if (!confirm('相手を削除しますか？削除した場合、相手に紐づいている取引も自動的に削除されます。')) {
      return;
    }

    try {
      await deleteOpponent(targetOpponent, liff);
      setOpponents(opponents.filter((opponent) => {
        return opponent.id !== targetOpponent.id;
      }));
      setToast({
        type: 'success',
        message: '相手を削除しました'
      });
      onClose();
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
  }, [liff, opponents, setOpponents, setToast]);

  useEffect(() => {
    if (opponents === undefined || setOpponents === undefined || liff === null) {
      return;
    }
  }, [opponents, setOpponents, liff, setToast]);

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
              defaultValue={targetOpponent.name}
              {...register("name", { required: '項目名は必須です' })} 
            />
            {errors.name && <ValidationErrorText message={errors.name.message} />}
          </div>
          <div className="flex justify-center mt-4">
            <button type="button" onClick={onClose} className="px-3 py-3 mr-2 bg-gray-300 rounded shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors">キャンセル</button>
            <button type="submit" className="px-3 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition-colors">更新する</button>
            <button type="button" onClick={() => submitDeleteOpponent(targetOpponent)} className="px-3 py-3 ml-2 bg-red-500 text-white rounded shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 transition-colors">削除する</button>
          </div>
        </form>
      </div>
    </div>
  )
}