import React, { ReactNode } from 'react';
import { TransactionsProvider } from './_contexts/TransactionsProvider';
import { OpponentsProvider } from './_contexts/OpponentsProvider';
import { UserProvider } from './_contexts/UserProvider';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <UserProvider>
      <TransactionsProvider>
        <OpponentsProvider>
          {children}
        </OpponentsProvider>
      </TransactionsProvider>
    </UserProvider>
  )
}
