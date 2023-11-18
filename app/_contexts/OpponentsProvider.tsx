'use client'
import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { TOpponent } from '../_types/TOpponent';
import { useContext } from 'react';

type OpponentsUpdateType = Dispatch<SetStateAction<TOpponent[] | null>>;

export const OpponentsContext = createContext<TOpponent[] | null>(null);
export const OpponentsUpdateContext = createContext<OpponentsUpdateType | undefined>(undefined);

type OpponentsProviderProps = {
  children: ReactNode;
};

export const OpponentsProvider: React.FC<OpponentsProviderProps> = ({ children }) => {
  const [opponents, setOpponents] = useState<TOpponent[] | null>(null);

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
