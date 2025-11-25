import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useProfessores } from './useProfessores';
import { getProfessores } from '@/store/slices/professoresSlice';
import { STATUS } from '@/constants';

// Mock dos módulos
jest.mock('@/store/slices/professoresSlice', () => ({
  getProfessores: jest.fn(),
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

describe.skip('useProfessores', () => {
  let mockDispatch;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock do getProfessores action
    getProfessores.mockImplementation(() => ({
      type: 'professores/getProfessores',
    }));

    mockDispatch = jest.fn();
  });

  it('should return initial state with empty list and loading status', () => {
    const initialState = {
      list: [],
      status: STATUS.IDLE,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useProfessores(), { wrapper });

    expect(result.current).toEqual({
      professores: [],
      status: STATUS.IDLE,
      isLoading: true,
      isSuccess: false,
      isEmpty: false,
      columns: expect.any(Array),
    });
  });

  it('should dispatch getProfessores on mount', () => {
    const initialState = {
      list: [],
      status: STATUS.IDLE,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    renderHook(() => useProfessores(), { wrapper });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'professores/getProfessores',
    });
  });

  it('should return loading state correctly', () => {
    const initialState = {
      list: [],
      status: STATUS.LOADING,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useProfessores(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isEmpty).toBe(false);
  });

  it('should return success state with data correctly', () => {
    const mockProfessores = [
      { id: 1, nome: 'João', email: 'joao@test.com' },
      { id: 2, nome: 'Maria', email: 'maria@test.com' },
    ];
    const initialState = {
      list: mockProfessores,
      status: STATUS.SUCCESS,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useProfessores(), { wrapper });

    expect(result.current).toEqual({
      professores: mockProfessores,
      status: STATUS.SUCCESS,
      isLoading: false,
      isSuccess: true,
      isEmpty: false,
      columns: expect.any(Array),
    });
  });

  it('should return isEmpty true when success but no data', () => {
    const initialState = {
      list: [],
      status: STATUS.SUCCESS,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useProfessores(), { wrapper });

    expect(result.current.isEmpty).toBe(true);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.professores).toEqual([]);
  });

  it('should handle failed state correctly', () => {
    const initialState = {
      list: [],
      status: STATUS.FAILED,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useProfessores(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isEmpty).toBe(false);
    expect(result.current.status).toBe(STATUS.FAILED);
  });

  it('should only dispatch getProfessores once on mount', () => {
    const initialState = {
      list: [],
      status: STATUS.IDLE,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { rerender } = renderHook(() => useProfessores(), { wrapper });

    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Re-render não deve chamar dispatch novamente
    rerender();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should handle undefined state gracefully', () => {
    const store = createMockStore();
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useProfessores(), { wrapper });

    expect(result.current.professores).toBeUndefined();
    expect(result.current.status).toBeUndefined();
    expect(result.current.isLoading).toBe(false); // undefined é falsy, então nem IDLE nem LOADING
  });
});
