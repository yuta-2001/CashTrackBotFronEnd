import { useCallback, useMemo, useState } from "react"
import { useOpponents } from "@/app/_context/OpponentsProvider"
import { useRouter } from "next/navigation"
import { useSearchConditionsUpdate } from "@/app/_context/SearchConditionsProvider"
import { TOpponent } from "@/app/_libs/types"
import EditModalComponent from "../Modal/EditModalComponent"
import { Edit2, CheckSquare } from 'lucide-react';

export default function ListComponent() {
  const opponents = useOpponents()
  const router = useRouter()
  const setSearchConditions = useSearchConditionsUpdate()

  const [targetEditOpponent, setTargetEditOpponent] = useState<TOpponent | null>(null);

  const checkTransaction = useCallback((opponentId: number) => {
    if (setSearchConditions === undefined || router === undefined) {
      return;
    }

    setSearchConditions({
      type: 'all',
      isSettled: false,
      opponent: opponentId,
    });
    router.push('/transactions');
  }, [setSearchConditions, router])


  const opponentsList = useMemo(() => {
    if (opponents === undefined) {
      return null;
    }

    if (opponents.length === 0) {
      return (
        <div className="text-center mt-10">
          相手が登録されていません
        </div>
      )
    }

    return (
      <>
        {opponents.map((opponent) => {
          return (
            <div key={opponent.id} className="mb-4 p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-md font-semibold text-gray-900">{opponent.name}</h3>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => checkTransaction(opponent.id)}
                  className="py-4 w-28 mr-2 text-xs font-semibold text-green-600 bg-green-100 rounded hover:bg-green-200 flex items-center justify-center"
                >
                  <CheckSquare className="w-5 h-5 mr-2" />
                  貸借り確認
                </button>
                <button
                  onClick={() => setTargetEditOpponent(opponent)}
                  className="py-4 w-20 text-xs font-semibold text-blue-600 bg-blue-100 rounded hover:bg-blue-200 flex items-center justify-center"
                >
                  <Edit2 className="w-5 h-5 mr-2" />
                  編集
                </button>
              </div>
            </div>
          )
        })}
      </>
    )
  }, [opponents, checkTransaction, setTargetEditOpponent]);


  return (
    <div
      className="flex-1 overflow-y-auto p-4 w-full mt-20"
      style={{
        height: 'calc(100vh - 15rem)',
      }}
    >
      {opponentsList}
      {targetEditOpponent && (
        <EditModalComponent 
          targetOpponent={targetEditOpponent}
          onClose={() => setTargetEditOpponent(null)}
        />
      )}
    </div>
  )
}
