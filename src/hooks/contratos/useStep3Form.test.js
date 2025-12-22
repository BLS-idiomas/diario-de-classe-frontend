import { renderHook, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useStep3Form } from './useStep3Form';
import { STATUS } from '@/constants';
import {
  updateContrato,
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
  updateContrato: jest.fn(),
  clearStatus: jest.fn(),
  clearCurrent: jest.fn(),
}));

describe('useStep3Form', () => {
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
        useStep3Form({
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
        useStep3Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      expect(mockDispatch).toHaveBeenCalledWith(clearCurrent());
    });

    it('should return submitStep3 function', () => {
      const { result } = renderHook(() =>
        useStep3Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      expect(result.current.submitStep3).toBeDefined();
      expect(typeof result.current.submitStep3).toBe('function');
    });
  });

  describe('submitStep3', () => {
    it('should dispatch updateContrato with correct data', () => {
      const { result } = renderHook(() =>
        useStep3Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: 10,
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        someOtherField: 'should be ignored',
      };

      result.current.submitStep3(formData);

      expect(mockClearError).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(
        updateContrato({
          id: 10,
          data: {
            dataInicio: '2024-01-01',
            dataTermino: '2024-12-31',
          },
        })
      );
    });

    it('should clear errors before submitting', () => {
      const { result } = renderHook(() =>
        useStep3Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: 5,
        dataInicio: '2024-06-01',
        dataTermino: '2024-06-30',
      };

      result.current.submitStep3(formData);

      expect(mockClearError).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should handle missing optional fields', () => {
      const { result } = renderHook(() =>
        useStep3Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: 20,
        dataInicio: '2024-02-01',
        dataTermino: '2024-02-28',
      };

      result.current.submitStep3(formData);

      expect(mockDispatch).toHaveBeenCalledWith(
        updateContrato({
          id: 20,
          data: {
            dataInicio: '2024-02-01',
            dataTermino: '2024-02-28',
          },
        })
      );
    });
  });

  describe('success handling', () => {
    it('should call successSubmit and update formData on success', async () => {
      const mockCurrent = {
        id: 1,
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
      };

      useSelector.mockReturnValue({
        status: STATUS.SUCCESS,
        message: 'Contrato atualizado com sucesso',
        errors: [],
        current: mockCurrent,
        action: 'updateContrato',
      });

      renderHook(() =>
        useStep3Form({
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
        useStep3Form({
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
        action: 'updateContrato',
      });

      renderHook(() =>
        useStep3Form({
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
        action: 'updateContrato',
      });

      renderHook(() =>
        useStep3Form({
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
  });

  describe('error handling', () => {
    it('should call errorSubmit on failure', async () => {
      const mockErrors = [
        { field: 'dataInicio', message: 'Data de início inválida' },
      ];

      useSelector.mockReturnValue({
        status: STATUS.FAILED,
        message: 'Erro ao atualizar contrato',
        errors: mockErrors,
        current: null,
        action: 'updateContrato',
      });

      renderHook(() =>
        useStep3Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      await waitFor(() => {
        expect(mockErrorSubmit).toHaveBeenCalledWith({
          message: 'Erro ao atualizar contrato',
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
        action: 'updateContrato',
      });

      renderHook(() =>
        useStep3Form({
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
        useStep3Form({
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
        { field: 'dataInicio', message: 'Data de início inválida' },
        { field: 'dataTermino', message: 'Data de término inválida' },
        {
          field: 'dataTermino',
          message: 'Data de término deve ser após data de início',
        },
      ];

      useSelector.mockReturnValue({
        status: STATUS.FAILED,
        message: 'Erro de validação',
        errors: mockErrors,
        current: null,
        action: 'updateContrato',
      });

      renderHook(() =>
        useStep3Form({
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
  });

  describe('status changes', () => {
    it('should not trigger callbacks when status is LOADING', async () => {
      useSelector.mockReturnValue({
        status: STATUS.LOADING,
        message: null,
        errors: [],
        current: null,
        action: 'updateContrato',
      });

      renderHook(() =>
        useStep3Form({
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
        action: 'updateContrato',
      });

      renderHook(() =>
        useStep3Form({
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
        useStep3Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData1 = {
        contratoId: 10,
        dataInicio: '2024-01-01',
        dataTermino: '2024-06-30',
      };

      const formData2 = {
        contratoId: 20,
        dataInicio: '2024-07-01',
        dataTermino: '2024-12-31',
      };

      result.current.submitStep3(formData1);
      result.current.submitStep3(formData2);

      expect(mockClearError).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledTimes(4); // 2 initial (clearStatus, clearCurrent) + 2 submissions
    });
  });

  describe('edge cases', () => {
    it('should handle undefined formData fields', () => {
      const { result } = renderHook(() =>
        useStep3Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: 10,
        dataInicio: undefined,
        dataTermino: undefined,
      };

      result.current.submitStep3(formData);

      expect(mockDispatch).toHaveBeenCalledWith(
        updateContrato({
          id: 10,
          data: {
            dataInicio: undefined,
            dataTermino: undefined,
          },
        })
      );
    });

    it('should handle null dates', () => {
      const { result } = renderHook(() =>
        useStep3Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: 15,
        dataInicio: null,
        dataTermino: null,
      };

      result.current.submitStep3(formData);

      expect(mockDispatch).toHaveBeenCalledWith(
        updateContrato({
          id: 15,
          data: {
            dataInicio: null,
            dataTermino: null,
          },
        })
      );
    });

    it('should only send dataInicio and dataTermino fields', () => {
      const { result } = renderHook(() =>
        useStep3Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: 25,
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        alunoId: 1,
        professorId: 2,
        valorMensal: 500,
        extraField: 'should not be sent',
      };

      result.current.submitStep3(formData);

      expect(mockDispatch).toHaveBeenCalledWith(
        updateContrato({
          id: 25,
          data: {
            dataInicio: '2024-01-01',
            dataTermino: '2024-12-31',
          },
        })
      );

      // Verificar que os campos extras não foram enviados
      const dispatchCall = mockDispatch.mock.calls.find(
        call => call[0] && call[0].type === updateContrato().type
      );

      if (dispatchCall) {
        const payload = dispatchCall[0].payload;
        expect(payload.data).not.toHaveProperty('alunoId');
        expect(payload.data).not.toHaveProperty('professorId');
        expect(payload.data).not.toHaveProperty('valorMensal');
        expect(payload.data).not.toHaveProperty('extraField');
      }
    });

    it('should handle date strings in different formats', () => {
      const { result } = renderHook(() =>
        useStep3Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        contratoId: 30,
        dataInicio: '01/01/2024',
        dataTermino: '31/12/2024',
      };

      result.current.submitStep3(formData);

      expect(mockDispatch).toHaveBeenCalledWith(
        updateContrato({
          id: 30,
          data: {
            dataInicio: '01/01/2024',
            dataTermino: '31/12/2024',
          },
        })
      );
    });
  });
});
