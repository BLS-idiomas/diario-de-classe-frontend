'use client';

import React, { createContext, useContext, useState } from 'react';

const UserAuthContext = createContext();

export function UserAuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window === 'undefined') {
      return {
        accessToken: null,
        refreshToken: null,
        tokenType: null,
        expiresIn: null,
        currentUser: null,
      };
    }

    const tokenString = localStorage.getItem('token');
    if (tokenString) {
      const token = JSON.parse(tokenString);
      return {
        accessToken: token.accessToken || null,
        refreshToken: token.refreshToken || null,
        tokenType: token.tokenType || null,
        expiresIn: token.expiresIn || null,
        currentUser: token.currentUser || null,
      };
    }
    return {
      accessToken: null,
      refreshToken: null,
      tokenType: null,
      expiresIn: null,
      currentUser: null,
    };
  });

  const authenticate = ({
    accessToken,
    refreshToken,
    tokenType,
    expiresIn,
    currentUser,
  }) => {
    const token = {
      accessToken,
      refreshToken,
      tokenType,
      expiresIn,
      currentUser,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', JSON.stringify(token));
    }
    setAuth(token);
  };

  const removeAuthenticate = () => {
    const token = {
      accessToken: null,
      refreshToken: null,
      tokenType: null,
      expiresIn: null,
      currentUser: null,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', JSON.stringify(token));
    }
    setAuth(token);
  };

  const isAuthenticated = async () => {
    return auth.currentUser !== null && auth.accessToken !== null;
  };

  const isAdmin = () =>
    auth.currentUser && auth.currentUser.permissao === 'admin';

  return (
    <UserAuthContext.Provider
      value={{
        currentUser: auth.currentUser,
        refreshToken: auth.refreshToken,
        authenticate,
        removeAuthenticate,
        isAuthenticated,
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
