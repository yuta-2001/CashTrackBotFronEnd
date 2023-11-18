'use client'
import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { TTransaction } from '../_types/TTransaction';
import { useContext } from 'react';

type TransactionsUpdateType = Dispatch<SetStateAction<TTransaction[] | null>>;

export const TransactionsContext = createContext<TTransaction[] | null>(null);
export const TransactionsUpdateContext = createContext<TransactionsUpdateType | undefined>(undefined);

type TransactionsProviderProps = {
  children: ReactNode;
};

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<TTransaction[] | null>(null);

  return (
    <TransactionsContext.Provider value={transactions}>
      <TransactionsUpdateContext.Provider value={setTransactions}>
        {children}
      </TransactionsUpdateContext.Provider>
    </TransactionsContext.Provider>
  )
}

export const useTransactions = () => {
  return useContext(TransactionsContext);
}

export const useTransactionsUpdate = () => {
  return useContext(TransactionsUpdateContext);
}
