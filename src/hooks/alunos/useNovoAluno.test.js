import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useRouter } from 'next/navigation';
import { useNovoAluno } from './useNovoAluno';
import { createAluno } from '@/store/slices/alunosSlice';
import { STATUS } from '@/constants';
import { useToast } from '@/providers/ToastProvider';

// Mock dos módulos
jest.mock('@/store/slices/alunosSlice', () => ({
  createAluno: jest.fn(data => ({
    type: 'createAluno',
    payload: data,
  })),
  clearStatus: jest.fn(() => ({ type: 'clearStatus' })),
  clearCurrent: jest.fn(() => ({ type: 'clearCurrent' })),
}));

jest.mock('@/constants', () => ({
  STATUS: {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    FAILED: 'failed',
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/providers/ToastProvider', () => ({
  useToast: jest.fn(),
}));

// Mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      alunos: (state = initialState, action) => state,
    },
  });
};

// Wrapper para Provider
const createWrapper = store => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('useNovoAluno', () => {
  let mockDispatch;
  let mockPush;
  let mockSuccess;
  let mockCreateAluno;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock do router
    mockPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockPush,
    });

    // Mock do toast
    mockSuccess = jest.fn();
    useToast.mockReturnValue({
      success: mockSuccess,
    });

    // Mock do createAluno dispatch
    mockCreateAluno = jest.fn();
    mockDispatch = jest.fn().mockImplementation(action => {
      if (typeof action === 'function') {
        return mockCreateAluno(action);
      }
      return action;
    });
  });

  it('should dispatch createAluno on submit', () => {
    const initialState = {
      status: STATUS.IDLE,
      message: '',
      errors: {},
      current: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useNovoAluno(), { wrapper });

    act(() => {
      // submit expects an object with dataToSend
      result.current.submit({
        dataToSend: {
          nome: 'João',
          sobrenome: 'Silva',
          email: 'joao@test.com',
        },
      });
    });

    // Verifica se o dispatch foi chamado com createAluno
    expect(mockDispatch).toHaveBeenCalledWith(
      createAluno({
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joao@test.com',
      })
    );
  });

  it('should return correct loading states', () => {
    const loadingState = {
      status: STATUS.LOADING,
      message: '',
      errors: {},
      current: null,
    };
    const store = createMockStore(loadingState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useNovoAluno(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSubmitting).toBe(true);
  });

  it('should return correct idle states', () => {
    const idleState = {
      status: STATUS.IDLE,
      message: '',
      errors: {},
      current: null,
    };
    const store = createMockStore(idleState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useNovoAluno(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should return correct success states', () => {
    const successState = {
      status: STATUS.SUCCESS,
      message: 'Aluno criado com sucesso',
      errors: {},
      current: { id: 1, nome: 'João', sobrenome: 'Silva' },
      action: 'createAluno',
    };
    const store = createMockStore(successState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useNovoAluno(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.message).toBe('Aluno criado com sucesso');
  });

  it('should show success toast and redirect when status is SUCCESS and current exists', () => {
    const successState = {
      status: STATUS.SUCCESS,
      message: 'Aluno criado com sucesso',
      errors: {},
      current: { id: 1, nome: 'João', sobrenome: 'Silva' },
      action: 'createAluno',
    };
    const store = createMockStore(successState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useNovoAluno(), { wrapper });

    // Effects may run asynchronously; wait for side-effects
    const { waitFor } = require('@testing-library/react');
    return waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledWith('Aluno criado com sucesso!');
      expect(mockPush).toHaveBeenCalledWith('/alunos');
    });
  });

  it('should not redirect if status is not SUCCESS', () => {
    const loadingState = {
      status: STATUS.LOADING,
      message: '',
      errors: {},
      current: null,
      action: 'createAluno',
    };
    const store = createMockStore(loadingState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useNovoAluno(), { wrapper });

    expect(mockSuccess).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not redirect if current is null', () => {
    const successState = {
      status: STATUS.SUCCESS,
      message: 'Success',
      errors: {},
      current: null,
      action: 'createAluno',
    };
    const store = createMockStore(successState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useNovoAluno(), { wrapper });

    expect(mockSuccess).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not redirect if action is not createAluno', () => {
    const successState = {
      status: STATUS.SUCCESS,
      message: 'Success',
      errors: {},
      current: { id: 1, nome: 'João' },
      action: 'getAluno',
    };
    const store = createMockStore(successState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useNovoAluno(), { wrapper });

    expect(mockSuccess).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should return errors when present', () => {
    const errorState = {
      status: STATUS.FAILED,
      message: 'Erro ao criar aluno',
      errors: { nome: 'Nome é obrigatório', email: 'Email inválido' },
      current: null,
    };
    const store = createMockStore(errorState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useNovoAluno(), { wrapper });

    expect(result.current.errors).toEqual({
      nome: 'Nome é obrigatório',
      email: 'Email inválido',
    });
  });

  it('should dispatch clearStatus on mount', () => {
    const initialState = {
      status: STATUS.SUCCESS,
      message: '',
      errors: {},
      current: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const { clearStatus } = require('@/store/slices/alunosSlice');

    const wrapper = createWrapper(store);
    renderHook(() => useNovoAluno(), { wrapper });

    expect(mockDispatch).toHaveBeenCalledWith(clearStatus());
  });

  it('should return all expected properties', () => {
    const initialState = {
      status: STATUS.IDLE,
      message: 'Some message',
      errors: { nome: 'Error' },
      current: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useNovoAluno(), { wrapper });

    expect(result.current).toEqual({
      message: 'Some message',
      errors: { nome: 'Error' },
      isLoading: false,
      isSubmitting: false,
      submit: expect.any(Function),
    });
  });

  it('should handle multiple submissions correctly', () => {
    const initialState = {
      status: STATUS.IDLE,
      message: '',
      errors: {},
      current: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useNovoAluno(), { wrapper });

    act(() => {
      result.current.submit({ dataToSend: { nome: 'João' } });
    });

    act(() => {
      result.current.submit({ dataToSend: { nome: 'Maria' } });
    });

    // Clearstatus é chamado no mount (1x) + 2 submits
    expect(mockDispatch).toHaveBeenCalledTimes(3);
  });
});
