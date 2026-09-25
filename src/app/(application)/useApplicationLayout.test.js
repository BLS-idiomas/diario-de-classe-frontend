import { renderHook, act, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { useApplicationLayout } from './useApplicationLayout';
import professoresReducer from '@/store/slices/professoresSlice';
import alunosReducer from '@/store/slices/alunosSlice';
import aulasReducer from '@/store/slices/aulasSlice';
import contratosReducer from '@/store/slices/contratosSlice';
import configuracaoReducer, {
  updateConfiguracao,
} from '@/store/slices/configuracaoSlice';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/providers/UserAuthProvider', () => ({ useUserAuth: jest.fn() }));
jest.mock('@/providers/ToastProvider', () => ({ useToast: jest.fn() }));
// Canário do NFR-001-005/AC-001-020: prova que o hook nunca chama
// isMobileFunction no fluxo de render/toggle (nenhum outro teste deste
// arquivo exercita este módulo).
jest.mock('@/utils/isMobileFunction', () => ({
  isMobileFunction: jest.fn(() => {
    throw new Error(
      'isMobileFunction não pode ser chamada no fluxo de render/toggle'
    );
  }),
}));
const dispatchMock = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => dispatchMock),
}));
jest.mock('@/store/slices/authSlice', () => ({
  logout: jest.fn(() => ({ type: 'auth/logout' })),
}));
jest.mock('@/utils/appCache', () => ({ clearAppCache: jest.fn() }));

