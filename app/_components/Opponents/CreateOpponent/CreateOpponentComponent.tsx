import { useState } from 'react';
import CreateModalComponent from '../Modal/CreateModalComponent';

export default function CreateOpponentComponent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed z-10 bottom-24 left-1/2 transform -translate-x-1/2 bg-green-500 hover:bg-green-600 text-white font-bold w-16 h-16 rounded-full leading-none text-3xl"
        aria-label="Add"
      >
      +
      </button>

      {isCreateModalOpen && (
        <CreateModalComponent
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </>
  )
}