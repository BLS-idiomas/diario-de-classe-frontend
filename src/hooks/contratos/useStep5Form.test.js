import { renderHook, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useStep5Form } from './useStep5Form';
import { STATUS } from '@/constants';
import {
  validateContrato,
  clearStatus,
  clearCurrent,
} from '@/store/slices/contratosSlice';

// Mock do react-redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock do slice
jest.mock('@/store/slices/contratosSlice', () => ({
  validateContrato: jest.fn(),
  clearStatus: jest.fn(),
  clearCurrent: jest.fn(),
}));

describe('useStep5Form', () => {
  let mockDispatch;
  let mockSuccessSubmit;
  let mockErrorSubmit;
  let mockClearError;
  let mockSetFormData;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDispatch = jest.fn();
    mockSuccessSubmit = jest.fn();
    mockErrorSubmit = jest.fn();
    mockClearError = jest.fn();
    mockSetFormData = jest.fn();

    useDispatch.mockReturnValue(mockDispatch);

    // Estado inicial padrão
    useSelector.mockReturnValue({
      status: STATUS.IDLE,
      message: null,
      errors: [],
      current: null,
      action: null,
    });
  });

  describe('initialization', () => {
    it('should dispatch clearStatus on mount', () => {
      renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      expect(mockDispatch).toHaveBeenCalledWith(clearStatus());
    });

    it('should dispatch clearCurrent on mount', () => {
      renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      expect(mockDispatch).toHaveBeenCalledWith(clearCurrent());
    });

    it('should return submitStep5 function', () => {
      const { result } = renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      expect(result.current.submitStep5).toBeDefined();
      expect(typeof result.current.submitStep5).toBe('function');
    });
  });

  describe('submitStep5', () => {
    it('should dispatch validateContrato with contratoId', () => {
      const { result } = renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: 10,
        alunoId: 1,
        professorId: 2,
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
      };

      result.current.submitStep5(formData);

      expect(mockClearError).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(validateContrato(10));
    });

    it('should clear errors before submitting', () => {
      const { result } = renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: 5,
      };

      result.current.submitStep5(formData);

      expect(mockClearError).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should handle formData with only contratoId', () => {
      const { result } = renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: 25,
      };

      result.current.submitStep5(formData);

      expect(mockDispatch).toHaveBeenCalledWith(validateContrato(25));
    });

    it('should ignore extra fields in formData', () => {
      const { result } = renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: 30,
        extraField1: 'ignored',
        extraField2: 'also ignored',
        diasAulas: [],
      };

      result.current.submitStep5(formData);

      expect(mockDispatch).toHaveBeenCalledWith(validateContrato(30));
    });
  });

  describe('success handling', () => {
    it('should call successSubmit and update formData on success', async () => {
      const mockCurrent = {
        id: 1,
        valid: true,
        alunoId: 1,
        professorId: 2,
      };

      useSelector.mockReturnValue({
        status: STATUS.SUCCESS,
        message: 'Contrato validado com sucesso',
        errors: [],
        current: mockCurrent,
        action: 'validateContrato',
      });

      renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalledWith(expect.any(Function));
      });

      await waitFor(() => {
        expect(mockSuccessSubmit).toHaveBeenCalled();
      });

      // Verificar que o callback de setFormData atualiza corretamente
      const setFormDataCallback = mockSetFormData.mock.calls[0][0];
      const prevData = { some: 'data' };
      const result = setFormDataCallback(prevData);

      expect(result).toEqual({
        some: 'data',
        contrato: mockCurrent,
      });
    });

    it('should not call success callbacks if action is different', async () => {
      useSelector.mockReturnValue({
        status: STATUS.SUCCESS,
        message: 'Success',
        errors: [],
        current: { id: 1 },
        action: 'createContrato', // Ação diferente
      });

      renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      await waitFor(() => {
        expect(mockSuccessSubmit).not.toHaveBeenCalled();
      });

      expect(mockSetFormData).not.toHaveBeenCalled();
    });

    it('should not call callbacks if current is null', async () => {
      useSelector.mockReturnValue({
        status: STATUS.SUCCESS,
        message: 'Success',
        errors: [],
        current: null,
        action: 'validateContrato',
      });

      renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      await waitFor(() => {
        expect(mockSuccessSubmit).not.toHaveBeenCalled();
      });

      expect(mockSetFormData).not.toHaveBeenCalled();
    });

    it('should handle success with empty current object', async () => {
      useSelector.mockReturnValue({
        status: STATUS.SUCCESS,
        message: 'Success',
        errors: [],
        current: {},
        action: 'validateContrato',
      });

      renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalled();
      });

      expect(mockSuccessSubmit).toHaveBeenCalled();

      const setFormDataCallback = mockSetFormData.mock.calls[0][0];
      const result = setFormDataCallback({});

      expect(result.contrato).toEqual({});
    });

    it('should handle validation success with complex current data', async () => {
      const mockCurrent = {
        id: 5,
        valid: true,
        alunoId: 10,
        professorId: 20,
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        diasAulas: [
          { diaSemana: 1, horaInicial: '08:00', quantidadeAulas: 2 },
          { diaSemana: 3, horaInicial: '10:00', quantidadeAulas: 1 },
        ],
      };

      useSelector.mockReturnValue({
        status: STATUS.SUCCESS,
        message: 'Contrato validado',
        errors: [],
        current: mockCurrent,
        action: 'validateContrato',
      });

      renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      await waitFor(() => {
        expect(mockSuccessSubmit).toHaveBeenCalled();
      });

      const setFormDataCallback = mockSetFormData.mock.calls[0][0];
      const result = setFormDataCallback({ existing: 'data' });

      expect(result.contrato).toEqual(mockCurrent);
    });
  });

  describe('error handling', () => {
    it('should call errorSubmit on failure', async () => {
      const mockErrors = [
        { field: 'contratoId', message: 'Contrato não encontrado' },
      ];

      useSelector.mockReturnValue({
        status: STATUS.FAILED,
        message: 'Erro ao validar contrato',
        errors: mockErrors,
        current: null,
        action: 'validateContrato',
      });

      renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      await waitFor(() => {
        expect(mockErrorSubmit).toHaveBeenCalledWith({
          message: 'Erro ao validar contrato',
          errors: mockErrors,
        });
      });

      expect(mockSuccessSubmit).not.toHaveBeenCalled();
    });

    it('should handle error without validation errors', async () => {
      useSelector.mockReturnValue({
        status: STATUS.FAILED,
        message: 'Erro de servidor',
        errors: [],
        current: null,
        action: 'validateContrato',
      });

      renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      await waitFor(() => {
        expect(mockErrorSubmit).toHaveBeenCalledWith({
          message: 'Erro de servidor',
          errors: [],
        });
      });
    });

    it('should not call error callbacks if action is different', async () => {
      useSelector.mockReturnValue({
        status: STATUS.FAILED,
        message: 'Error',
        errors: [],
        current: null,
        action: 'deleteContrato', // Ação diferente
      });

      renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      await waitFor(() => {
        expect(mockErrorSubmit).not.toHaveBeenCalled();
      });
    });

    it('should handle multiple validation errors', async () => {
      const mockErrors = [
        { field: 'diasAulas', message: 'Nenhum dia de aula cadastrado' },
        { field: 'dataInicio', message: 'Data de início inválida' },
        { field: 'dataTermino', message: 'Data de término inválida' },
      ];

      useSelector.mockReturnValue({
        status: STATUS.FAILED,
        message: 'Erro de validação',
        errors: mockErrors,
        current: null,
        action: 'validateContrato',
      });

      renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      await waitFor(() => {
        expect(mockErrorSubmit).toHaveBeenCalledWith({
          message: 'Erro de validação',
          errors: mockErrors,
        });
      });
    });

    it('should handle validation error with specific contract issues', async () => {
      const mockErrors = [
        {
          field: 'contrato',
          message: 'Contrato possui conflitos de horário',
        },
      ];

      useSelector.mockReturnValue({
        status: STATUS.FAILED,
        message: 'Validação falhou',
        errors: mockErrors,
        current: null,
        action: 'validateContrato',
      });

      renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      await waitFor(() => {
        expect(mockErrorSubmit).toHaveBeenCalledWith({
          message: 'Validação falhou',
          errors: mockErrors,
        });
      });
    });
  });

  describe('status changes', () => {
    it('should not trigger callbacks when status is LOADING', async () => {
      useSelector.mockReturnValue({
        status: STATUS.LOADING,
        message: null,
        errors: [],
        current: null,
        action: 'validateContrato',
      });

      renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      await waitFor(() => {
        expect(mockSuccessSubmit).not.toHaveBeenCalled();
      });

      expect(mockErrorSubmit).not.toHaveBeenCalled();
    });

    it('should not trigger callbacks when status is IDLE', async () => {
      useSelector.mockReturnValue({
        status: STATUS.IDLE,
        message: null,
        errors: [],
        current: null,
        action: 'validateContrato',
      });

      renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      await waitFor(() => {
        expect(mockSuccessSubmit).not.toHaveBeenCalled();
      });

      expect(mockErrorSubmit).not.toHaveBeenCalled();
    });
  });

  describe('multiple submissions', () => {
    it('should handle multiple sequential submissions', () => {
      const { result } = renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData1 = {
        contratoId: 10,
      };

      const formData2 = {
        contratoId: 20,
      };

      result.current.submitStep5(formData1);
      result.current.submitStep5(formData2);

      expect(mockClearError).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledTimes(4); // 2 initial (clearStatus, clearCurrent) + 2 submissions
    });

    it('should handle rapid successive validations', () => {
      const { result } = renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      for (let i = 1; i <= 5; i++) {
        result.current.submitStep5({ contratoId: i * 10 });
      }

      expect(mockClearError).toHaveBeenCalledTimes(5);
      expect(mockDispatch).toHaveBeenCalledTimes(7); // 2 initial + 5 submissions
    });
  });

  describe('edge cases', () => {
    it('should handle contratoId as string', () => {
      const { result } = renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: '100',
      };

      result.current.submitStep5(formData);

      expect(mockDispatch).toHaveBeenCalledWith(validateContrato('100'));
    });

    it('should handle contratoId as zero', () => {
      const { result } = renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: 0,
      };

      result.current.submitStep5(formData);

      expect(mockDispatch).toHaveBeenCalledWith(validateContrato(0));
    });

    it('should handle very large contratoId', () => {
      const { result } = renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: 999999999,
      };

      result.current.submitStep5(formData);

      expect(mockDispatch).toHaveBeenCalledWith(validateContrato(999999999));
    });

    it('should handle formData with nested objects', () => {
      const { result } = renderHook(() =>
        useStep5Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: 50,
        nested: {
          field: 'value',
          deep: {
            nested: 'data',
          },
        },
        array: [1, 2, 3],
      };

      result.current.submitStep5(formData);

      expect(mockDispatch).toHaveBeenCalledWith(validateContrato(50));
    });
  });
});
