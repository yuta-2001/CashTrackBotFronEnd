'use client';
import React from 'react';
import HeadBtnListComponent from '../_components/Transactions/HeadBtnList/HeadBtnListComponent';
import CreateTransactionComponent from '../_components/Transactions/CreateTransaction/CreateTransactionComponent';
import ResultListComponent from '../_components/Transactions/ResultList/ResultListComponent';
import { SelectedTransactionsProvider } from '../_context/Transactions/SelectedTransactionsProvider';
import { useLiff } from '../_context/LiffProvider';


export default function TransactionsPage() {
  const liff = useLiff();
  if (liff === null) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-green-600 fixed z-50">
        <div className="text-white animate-pulse text-4xl font-bold">loading...</div>
      </div>
    );
  }

  return (
    <SelectedTransactionsProvider>
      <HeadBtnListComponent />
      <ResultListComponent />
      <CreateTransactionComponent />
    </SelectedTransactionsProvider>
  );
}
