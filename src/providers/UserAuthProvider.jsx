'use client';

import React, { createContext, useContext, useState } from 'react';

const UserAuthContext = createContext();

export function UserAuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    // Check if we're in the browser before accessing localStorage
    const emptyAuth = {
      accessToken: null,
      refreshToken: null,
      tokenType: null,
      expiresIn: null,
      currentUser: null,
    };
    if (typeof window === 'undefined') {
      return emptyAuth;
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
    return emptyAuth;
  });

  const [settings, setSettings] = useState(() => {
    // Check if we're in the browser before accessing localStorage
    const emptySettings = {
      duracaoAula: null,
      tolerancia: null,
      diasDeFuncionamento: [],
    };

    if (typeof window === 'undefined') {
      return emptySettings;
    }

    const settingsString = localStorage.getItem('settings');
    if (settingsString) {
      const settings = JSON.parse(settingsString);
      return {
        duracaoAula: settings.duracaoAula || null,
        tolerancia: settings.tolerancia || null,
        diasDeFuncionamento: settings.diasDeFuncionamento || [],
      };
    }
    return emptySettings;
  });

  const authenticate = ({
    accessToken,
    refreshToken,
    tokenType,
    expiresIn,
    currentUser,
    duracaoAula,
    tolerancia,
    diasDeFuncionamento,
  }) => {
    const token = {
      accessToken,
      refreshToken,
      tokenType,
      expiresIn,
      currentUser,
    };
    const settings = {
      duracaoAula,
      tolerancia,
      diasDeFuncionamento,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', JSON.stringify(token));
      localStorage.setItem('settings', JSON.stringify(settings));
    }
    setAuth(token);
    setSettings(settings);
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
        settings,
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
