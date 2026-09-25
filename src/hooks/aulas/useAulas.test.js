import { createElement } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { mountRaw } from '@/utils/mountRaw';
import { useAulas } from './useAulas';
import { getAulas } from '@/store/slices/aulasSlice';
import { STATUS, FILTER_STORAGE_KEYS } from '@/constants';
import { useCollapsiblePanelState } from '@/hooks/useCollapsiblePanelState';
import { countAppliedFilters } from '@/utils/filterCount';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('@/store/slices/aulasSlice', () => ({
  getAulas: jest.fn(() => ({ type: 'getAulas' })),
}));

const mockDispatch = jest.fn();

beforeEach(() => {
  useDispatch.mockReturnValue(mockDispatch);
  jest.clearAllMocks();
  // Filtros são persistidos em localStorage; limpa para isolar cada teste.
  localStorage.clear();
});

// `mountRaw` (ACH-10) cuida do `flushSync`/supressão de aviso de `act`
// compartilhados entre os 7 testes que precisam observar estado pré-efeito;
// só o que varia por hook fica aqui: o `Harness` e como ler
// dataInicio/dataTermino do DOM (não de uma variável capturada por fora do
// componente, para manter o harness puro).
function mountHookRaw() {
  function Harness() {
    const { formData } = useAulas();
    return createElement(
      'div',
      { 'data-testid': 'datas' },
      JSON.stringify({
        dataInicio: formData.dataInicio,
        dataTermino: formData.dataTermino,
      })
    );
  }
  const hook = mountRaw(createElement(Harness));
  return {
    ...hook,
    getDatas() {
      const text = hook.container.querySelector(
        '[data-testid="datas"]'
      ).textContent;
      return JSON.parse(text);
    },
  };
}

