'use client'
import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { TUser } from '../_libs/types';
import { useContext } from 'react';
import { mockUser } from '../_libs/placeholder-data';

type UserUpdateType = Dispatch<SetStateAction<TUser | null>>;

export const UserContext = createContext<TUser | null>(null);
export const UserUpdateContext = createContext<UserUpdateType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<TUser | null>(null);

  useEffect(() => {
    setUser(mockUser)
  }, [])

  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value={setUser}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext);
}

export const useUserUpdate = () => {
  return useContext(UserUpdateContext);
}
