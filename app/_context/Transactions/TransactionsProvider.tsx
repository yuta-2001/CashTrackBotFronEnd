'use client'
import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { TTransaction } from '../../_libs/types';
import { useContext } from 'react';
import { useLiff } from '../LiffProvider';
import { getTransactions } from '../../_libs/data';

type TransactionsUpdateType = Dispatch<SetStateAction<TTransaction[]>>;

export const TransactionsContext = createContext<TTransaction[]>([]);
export const TransactionsUpdateContext = createContext<TransactionsUpdateType | undefined>(undefined);

type TransactionsProviderProps = {
  children: ReactNode;
};

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<TTransaction[]>([]);
  const liff = useLiff();

  useEffect(() => {
    if (liff === null) {
      return;
    }

    const fetchData = async () => {
      const transactionsData = await getTransactions(liff);
      setTransactions(transactionsData);
    }

    try {
      fetchData();
    } catch (error) {
      liff.sendMessages([{
        type: 'text',
        text: 'エラーが発生しました。時間をおいて再度お試しください。'
      }]).then(() => {
        liff.closeWindow();
      }).catch((error) => {
        console.log(error);
      });
    }
  }, [liff, getTransactions])

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
