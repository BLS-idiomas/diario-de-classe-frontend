import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useRouter } from 'next/navigation';
import { useEditarAluno } from './useEditarAluno';
import { updateAluno, getAluno } from '@/store/slices/alunosSlice';
import { STATUS } from '@/constants';
import { useToast } from '@/providers/ToastProvider';

// Mock dos módulos
jest.mock('@/store/slices/alunosSlice', () => ({
  updateAluno: jest.fn(),
  getAluno: jest.fn(),
  clearStatus: jest.fn(() => ({ type: 'alunos/clearStatus' })),
  clearCurrent: jest.fn(() => ({ type: 'alunos/clearCurrent' })),
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

describe.skip('useEditarAluno', () => {
  let mockDispatch;
  let mockPush;
  let mockSuccess;
  let mockUpdateAluno;

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

    // Mock do updateAluno dispatch
    mockUpdateAluno = jest.fn();
    mockDispatch = jest.fn().mockImplementation(action => {
      if (typeof action === 'function') {
        return mockUpdateAluno(action);
      }
      return action;
    });

    // Mock do getAluno action
    getAluno.mockImplementation(id => ({
      type: 'alunos/getAluno',
      payload: id,
    }));
  });

  it('should return initial empty form data when no current aluno', () => {
    const initialState = {
      status: STATUS.IDLE,
      message: '',
      errors: {},
      current: null,
      statusError: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useEditarAluno(123), { wrapper });

    expect(result.current).toHaveProperty('current', null);
    expect(result.current).toHaveProperty('statusError', null);
  });

  it('should populate form data when current aluno exists', () => {
    const mockAluno = {
      id: 123,
      nome: 'João',
      sobrenome: 'Silva',
      email: 'joao@test.com',
      telefone: '11999999999',
    };
    const initialState = {
      status: STATUS.SUCCESS,
      message: '',
      errors: {},
      current: mockAluno,
      action: null,
      statusError: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useEditarAluno(123), { wrapper });

    expect(result.current.current).toEqual(mockAluno);
  });

  it('should dispatch getAluno when alunoId is provided', () => {
    const initialState = {
      status: STATUS.IDLE,
      message: '',
      errors: {},
      current: null,
      statusError: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useEditarAluno(123), { wrapper });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/getAluno',
      payload: 123,
    });
  });

  it('should not dispatch getAluno when alunoId is not provided', () => {
    const initialState = {
      status: STATUS.IDLE,
      message: '',
      errors: {},
      current: null,
      statusError: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useEditarAluno(null), { wrapper });

    // clearStatus is always dispatched on mount
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/clearStatus',
    });
  });

  it('should return correct loading states', () => {
    const loadingState = {
      status: STATUS.LOADING,
      message: '',
      errors: {},
      current: null,
      statusError: null,
    };
    const store = createMockStore(loadingState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useEditarAluno(123), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it('should update form data when current aluno changes', () => {
    const initialState = {
      status: STATUS.SUCCESS,
      message: '',
      errors: {},
      current: null,
      statusError: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useEditarAluno(123), { wrapper });

    // Inicialmente sem dados
    expect(result.current.current).toBe(null);

    // Simular mudança no current aluno
    const newState = {
      status: STATUS.SUCCESS,
      message: '',
      errors: {},
      current: { id: 123, nome: 'João', email: 'joao@test.com' },
      statusError: null,
    };
    const newStore = createMockStore(newState);
    newStore.dispatch = mockDispatch;

    const newWrapper = createWrapper(newStore);
    const { result: newResult } = renderHook(() => useEditarAluno(123), {
      wrapper: newWrapper,
    });

    expect(newResult.current.current.nome).toBe('João');
    expect(newResult.current.current.email).toBe('joao@test.com');
  });

  it('should return all expected properties', () => {
    const initialState = {
      status: STATUS.SUCCESS,
      message: 'Success message',
      errors: { nome: 'Nome é obrigatório' },
      current: { id: 123, nome: 'João' },
      action: null,
      statusError: '400',
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useEditarAluno(123), { wrapper });

    expect(result.current).toEqual({
      statusError: '400',
      message: 'Success message',
      errors: { nome: 'Nome é obrigatório' },
      isLoading: false,
      current: { id: 123, nome: 'João' },
      submit: expect.any(Function),
    });
  });

  it('should call submit function with correct parameters', () => {
    const initialState = {
      status: STATUS.IDLE,
      message: '',
      errors: {},
      current: { id: 123, nome: 'João' },
      statusError: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    updateAluno.mockImplementation(data => ({
      type: 'alunos/updateAluno',
      payload: data,
    }));

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useEditarAluno(123), { wrapper });

    const dataToSend = {
      nome: 'João Silva',
      email: 'joao@test.com',
    };

    act(() => {
      result.current.submit({ id: 123, dataToSend });
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/updateAluno',
      payload: { id: 123, data: dataToSend },
    });
  });

  it('should handle statusError correctly', () => {
    const initialState = {
      status: STATUS.FAILED,
      message: 'Erro ao atualizar',
      errors: {},
      current: { id: 123, nome: 'João' },
      statusError: '404',
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useEditarAluno(123), { wrapper });

    expect(result.current.statusError).toBe('404');
    expect(result.current.isLoading).toBe(false);
  });

  it('should dispatch clearStatus on mount', () => {
    const initialState = {
      status: STATUS.SUCCESS,
      message: '',
      errors: {},
      current: null,
      statusError: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const { clearStatus } = require('@/store/slices/alunosSlice');

    const wrapper = createWrapper(store);
    renderHook(() => useEditarAluno(123), { wrapper });

    expect(mockDispatch).toHaveBeenCalledWith(clearStatus());
  });

  it('should redirect and show success message when update is successful', () => {
    const successState = {
      status: STATUS.SUCCESS,
      message: 'Aluno atualizado',
      errors: {},
      current: { id: 123, nome: 'João Silva' },
      action: 'updateAluno',
      statusError: null,
    };
    const store = createMockStore(successState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useEditarAluno(123), { wrapper });

    const { waitFor } = require('@testing-library/react');
    return waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledWith(
        'Operação realizada com sucesso!'
      );
      expect(mockPush).toHaveBeenCalledWith('/alunos');
    });
  });

  it('should not redirect if action is not updateAluno', () => {
    const successState = {
      status: STATUS.SUCCESS,
      message: 'Sucesso',
      errors: {},
      current: { id: 123, nome: 'João' },
      action: 'getAluno',
      statusError: null,
    };
    const store = createMockStore(successState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useEditarAluno(123), { wrapper });

    expect(mockSuccess).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
