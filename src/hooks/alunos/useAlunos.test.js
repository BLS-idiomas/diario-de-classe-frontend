import { act, renderHook } from '@testing-library/react';
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

const mockRouterReplace = jest.fn();
let mockSearchParamsValue = '';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ replace: mockRouterReplace })),
  usePathname: jest.fn(() => '/alunos'),
  useSearchParams: jest.fn(() => new URLSearchParams(mockSearchParamsValue)),
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

    mockSearchParamsValue = '';

    // Mock do getAlunos action
    getAlunos.mockImplementation(query => ({
      type: 'alunos/getAlunos',
      payload: query,
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
      action: 'getAlunos',
      isLoading: true,
      alunoOptions: [],
      searchParams: expect.any(Function),
      initialValue: '',
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

    expect(mockDispatch).toHaveBeenCalledWith(getAlunos(null));
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
      action: 'getAlunos',
      isLoading: false,
      alunoOptions: expectedOptions,
      searchParams: expect.any(Function),
      initialValue: '',
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

    // Re-render sem mudança no `q` da URL não deve disparar um novo dispatch.
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

  it('should return searchParams function', () => {
    const initialState = {
      list: [],
      status: STATUS.IDLE,
      action: 'getAlunos',
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAlunos(), { wrapper });

    expect(result.current.searchParams).toBeDefined();
    expect(typeof result.current.searchParams).toBe('function');
  });

  it('should read q from the URL on mount and dispatch getAlunos with it', () => {
    mockSearchParamsValue = 'q=termo-inicial';

    const initialState = {
      list: [],
      status: STATUS.IDLE,
      action: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result } = renderHook(() => useAlunos(), { wrapper });

    expect(getAlunos).toHaveBeenCalledWith('termo-inicial');
    expect(result.current.initialValue).toBe('termo-inicial');
  });

  describe('escrita da URL (debounced)', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      act(() => {
        jest.runOnlyPendingTimers();
      });
      jest.useRealTimers();
    });

    it('should NOT call router.replace nor dispatch synchronously when searchParams is called', () => {
      const initialState = {
        list: [],
        status: STATUS.IDLE,
        action: 'getAlunos',
      };
      const store = createMockStore(initialState);
      store.dispatch = mockDispatch;

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useAlunos(), { wrapper });

      mockDispatch.mockClear();

      act(() => {
        result.current.searchParams('termo');
      });

      expect(mockRouterReplace).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should update the URL via router.replace after the debounce delay when searchParams is called with a value', () => {
      const initialState = {
        list: [],
        status: STATUS.IDLE,
        action: 'getAlunos',
      };
      const store = createMockStore(initialState);
      store.dispatch = mockDispatch;

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useAlunos(), { wrapper });

      act(() => {
        result.current.searchParams('termo');
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(mockRouterReplace).toHaveBeenCalledWith('/alunos?q=termo', {
        scroll: false,
      });
    });

    it('should remove q from the URL (without leaving a dangling ?q=) when searchParams is called with an empty value', () => {
      mockSearchParamsValue = 'q=valor-antigo';

      const initialState = {
        list: [],
        status: STATUS.IDLE,
        action: 'getAlunos',
      };
      const store = createMockStore(initialState);
      store.dispatch = mockDispatch;

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useAlunos(), { wrapper });

      act(() => {
        result.current.searchParams('');
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(mockRouterReplace).toHaveBeenCalledWith('/alunos', {
        scroll: false,
      });
    });

    it('should debounce successive calls to searchParams, calling router.replace only once with the last value', () => {
      const initialState = {
        list: [],
        status: STATUS.IDLE,
        action: 'getAlunos',
      };
      const store = createMockStore(initialState);
      store.dispatch = mockDispatch;

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useAlunos(), { wrapper });

      act(() => {
        result.current.searchParams('t');
        jest.advanceTimersByTime(100);
        result.current.searchParams('te');
        jest.advanceTimersByTime(100);
        result.current.searchParams('term');
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(mockRouterReplace).toHaveBeenCalledTimes(1);
      expect(mockRouterReplace).toHaveBeenCalledWith('/alunos?q=term', {
        scroll: false,
      });
    });
  });

  it('should dispatch a new getAlunos when the `q` value read from the URL changes without a remount', () => {
    // Prova do bug do A1: hoje (código antigo) o fetch só era disparado pelo
    // handler `searchParams` — uma mudança na URL "por fora" (navegação sem
    // remount, refresh do valor de useSearchParams) não disparava refetch
    // nenhum, mesmo com o campo de busca sincronizando para o novo valor.
    mockSearchParamsValue = 'q=ana';

    const initialState = {
      list: [],
      status: STATUS.IDLE,
      action: null,
    };
    const store = createMockStore(initialState);
    store.dispatch = mockDispatch;

    const wrapper = createWrapper(store);
    const { result, rerender } = renderHook(() => useAlunos(), { wrapper });

    expect(getAlunos).toHaveBeenCalledWith('ana');
    expect(result.current.initialValue).toBe('ana');

    mockDispatch.mockClear();
    getAlunos.mockClear();

    // Simula a URL perdendo o `q` sem remount do componente (ex.: navegação
    // que reseta a query string) — useSearchParams passa a retornar vazio.
    mockSearchParamsValue = '';
    rerender();

    expect(getAlunos).toHaveBeenCalledWith(null);
    expect(mockDispatch).toHaveBeenCalledWith(getAlunos(null));
    expect(result.current.initialValue).toBe('');
  });
});
