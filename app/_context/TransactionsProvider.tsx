'use client'
import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { TTransaction } from '../_libs/types';
import { useContext } from 'react';

type TransactionsUpdateType = Dispatch<SetStateAction<TTransaction[]>>;

export const TransactionsContext = createContext<TTransaction[]>([]);
export const TransactionsUpdateContext = createContext<TransactionsUpdateType | undefined>(undefined);

type TransactionsProviderProps = {
  children: ReactNode;
};

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<TTransaction[]>([]);

  useEffect(() => {
    setTransactions([])
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
