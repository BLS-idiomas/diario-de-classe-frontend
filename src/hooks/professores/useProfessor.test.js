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

jest.mock('@/constants/statusError', () => ({
  STATUS_ERROR: {
    BAD_REQUEST: '400',
    NOT_FOUND: '404',
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

    // Implementação do action para facilitar asserções
    getProfessor.mockImplementation(id => ({
      type: 'professores/getProfessor',
      payload: id,
    }));

    mockDispatch = jest.fn();
  });

  it('dispatches getProfessor when id is provided', () => {
    const initialState = {
      current: {
        id: 123,
        nome: 'Teste',
        aulas: [{ id: 1 }],
        alunos: [{ id: 2 }],
      },
      message: 'ok',
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

  it('does not dispatch when id is falsy', () => {
    const initialState = {};
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useProfessor(null), { wrapper });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('returns correct shape and flags for different statuses', () => {
    const initialState = {
      current: {
        id: 5,
        nome: 'Ana',
        aulas: [{ id: 11 }],
        alunos: [{ id: 22 }],
      },
      message: 'all good',
      status: STATUS.SUCCESS,
      action: 'getProfessor',
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result: successResult } = renderHook(() => useProfessor(5), {
      wrapper,
    });

    expect(successResult.current).toEqual({
      professor: initialState.current,
      aulas: initialState.current.aulas,
      alunos: initialState.current.alunos,
      message: initialState.message,
      isLoading: false,
      isSuccess: true,
      isFailed: false,
      isNotFound: false,
    });

    // Loading state
    const loadingState = { ...initialState, status: STATUS.LOADING };
    const loadingStore = createMockStore(loadingState);
    loadingStore.dispatch = mockDispatch;
    const loadingWrapper = createWrapper(loadingStore);
    const { result: loadingResult } = renderHook(() => useProfessor(5), {
      wrapper: loadingWrapper,
    });

    expect(loadingResult.current.isLoading).toBe(true);
    expect(loadingResult.current.isSuccess).toBe(false);
    expect(loadingResult.current.isFailed).toBe(false);

    // Failed state
    const failedState = { ...initialState, status: STATUS.FAILED };
    const failedStore = createMockStore(failedState);
    failedStore.dispatch = mockDispatch;
    const failedWrapper = createWrapper(failedStore);
    const { result: failedResult } = renderHook(() => useProfessor(5), {
      wrapper: failedWrapper,
    });

    expect(failedResult.current.isFailed).toBe(true);
    expect(failedResult.current.isSuccess).toBe(false);
    expect(failedResult.current.isLoading).toBe(false);
  });

  it('returns isNotFound true when statusError is 404 and no current professor', () => {
    const initialState = {
      current: null,
      aulas: [],
      alunos: [],
      message: 'Not found',
      status: STATUS.FAILED,
      statusError: '404',
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useProfessor(999), { wrapper });

    expect(result.current.isNotFound).toBe(true);
    expect(result.current.professor).toBeNull();
  });

  it('returns isNotFound true when statusError is 400 and no current professor', () => {
    const initialState = {
      current: null,
      aulas: [],
      alunos: [],
      message: 'Bad request',
      status: STATUS.FAILED,
      statusError: '400',
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useProfessor(999), { wrapper });

    expect(result.current.isNotFound).toBe(true);
    expect(result.current.professor).toBeNull();
  });

  it('returns isNotFound false when professor exists even with error status', () => {
    const initialState = {
      current: { id: 5, nome: 'Ana' },
      aulas: [],
      alunos: [],
      message: 'Some error',
      status: STATUS.FAILED,
      statusError: '404',
    };

    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useProfessor(5), { wrapper });

    expect(result.current.isNotFound).toBe(false);
    expect(result.current.professor).toEqual({ id: 5, nome: 'Ana' });
  });
});
