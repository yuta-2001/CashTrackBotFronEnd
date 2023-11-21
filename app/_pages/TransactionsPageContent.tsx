'use client';
import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { TTransaction, TOpponent, TCalculateResult, TSearchCondition, TUser } from '../_libs/types';
import CreateModalComponent from '../_components/Transactions/Modal/CreateModalComponent';
import EditModalComponent from '../_components/Transactions/Modal/EditModalComponent';
import SettleConfirmModalComponent from '../_components/Transactions/Modal/SettleConfirmModalComponent';
import ResultListComponent from '../_components/Transactions/ResultList/ResultListComponent';
import HeadBtnListComponent from '../_components/Transactions/HeadBtnList/HeadBtnListComponent';
import HeaderComponent from '../_components/common/HeaderComponent';
import CreateBtnComponent from '../_components/Transactions/Button/CreateBtnComponent';
import { getOpponents, getTransactions } from '../_libs/data';


export default function TransactionsPageContent() {
  const [searchConditions, setSearchConditions] = useState<TSearchCondition>({
    type: 'all',
    isSettled: false,
    opponent: 'all',
  })
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [isOpenSettleConfirm, setIsOpenSettleConfirm] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [targetEditTransaction, setTargetEditTransaction] = useState<TTransaction | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<TTransaction[]>([]);
  const [calculateSettled, setCalculateSettled] = useState<TCalculateResult[]>([]);
  const [transactions, setTransactions] = useState<TTransaction[] | null>(null);
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
        if (!liff.isLoggedIn()) {
          liff.login();
        }
      })
      .then(() => {
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

      {/* 検索条件の表示 */}
      <HeadBtnListComponent
        opponents={opponents}
        transactions={transactions}
        searchConditions={searchConditions}
        setSearchConditions={setSearchConditions}
        isSearchVisible={isSearchVisible}
        setIsSearchVisible={setIsSearchVisible}
        selectedTransactions={selectedTransactions}
        setCalculateSettled={setCalculateSettled}
        setIsOpenSettleConfirm={setIsOpenSettleConfirm}
      />

      {/* 検索結果の一覧 */}
      <ResultListComponent
        transactions={transactions}
        opponents={opponents}
        searchConditions={searchConditions}
        selectedTransactions={selectedTransactions}
        setSelectedTransactions={setSelectedTransactions}
        setTargetEditTransaction={setTargetEditTransaction}
      />

      {isOpenSettleConfirm && (
        <SettleConfirmModalComponent
          setIsOpenSettleConfirm={setIsOpenSettleConfirm}
          setCalculateSettled={setCalculateSettled}
          calculateResults={calculateSettled}
        />
      )}

      <CreateBtnComponent setIsCreateModalOpen={setIsCreateModalOpen} />

      {isCreateModalOpen && (
        <CreateModalComponent
          opponents={opponents}
          onClose={() => setIsCreateModalOpen(false)}
          transactions={transactions}
          setTransactions={setTransactions}
        />
      )}

      {targetEditTransaction && (
        <EditModalComponent
          opponents={opponents}
          transaction={targetEditTransaction}
          onClose={() => setTargetEditTransaction(null)}
          transactions={transactions}
          setTransactions={setTransactions}
        />
      )}
    </div>
  );
}
