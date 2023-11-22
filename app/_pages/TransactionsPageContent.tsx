'use client';
import React, { useEffect, useState, Suspense } from 'react';
import liff from '@line/liff';
import { TTransaction, TOpponent, TSearchCondition, TUser } from '../_libs/types';
import HeadBtnListComponent from '../_components/Transactions/HeadBtnList/HeadBtnListComponent';
import CreateTransactionComponent from '../_components/Transactions/CreateTransaction/CreateTransactionComponent';
import ResultListComponent from '../_components/Transactions/ResultList/ResultListComponent';
import HeaderComponent from '../_components/common/HeaderComponent';


export default function TransactionsPageContent() {
  const [searchConditions, setSearchConditions] = useState<TSearchCondition>({
    type: 'all',
    isSettled: false,
    opponent: 'all',
  })
  const [selectedTransactions, setSelectedTransactions] = useState<TTransaction[]>([]);
  const [transactions, setTransactions] = useState<TTransaction[]>([]);
  const [user, setUser] = useState<TUser | null>(null);
  const [opponents, setOpponents] = useState<TOpponent[]>([]);

  
  useEffect(() => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID!;
    liff.init({
      liffId: liffId,
    })
      .then(() => {
        // ブラウザでテストする時のみ
        if (!liff.isLoggedIn()) {
          liff.login();
        }

        liff.getProfile()
          .then((profile) => {
            setUser({
              name: profile.displayName,
              pictureUrl: profile.pictureUrl,
            });
          })
          .catch((err) => {
            alert(err);
          });
      })
      .catch((err) => {
        alert(err);
      });

  }, []);

  return (
    <div>
      <HeaderComponent user={user} />

      <HeadBtnListComponent
        opponents={opponents}
        transactions={transactions}
        setTransactions={setTransactions}
        searchConditions={searchConditions}
        setSearchConditions={setSearchConditions}
        selectedTransactions={selectedTransactions}
        setSelectedTransactions={setSelectedTransactions}
      />

      <Suspense fallback='loading'>
        <ResultListComponent
          transactions={transactions}
          setTransactions={setTransactions}
          opponents={opponents}
          setOpponents={setOpponents}
          searchConditions={searchConditions}
          selectedTransactions={selectedTransactions}
          setSelectedTransactions={setSelectedTransactions}
        />
      </Suspense>

      <CreateTransactionComponent
        opponents={opponents}
        transactions={transactions}
        setTransactions={setTransactions}
      />
    </div>
  );
}
