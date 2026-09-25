import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useContratos } from './useContratos';
import { getContratos } from '@/store/slices/contratosSlice';
import { STATUS } from '@/constants';
import { useCollapsiblePanelState } from '@/hooks/useCollapsiblePanelState';
import { countAppliedFilters } from '@/utils/filterCount';

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
  FILTER_STORAGE_KEYS: {
    aulas: 'filters_aulas',
    contratos: 'filters_contratos',
    dashboard: 'filters_dashboard',
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
    // Filtros são persistidos em localStorage; limpa para isolar cada teste.
    localStorage.clear();

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
    expect(result.current.searchParams).toBeDefined();
    expect(typeof result.current.searchParams).toBe('function');
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

  it('expõe action do state, no mesmo contrato de useAlunos/useProfessores (achado convergente de code-reviewer/product-designer, TASK-002-007)', () => {
    const store = createMockStore({
      list: [],
      status: STATUS.FAILED,
      action: 'getContratos',
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.action).toBe('getContratos');
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

  it('should return searchParams function', () => {
    const store = createMockStore({
      list: [],
      status: STATUS.IDLE,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.searchParams).toBeDefined();
    expect(typeof result.current.searchParams).toBe('function');
  });

  it('should dispatch getContratos with query when searchParams is called', () => {
    const store = createMockStore({
      list: [],
      status: STATUS.IDLE,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContratos(), {
      wrapper: createWrapper(store),
    });

    result.current.searchParams('contrato search');

    expect(mockDispatch).toHaveBeenCalledWith(
      getContratos({ q: 'contrato search' })
    );
  });

  describe('appliedCount (COMP-002-004) e AC-001-013 — cenário irmão (achado B1 do qa)', () => {
    it('formData alterado do default: appliedCount reflete countAppliedFilters(formData, defaultFormData)', () => {
      const store = createMockStore({ list: [], status: STATUS.IDLE });
      store.dispatch = mockDispatch;

      const { result } = renderHook(() => useContratos(), {
        wrapper: createWrapper(store),
      });

      act(() => {
        result.current.handleChange({
          target: { name: 'idioma', value: 'INGLES', type: 'text' },
        });
      });

      const defaultFormData = { ...result.current.formData, idioma: '' };
      expect(result.current.appliedCount).toBe(
        countAppliedFilters(result.current.formData, defaultFormData)
      );
      expect(result.current.appliedCount).toBe(1);
    });

    it('AC-001-013: handleClearFilter zera appliedCount na sequência, sem remontar', () => {
      const store = createMockStore({ list: [], status: STATUS.IDLE });
      store.dispatch = mockDispatch;

      const { result } = renderHook(() => useContratos(), {
        wrapper: createWrapper(store),
      });

      act(() => {
        result.current.handleChange({
          target: { name: 'idioma', value: 'INGLES', type: 'text' },
        });
      });
      act(() => {
        result.current.handleChange({
          target: { name: 'idAluno', value: '123', type: 'text' },
        });
      });

      expect(result.current.appliedCount).toBe(2);

      act(() => {
        result.current.handleClearFilter();
      });

      expect(result.current.appliedCount).toBe(0);
    });
  });

  describe('AC-001-011 (não-regressão, FR-001-002, cenário irmão): toggle() do painel não toca formData/dispatch de useContratos', () => {
    it('alternar isOpen via toggle() do hook do painel não dispara novo dispatch nem altera o formData já modificado', () => {
      const store = createMockStore({ list: [], status: STATUS.IDLE });
      store.dispatch = mockDispatch;

      const { result } = renderHook(
        () => ({
          contratos: useContratos(),
          painel: useCollapsiblePanelState('panel_contratos_teste_ac011'),
        }),
        { wrapper: createWrapper(store) }
      );

      act(() => {
        result.current.contratos.handleChange({
          target: { name: 'idioma', value: 'INGLES', type: 'text' },
        });
      });

      const formDataAntesDoToggle = result.current.contratos.formData;
      expect(formDataAntesDoToggle.idioma).toBe('INGLES');

      getContratos.mockClear();
      mockDispatch.mockClear();

      act(() => {
        result.current.painel.toggle();
      });

      // Mutante: fazer toggle() chamar handleClearFilter por engano faria
      // getContratos/dispatch serem chamados de novo, com o formData
      // resetado ao default (idioma === '') — divergente do modificado acima.
      expect(getContratos).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(result.current.contratos.formData).toEqual(formDataAntesDoToggle);
      expect(result.current.painel.isOpen).toBe(false);
    });
  });

  describe('AC-001-008 (FR-001-012, achado B1 do qa, cenário irmão): handleClearFilter não altera isOpen do painel', () => {
    it('painel recolhido: acionar handleClearFilter do hook real mantém isOpen inalterado', () => {
      const store = createMockStore({ list: [], status: STATUS.IDLE });
      store.dispatch = mockDispatch;

      const { result } = renderHook(
        () => ({
          contratos: useContratos(),
          painel: useCollapsiblePanelState('panel_contratos_teste_ac008'),
        }),
        { wrapper: createWrapper(store) }
      );

      act(() => {
        result.current.painel.toggle();
      });
      expect(result.current.painel.isOpen).toBe(false);

      act(() => {
        result.current.contratos.handleClearFilter();
      });

      expect(result.current.painel.isOpen).toBe(false);
    });
  });
});
