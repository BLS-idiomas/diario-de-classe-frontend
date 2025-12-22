import { renderHook, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useStep2Form } from './useStep2Form';
import { STATUS } from '@/constants';
import {
  createManyDiasAulas,
  clearStatus,
  clearCurrent,
  clearExtra,
} from '@/store/slices/contratosSlice';

// Mock do react-redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock do slice
jest.mock('@/store/slices/contratosSlice', () => ({
  createManyDiasAulas: jest.fn(),
  clearStatus: jest.fn(),
  clearCurrent: jest.fn(),
  clearExtra: jest.fn(),
}));

describe('useStep2Form', () => {
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
      extra: null,
      action: null,
    });
  });

  describe('initialization', () => {
    it('should dispatch clearStatus on mount', () => {
      renderHook(() =>
        useStep2Form({
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
        useStep2Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      expect(mockDispatch).toHaveBeenCalledWith(clearCurrent());
    });

    it('should dispatch clearExtra on mount', () => {
      renderHook(() =>
        useStep2Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      expect(mockDispatch).toHaveBeenCalledWith(clearExtra());
    });

    it('should return submitStep2 function', () => {
      const { result } = renderHook(() =>
        useStep2Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      expect(result.current.submitStep2).toBeDefined();
      expect(typeof result.current.submitStep2).toBe('function');
    });
  });

  describe('submitStep2', () => {
    it('should transform data and dispatch createManyDiasAulas', () => {
      const { result } = renderHook(() =>
        useStep2Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        alunoId: 1,
        contratoId: 10,
        diasAulas: [
          {
            ativo: true,
            diaSemana: 1,
            quantidadeAulas: 2,
            horaInicial: '10:00',
          },
          {
            ativo: true,
            diaSemana: 3,
            quantidadeAulas: 1,
            horaInicial: '14:00',
          },
          {
            ativo: false,
            diaSemana: 5,
            quantidadeAulas: 2,
            horaInicial: '16:00',
          },
        ],
      };

      result.current.submitStep2(formData);

      expect(mockClearError).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(
        createManyDiasAulas({
          id: 10,
          data: {
            idAluno: 1,
            1: {
              quantidadeAulas: 2,
              horaInicial: '10:00',
              ativo: true,
            },
            3: {
              quantidadeAulas: 1,
              horaInicial: '14:00',
              ativo: true,
            },
            5: {
              quantidadeAulas: 2,
              horaInicial: '16:00',
              ativo: false,
            },
          },
        })
      );
    });

    it('should handle form data with only one dia aula', () => {
      const { result } = renderHook(() =>
        useStep2Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        alunoId: 2,
        contratoId: 20,
        diasAulas: [
          {
            ativo: true,
            diaSemana: 2,
            quantidadeAulas: 3,
            horaInicial: '09:00',
          },
        ],
      };

      result.current.submitStep2(formData);

      expect(mockDispatch).toHaveBeenCalledWith(
        createManyDiasAulas({
          id: 20,
          data: {
            idAluno: 2,
            2: {
              quantidadeAulas: 3,
              horaInicial: '09:00',
              ativo: true,
            },
          },
        })
      );
    });

    it('should handle empty diasAulas array', () => {
      const { result } = renderHook(() =>
        useStep2Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        alunoId: 4,
        contratoId: 40,
        diasAulas: [],
      };

      result.current.submitStep2(formData);

      expect(mockDispatch).toHaveBeenCalledWith(
        createManyDiasAulas({
          id: 40,
          data: {
            idAluno: 4,
          },
        })
      );
    });

    it('should clear errors before submitting', () => {
      const { result } = renderHook(() =>
        useStep2Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        alunoId: 5,
        contratoId: 50,
        diasAulas: [
          {
            ativo: true,
            diaSemana: 1,
            quantidadeAulas: 2,
            horaInicial: '10:00',
          },
        ],
      };

      result.current.submitStep2(formData);

      expect(mockClearError).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  describe('success handling', () => {
    it('should call successSubmit and update formData on success', async () => {
      const mockExtra = [
        { id: 1, diaSemana: 1, quantidadeAulas: 2 },
        { id: 2, diaSemana: 3, quantidadeAulas: 1 },
      ];

      useSelector.mockReturnValue({
        status: STATUS.SUCCESS,
        message: 'Dias de aula criados com sucesso',
        errors: [],
        extra: mockExtra,
        action: 'createManyDiasAulas',
      });

      renderHook(() =>
        useStep2Form({
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
        currentDiasAulas: mockExtra,
      });
    });

    it('should not call success callbacks if action is different', async () => {
      useSelector.mockReturnValue({
        status: STATUS.SUCCESS,
        message: 'Success',
        errors: [],
        extra: [{ id: 1 }],
        action: 'getContrato', // Ação diferente
      });

      renderHook(() =>
        useStep2Form({
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

    it('should handle success with empty extra', async () => {
      useSelector.mockReturnValue({
        status: STATUS.SUCCESS,
        message: 'Success',
        errors: [],
        extra: [],
        action: 'createManyDiasAulas',
      });

      renderHook(() =>
        useStep2Form({
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

      expect(result.currentDiasAulas).toEqual([]);
    });

    it('should not call callbacks if extra is null', async () => {
      useSelector.mockReturnValue({
        status: STATUS.SUCCESS,
        message: 'Success',
        errors: [],
        extra: null,
        action: 'createManyDiasAulas',
      });

      renderHook(() =>
        useStep2Form({
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
  });

  describe('error handling', () => {
    it('should call errorSubmit on failure', async () => {
      const mockErrors = [
        { field: 'diaSemana', message: 'Dia da semana inválido' },
      ];

      useSelector.mockReturnValue({
        status: STATUS.FAILED,
        message: 'Erro ao criar dias de aula',
        errors: mockErrors,
        extra: null,
        action: 'createManyDiasAulas',
      });

      renderHook(() =>
        useStep2Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      await waitFor(() => {
        expect(mockErrorSubmit).toHaveBeenCalledWith({
          message: 'Erro ao criar dias de aula',
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
        extra: null,
        action: 'createManyDiasAulas',
      });

      renderHook(() =>
        useStep2Form({
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
        extra: null,
        action: 'deleteContrato', // Ação diferente
      });

      renderHook(() =>
        useStep2Form({
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
  });

  describe('status changes', () => {
    it('should not trigger callbacks when status is LOADING', async () => {
      useSelector.mockReturnValue({
        status: STATUS.LOADING,
        message: null,
        errors: [],
        extra: null,
        action: 'createManyDiasAulas',
      });

      renderHook(() =>
        useStep2Form({
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
        extra: null,
        action: 'createManyDiasAulas',
      });

      renderHook(() =>
        useStep2Form({
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
        useStep2Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData1 = {
        alunoId: 1,
        contratoId: 10,
        diasAulas: [
          {
            ativo: true,
            diaSemana: 1,
            quantidadeAulas: 2,
            horaInicial: '10:00',
          },
        ],
      };

      const formData2 = {
        alunoId: 2,
        contratoId: 20,
        diasAulas: [
          {
            ativo: true,
            diaSemana: 3,
            quantidadeAulas: 1,
            horaInicial: '14:00',
          },
        ],
      };

      result.current.submitStep2(formData1);
      result.current.submitStep2(formData2);

      expect(mockClearError).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledTimes(5); // 3 initial (clearStatus, clearCurrent, clearExtra) + 2 submissions
    });
  });

  describe('edge cases', () => {
    it('should include all diasAulas regardless of ativo status', () => {
      const { result } = renderHook(() =>
        useStep2Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        alunoId: 1,
        contratoId: 10,
        diasAulas: [
          {
            ativo: false,
            diaSemana: 1,
            quantidadeAulas: 2,
            horaInicial: '10:00',
          },
        ],
      };

      result.current.submitStep2(formData);

      expect(mockDispatch).toHaveBeenCalledWith(
        createManyDiasAulas({
          id: 10,
          data: {
            idAluno: 1,
            1: {
              quantidadeAulas: 2,
              horaInicial: '10:00',
              ativo: false,
            },
          },
        })
      );
    });

    it('should preserve all required fields in mapped data', () => {
      const { result } = renderHook(() =>
        useStep2Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const formData = {
        alunoId: 10,
        contratoId: 100,
        diasAulas: [
          {
            ativo: true,
            diaSemana: 5,
            quantidadeAulas: 4,
            horaInicial: '08:30',
            extraField: 'should be ignored',
          },
        ],
      };

      result.current.submitStep2(formData);

      expect(mockDispatch).toHaveBeenCalledWith(
        createManyDiasAulas({
          id: 100,
          data: {
            idAluno: 10,
            5: {
              quantidadeAulas: 4,
              horaInicial: '08:30',
              ativo: true,
            },
          },
        })
      );
    });

    it('should handle large number of dias aulas', () => {
      const { result } = renderHook(() =>
        useStep2Form({
          successSubmit: mockSuccessSubmit,
          errorSubmit: mockErrorSubmit,
          clearError: mockClearError,
          setFormData: mockSetFormData,
        })
      );

      const diasAulas = [
        {
          ativo: true,
          diaSemana: 1,
          quantidadeAulas: 2,
          horaInicial: '08:00',
        },
        {
          ativo: true,
          diaSemana: 2,
          quantidadeAulas: 3,
          horaInicial: '09:00',
        },
        {
          ativo: false,
          diaSemana: 3,
          quantidadeAulas: 1,
          horaInicial: '10:00',
        },
        {
          ativo: true,
          diaSemana: 4,
          quantidadeAulas: 2,
          horaInicial: '11:00',
        },
        {
          ativo: true,
          diaSemana: 5,
          quantidadeAulas: 4,
          horaInicial: '12:00',
        },
      ];

      const formData = {
        alunoId: 1,
        contratoId: 10,
        diasAulas,
      };

      result.current.submitStep2(formData);

      // Verificar que dispatch foi chamado com createManyDiasAulas
      expect(mockDispatch).toHaveBeenCalledWith(
        createManyDiasAulas({
          id: 10,
          data: expect.objectContaining({
            idAluno: 1,
          }),
        })
      );
    });
  });
});
