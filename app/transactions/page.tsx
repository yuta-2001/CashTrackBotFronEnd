import HeaderComponent from '../_components/common/HeaderComponent';
import { mockOpponents, mockTransactions, mockUser } from '../_libs/placeholder-data';
import TransactionsPageContent from '../_pages/TransactionsPageContent';

export default function TransactionsPage() {
  const user = mockUser;
  const opponents = mockOpponents;

  return (
    <>
      <HeaderComponent user={user} />
      <TransactionsPageContent
        opponents={opponents}
      />
    </>
  )
};
