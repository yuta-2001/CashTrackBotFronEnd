'use client'
import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction, use } from 'react';
import { TOpponent } from '../_libs/types';
import { useContext } from 'react';
import { getOpponents } from '../_libs/data';
import { useLiff } from './LiffProvider';

type OpponentsUpdateType = Dispatch<SetStateAction<TOpponent[]>>;

export const OpponentsContext = createContext<TOpponent[]>([]);
export const OpponentsUpdateContext = createContext<OpponentsUpdateType | undefined>(undefined);

type OpponentsProviderProps = {
  children: ReactNode;
};

export const OpponentsProvider: React.FC<OpponentsProviderProps> = ({ children }) => {
  const [opponents, setOpponents] = useState<TOpponent[]>([]);
  const liff = useLiff();

  useEffect(() => {
    if (liff === null) {
      return;
    }

    const fetchData = async () => {
      const opponentsData = await getOpponents(liff);
      setOpponents(opponentsData);
    }

    fetchData();
  }, [liff, getOpponents])

  return (
    <OpponentsContext.Provider value={opponents}>
      <OpponentsUpdateContext.Provider value={setOpponents}>
        {children}
      </OpponentsUpdateContext.Provider>
    </OpponentsContext.Provider>
  )
}

export const useOpponents = () => {
  return useContext(OpponentsContext);
}

export const useOpponentsUpdate = () => {
  return useContext(OpponentsUpdateContext);
}
