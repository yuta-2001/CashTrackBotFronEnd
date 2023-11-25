'use client';
import React from 'react';
import HeadBtnListComponent from '../_components/Transactions/HeadBtnList/HeadBtnListComponent';
import CreateTransactionComponent from '../_components/Transactions/CreateTransaction/CreateTransactionComponent';
import ResultListComponent from '../_components/Transactions/ResultList/ResultListComponent';
import { SelectedTransactionsProvider } from '../_context/Transactions/SelectedTransactionsProvider';
import { TransactionsProvider } from '../_context/Transactions/TransactionsProvider';

export default function TransactionsPage() {
  return (
    <TransactionsProvider>
      <SelectedTransactionsProvider>
        <HeadBtnListComponent />
        <ResultListComponent />
        <CreateTransactionComponent />
      </SelectedTransactionsProvider>
    </TransactionsProvider>
  );
}
