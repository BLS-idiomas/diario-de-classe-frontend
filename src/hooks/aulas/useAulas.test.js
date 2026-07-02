import { renderHook, act, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useAulas } from './useAulas';
import { getAulas } from '@/store/slices/aulasSlice';
import { STATUS } from '@/constants';

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

describe('useAulas', () => {
  const mockSelectorState = {
    aulas: {
      list: [],
      status: STATUS.IDLE,
      action: null,
    },
  };

  describe('initialization', () => {
    it('should initialize with default date range (today to 3 months later)', () => {
      useSelector.mockImplementation(cb => cb(mockSelectorState));
      const { result } = renderHook(() => useAulas());

      const today = new Date().toISOString().split('T')[0];
      expect(result.current.formData.dataInicio).toBe(today);

      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
      const expectedDate = threeMonthsLater.toISOString().split('T')[0];
      expect(result.current.formData.dataTermino).toBe(expectedDate);
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
});
