'use client';
import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { TTransaction, TOpponent, TSearchCondition, TUser } from '../_libs/types';
import ResultListComponent from '../_components/Transactions/ResultList/ResultListComponent';
import HeadBtnListComponent from '../_components/Transactions/HeadBtnList/HeadBtnListComponent';
import CreateTransactionComponent from '../_components/Transactions/CreateTransaction/CreateTransactionComponent';
import HeaderComponent from '../_components/common/HeaderComponent';
import { getOpponents, getTransactions } from '../_libs/data';


export default function TransactionsPageContent() {
  const [searchConditions, setSearchConditions] = useState<TSearchCondition>({
    type: 'all',
    isSettled: false,
    opponent: 'all',
  })
  const [selectedTransactions, setSelectedTransactions] = useState<TTransaction[] | []>([]);
  const [transactions, setTransactions] = useState<TTransaction[] | []>([]);
  const [user, setUser] = useState<TUser | null>(null);
  const [opponents, setOpponents] = useState<TOpponent[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = liff.getAccessToken();
      if (!accessToken) return;
      const opponentsData = await getOpponents(accessToken);
      const transactionsData = await getTransactions(accessToken);
      
      setOpponents(opponentsData);
      setTransactions(transactionsData);
    }

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
      .then(() => {
        fetchData();
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

      <ResultListComponent
        transactions={transactions}
        setTransactions={setTransactions}
        opponents={opponents}
        searchConditions={searchConditions}
        selectedTransactions={selectedTransactions}
        setSelectedTransactions={setSelectedTransactions}
      />

      <CreateTransactionComponent
        opponents={opponents}
        transactions={transactions}
        setTransactions={setTransactions}
      />
    </div>
  );
}
