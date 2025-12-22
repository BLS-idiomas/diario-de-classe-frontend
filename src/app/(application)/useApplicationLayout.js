'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { isMobileFunction } from '@/utils/isMobileFunction';
import { logout } from '@/store/slices/authSlice';

export function useApplicationLayout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, removeAuthenticate, refreshToken } = useUserAuth();
  const { error } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState({
    mainClass: 'ml-18',
    sidebarClass: 'w-18',
    isExpanded: false,
  });

  const professoresState = useSelector(state => state.professores);
  const alunosState = useSelector(state => state.alunos);
  const states = useMemo(
    () => [professoresState, alunosState],
    [professoresState, alunosState]
  );

  const toggleSidebar = () => {
    const isMobile = isMobileFunction();
    let mainClass = 'ml-18';
    let sidebarClass = 'w-18';

    if (!sidebarExpanded.isExpanded) {
      if (isMobile === true) {
        sidebarClass = 'absolute w-full';
      } else {
        sidebarClass = 'w-[180px]';
        mainClass = 'ml-[150px]';
      }
    }

    setSidebarExpanded({
      mainClass: mainClass,
      sidebarClass: sidebarClass,
      isExpanded: !sidebarExpanded.isExpanded,
    });
  };

  useEffect(() => {
    async function checkAuth() {
      const userIsAuth = await isAuthenticated();
      if (!userIsAuth) {
        error('Por favor, faça login para acessar o sistema.');
        router.push('/login');
        return;
      } else {
        setIsLoading(false);
      }
    }
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const statusErrors = states.map(state => String(state.statusError));

    if (!isUnauthorized && statusErrors.includes('401')) {
      setIsUnauthorized(true);
      dispatch(logout(refreshToken));
      removeAuthenticate();
      error('Sua sessão expirou.');
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states]);

  return {
    isUnauthorized,
    isLoading,
    sidebarExpanded,
    toggleSidebar,
  };
}
