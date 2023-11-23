'use client'
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import liff from '@line/liff'


type LiffProviderProps = {
  children: ReactNode;
};

const LiffContext = createContext<any | null>(null)

export const LiffProvider: React.FC<LiffProviderProps> = ({ children }) => {
  const [liffObject, setLiffObject] = useState<any | null>(null)

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
        console.error({ err })
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
