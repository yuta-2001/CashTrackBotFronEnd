'use client';
import { useState } from 'react';
import CreateBtnComponent from '../Button/CreateBtnComponent';
import CreateModalComponent from '../Modal/CreateModalComponent';

export default function CreateTransactionComponent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  return (
    <>
      <CreateBtnComponent setIsCreateModalOpen={setIsCreateModalOpen} />

      {isCreateModalOpen && (
        <CreateModalComponent
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </>
  )
} 
