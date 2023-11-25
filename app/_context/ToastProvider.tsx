'use client'
import React, { createContext, useState } from 'react';
import { useContext } from 'react';
import { TToastInfo } from '../_libs/types';

type ToastUpdateType = React.Dispatch<React.SetStateAction<TToastInfo | null>>;
export const ToastContext = createContext<TToastInfo | null>(null);
export const ToastUpdateContext = createContext<ToastUpdateType  | undefined>(undefined);

type ToastProviderProps = {
  children: React.ReactNode;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<TToastInfo | null>(null)

  return (
    <ToastContext.Provider value={toast}>
      <ToastUpdateContext.Provider value={setToast}>
        {children}
      </ToastUpdateContext.Provider>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  return useContext(ToastContext);
}

export const useToastUpdate = () => {
  return useContext(ToastUpdateContext);
}
