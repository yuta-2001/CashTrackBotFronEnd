'use client'
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import liff, { Liff } from '@line/liff'


type LiffProviderProps = {
  children: ReactNode;
};

const LiffContext = createContext<Liff | null>(null)

export const LiffProvider: React.FC<LiffProviderProps> = ({ children }) => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null)

  useEffect(() => {
    liff
      .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
      .then(() => {
        setLiffObject(liff)
        if (!liff.isLoggedIn()) {
          liff.login()
        }
      })
      .catch((err: any) => {
        console.log(err)
      })
  }, [])


  return (
    <LiffContext.Provider value={liffObject}>
      {children}
    </LiffContext.Provider>
  )
}

export const useLiff = () => {
  return useContext(LiffContext);
}
