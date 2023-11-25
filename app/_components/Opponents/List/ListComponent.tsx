import { useState } from "react"
import { useOpponents } from "@/app/_context/OpponentsProvider"
import { useRouter } from "next/navigation"
import { useSearchConditionsUpdate } from "@/app/_context/SearchConditionsProvider"
import { TOpponent } from "@/app/_libs/types"
import EditModalComponent from "../Modal/EditModalComponent"

export default function ListComponent() {
  const opponents = useOpponents()
  const router = useRouter()
  const setSearchConditions = useSearchConditionsUpdate()

  const [targetEditOpponent, setTargetEditOpponent] = useState<TOpponent | null>(null);

  const checkTransaction = (opponentId: number) => {
    if (setSearchConditions === undefined || router === undefined) {
      return;
    }

    setSearchConditions({
      type: 'all',
      isSettled: false,
      opponent: opponentId,
    });
    router.push('/transactions');
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-4 w-full mt-20"
      style={{
        height: 'calc(100vh - 10rem)',
      }}
    >
      {opponents.map((opponent) => {
        return (
          <div key={opponent.id} className="mb-4 p-4 bg-white rounded-lg shadow flex items-center justify-between">
            <div className="flex-grow">
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
        <EditModalComponent 
          targetOpponent={targetEditOpponent}
          onClose={() => setTargetEditOpponent(null)}
        />
      )}
    </div>
  )
}