describe('useAulas', () => {
  const mockSelectorState = {
    aulas: {
      list: [],
      status: STATUS.IDLE,
      action: null,
    },
  };

  describe('initialization', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('should initialize with default date range (today to 3 months later)', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-01-15T12:00:00.000-03:00'));
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      // Literais fixos (fuso local, `todayLocalDate`) — não recalculados
      // pelo mesmo algoritmo da produção, para o teste discriminar um bug
      // real de fuso/mês (ACH-08).
      expect(result.current.formData.dataInicio).toBe('2026-01-15');
      expect(result.current.formData.dataTermino).toBe('2026-04-15');
    });

    it('should return aulas and status from Redux', () => {
      const mockAulas = [
        { id: 1, dataAula: '2024-03-01', tipo: 'PADRAO' },
        { id: 2, dataAula: '2024-03-02', tipo: 'REPOSICAO' },
      ];
      useSelector.mockImplementation(cb =>
        cb({
          aulas: {
            list: mockAulas,
            status: STATUS.SUCCESS,
            action: 'getAulas',
          },
        })
      );
      const { result } = renderHook(() => useAulas());

      expect(result.current.aulas).toEqual(mockAulas);
      expect(result.current.status).toBe(STATUS.SUCCESS);
    });

    it('should initialize with empty formData values by default', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      expect(result.current.formData.tipo).toBe('');
      expect(result.current.formData.status).toBe('');
      expect(result.current.formData.idAluno).toBe('');
      expect(result.current.formData.idProfessor).toBe('');
      expect(result.current.formData.q).toBe('');
    });

    it('should initialize formData with all required fields', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      expect(result.current.formData).toHaveProperty('dataInicio');
      expect(result.current.formData).toHaveProperty('dataTermino');
      expect(result.current.formData).toHaveProperty('tipo');
      expect(result.current.formData).toHaveProperty('status');
      expect(result.current.formData).toHaveProperty('idAluno');
      expect(result.current.formData).toHaveProperty('idProfessor');
      expect(result.current.formData).toHaveProperty('q');
    });
  });

  describe('isLoading computation', () => {
    it('should return true when action is getAulas and status is IDLE', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: { list: [], status: STATUS.IDLE, action: 'getAulas' },
        })
      );
      const { result } = renderHook(() => useAulas());

      expect(result.current.isLoading).toBe(true);
    });

    it('should return true when action is getAulas and status is LOADING', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: { list: [], status: STATUS.LOADING, action: 'getAulas' },
        })
      );
      const { result } = renderHook(() => useAulas());

      expect(result.current.isLoading).toBe(true);
    });

    it('should return false when status is SUCCESS', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: { list: [], status: STATUS.SUCCESS, action: 'getAulas' },
        })
      );
      const { result } = renderHook(() => useAulas());

      expect(result.current.isLoading).toBe(false);
    });

    it('should return false when action is not getAulas', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: { list: [], status: STATUS.IDLE, action: 'other' },
        })
      );
      const { result } = renderHook(() => useAulas());

      expect(result.current.isLoading).toBe(false);
    });

    it('should return false when status is ERROR', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: { list: [], status: STATUS.ERROR, action: 'getAulas' },
        })
      );
      const { result } = renderHook(() => useAulas());

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('handleChange', () => {
    it('should update formData for regular input fields', async () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      act(() => {
        result.current.handleChange({
          target: { name: 'dataInicio', value: '2024-02-01', type: 'text' },
        });
      });

      expect(result.current.formData.dataInicio).toBe('2024-02-01');
    });

    it('should handle checkbox inputs with checked property', async () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      act(() => {
        result.current.handleChange({
          target: { name: 'someCheckbox', checked: true, type: 'checkbox' },
        });
      });

      expect(result.current.formData.someCheckbox).toBe(true);
    });

    it('should update dataTermino field', async () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      act(() => {
        result.current.handleChange({
          target: { name: 'dataTermino', value: '2024-12-31', type: 'text' },
        });
      });

      expect(result.current.formData.dataTermino).toBe('2024-12-31');
    });

    it('should update tipo field', async () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      act(() => {
        result.current.handleChange({
          target: { name: 'tipo', value: 'PADRAO', type: 'text' },
        });
      });

      expect(result.current.formData.tipo).toBe('PADRAO');
    });

    it('should update status field', async () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      act(() => {
        result.current.handleChange({
          target: { name: 'status', value: 'AGENDADA', type: 'text' },
        });
      });

      expect(result.current.formData.status).toBe('AGENDADA');
    });

    it('should update idAluno field', async () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      act(() => {
        result.current.handleChange({
          target: { name: 'idAluno', value: '123', type: 'text' },
        });
      });

      expect(result.current.formData.idAluno).toBe('123');
    });

    it('should update idProfessor field', async () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      act(() => {
        result.current.handleChange({
          target: { name: 'idProfessor', value: '456', type: 'text' },
        });
      });

      expect(result.current.formData.idProfessor).toBe('456');
    });

    it('should maintain other fields when one field is updated', async () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      act(() => {
        result.current.handleChange({
          target: { name: 'tipo', value: 'REPOSICAO', type: 'text' },
        });
      });

      expect(result.current.formData.dataInicio).toBeDefined();
      expect(result.current.formData.dataTermino).toBeDefined();
      expect(result.current.formData.status).toBe('');
    });
  });

  describe('handleSubmit', () => {
    it('should dispatch getAulas with formData', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      const testFormData = {
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
      };

      act(() => {
        result.current.handleSubmit(testFormData);
      });

      expect(mockDispatch).toHaveBeenCalledWith(getAulas(testFormData));
    });

    it('should dispatch getAulas on formData change', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      renderHook(() => useAulas());

      // Wait for useEffect to trigger after state changes
      waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled();
      });
    });

    it('should call with current formData on mount', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      renderHook(() => useAulas());

      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  describe('searchParams', () => {
    it('should update formData with search query', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      act(() => {
        result.current.searchParams('classroom search');
      });

      expect(result.current.formData.q).toBe('classroom search');
    });

    it('should be a function', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      expect(typeof result.current.searchParams).toBe('function');
    });

    it('should handle empty search query', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      act(() => {
        result.current.searchParams('');
      });

      expect(result.current.formData.q).toBe('');
    });

    it('should handle multiple searches', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      act(() => {
        result.current.searchParams('search 1');
      });

      expect(result.current.formData.q).toBe('search 1');

      act(() => {
        result.current.searchParams('search 2');
      });

      expect(result.current.formData.q).toBe('search 2');
    });
  });

  describe('return value', () => {
    it('should return all expected properties', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      expect(result.current).toHaveProperty('aulas');
      expect(result.current).toHaveProperty('status');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('searchParams');
      expect(result.current).toHaveProperty('handleSubmit');
      expect(result.current).toHaveProperty('handleChange');
      expect(result.current).toHaveProperty('formData');
    });

    it('should return handleSubmit as function', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      expect(typeof result.current.handleSubmit).toBe('function');
    });

    it('should return handleChange as function', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      expect(typeof result.current.handleChange).toBe('function');
    });

    it('should return searchParams as function', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      expect(typeof result.current.searchParams).toBe('function');
    });

    it('should return formData as object', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      expect(typeof result.current.formData).toBe('object');
      expect(result.current.formData).not.toBeNull();
    });
  });

  describe('Redux integration', () => {
    it('should use dispatch from Redux', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      renderHook(() => useAulas());

      expect(useDispatch).toHaveBeenCalled();
    });

    it('should use selector to get aulas state', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      renderHook(() => useAulas());

      expect(useSelector).toHaveBeenCalled();
    });

    it('should provide list, status, and action from Redux state', () => {
      const mockAulas = [{ id: 1, nome: 'Aula teste' }];
      useSelector.mockImplementation(cb =>
        cb({
          aulas: {
            list: mockAulas,
            status: STATUS.SUCCESS,
            action: 'getAulas',
          },
        })
      );
      const { result } = renderHook(() => useAulas());

      expect(result.current.aulas).toEqual(mockAulas);
      expect(result.current.status).toBe(STATUS.SUCCESS);
    });
  });

  describe('edge cases', () => {
    it('should handle formData with multiple changes', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      act(() => {
        result.current.handleChange({
          target: { name: 'dataInicio', value: '2024-01-15', type: 'text' },
        });
      });

      act(() => {
        result.current.handleChange({
          target: { name: 'dataTermino', value: '2024-03-15', type: 'text' },
        });
      });

      expect(result.current.formData.dataInicio).toBe('2024-01-15');
      expect(result.current.formData.dataTermino).toBe('2024-03-15');
    });

    it('should preserve formData integrity across changes', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      const initialDataInicio = result.current.formData.dataInicio;

      act(() => {
        result.current.handleChange({
          target: { name: 'dataTermino', value: '2024-09-30', type: 'text' },
        });
      });

      expect(result.current.formData.dataInicio).toBe(initialDataInicio);
      expect(result.current.formData.dataTermino).toBe('2024-09-30');
    });
  });

  describe('dataInicio/dataTermino default estável até montar (AC-001-006)', () => {
    beforeEach(() => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('paridade: dataInicio/dataTermino nascem null independente do relógio', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-30T23:59:59.000Z'));
      const hook1 = mountHookRaw();
      expect(hook1.getDatas()).toEqual({
        dataInicio: null,
        dataTermino: null,
      });
      hook1.unmount();

      jest.setSystemTime(new Date('2026-07-01T00:00:01.000Z'));
      const hook2 = mountHookRaw();
      expect(hook2.getDatas()).toEqual({
        dataInicio: null,
        dataTermino: null,
      });
      hook2.unmount();
    });

    it('preenchimento pós-montagem: datas passam a refletir o relógio real (sem filtro salvo)', async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-30T00:00:00.000-03:00'));

      const hook = mountHookRaw();
      expect(hook.getDatas()).toEqual({ dataInicio: null, dataTermino: null });
      await hook.flush();

      // Literais fixos (fuso local, `todayLocalDate`) — não recalculados
      // pelo mesmo algoritmo da produção, para o teste discriminar um bug
      // real de fuso/mês (ACH-08).
      expect(hook.getDatas()).toEqual({
        dataInicio: '2026-06-30',
        dataTermino: '2026-09-30',
      });
      hook.unmount();
    });

    it('filtro salvo não é sobrescrito pelo efeito de default', async () => {
      localStorage.setItem(
        FILTER_STORAGE_KEYS.aulas,
        JSON.stringify({ dataInicio: '2024-05-05', dataTermino: '2024-08-08' })
      );
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-30T00:00:00.000-03:00'));

      const hook = mountHookRaw();
      expect(hook.getDatas()).toEqual({
        dataInicio: '2024-05-05',
        dataTermino: '2024-08-08',
      });
      await hook.flush();
      expect(hook.getDatas()).toEqual({
        dataInicio: '2024-05-05',
        dataTermino: '2024-08-08',
      });
      hook.unmount();
    });

    it('busca dispara uma única vez por montagem, nunca com datas null (ACH-06)', async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-30T00:00:00.000-03:00'));

      const hook = mountHookRaw();
      await hook.flush();

      // Antes da correção: 2 dispatches (o primeiro com dataInicio/
      // dataTermino ainda null, descartado pelo backend como "sem filtro" —
      // tabela inteira sem paginação). Depois: 1, só com datas resolvidas.
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(getAulas).toHaveBeenCalledWith(
        expect.objectContaining({
          dataInicio: '2026-06-30',
          dataTermino: '2026-09-30',
        })
      );
      hook.unmount();
    });

    it('busca dispara uma única vez por montagem quando há filtro salvo (NOVO-05)', async () => {
      localStorage.setItem(
        FILTER_STORAGE_KEYS.aulas,
        JSON.stringify({ dataInicio: '2024-05-05', dataTermino: '2024-08-08' })
      );
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-06-30T00:00:00.000-03:00'));

      const hook = mountHookRaw();
      await hook.flush();

      // Com filtro salvo (datas já não-nulas), o efeito de preenchimento não
      // pode gerar identidade nova de `formData` — senão o efeito de busca,
      // que depende dela, dispara de novo com os mesmos parâmetros.
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(getAulas).toHaveBeenCalledWith(
        expect.objectContaining({
          dataInicio: '2024-05-05',
          dataTermino: '2024-08-08',
        })
      );
      hook.unmount();
    });
  });

  describe('appliedCount (COMP-002-004) e AC-001-013', () => {
    it('formData alterado do default: appliedCount reflete countAppliedFilters(formData, defaultFormData)', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      act(() => {
        result.current.handleChange({
          target: { name: 'tipo', value: 'PADRAO', type: 'text' },
        });
      });

      const defaultFormData = { ...result.current.formData, tipo: '' };
      expect(result.current.appliedCount).toBe(
        countAppliedFilters(result.current.formData, defaultFormData)
      );
      expect(result.current.appliedCount).toBe(1);
    });

    it('AC-001-013: handleClearFilter zera appliedCount na sequência, sem remontar', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      act(() => {
        result.current.handleChange({
          target: { name: 'tipo', value: 'PADRAO', type: 'text' },
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

  describe('AC-001-011 (não-regressão, FR-001-002): toggle() do painel não toca formData/dispatch de useAulas', () => {
    it('alternar isOpen via toggle() do hook do painel não dispara novo dispatch nem altera o formData já modificado', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));

      const { result } = renderHook(() => ({
        aulas: useAulas(),
        painel: useCollapsiblePanelState('panel_aulas_teste_ac011'),
      }));

      act(() => {
        result.current.aulas.handleChange({
          target: { name: 'tipo', value: 'PADRAO', type: 'text' },
        });
      });

      const formDataAntesDoToggle = result.current.aulas.formData;
      expect(formDataAntesDoToggle.tipo).toBe('PADRAO');

      getAulas.mockClear();
      mockDispatch.mockClear();

      act(() => {
        result.current.painel.toggle();
      });

      // Mutante: fazer toggle() chamar handleClearFilter por engano faria
      // getAulas/dispatch serem chamados de novo, com o formData resetado ao
      // default (tipo === '') — divergente do formData modificado acima.
      expect(getAulas).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(result.current.aulas.formData).toEqual(formDataAntesDoToggle);
      expect(result.current.painel.isOpen).toBe(false);
    });
  });

  describe('AC-001-008 (FR-001-012, achado B1 do qa): handleClearFilter não altera isOpen do painel', () => {
    it('painel recolhido: acionar handleClearFilter do hook real mantém isOpen inalterado', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));

      const { result } = renderHook(() => ({
        aulas: useAulas(),
        painel: useCollapsiblePanelState('panel_aulas_teste_ac008'),
      }));

      act(() => {
        result.current.painel.toggle();
      });
      expect(result.current.painel.isOpen).toBe(false);

      act(() => {
        result.current.aulas.handleClearFilter();
      });

      expect(result.current.painel.isOpen).toBe(false);
    });
  });
});
