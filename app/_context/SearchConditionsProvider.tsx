'use client'
import React, { createContext, useState, ReactNode, Dispatch, SetStateAction} from 'react';
import { TSearchCondition } from '../_libs/types';
import { useContext } from 'react';

type SearchConditionsUpdateType = Dispatch<SetStateAction<TSearchCondition>>;
export const SearchConditionsContext = createContext<TSearchCondition>({type: 'all', isSettled: false, opponent: 'all'});
export const SearchConditionsUpdateContext = createContext<SearchConditionsUpdateType | undefined>(undefined);

type SearchConditionsProviderProps = {
  children: ReactNode;
};

export const SearchConditionsProvider: React.FC<SearchConditionsProviderProps> = ({ children }) => {
  const [searchConditions, setSearchConditions] = useState<TSearchCondition>({
    type: 'all',
    isSettled: false,
    opponent: 'all',
  })

  return (
    <SearchConditionsContext.Provider value={searchConditions}>
      <SearchConditionsUpdateContext.Provider value={setSearchConditions}>
        {children}
      </SearchConditionsUpdateContext.Provider>
    </SearchConditionsContext.Provider>
  )
}

export const useSearchConditions = () => {
  return useContext(SearchConditionsContext);
}

export const useSearchConditionsUpdate = () => {
  return useContext(SearchConditionsUpdateContext);
}
