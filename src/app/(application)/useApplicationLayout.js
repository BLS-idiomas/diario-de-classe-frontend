'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { logout } from '@/store/slices/authSlice';
import { clearErrors as clearProfessoresErrors } from '@/store/slices/professoresSlice';
import { clearErrors as clearAlunosErrors } from '@/store/slices/alunosSlice';
import { clearErrors as clearAulasErrors } from '@/store/slices/aulasSlice';
import { clearErrors as clearContratoErrors } from '@/store/slices/contratosSlice';
import { isMobileFunction } from '@/utils/isMobileFunction';

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
  const aulasState = useSelector(state => state.aulas);
  const contratosState = useSelector(state => state.contratos);
  const states = useMemo(
    () => [professoresState, alunosState, aulasState, contratosState],
    [professoresState, alunosState, aulasState, contratosState]
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
    dispatch(clearProfessoresErrors());
    dispatch(clearAlunosErrors());
    dispatch(clearAulasErrors());
    dispatch(clearContratoErrors());
  }, []);

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
    isMobile: isMobileFunction(),
    toggleSidebar,
  };
}
