'use client'
import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction, use } from 'react';
import { TOpponent } from '../_libs/types';
import { useContext } from 'react';
import { mockOpponents } from '../_libs/placeholder-data';

type OpponentsUpdateType = Dispatch<SetStateAction<TOpponent[] | null>>;

export const OpponentsContext = createContext<TOpponent[] | null>(null);
export const OpponentsUpdateContext = createContext<OpponentsUpdateType | undefined>(undefined);

type OpponentsProviderProps = {
  children: ReactNode;
};

export const OpponentsProvider: React.FC<OpponentsProviderProps> = ({ children }) => {
  const [opponents, setOpponents] = useState<TOpponent[] | null>(null);

  useEffect(() => {
    setOpponents(mockOpponents)
  }, [])

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
