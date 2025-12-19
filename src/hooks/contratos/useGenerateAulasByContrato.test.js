import { renderHook, waitFor } from '@testing-library/react';
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
  let mockClearError;
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
    mockClearError = jest.fn();
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
            clearError: mockClearError,
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
            clearError: mockClearError,
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
            clearError: mockClearError,
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

      expect(mockClearError).toHaveBeenCalled();
      expect(generateAulas).toHaveBeenCalledWith({
        id: 123,
        data: {
          dataInicio: '2024-01-01',
          dataFim: '2024-12-31',
          diasAulas: formData.currentDiasAulas,
        },
      });
    });

    it('should call clearError before dispatching', () => {
      const { result } = renderHook(
        () =>
          useGenerateAulasByContrato({
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        contratoId: 456,
        contrato: {
          dataInicio: '2024-02-01',
          dataTermino: '2024-11-30',
        },
        currentDiasAulas: [],
      };

      result.current.generateAulasByContrato(formData);

      expect(mockClearError).toHaveBeenCalled();
      expect(generateAulas).toHaveBeenCalled();
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
            clearError: mockClearError,
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
            clearError: mockClearError,
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
            clearError: mockClearError,
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
            clearError: mockClearError,
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
            clearError: mockClearError,
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
            clearError: mockClearError,
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
            clearError: mockClearError,
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
            clearError: mockClearError,
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
            clearError: mockClearError,
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
});
