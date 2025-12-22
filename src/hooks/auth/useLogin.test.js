import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { STATUS } from '@/constants';
import { useLogin } from './useLogin';
import { clearStatus } from '@/store/slices/authSlice';

const mockStore = configureStore([]);
const mockPush = jest.fn();
const mockSuccess = jest.fn();
const mockError = jest.fn();
const mockAuthenticate = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock('@/providers/ToastProvider', () => ({
  useToast: () => ({ success: mockSuccess, error: mockError }),
}));
jest.mock('@/providers/UserAuthProvider', () => ({
  useUserAuth: () => ({ authenticate: mockAuthenticate }),
}));
jest.mock('@/store/slices/authSlice', () => ({
  login: jest.fn(formData => ({ type: 'auth/login', payload: formData })),
  clearStatus: jest.fn(() => ({ type: 'auth/clearStatus' })),
}));

describe('useLogin', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        status: STATUS.IDLE,
        message: '',
        action: '',
        data: null,
      },
    });
    store.dispatch = jest.fn();
    mockPush.mockClear();
    mockSuccess.mockClear();
    mockError.mockClear();
    mockAuthenticate.mockClear();
    clearStatus.mockClear();
  });

  function wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLogin(), { wrapper });
    expect(result.current.formData).toEqual({ email: '', senha: '' });
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.handleChange).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
  });

  it('should dispatch clearStatus on mount', () => {
    renderHook(() => useLogin(), { wrapper });
    expect(store.dispatch).toHaveBeenCalledWith({ type: 'auth/clearStatus' });
  });

  it('should update formData on handleChange', () => {
    const { result } = renderHook(() => useLogin(), { wrapper });
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@email.com' },
      });
    });
    expect(result.current.formData.email).toBe('test@email.com');
  });

  it('should update multiple fields on handleChange', () => {
    const { result } = renderHook(() => useLogin(), { wrapper });
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@email.com' },
      });
      result.current.handleChange({ target: { name: 'senha', value: '123' } });
    });
    expect(result.current.formData.email).toBe('test@email.com');
    expect(result.current.formData.senha).toBe('123');
  });

  it('should dispatch login on handleSubmit with valid data', () => {
    const { result } = renderHook(() => useLogin(), { wrapper });
    const mockPreventDefault = jest.fn();

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@email.com' },
      });
      result.current.handleChange({ target: { name: 'senha', value: '123' } });
    });

    act(() => {
      result.current.handleSubmit({ preventDefault: mockPreventDefault });
    });

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledTimes(2); // clearStatus + login
    expect(store.dispatch).toHaveBeenLastCalledWith({
      type: 'auth/login',
      payload: { email: 'test@email.com', senha: '123' },
    });
  });

  it('should show error if email is missing', () => {
    const { result } = renderHook(() => useLogin(), { wrapper });
    act(() => {
      result.current.handleChange({ target: { name: 'senha', value: '123' } });
      result.current.handleSubmit({ preventDefault: jest.fn() });
    });
    expect(mockError).toHaveBeenCalledWith('Preencha o email e senha.');
  });

  it('should show error if senha is missing', () => {
    const { result } = renderHook(() => useLogin(), { wrapper });
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@email.com' },
      });
      result.current.handleSubmit({ preventDefault: jest.fn() });
    });
    expect(mockError).toHaveBeenCalledWith('Preencha o email e senha.');
  });

  it('should show error if both email and senha are missing', () => {
    const { result } = renderHook(() => useLogin(), { wrapper });
    act(() => {
      result.current.handleSubmit({ preventDefault: jest.fn() });
    });
    expect(mockError).toHaveBeenCalledWith('Preencha o email e senha.');
  });

  it('should set isLoading to true when status is LOADING', () => {
    store = mockStore({
      auth: {
        status: STATUS.LOADING,
        message: '',
        action: '',
        data: null,
      },
    });
    const { result } = renderHook(() => useLogin(), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it('should show error message when login fails', () => {
    store = mockStore({
      auth: {
        status: STATUS.FAILED,
        message: 'Credenciais inválidas',
        action: 'login',
        data: null,
      },
    });
    renderHook(() => useLogin(), { wrapper });
    expect(mockError).toHaveBeenCalledWith('Credenciais inválidas');
  });

  it('should not show error if action is not login', () => {
    store = mockStore({
      auth: {
        status: STATUS.FAILED,
        message: 'Algum erro',
        action: 'logout',
        data: null,
      },
    });
    renderHook(() => useLogin(), { wrapper });
    expect(mockError).not.toHaveBeenCalled();
  });

  it('should handle successful login with complete data', () => {
    const mockData = {
      user: { nome: 'João Silva', permissao: 'admin' },
      configuracao: {
        duracaoAula: 60,
        tolerancia: 10,
        diasDeFuncionamento: [1, 2, 3, 4, 5],
      },
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
      tokenType: 'Bearer',
      expiresIn: 3600,
    };

    store = mockStore({
      auth: {
        status: STATUS.SUCCESS,
        message: '',
        action: 'login',
        data: mockData,
      },
    });
    store.dispatch = jest.fn();

    renderHook(() => useLogin(), { wrapper });

    expect(mockSuccess).toHaveBeenCalledWith('Bem-vindo, João Silva!');
    expect(mockAuthenticate).toHaveBeenCalledWith({
      currentUser: mockData.user,
      duracaoAula: mockData.configuracao.duracaoAula,
      tolerancia: mockData.configuracao.tolerancia,
      diasDeFuncionamento: mockData.configuracao.diasDeFuncionamento,
      accessToken: mockData.accessToken,
      refreshToken: mockData.refreshToken,
      tokenType: mockData.tokenType,
      expiresIn: mockData.expiresIn,
    });
    expect(mockPush).toHaveBeenCalledWith('/');
    expect(store.dispatch).toHaveBeenCalledWith({ type: 'auth/clearStatus' });
  });

  it('should not handle success if action is not login', () => {
    const mockData = {
      user: { nome: 'João Silva', permissao: 'admin' },
      configuracao: {
        duracaoAula: 60,
        tolerancia: 10,
        diasDeFuncionamento: [1, 2, 3, 4, 5],
      },
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
      tokenType: 'Bearer',
      expiresIn: 3600,
    };

    store = mockStore({
      auth: {
        status: STATUS.SUCCESS,
        message: '',
        action: 'logout',
        data: mockData,
      },
    });

    renderHook(() => useLogin(), { wrapper });

    expect(mockSuccess).not.toHaveBeenCalled();
    expect(mockAuthenticate).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not handle success if data is null', () => {
    store = mockStore({
      auth: {
        status: STATUS.SUCCESS,
        message: '',
        action: 'login',
        data: null,
      },
    });

    renderHook(() => useLogin(), { wrapper });

    expect(mockSuccess).not.toHaveBeenCalled();
    expect(mockAuthenticate).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not handle success if user is missing', () => {
    store = mockStore({
      auth: {
        status: STATUS.SUCCESS,
        message: '',
        action: 'login',
        data: { accessToken: 'token' },
      },
    });

    renderHook(() => useLogin(), { wrapper });

    expect(mockSuccess).not.toHaveBeenCalled();
    expect(mockAuthenticate).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
