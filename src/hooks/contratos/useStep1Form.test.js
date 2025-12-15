import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useStep1Form } from './useStep1Form';
import {
  createContrato,
  clearStatus,
  clearCurrent,
} from '@/store/slices/contratosSlice';
import { STATUS } from '@/constants';

// Mock das actions
jest.mock('@/store/slices/contratosSlice', () => ({
  createContrato: jest.fn(),
  clearStatus: jest.fn(),
  clearCurrent: jest.fn(),
}));

jest.mock('@/constants', () => ({
  STATUS: {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    FAILED: 'failed',
  },
}));

describe('useStep1Form', () => {
  let store;
  let mockSuccessSubmit;
  let mockErrorSubmit;
  let mockClearError;
  let mockSetFormData;

  const createMockStore = (initialState = {}) => {
    const mockReducer = (
      state = {
        status: STATUS.IDLE,
        message: null,
        errors: [],
        current: null,
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
    mockSuccessSubmit = jest.fn();
    mockErrorSubmit = jest.fn();
    mockClearError = jest.fn();
    mockSetFormData = jest.fn();

    createContrato.mockReturnValue({
      type: 'contratos/createContrato',
      payload: {},
    });
    clearStatus.mockReturnValue({ type: 'contratos/clearStatus' });
    clearCurrent.mockReturnValue({ type: 'contratos/clearCurrent' });

    store = createMockStore();
  });

  describe('initialization', () => {
    it('should dispatch clearStatus and clearCurrent on mount', () => {
      renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      expect(clearStatus).toHaveBeenCalledTimes(1);
      expect(clearCurrent).toHaveBeenCalledTimes(1);
    });

    it('should return submitStep1 function', () => {
      const { result } = renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      expect(result.current).toHaveProperty('submitStep1');
      expect(typeof result.current.submitStep1).toBe('function');
    });
  });

  describe('submitStep1', () => {
    it('should call clearError', () => {
      const { result } = renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = { alunoId: 123 };
      result.current.submitStep1(formData);

      expect(mockClearError).toHaveBeenCalledTimes(1);
    });

    it('should dispatch createContrato with correct data', () => {
      const { result } = renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = { alunoId: 123 };
      result.current.submitStep1(formData);

      expect(createContrato).toHaveBeenCalledWith({
        idAluno: 123,
      });
    });

    it('should handle string alunoId', () => {
      const { result } = renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = { alunoId: '456' };
      result.current.submitStep1(formData);

      expect(createContrato).toHaveBeenCalledWith({
        idAluno: '456',
      });
    });

    it('should handle formData with extra properties', () => {
      const { result } = renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {
        alunoId: 789,
        extraProp: 'should be ignored',
        anotherProp: 123,
      };
      result.current.submitStep1(formData);

      expect(createContrato).toHaveBeenCalledWith({
        idAluno: 789,
      });
    });
  });

  describe('success handling', () => {
    it('should call setFormData and successSubmit when status is SUCCESS and current exists', async () => {
      store = createMockStore({
        status: STATUS.SUCCESS,
        action: 'createContrato',
        current: { id: 100, idAluno: 123 },
      });

      renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalledWith(expect.any(Function));
        expect(mockSuccessSubmit).toHaveBeenCalledTimes(1);
      });
    });

    it('should update formData with contratoId and contrato', async () => {
      const current = { id: 200, idAluno: 456 };
      store = createMockStore({
        status: STATUS.SUCCESS,
        action: 'createContrato',
        current,
      });

      renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
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
      const prev = { existingData: 'value' };
      const result = setFormDataCall(prev);

      expect(result).toEqual({
        existingData: 'value',
        contratoId: 200,
        contrato: current,
      });
    });

    it('should not call successSubmit if action is not createContrato', async () => {
      store = createMockStore({
        status: STATUS.SUCCESS,
        action: 'otherAction',
        current: { id: 100 },
      });

      renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSuccessSubmit).not.toHaveBeenCalled();
        expect(mockSetFormData).not.toHaveBeenCalled();
      });
    });

    it('should not call successSubmit if current is null', async () => {
      store = createMockStore({
        status: STATUS.SUCCESS,
        action: 'createContrato',
        current: null,
      });

      renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSuccessSubmit).not.toHaveBeenCalled();
        expect(mockSetFormData).not.toHaveBeenCalled();
      });
    });
  });

  describe('error handling', () => {
    it('should call errorSubmit when status is FAILED', async () => {
      const message = 'Error creating contrato';
      const errors = ['Field error 1', 'Field error 2'];

      store = createMockStore({
        status: STATUS.FAILED,
        action: 'createContrato',
        message,
        errors,
      });

      renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockErrorSubmit).toHaveBeenCalledWith({
          message,
          errors,
        });
      });
    });

    it('should not call errorSubmit if action is not createContrato', async () => {
      store = createMockStore({
        status: STATUS.FAILED,
        action: 'otherAction',
        message: 'Error message',
        errors: [],
      });

      renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockErrorSubmit).not.toHaveBeenCalled();
      });
    });

    it('should handle empty errors array', async () => {
      const message = 'Error without field errors';

      store = createMockStore({
        status: STATUS.FAILED,
        action: 'createContrato',
        message,
        errors: [],
      });

      renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockErrorSubmit).toHaveBeenCalledWith({
          message,
          errors: [],
        });
      });
    });
  });

  describe('status changes', () => {
    it('should not trigger callbacks when status is IDLE', async () => {
      store = createMockStore({
        status: STATUS.IDLE,
        action: 'createContrato',
      });

      renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSuccessSubmit).not.toHaveBeenCalled();
        expect(mockErrorSubmit).not.toHaveBeenCalled();
      });
    });

    it('should not trigger callbacks when status is LOADING', async () => {
      store = createMockStore({
        status: STATUS.LOADING,
        action: 'createContrato',
      });

      renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSuccessSubmit).not.toHaveBeenCalled();
        expect(mockErrorSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('edge cases', () => {
    it('should handle undefined alunoId', () => {
      const { result } = renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = { alunoId: undefined };
      result.current.submitStep1(formData);

      expect(createContrato).toHaveBeenCalledWith({
        idAluno: undefined,
      });
    });

    it('should handle null alunoId', () => {
      const { result } = renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = { alunoId: null };
      result.current.submitStep1(formData);

      expect(createContrato).toHaveBeenCalledWith({
        idAluno: null,
      });
    });

    it('should handle empty formData object', () => {
      const { result } = renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      const formData = {};
      result.current.submitStep1(formData);

      expect(createContrato).toHaveBeenCalledWith({
        idAluno: undefined,
      });
    });
  });

  describe('multiple submissions', () => {
    it('should handle consecutive submissions', () => {
      const { result } = renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      result.current.submitStep1({ alunoId: 1 });
      result.current.submitStep1({ alunoId: 2 });
      result.current.submitStep1({ alunoId: 3 });

      expect(createContrato).toHaveBeenCalledTimes(3);
      expect(mockClearError).toHaveBeenCalledTimes(3);
    });

    it('should clear error before each submission', () => {
      const { result } = renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      result.current.submitStep1({ alunoId: 1 });
      expect(mockClearError).toHaveBeenCalledTimes(1);

      result.current.submitStep1({ alunoId: 2 });
      expect(mockClearError).toHaveBeenCalledTimes(2);
    });
  });

  describe('callback dependencies', () => {
    it('should only call callbacks when all conditions are met', async () => {
      store = createMockStore({
        status: STATUS.SUCCESS,
        action: 'createContrato',
        current: { id: 300, idAluno: 999 },
      });

      renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalledTimes(1);
        expect(mockSuccessSubmit).toHaveBeenCalledTimes(1);
        expect(mockErrorSubmit).not.toHaveBeenCalled();
      });
    });

    it('should preserve formData structure in setFormData callback', async () => {
      const current = { id: 400, idAluno: 111, other: 'data' };
      store = createMockStore({
        status: STATUS.SUCCESS,
        action: 'createContrato',
        current,
      });

      renderHook(
        () =>
          useStep1Form({
            successSubmit: mockSuccessSubmit,
            errorSubmit: mockErrorSubmit,
            clearError: mockClearError,
            setFormData: mockSetFormData,
          }),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalled();
      });

      const setFormDataCallback = mockSetFormData.mock.calls[0][0];
      const previousFormData = {
        alunoId: 111,
        existingField: 'value',
      };
      const updatedFormData = setFormDataCallback(previousFormData);

      expect(updatedFormData).toEqual({
        alunoId: 111,
        existingField: 'value',
        contratoId: 400,
        contrato: current,
      });
    });
  });
});
