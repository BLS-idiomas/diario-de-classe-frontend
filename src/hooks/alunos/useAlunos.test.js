import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAlunos } from './useAlunos';
import { getAlunos } from '@/store/slices/alunosSlice';
import { STATUS } from '@/constants';
import { makeEmailLabel } from '@/utils/makeEmailLabel';

// Mock dos módulos
jest.mock('@/store/slices/alunosSlice', () => ({
  getAlunos: jest.fn(),
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

describe('useAlunos', () => {
  let mockDispatch;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock do getAlunos action
    getAlunos.mockImplementation(() => ({
      type: 'alunos/getAlunos',
    }));

    mockDispatch = jest.fn();
  });

  it('should return initial state with empty list and loading status', () => {
    const initialState = {
      list: [],
      status: STATUS.IDLE,
      action: 'getAlunos',
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAlunos(), { wrapper });

    expect(result.current).toEqual({
      alunos: [],
      status: STATUS.IDLE,
      isLoading: true,
      alunoOptions: [],
    });
  });

  it('should dispatch getAlunos on mount', () => {
    const initialState = {
      list: [],
      status: STATUS.IDLE,
      action: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useAlunos(), { wrapper });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'alunos/getAlunos',
    });
  });

  it('should return loading state correctly', () => {
    const initialState = {
      list: [],
      status: STATUS.LOADING,
      action: 'getAlunos',
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAlunos(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.status).toBe(STATUS.LOADING);
  });

  it('should return success state with data correctly', () => {
    const mockAlunos = [
      { id: 1, nome: 'João', sobrenome: 'Silva', email: 'joao@test.com' },
      { id: 2, nome: 'Maria', sobrenome: 'Santos', email: 'maria@test.com' },
    ];
    const initialState = {
      list: mockAlunos,
      status: STATUS.SUCCESS,
      action: 'getAlunos',
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAlunos(), { wrapper });

    const expectedOptions = mockAlunos.map(a => ({
      label: makeEmailLabel(a),
      value: a.id,
    }));

    expect(result.current).toEqual({
      alunos: mockAlunos,
      status: STATUS.SUCCESS,
      isLoading: false,
      alunoOptions: expectedOptions,
    });
  });

  it('should return isEmpty true when success but no data', () => {
    const initialState = {
      list: [],
      status: STATUS.SUCCESS,
      action: 'getAlunos',
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAlunos(), { wrapper });

    expect(result.current.alunos).toEqual([]);
    expect(result.current.status).toBe(STATUS.SUCCESS);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.alunoOptions).toEqual([]);
  });

  it('should handle failed state correctly', () => {
    const initialState = {
      list: [],
      status: STATUS.FAILED,
      action: 'getAlunos',
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAlunos(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.status).toBe(STATUS.FAILED);
  });

  it('should only dispatch getAlunos once on mount', () => {
    const initialState = {
      list: [],
      status: STATUS.IDLE,
      action: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { rerender } = renderHook(() => useAlunos(), { wrapper });

    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Re-render não deve chamar dispatch novamente
    rerender();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should handle undefined state gracefully', () => {
    const store = createMockStore();
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAlunos(), { wrapper });

    expect(result.current.alunos).toBeUndefined();
    expect(result.current.status).toBeUndefined();
    expect(result.current.isLoading).toBe(false); // undefined é falsy, então nem IDLE nem LOADING
    expect(result.current.alunoOptions).toEqual([]);
  });

  it('should return large list of alunos correctly', () => {
    const mockAlunos = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      nome: `Aluno${i + 1}`,
      sobrenome: `Sobrenome${i + 1}`,
      email: `aluno${i + 1}@test.com`,
    }));
    const initialState = {
      list: mockAlunos,
      status: STATUS.SUCCESS,
      action: 'getAlunos',
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAlunos(), { wrapper });

    expect(result.current.alunos).toHaveLength(100);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.alunoOptions).toHaveLength(100);
  });
});
