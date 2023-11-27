'use client'
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import liff, { Liff } from '@line/liff'


type LiffProviderProps = {
  children: ReactNode;
};

const LiffContext = createContext<Liff | null>(null)

export const LiffProvider: React.FC<LiffProviderProps> = ({ children }) => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null)
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    liff
      .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
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
      .then(() => {
        if (searchParams.get('page') === 'transactions') {
          router.push('/transactions')
        } else if (searchParams.get('page') === 'opponents') {
          router.push('/opponents')
        } else {
          setLiffObject(null)
          liff.closeWindow()
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
