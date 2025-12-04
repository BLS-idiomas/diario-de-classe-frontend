import { renderHook, act, waitFor } from '@testing-library/react';
import { useApplicationLayout } from './useApplicationLayout';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/providers/UserAuthProvider', () => ({ useUserAuth: jest.fn() }));
jest.mock('@/providers/ToastProvider', () => ({ useToast: jest.fn() }));
jest.mock('@/utils/isMobileFunction', () => ({ isMobileFunction: jest.fn() }));
const dispatchMock = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => dispatchMock),
}));
jest.mock('@/store/slices/authSlice', () => ({
  logout: jest.fn(() => 'LOGOUT_ACTION'),
}));

describe('useApplicationLayout', () => {
  let routerMock,
    isAuthenticatedMock,
    errorMock,
    isMobileFunctionMock,
    useSelectorMock,
    removeAuthenticateMock;

  beforeEach(() => {
    routerMock = { push: jest.fn() };
    isAuthenticatedMock = jest.fn();
    errorMock = jest.fn();
    isMobileFunctionMock = jest.fn();
    removeAuthenticateMock = jest.fn();
    useSelectorMock = require('react-redux').useSelector;
    useSelectorMock.mockImplementation(fn =>
      fn({ professores: {}, alunos: {} })
    );
    require('next/navigation').useRouter.mockReturnValue(routerMock);
    require('@/providers/UserAuthProvider').useUserAuth.mockReturnValue({
      isAuthenticated: isAuthenticatedMock,
      removeAuthenticate: removeAuthenticateMock,
    });
    require('@/providers/ToastProvider').useToast.mockReturnValue({
      error: errorMock,
    });
    require('@/utils/isMobileFunction').isMobileFunction.mockImplementation(
      isMobileFunctionMock
    );
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

  it('deve alternar sidebar para mobile', () => {
    isMobileFunctionMock.mockReturnValue(true);
    const { result } = renderHook(() => useApplicationLayout());
    act(() => {
      result.current.toggleSidebar();
    });
    expect(result.current.sidebarExpanded.sidebarClass).toBe('absolute w-full');
    expect(result.current.sidebarExpanded.isExpanded).toBe(true);
  });

  it('deve alternar sidebar para desktop', () => {
    isMobileFunctionMock.mockReturnValue(false);
    const { result } = renderHook(() => useApplicationLayout());
    act(() => {
      result.current.toggleSidebar();
    });
    expect(result.current.sidebarExpanded.sidebarClass).toBe('w-[180px]');
    expect(result.current.sidebarExpanded.mainClass).toBe('ml-[150px]');
    expect(result.current.sidebarExpanded.isExpanded).toBe(true);
  });

  it('deve chamar dispatch(logout), removeAuthenticate, error e router.push se statusError de professores for 401', () => {
    const { logout } = require('@/store/slices/authSlice');
    useSelectorMock.mockImplementation(fn =>
      fn({ professores: { statusError: '401' }, alunos: {} })
    );
    renderHook(() => useApplicationLayout());
    expect(dispatchMock).toHaveBeenCalledWith(logout());
    expect(removeAuthenticateMock).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalledWith('Sua sessão expirou.');
    expect(routerMock.push).toHaveBeenCalledWith('/login');
  });

  it('deve chamar dispatch(logout), removeAuthenticate, error e router.push se statusError de alunos for 401', () => {
    const { logout } = require('@/store/slices/authSlice');
    useSelectorMock.mockImplementation(fn =>
      fn({ professores: {}, alunos: { statusError: '401' } })
    );
    renderHook(() => useApplicationLayout());
    expect(dispatchMock).toHaveBeenCalledWith(logout());
    expect(removeAuthenticateMock).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalledWith('Sua sessão expirou.');
    expect(routerMock.push).toHaveBeenCalledWith('/login');
  });

  it('deve chamar dispatch(logout) apenas uma vez se múltiplos estados tiverem 401', () => {
    const { logout } = require('@/store/slices/authSlice');
    useSelectorMock.mockImplementation(fn =>
      fn({
        professores: { statusError: '401' },
        alunos: { statusError: '401' },
      })
    );
    renderHook(() => useApplicationLayout());
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(logout());
    expect(removeAuthenticateMock).toHaveBeenCalledTimes(1);
    expect(errorMock).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenCalledTimes(1);
  });

  it('não deve chamar logout se statusError não for 401', () => {
    const { logout } = require('@/store/slices/authSlice');
    useSelectorMock.mockImplementation(fn =>
      fn({
        professores: { statusError: '404' },
        alunos: { statusError: '500' },
      })
    );
    renderHook(() => useApplicationLayout());
    expect(dispatchMock).not.toHaveBeenCalled();
    expect(removeAuthenticateMock).not.toHaveBeenCalled();
  });

  it('deve monitorar mudanças nos estados de professores e alunos', async () => {
    const { logout } = require('@/store/slices/authSlice');

    // Inicialmente sem erro
    useSelectorMock.mockImplementation(fn =>
      fn({ professores: {}, alunos: {} })
    );

    const { rerender } = renderHook(() => useApplicationLayout());

    expect(dispatchMock).not.toHaveBeenCalled();

    // Atualiza para ter erro 401
    useSelectorMock.mockImplementation(fn =>
      fn({ professores: { statusError: '401' }, alunos: {} })
    );

    rerender();

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(logout());
    });
  });
});
