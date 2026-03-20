import { renderHook, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useGenerateAulasByContrato } from './useGenerateAulasByContrato';
import {
  generateAulas,
  clearStatus,
  clearCurrent,
  clearExtra,
} from '@/store/slices/contratosSlice';
import { STATUS } from '@/constants';

// Mock das actions
jest.mock('@/store/slices/contratosSlice', () => ({
  generateAulas: jest.fn(),
  clearStatus: jest.fn(),
  clearCurrent: jest.fn(),
  clearExtra: jest.fn(),
}));

jest.mock('@/constants', () => ({
  STATUS: {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    FAILED: 'failed',
  },
}));

describe('useGenerateAulasByContrato', () => {
  let store;
  let mockErrorSubmit;
  let mockSetFormData;

  const createMockStore = (initialState = {}) => {
    const mockReducer = (
      state = {
        status: STATUS.IDLE,
        message: null,
        errors: [],
        extra: null,
        action: null,
        ...initialState,
      }
    ) => state;

    return configureStore({
      reducer: {
        contratos: mockReducer,
      },
    });
  };

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockErrorSubmit = jest.fn();
    mockSetFormData = jest.fn();

    generateAulas.mockReturnValue({
      type: 'contratos/generateAulas',
      payload: {},
    });
    clearStatus.mockReturnValue({ type: 'contratos/clearStatus' });
    clearCurrent.mockReturnValue({ type: 'contratos/clearCurrent' });
    clearExtra.mockReturnValue({ type: 'contratos/clearExtra' });

    store = createMockStore();
  });

  describe('initialization', () => {
    it('should dispatch clearStatus, clearCurrent and clearExtra on mount', () => {
      renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      expect(clearStatus).toHaveBeenCalled();
      expect(clearCurrent).toHaveBeenCalled();
      expect(clearExtra).toHaveBeenCalled();
    });

    it('should return generateAulasByContrato function', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      expect(result.current.generateAulasByContrato).toBeDefined();
      expect(typeof result.current.generateAulasByContrato).toBe('function');
    });
  });

  describe('generateAulasByContrato', () => {
    it('should dispatch generateAulas with correct data', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        contratoId: 123,
        contrato: {
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        },
        currentDiasAulas: [
          { diaSemana: 'SEGUNDA', horaInicial: '09:00', horaFinal: '10:00' },
          { diaSemana: 'QUARTA', horaInicial: '14:00', horaFinal: '15:00' },
        ],
      };

      result.current.generateAulasByContrato(formData);

      expect(generateAulas).toHaveBeenCalledWith({
        id: 123,
        data: {
          dataInicio: '2024-01-01',
          dataFim: '2024-12-31',
          diasAulas: formData.currentDiasAulas,
        },
      });
    });
  });

  describe('status handling', () => {
    it('should update formData with aulas on success', async () => {
      const mockAulas = [
        {
          id: 1,
          dataAula: '2024-01-15',
          horaInicial: '09:00',
          horaFinal: '10:00',
        },
        {
          id: 2,
          dataAula: '2024-01-17',
          horaInicial: '14:00',
          horaFinal: '15:00',
        },
      ];

      store = createMockStore({
        status: STATUS.SUCCESS,
        action: 'generateAulas',
        extra: { aulas: mockAulas },
      });

      renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalled();
      });

      const setFormDataCall = mockSetFormData.mock.calls[0][0];
      const updatedData = setFormDataCall({ aulas: [] });

      expect(updatedData.aulas).toEqual(mockAulas);
    });

    it('should handle aulas without id by adding index-based id', async () => {
      const mockAulas = [
        { dataAula: '2024-01-15', horaInicial: '09:00', horaFinal: '10:00' },
        { dataAula: '2024-01-17', horaInicial: '14:00', horaFinal: '15:00' },
      ];

      store = createMockStore({
        status: STATUS.SUCCESS,
        action: 'generateAulas',
        extra: { aulas: mockAulas },
      });

      renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalled();
      });

      const setFormDataCall = mockSetFormData.mock.calls[0][0];
      const updatedData = setFormDataCall({ aulas: [] });

      expect(updatedData.aulas[0].id).toBe(1);
      expect(updatedData.aulas[1].id).toBe(2);
    });

    it('should call errorSubmit on failed status', async () => {
      const mockMessage = 'Erro ao gerar aulas';
      const mockErrors = [{ field: 'diasAulas', message: 'Campo obrigatório' }];

      store = createMockStore({
        status: STATUS.FAILED,
        action: 'generateAulas',
        message: mockMessage,
        errors: mockErrors,
      });

      renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockErrorSubmit).toHaveBeenCalledWith({
          message: mockMessage,
          errors: mockErrors,
        });
      });
    });

    it('should not update formData if status is not SUCCESS', async () => {
      store = createMockStore({
        status: STATUS.LOADING,
        action: 'generateAulas',
        extra: { aulas: [] },
      });

      renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSetFormData).not.toHaveBeenCalled();
      });
    });

    it('should not update formData if action is not generateAulas', async () => {
      store = createMockStore({
        status: STATUS.SUCCESS,
        action: 'createContrato',
        extra: { aulas: [] },
      });

      renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSetFormData).not.toHaveBeenCalled();
      });
    });

    it('should handle empty extra.aulas array', async () => {
      store = createMockStore({
        status: STATUS.SUCCESS,
        action: 'generateAulas',
        extra: { aulas: [] },
      });

      renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalled();
      });

      const setFormDataCall = mockSetFormData.mock.calls[0][0];
      const updatedData = setFormDataCall({ aulas: [] });

      expect(updatedData.aulas).toEqual([]);
    });

    it('should handle missing extra.aulas', async () => {
      store = createMockStore({
        status: STATUS.SUCCESS,
        action: 'generateAulas',
        extra: {},
      });

      renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalled();
      });

      const setFormDataCall = mockSetFormData.mock.calls[0][0];
      const updatedData = setFormDataCall({ aulas: [] });

      expect(updatedData.aulas).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('should handle formData without contrato object', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        contratoId: 789,
        currentDiasAulas: [],
      };

      result.current.generateAulasByContrato(formData);

      expect(generateAulas).toHaveBeenCalledWith({
        id: 789,
        data: {
          dataInicio: undefined,
          dataFim: undefined,
          diasAulas: [],
        },
      });
    });

    it('should handle formData with empty currentDiasAulas', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        contratoId: 100,
        contrato: {
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        },
        currentDiasAulas: [],
      };

      result.current.generateAulasByContrato(formData);

      expect(generateAulas).toHaveBeenCalledWith({
        id: 100,
        data: {
          dataInicio: '2024-01-01',
          dataFim: '2024-12-31',
          diasAulas: [],
        },
      });
    });
  });

  describe('Dias Aulas Filtering and Formatting', () => {
    it('should filter out dias with ativo=false', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        contratoId: 123,
        contrato: {
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        },
        currentDiasAulas: [
          {
            diaSemana: 'SEGUNDA',
            ativo: true,
            horaInicial: '09:00',
            horaFinal: '10:00',
            quantidadeAulas: 1,
            duracaoAula: 40,
          },
          {
            diaSemana: 'TERCA',
            ativo: false,
            horaInicial: '14:00',
            horaFinal: '15:00',
            quantidadeAulas: 1,
            duracaoAula: 60,
          },
          {
            diaSemana: 'QUARTA',
            ativo: true,
            horaInicial: '10:00',
            horaFinal: '11:00',
            quantidadeAulas: 1,
            duracaoAula: 60,
          },
        ],
      };

      result.current.generateAulasByContrato(formData);

      const callArgs = generateAulas.mock.calls[0][0];
      expect(callArgs.data.diasAulas).toHaveLength(2);
      expect(callArgs.data.diasAulas[0].diaSemana).toBe('SEGUNDA');
      expect(callArgs.data.diasAulas[1].diaSemana).toBe('QUARTA');
    });

    it('should parse duracaoAula as integer', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        contratoId: 123,
        contrato: {
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        },
        currentDiasAulas: [
          {
            diaSemana: 'SEGUNDA',
            ativo: true,
            horaInicial: '09:00',
            horaFinal: '10:00',
            quantidadeAulas: 1,
            duracaoAula: '40',
          },
        ],
      };

      result.current.generateAulasByContrato(formData);

      const callArgs = generateAulas.mock.calls[0][0];
      const duracaoAula = callArgs.data.diasAulas[0].duracaoAula;
      expect(typeof duracaoAula).toBe('number');
      expect(Number.isInteger(duracaoAula)).toBe(true);
      expect(duracaoAula).toBe(40);
    });

    it('should preserve all required fields in diasAulas', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        contratoId: 123,
        contrato: {
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        },
        currentDiasAulas: [
          {
            diaSemana: 'SEGUNDA',
            ativo: true,
            horaInicial: '09:00',
            horaFinal: '10:00',
            quantidadeAulas: 2,
            duracaoAula: 40,
          },
        ],
      };

      result.current.generateAulasByContrato(formData);

      const callArgs = generateAulas.mock.calls[0][0];
      const dia = callArgs.data.diasAulas[0];

      expect(dia).toHaveProperty('diaSemana', 'SEGUNDA');
      expect(dia).toHaveProperty('quantidadeAulas', 2);
      expect(dia).toHaveProperty('duracaoAula', 40);
      expect(dia).toHaveProperty('horaInicial', '09:00');
      expect(dia).toHaveProperty('horaFinal', '10:00');
    });

    it('should calculate duracaoAula when not provided', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        contratoId: 123,
        contrato: {
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        },
        currentDiasAulas: [
          {
            diaSemana: 'SEGUNDA',
            ativo: true,
            horaInicial: '09:00',
            horaFinal: '09:40',
            quantidadeAulas: 1,
            // duracaoAula not provided
          },
        ],
      };

      result.current.generateAulasByContrato(formData);

      const callArgs = generateAulas.mock.calls[0][0];
      const dia = callArgs.data.diasAulas[0];

      expect(dia.duracaoAula).toBe(40);
    });
  });

  describe('IsSubmitting State', () => {
    it('should have isSubmitting as false in initial state', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      expect(result.current.isSubmitting).toBe(false);
    });

    it('should return isSubmitting property', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      expect(result.current).toHaveProperty('isSubmitting');
      expect(typeof result.current.isSubmitting).toBe('boolean');
    });
  });

  describe('Multiple Dias Aulas Handling', () => {
    it('should handle multiple active dias correctly', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        contratoId: 123,
        contrato: {
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        },
        currentDiasAulas: [
          {
            diaSemana: 'SEGUNDA',
            ativo: true,
            horaInicial: '09:00',
            horaFinal: '10:00',
            quantidadeAulas: 1,
            duracaoAula: 40,
          },
          {
            diaSemana: 'QUARTA',
            ativo: true,
            horaInicial: '14:00',
            horaFinal: '15:00',
            quantidadeAulas: 2,
            duracaoAula: 60,
          },
          {
            diaSemana: 'SEXTA',
            ativo: true,
            horaInicial: '19:00',
            horaFinal: '20:00',
            quantidadeAulas: 1,
            duracaoAula: 40,
          },
        ],
      };

      result.current.generateAulasByContrato(formData);

      const callArgs = generateAulas.mock.calls[0][0];
      expect(callArgs.data.diasAulas).toHaveLength(3);
      expect(callArgs.data.diasAulas.map(d => d.diaSemana)).toEqual([
        'SEGUNDA',
        'QUARTA',
        'SEXTA',
      ]);
    });

    it('should preserve order of dias aulas', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,

            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        contratoId: 123,
        contrato: {
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        },
        currentDiasAulas: [
          {
            diaSemana: 'SEGUNDA',
            ativo: true,
            horaInicial: '09:00',
            horaFinal: '10:00',
            quantidadeAulas: 1,
            duracaoAula: 40,
          },
          {
            diaSemana: 'TERCA',
            ativo: false,
            horaInicial: '10:00',
            horaFinal: '11:00',
            quantidadeAulas: 1,
            duracaoAula: 60,
          },
          {
            diaSemana: 'QUARTA',
            ativo: true,
            horaInicial: '14:00',
            horaFinal: '15:00',
            quantidadeAulas: 1,
            duracaoAula: 60,
          },
        ],
      };

      result.current.generateAulasByContrato(formData);

      const callArgs = generateAulas.mock.calls[0][0];
      expect(callArgs.data.diasAulas[0].diaSemana).toBe('SEGUNDA');
      expect(callArgs.data.diasAulas[1].diaSemana).toBe('QUARTA');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should set isSubmitting to false after generation completes', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        contratoId: 100,
        contrato: {
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        },
        currentDiasAulas: [],
      };

      act(() => {
        result.current.generateAulasByContrato(formData);
      });

      // After action completes
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should handle diasAulas with only quantidadeAulas property', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        contratoId: 123,
        contrato: {
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        },
        currentDiasAulas: [
          {
            diaSemana: 'SEGUNDA',
            ativo: true,
            quantidadeAulas: 3,
            duracaoAula: 40,
          },
        ],
      };

      act(() => {
        result.current.generateAulasByContrato(formData);
      });

      const callArgs = generateAulas.mock.calls[0][0];
      expect(callArgs.data.diasAulas[0].quantidadeAulas).toBe(3);
    });

    it('should handle formData with diasAulas property instead of currentDiasAulas', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        contratoId: 123,
        contrato: {
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        },
        diasAulas: [
          {
            diaSemana: 'SEGUNDA',
            ativo: true,
            horaInicial: '09:00',
            horaFinal: '10:00',
            quantidadeAulas: 1,
            duracaoAula: 40,
          },
        ],
      };

      result.current.generateAulasByContrato(formData);

      const callArgs = generateAulas.mock.calls[0][0];
      expect(callArgs.data.diasAulas).toHaveLength(1);
      expect(callArgs.data.diasAulas[0].diaSemana).toBe('SEGUNDA');
    });

    it('should handle error with multiple errors array', async () => {
      const mockErrors = [
        { field: 'diasAulas', message: 'Campo obrigatório' },
        { field: 'dataInicio', message: 'Data invalida' },
        { field: 'dataFim', message: 'Data invalida' },
      ];

      store = createMockStore({
        status: STATUS.FAILED,
        action: 'generateAulas',
        message: 'Erro de validação',
        errors: mockErrors,
      });

      renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockErrorSubmit).toHaveBeenCalledWith({
          message: 'Erro de validação',
          errors: mockErrors,
        });
      });
    });

    it('should not process if extra is null on success', async () => {
      store = createMockStore({
        status: STATUS.SUCCESS,
        action: 'generateAulas',
        extra: null,
      });

      renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        // Should still call setFormData even with null extra
        // but with empty aulas
        expect(mockSetFormData).not.toHaveBeenCalled();
      });
    });

    it('should handle SUCCESS status without action being generateAulas', async () => {
      store = createMockStore({
        status: STATUS.SUCCESS,
        action: 'otherAction',
        extra: { aulas: [{ id: 1, dataAula: '2024-01-15' }] },
      });

      renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSetFormData).not.toHaveBeenCalled();
      });
    });
  });

  describe('Complex Data Scenarios', () => {
    it('should handle aulas with mixed id patterns', async () => {
      const mockAulas = [
        { id: 1, dataAula: '2024-01-15', horaInicial: '09:00' },
        { dataAula: '2024-01-17', horaInicial: '14:00' },
        { id: 'custom-id', dataAula: '2024-01-19', horaInicial: '10:00' },
      ];

      store = createMockStore({
        status: STATUS.SUCCESS,
        action: 'generateAulas',
        extra: { aulas: mockAulas },
      });

      renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalled();
      });

      const setFormDataCall = mockSetFormData.mock.calls[0][0];
      const updatedData = setFormDataCall({ aulas: [] });

      expect(updatedData.aulas[0].id).toBe(1);
      expect(updatedData.aulas[1].id).toBe(2);
      expect(updatedData.aulas[2].id).toBe('custom-id');
    });

    it('should handle large number of dias correctly', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const largeDiasAulas = Array.from({ length: 30 }, (_, i) => ({
        diaSemana: [
          'SEGUNDA',
          'TERCA',
          'QUARTA',
          'QUINTA',
          'SEXTA',
          'SABADO',
          'DOMINGO',
        ][i % 7],
        ativo: true,
        horaInicial: '09:00',
        horaFinal: '10:00',
        quantidadeAulas: 1,
        duracaoAula: 40,
      }));

      const formData = {
        contratoId: 123,
        contrato: {
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        },
        currentDiasAulas: largeDiasAulas,
      };

      result.current.generateAulasByContrato(formData);

      const callArgs = generateAulas.mock.calls[0][0];
      expect(callArgs.data.diasAulas.length).toBe(30);
    });

    it('should preserve duracaoAula types during generation', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        contratoId: 123,
        contrato: {
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
        },
        currentDiasAulas: [
          {
            diaSemana: 'SEGUNDA',
            ativo: true,
            horaInicial: '09:00',
            horaFinal: '10:00',
            quantidadeAulas: 1,
            duracaoAula: '40',
          },
          {
            diaSemana: 'QUARTA',
            ativo: true,
            horaInicial: '14:00',
            horaFinal: '15:00',
            quantidadeAulas: 1,
            duracaoAula: 60,
          },
        ],
      };

      result.current.generateAulasByContrato(formData);

      const callArgs = generateAulas.mock.calls[0][0];
      expect(typeof callArgs.data.diasAulas[0].duracaoAula).toBe('number');
      expect(typeof callArgs.data.diasAulas[1].duracaoAula).toBe('number');
    });
  });

  describe('State Management', () => {
    it('should dispatch all clear actions on component mount', () => {
      renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      expect(clearStatus).toHaveBeenCalled();
      expect(clearCurrent).toHaveBeenCalled();
      expect(clearExtra).toHaveBeenCalled();
    });

    it('should have generateAulasByContrato as function in hook result', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      expect(typeof result.current.generateAulasByContrato).toBe('function');
    });

    it('should have isSubmitting boolean in hook result', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      expect(typeof result.current.isSubmitting).toBe('boolean');
      expect([true, false]).toContain(result.current.isSubmitting);
    });
  });
});
