'use client'
import React, { createContext, useState, ReactNode, Dispatch, SetStateAction} from 'react';
import { TTransaction } from '../../_libs/types';
import { useContext } from 'react';

type TransactionsUpdateType = Dispatch<SetStateAction<TTransaction[]>>;
export const SelectedTransactionsContext = createContext<TTransaction[]>([]);
export const SelectedTransactionsUpdateContext = createContext<TransactionsUpdateType | undefined>(undefined);

type SelectedTransactionsProviderProps = {
  children: ReactNode;
};

export const SelectedTransactionsProvider: React.FC<SelectedTransactionsProviderProps> = ({ children }) => {
  const [selectedTransactions, setSelectedTransactions] = useState<TTransaction[]>([]);

  return (
    <SelectedTransactionsContext.Provider value={selectedTransactions}>
      <SelectedTransactionsUpdateContext.Provider value={setSelectedTransactions}>
        {children}
      </SelectedTransactionsUpdateContext.Provider>
    </SelectedTransactionsContext.Provider>
  )
}

export const useSelectedTransactions = () => {
  return useContext(SelectedTransactionsContext);
}

export const useSelectedTransactionsUpdate = () => {
  return useContext(SelectedTransactionsUpdateContext);
}
