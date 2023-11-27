'use client'
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useRouter } from 'next/router'
import liff, { Liff } from '@line/liff'


type LiffProviderProps = {
  children: ReactNode;
};

const LiffContext = createContext<Liff | null>(null)

export const LiffProvider: React.FC<LiffProviderProps> = ({ children }) => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null)
  const router = useRouter();

  useEffect(() => {
    let liffIdFromUrl = ''
    if (router.pathname === '/transactions') {
      liffIdFromUrl = process.env.NEXT_PUBLIC_LIFF_ID_TRANSACTION!
    } else if (router.pathname === '/opponents') {
      liffIdFromUrl = process.env.NEXT_PUBLIC_LIFF_ID_OPPONENT!
    } else {
      return
    }

    liff
      .init({ liffId: liffIdFromUrl })
      .then(() => {
        setLiffObject(liff)

        // ブラウザでのテストのみ
        // if (!liff.isLoggedIn()) {
        //   liff.login()
        // }

        if (!liff.isInClient()) {
          alert('LINEアプリで開いてください')
          setLiffObject(null)
          liff.closeWindow()
          return
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
