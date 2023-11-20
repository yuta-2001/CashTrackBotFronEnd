import { mockOpponents } from '../_libs/placeholder-data';
import TransactionsPageContent from '../_pages/TransactionsPageContent';

export default function TransactionsPage() {
  const opponents = mockOpponents;

  return (
    <TransactionsPageContent
      opponents={opponents}
    />
  )
};
