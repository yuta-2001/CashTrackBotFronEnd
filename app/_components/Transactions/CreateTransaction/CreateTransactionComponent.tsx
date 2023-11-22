'use client';
import { useState } from 'react';
import CreateBtnComponent from '../Button/CreateBtnComponent';
import CreateModalComponent from '../Modal/CreateModalComponent';
import { TOpponent, TTransaction } from '@/app/_libs/types';


type Props = {
  opponents: TOpponent[];
  transactions: TTransaction[];
  setTransactions: (transactions: TTransaction[]) => void;
}

export default function CreateTransactionComponent(props: Props) {
  const { opponents, transactions, setTransactions } = props;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  return (
    <>
      <CreateBtnComponent setIsCreateModalOpen={setIsCreateModalOpen} />

      {isCreateModalOpen && (
        <CreateModalComponent
          opponents={opponents}
          onClose={() => setIsCreateModalOpen(false)}
          transactions={transactions}
          setTransactions={setTransactions}
        />
      )}
    </>
  )
} 
