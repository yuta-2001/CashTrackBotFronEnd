'use client';
import React, { Suspense } from 'react';
import HeadBtnListComponent from '../_components/Transactions/HeadBtnList/HeadBtnListComponent';
import CreateTransactionComponent from '../_components/Transactions/CreateTransaction/CreateTransactionComponent';
import ResultListComponent from '../_components/Transactions/ResultList/ResultListComponent';
import { SearchConditionsProvider } from '../_context/Transactions/SearchConditionsProvider';
import { SelectedTransactionsProvider } from '../_context/Transactions/SelectedTransactionsProvider';

export default function TransactionsPage() {
  return (
    <SearchConditionsProvider>
      <SelectedTransactionsProvider>
        <HeadBtnListComponent />
        <Suspense fallback='loading'>
          <ResultListComponent />
        </Suspense>
        <CreateTransactionComponent />
      </SelectedTransactionsProvider>
    </SearchConditionsProvider>
  );
}
