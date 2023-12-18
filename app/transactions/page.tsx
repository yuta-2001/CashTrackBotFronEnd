'use client';
import React from 'react';
import HeadBtnListComponent from '../_components/Transactions/HeadBtnList/HeadBtnListComponent';
import CreateTransactionComponent from '../_components/Transactions/CreateTransaction/CreateTransactionComponent';
import ResultListComponent from '../_components/Transactions/ResultList/ResultListComponent';
import { SelectedTransactionsProvider } from '../_context/Transactions/SelectedTransactionsProvider';


export default function TransactionsPage() {
  return (
    <SelectedTransactionsProvider>
      <HeadBtnListComponent />
      <ResultListComponent />
      <CreateTransactionComponent />
    </SelectedTransactionsProvider>
  );
}
