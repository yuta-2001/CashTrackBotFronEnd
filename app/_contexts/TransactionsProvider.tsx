'use client'
import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { TTransaction } from '../_libs/types';
import { useContext } from 'react';
import { mockTransactions } from '../_libs/placeholder-data';

type TransactionsUpdateType = Dispatch<SetStateAction<TTransaction[] | null>>;

export const TransactionsContext = createContext<TTransaction[] | null>(null);
export const TransactionsUpdateContext = createContext<TransactionsUpdateType | undefined>(undefined);

type TransactionsProviderProps = {
  children: ReactNode;
};

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<TTransaction[] | null>(null);

  useEffect(() => {
    setTransactions(mockTransactions)
  }, [])

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
