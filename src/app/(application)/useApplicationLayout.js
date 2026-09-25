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
import { clearErrors as clearConfiguracaoErrors } from '@/store/slices/configuracaoSlice';
import { clearAppCache } from '@/utils/appCache';

export function useApplicationLayout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, removeAuthenticate, refreshToken } = useUserAuth();
  const { error } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState({
    isExpanded: false,
  });

  const professoresState = useSelector(state => state.professores);
  const alunosState = useSelector(state => state.alunos);
  const aulasState = useSelector(state => state.aulas);
  const contratosState = useSelector(state => state.contratos);
  const configuracaoState = useSelector(state => state.configuracao);

  // Fonte única dos slices observados pelo 401: cada par {state, clearErrors}
  // alimenta tanto a lista de estados vigiada pelo efeito de logout forçado
  // quanto a limpeza de statusError residual no mount — evita que um slice
  // novo entre em uma lista e fique de fora da outra.
  const sessionSlices = useMemo(
    () => [
      { state: professoresState, clearErrors: clearProfessoresErrors },
      { state: alunosState, clearErrors: clearAlunosErrors },
      { state: aulasState, clearErrors: clearAulasErrors },
      { state: contratosState, clearErrors: clearContratoErrors },
      { state: configuracaoState, clearErrors: clearConfiguracaoErrors },
    ],
    [
      professoresState,
      alunosState,
      aulasState,
      contratosState,
      configuracaoState,
    ]
  );
  const states = useMemo(
    () => sessionSlices.map(({ state }) => state),
    [sessionSlices]
  );

  const toggleSidebar = () => {
    setSidebarExpanded({
      isExpanded: !sidebarExpanded.isExpanded,
    });
  };

  useEffect(() => {
    sessionSlices.forEach(({ clearErrors }) => dispatch(clearErrors()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let isCurrent = true;

    async function checkAuth() {
      let userIsAuth;
      try {
        userIsAuth = await isAuthenticated();
      } catch {
        userIsAuth = false;
      }
      if (!isCurrent) {
        return;
      }
      if (!userIsAuth) {
        error('Por favor, faça login para acessar o sistema.');
        router.push('/login');
        return;
      } else {
        setIsLoading(false);
      }
    }
    checkAuth();

    return () => {
      isCurrent = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const statusErrors = states.map(state => String(state.statusError));

    if (!isUnauthorized && statusErrors.includes('401')) {
      setIsUnauthorized(true);
      dispatch(logout(refreshToken));
      removeAuthenticate();
      clearAppCache();
      error('Sua sessão expirou. Entre novamente para continuar.');
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
