import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useProfessor } from './useProfessor';
import { getProfessor } from '@/store/slices/professoresSlice';
import { STATUS } from '@/constants';

// Mock dos módulos
jest.mock('@/store/slices/professoresSlice', () => ({
  getProfessor: jest.fn(),
}));

jest.mock('@/constants', () => ({
  STATUS: {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    FAILED: 'failed',
  },
}));

// Mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      professores: (state = initialState, action) => state,
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

describe('useProfessor', () => {
  let mockDispatch;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock do getProfessor action
    getProfessor.mockImplementation(id => ({
      type: 'professores/getProfessor',
      payload: id,
    }));

    mockDispatch = jest.fn();
  });

  it('should return initial state correctly', () => {
    const initialState = {
      current: null,
      message: '',
      status: STATUS.IDLE,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useProfessor(123), { wrapper });

    expect(result.current).toEqual({
      professor: null,
      message: '',
      isLoading: true,
      isSuccess: false,
      isFailed: false,
    });
  });

  it('should dispatch getProfessor when id is provided', () => {
    const initialState = {
      current: null,
      message: '',
      status: STATUS.IDLE,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useProfessor(123), { wrapper });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'professores/getProfessor',
      payload: 123,
    });
  });

  it('should not dispatch getProfessor when id is not provided', () => {
    const initialState = {
      current: null,
      message: '',
      status: STATUS.IDLE,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useProfessor(null), { wrapper });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should not dispatch getProfessor when id is undefined', () => {
    const initialState = {
      current: null,
      message: '',
      status: STATUS.IDLE,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useProfessor(undefined), { wrapper });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should return loading state correctly', () => {
    const initialState = {
      current: null,
      message: '',
      status: STATUS.LOADING,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useProfessor(123), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isFailed).toBe(false);
  });

  it('should return success state with professor data', () => {
    const mockProfessor = {
      id: 123,
      nome: 'João',
      sobrenome: 'Silva',
      email: 'joao@test.com',
    };
    const initialState = {
      current: mockProfessor,
      message: 'Professor carregado com sucesso',
      status: STATUS.SUCCESS,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useProfessor(123), { wrapper });

    expect(result.current).toEqual({
      professor: mockProfessor,
      message: 'Professor carregado com sucesso',
      isLoading: false,
      isSuccess: true,
      isFailed: false,
    });
  });

  it('should return failed state correctly', () => {
    const initialState = {
      current: null,
      message: 'Erro ao carregar professor',
      status: STATUS.FAILED,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useProfessor(123), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isFailed).toBe(true);
    expect(result.current.message).toBe('Erro ao carregar professor');
  });

  it('should dispatch getProfessor when id changes', () => {
    const initialState = {
      current: null,
      message: '',
      status: STATUS.IDLE,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { rerender } = renderHook(({ id }) => useProfessor(id), {
      wrapper,
      initialProps: { id: 123 },
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'professores/getProfessor',
      payload: 123,
    });

    // Mudar o ID deve disparar nova busca
    rerender({ id: 456 });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'professores/getProfessor',
      payload: 456,
    });

    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('should handle string IDs correctly', () => {
    const initialState = {
      current: null,
      message: '',
      status: STATUS.IDLE,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useProfessor('abc123'), { wrapper });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'professores/getProfessor',
      payload: 'abc123',
    });
  });

  it('should handle zero as valid ID', () => {
    const initialState = {
      current: null,
      message: '',
      status: STATUS.IDLE,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useProfessor(0), { wrapper });

    expect(mockDispatch).not.toHaveBeenCalled(); // 0 é falsy
  });

  it('should only dispatch once for same ID on re-render', () => {
    const initialState = {
      current: null,
      message: '',
      status: STATUS.IDLE,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { rerender } = renderHook(() => useProfessor(123), { wrapper });

    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Re-render com mesmo ID não deve disparar nova busca
    rerender();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