describe('useApplicationLayout', () => {
  let routerMock,
    isAuthenticatedMock,
    errorMock,
    useSelectorMock,
    removeAuthenticateMock;
  const mockRefreshToken = 'test-refresh-token-123';

  beforeEach(() => {
    routerMock = { push: jest.fn() };
    isAuthenticatedMock = jest.fn();
    errorMock = jest.fn();
    removeAuthenticateMock = jest.fn();
    useSelectorMock = require('react-redux').useSelector;
    useSelectorMock.mockImplementation(fn =>
      fn({
        professores: {},
        alunos: {},
        aulas: {},
        contratos: {},
        configuracao: {},
      })
    );
    require('next/navigation').useRouter.mockReturnValue(routerMock);
    require('@/providers/UserAuthProvider').useUserAuth.mockReturnValue({
      isAuthenticated: isAuthenticatedMock,
      removeAuthenticate: removeAuthenticateMock,
      refreshToken: mockRefreshToken,
    });
    require('@/providers/ToastProvider').useToast.mockReturnValue({
      error: errorMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve iniciar com loading true e sidebar fechado', () => {
    isAuthenticatedMock.mockResolvedValue(false);
    const { result } = renderHook(() => useApplicationLayout());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.sidebarExpanded.isExpanded).toBe(false);
  });

  it('deve redirecionar para login se não autenticado', async () => {
    isAuthenticatedMock.mockResolvedValue(false);
    renderHook(() => useApplicationLayout());
    await Promise.resolve();
    expect(errorMock).toHaveBeenCalledWith(
      'Por favor, faça login para acessar o sistema.'
    );
    expect(routerMock.push).toHaveBeenCalledWith('/login');
  });

  it('deve desativar loading se autenticado', async () => {
    isAuthenticatedMock.mockResolvedValue(true);
    const { result } = renderHook(() => useApplicationLayout());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('deve alternar isExpanded ao chamar toggleSidebar, sem calcular classes', () => {
    const { result } = renderHook(() => useApplicationLayout());
    act(() => {
      result.current.toggleSidebar();
    });
    expect(result.current.sidebarExpanded).toEqual({ isExpanded: true });
  });

  it('não chama isMobileFunction no fluxo de render/toggle', () => {
    const { result } = renderHook(() => useApplicationLayout());
    expect(() => {
      act(() => {
        result.current.toggleSidebar();
      });
    }).not.toThrow();
    expect(result.current.sidebarExpanded).toEqual({ isExpanded: true });
  });

  it('deve chamar dispatch(logout), removeAuthenticate, error e router.push se statusError de professores for 401', () => {
    const { logout } = require('@/store/slices/authSlice');
    useSelectorMock.mockImplementation(fn =>
      fn({
        professores: { statusError: '401' },
        alunos: {},
        aulas: {},
        contratos: {},
        configuracao: {},
      })
    );
    renderHook(() => useApplicationLayout());
    expect(dispatchMock).toHaveBeenCalledWith(logout(mockRefreshToken));
    expect(removeAuthenticateMock).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalledWith(
      'Sua sessão expirou. Entre novamente para continuar.'
    );
    expect(routerMock.push).toHaveBeenCalledWith('/login');
  });

  it('deve purgar o cache do aplicativo na expiração por 401 (AC-001-010)', () => {
    const { logout } = require('@/store/slices/authSlice');
    const { clearAppCache } = require('@/utils/appCache');
    useSelectorMock.mockImplementation(fn =>
      fn({
        professores: {},
        alunos: { statusError: '401' },
        aulas: {},
        contratos: {},
        configuracao: {},
      })
    );
    renderHook(() => useApplicationLayout());
    expect(dispatchMock).toHaveBeenCalledWith(logout(mockRefreshToken));
    expect(clearAppCache).toHaveBeenCalled();
    expect(removeAuthenticateMock).toHaveBeenCalled();
  });

  it('deve chamar dispatch(logout), removeAuthenticate, error e router.push se statusError de alunos for 401', () => {
    const { logout } = require('@/store/slices/authSlice');
    useSelectorMock.mockImplementation(fn =>
      fn({
        professores: {},
        alunos: { statusError: '401' },
        aulas: {},
        contratos: {},
        configuracao: {},
      })
    );
    renderHook(() => useApplicationLayout());
    expect(dispatchMock).toHaveBeenCalledWith(logout(mockRefreshToken));
    expect(removeAuthenticateMock).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalledWith(
      'Sua sessão expirou. Entre novamente para continuar.'
    );
    expect(routerMock.push).toHaveBeenCalledWith('/login');
  });

  it('deve chamar dispatch(logout), removeAuthenticate, error e router.push se statusError de configuracao for 401', () => {
    const { logout } = require('@/store/slices/authSlice');
    useSelectorMock.mockImplementation(fn =>
      fn({
        professores: {},
        alunos: {},
        aulas: {},
        contratos: {},
        configuracao: { statusError: '401' },
      })
    );
    renderHook(() => useApplicationLayout());
    expect(dispatchMock).toHaveBeenCalledWith(logout(mockRefreshToken));
    expect(removeAuthenticateMock).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalledWith(
      'Sua sessão expirou. Entre novamente para continuar.'
    );
    expect(routerMock.push).toHaveBeenCalledWith('/login');
  });

  it('deve chamar dispatch(logout) apenas uma vez se múltiplos estados tiverem 401', () => {
    const { logout } = require('@/store/slices/authSlice');
    useSelectorMock.mockImplementation(fn =>
      fn({
        professores: { statusError: '401' },
        alunos: { statusError: '401' },
        aulas: {},
        contratos: {},
        configuracao: {},
      })
    );
    renderHook(() => useApplicationLayout());
    // Conta apenas as chamadas de logout
    const logoutCalls = dispatchMock.mock.calls.filter(
      ([action]) => action && action.type === 'auth/logout'
    );
    expect(logoutCalls).toHaveLength(1);
    expect(logoutCalls[0][0]).toEqual(logout(mockRefreshToken));
    expect(removeAuthenticateMock).toHaveBeenCalledTimes(1);
    expect(errorMock).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenCalledTimes(1);
  });

  it('deve chamar dispatch(logout) apenas uma vez se configuracao e professores tiverem 401 simultaneamente', () => {
    const { logout } = require('@/store/slices/authSlice');
    useSelectorMock.mockImplementation(fn =>
      fn({
        professores: { statusError: '401' },
        alunos: {},
        aulas: {},
        contratos: {},
        configuracao: { statusError: '401' },
      })
    );
    renderHook(() => useApplicationLayout());
    const logoutCalls = dispatchMock.mock.calls.filter(
      ([action]) => action && action.type === 'auth/logout'
    );
    expect(logoutCalls).toHaveLength(1);
    expect(logoutCalls[0][0]).toEqual(logout(mockRefreshToken));
    expect(removeAuthenticateMock).toHaveBeenCalledTimes(1);
    expect(errorMock).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenCalledTimes(1);
  });

  it('limpa o statusError residual de configuracao no mount, evitando logout forçado em toda remontagem', () => {
    isAuthenticatedMock.mockResolvedValue(true);

    const store = configureStore({
      reducer: {
        professores: professoresReducer,
        alunos: alunosReducer,
        aulas: aulasReducer,
        contratos: contratosReducer,
        configuracao: configuracaoReducer,
      },
    });
    // 401 residual em configuracao, como se a última operação antes do
    // logout/login seguinte tivesse falhado com sessão expirada.
    store.dispatch({
      type: updateConfiguracao.rejected.type,
      payload: { statusError: '401' },
    });

    useSelectorMock.mockImplementation(fn => fn(store.getState()));
    dispatchMock.mockImplementation(action => store.dispatch(action));

    const countLogoutCalls = () =>
      dispatchMock.mock.calls.filter(
        ([action]) => action && action.type === 'auth/logout'
      ).length;

    try {
      const mountCounts = [];
      for (let mount = 0; mount < 3; mount += 1) {
        const { unmount } = renderHook(() => useApplicationLayout());
        mountCounts.push(countLogoutCalls());
        dispatchMock.mockClear();
        unmount();
      }

      // 1ª montagem ainda lê o 401 residual antes do clear aplicar (defeito
      // conhecido, fora de escopo); da 2ª em diante o clear da montagem
      // anterior já zerou o statusError.
      expect(mountCounts).toEqual([1, 0, 0]);
    } finally {
      // Restaura o dispatchMock para os demais testes: sem isso, o dispatch
      // continuaria roteando para esta store real depois que o teste termina.
      dispatchMock.mockImplementation(() => {});
    }
  });

  it('não deve chamar logout se statusError não for 401', () => {
    const { logout } = require('@/store/slices/authSlice');
    const { clearAppCache } = require('@/utils/appCache');
    useSelectorMock.mockImplementation(fn =>
      fn({
        professores: { statusError: '404' },
        alunos: { statusError: '500' },
        aulas: {},
        contratos: {},
        configuracao: {},
      })
    );
    renderHook(() => useApplicationLayout());
    // Garante que nenhuma chamada de logout foi feita
    const logoutCalls = dispatchMock.mock.calls.filter(
      ([action]) => action && action.type === 'auth/logout'
    );
    expect(logoutCalls).toHaveLength(0);
    expect(removeAuthenticateMock).not.toHaveBeenCalled();
    expect(clearAppCache).not.toHaveBeenCalled();
  });

  it('deve monitorar mudanças nos estados de professores e alunos', async () => {
    const { logout } = require('@/store/slices/authSlice');

    // Inicialmente sem erro
    useSelectorMock.mockImplementation(fn =>
      fn({
        professores: {},
        alunos: {},
        aulas: {},
        contratos: {},
        configuracao: {},
      })
    );

    const { rerender } = renderHook(() => useApplicationLayout());

    // Garante que nenhuma chamada de logout foi feita
    const logoutCalls = dispatchMock.mock.calls.filter(
      ([action]) => action && action.type === 'auth/logout'
    );
    expect(logoutCalls).toHaveLength(0);

    // Atualiza para ter erro 401
    useSelectorMock.mockImplementation(fn =>
      fn({
        professores: { statusError: '401' },
        alunos: {},
        aulas: {},
        contratos: {},
        configuracao: {},
      })
    );

    rerender();

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(logout(mockRefreshToken));
    });
  });

  it('não deve disparar toast/redirect duplicado quando o efeito remonta antes do checkAuth resolver (Strict Mode)', async () => {
    const resolvers = [];
    isAuthenticatedMock.mockImplementation(
      () =>
        new Promise(resolve => {
          resolvers.push(resolve);
        })
    );

    // Simula o double-invoke do useEffect que o React Strict Mode provoca em
    // dev: monta, desmonta antes do checkAuth() assíncrono resolver, e
    // remonta. A invocação obsoleta (montagem 1) não deve mais agir quando
    // resolver — só a montagem corrente (2) deve disparar toast/redirect.
    const { unmount } = renderHook(() => useApplicationLayout());
    unmount();
    renderHook(() => useApplicationLayout());

    expect(resolvers).toHaveLength(2);
    resolvers[0](false);
    resolvers[1](false);

    await waitFor(() => {
      expect(errorMock).toHaveBeenCalled();
    });

    expect(errorMock).toHaveBeenCalledTimes(1);
    expect(errorMock).toHaveBeenCalledWith(
      'Por favor, faça login para acessar o sistema.'
    );
    expect(routerMock.push).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenCalledWith('/login');
  });

  it('trata rejeição de isAuthenticated() como não-autenticada', async () => {
    isAuthenticatedMock.mockRejectedValue(new Error('network error'));
    const { result } = renderHook(() => useApplicationLayout());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith('/login');
    });

    expect(errorMock).toHaveBeenCalledWith(
      'Por favor, faça login para acessar o sistema.'
    );
    expect(result.current.isLoading).toBe(true);
  });
});
