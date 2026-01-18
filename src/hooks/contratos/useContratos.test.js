import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useContratos } from './useContratos';
import { getContratos } from '@/store/slices/contratosSlice';
import { STATUS } from '@/constants';

// Mock dos módulos
jest.mock('@/store/slices/contratosSlice', () => ({
  getContratos: jest.fn(),
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
      contratos: (state = initialState, action) => state,
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

describe('useContratos', () => {
  let mockDispatch;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock do getContratos action
    getContratos.mockImplementation(() => ({
      type: 'contratos/getAll',
    }));

    // Mock do dispatch
    mockDispatch = jest.fn();
  });

  it('should return initial state', () => {
    const store = createMockStore({
      list: [],
      status: STATUS.IDLE,
      count: 0,
      action: 'getContratos',
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.contratos).toEqual([]);
    expect(result.current.status).toBe(STATUS.IDLE);
    expect(result.current.isLoading).toBe(true);
  });

  it('should dispatch getContratos on mount', () => {
    const store = createMockStore({
      list: [],
      status: STATUS.IDLE,
    });
    store.dispatch = mockDispatch;

    renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    expect(mockDispatch).toHaveBeenCalledWith(getContratos());
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should return contratos list when available', () => {
    const mockContratos = [
      { id: 1, nomeAluno: 'João Silva' },
      { id: 2, nomeAluno: 'Maria Santos' },
    ];

    const store = createMockStore({
      list: mockContratos,
      status: STATUS.SUCCESS,
      count: 2,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.contratos).toEqual(mockContratos);
    expect(result.current.status).toBe(STATUS.SUCCESS);
  });

  it('should set isLoading to true when status is IDLE', () => {
    const store = createMockStore({
      list: [],
      status: STATUS.IDLE,
      action: 'getContratos',
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should set isLoading to true when status is LOADING', () => {
    const store = createMockStore({
      list: [],
      status: STATUS.LOADING,
      action: 'getContratos',
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should set isLoading to false when status is SUCCESS', () => {
    const store = createMockStore({
      list: [],
      status: STATUS.SUCCESS,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should set isLoading to false when status is FAILED', () => {
    const store = createMockStore({
      list: [],
      status: STATUS.FAILED,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should return empty array when list is empty', () => {
    const store = createMockStore({
      list: [],
      status: STATUS.SUCCESS,
      count: 0,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.contratos).toEqual([]);
    expect(Array.isArray(result.current.contratos)).toBe(true);
    expect(result.current.contratos.length).toBe(0);
  });

  it('should handle multiple contratos', () => {
    const mockContratos = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      nomeAluno: `Aluno ${i + 1}`,
    }));

    const store = createMockStore({
      list: mockContratos,
      status: STATUS.SUCCESS,
      count: 10,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.contratos).toHaveLength(10);
    expect(result.current.contratos[0].nomeAluno).toBe('Aluno 1');
    expect(result.current.contratos[9].nomeAluno).toBe('Aluno 10');
  });

  it('should dispatch getContratos only once on mount', async () => {
    const store = createMockStore({
      list: [],
      status: STATUS.IDLE,
    });
    store.dispatch = mockDispatch;

    const { rerender } = renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Rerender não deve chamar dispatch novamente
    rerender();

    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should return all state properties', () => {
    const store = createMockStore({
      list: [],
      status: STATUS.IDLE,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toHaveProperty('contratos');
    expect(result.current).toHaveProperty('status');
    expect(result.current).toHaveProperty('isLoading');
  });

  it('should handle status changes correctly', () => {
    const initialStore = createMockStore({
      list: [],
      status: STATUS.IDLE,
      action: 'getContratos',
    });
    initialStore.dispatch = mockDispatch;

    const { result } = renderHook(() => useContratos(), {
      wrapper: createWrapper(initialStore),
    });

    expect(result.current.status).toBe(STATUS.IDLE);
    expect(result.current.isLoading).toBe(true);
  });

  it('should handle contratos with complete data structure', () => {
    const mockContrato = {
      id: 1,
      nomeAluno: 'João Silva',
      nomeProfessor: 'Maria Santos',
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      horasPorSemana: 10,
      valorHora: 50,
      observacoes: 'Teste',
    };

    const store = createMockStore({
      list: [mockContrato],
      status: STATUS.SUCCESS,
      count: 1,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.contratos[0]).toEqual(mockContrato);
    expect(result.current.contratos[0].nomeAluno).toBe('João Silva');
    expect(result.current.contratos[0].nomeProfessor).toBe('Maria Santos');
  });
});
