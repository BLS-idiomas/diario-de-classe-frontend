'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  setToken,
  getToken,
  removeToken as removeTokenUtil,
} from '@/utils/token';

const UserAuthContext = createContext();

export function UserAuthProvider({ children }) {
  const initialToken = getToken();
  const [auth, setAuth] = useState({
    accessToken: initialToken?.accessToken || null,
    refreshToken: initialToken?.refreshToken || null,
    tokenType: initialToken?.tokenType || null,
    expiresIn: initialToken?.expiresIn || null,
    currentUser: initialToken?.user || null,
  });

  const saveToken = ({
    accessToken,
    refreshToken,
    tokenType,
    expiresIn,
    currentUser,
  }) => {
    setToken({
      accessToken,
      refreshToken,
      tokenType,
      expiresIn,
      user: currentUser,
    });
    setAuth({ accessToken, refreshToken, tokenType, expiresIn, currentUser });
  };

  const removeToken = () => {
    removeTokenUtil();
    setAuth({
      accessToken: null,
      refreshToken: null,
      tokenType: null,
      expiresIn: null,
      currentUser: null,
    });
  };

  const isUserLogin = () => Boolean(auth.currentUser);
  const isAdmin = () =>
    Boolean(auth.currentUser) && auth.currentUser.permissao === 'admin';

  return (
    <UserAuthContext.Provider
      value={{
        currentUser: auth.currentUser,
        removeToken,
        saveToken,
        isUserLogin,
        isAdmin,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
