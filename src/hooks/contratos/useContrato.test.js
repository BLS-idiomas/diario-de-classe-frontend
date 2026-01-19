import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useContrato } from './useContrato';
import { getContrato } from '@/store/slices/contratosSlice';
import { getAluno } from '@/store/slices/alunosSlice';
import { STATUS } from '@/constants';
import { STATUS_ERROR } from '@/constants/statusError';

// Mock dos módulos
jest.mock('@/store/slices/contratosSlice', () => ({
  getContrato: jest.fn(),
}));

jest.mock('@/store/slices/alunosSlice', () => ({
  getAluno: jest.fn(),
}));

jest.mock('@/constants', () => ({
  STATUS: {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    FAILED: 'failed',
  },
}));

jest.mock('@/constants/statusError', () => ({
  STATUS_ERROR: {
    BAD_REQUEST: '400',
    NOT_FOUND: '404',
    INTERNAL_SERVER_ERROR: '500',
  },
}));

// Mock store
const createMockStore = (contratosState = {}, alunosState = {}) => {
  return configureStore({
    reducer: {
      contratos: (state = contratosState, action) => state,
      alunos: (state = { current: null, ...alunosState }, action) => state,
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

describe('useContrato', () => {
  let mockDispatch;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock do getContrato action
    getContrato.mockImplementation(id => ({
      type: 'contratos/getContrato',
      payload: id,
    }));

    // Mock do getAluno action
    getAluno.mockImplementation(id => ({
      type: 'alunos/getAluno',
      payload: id,
    }));

    mockDispatch = jest.fn();
  });

  it('dispatches getContrato when id is provided', () => {
    const store = createMockStore({
      current: null,
      message: null,
      status: STATUS.IDLE,
      statusError: null,
    });
    store.dispatch = mockDispatch;

    renderHook(() => useContrato(123), {
      wrapper: createWrapper(store),
    });

    expect(mockDispatch).toHaveBeenCalledWith(getContrato({ id: 123 }));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('does not dispatch getContrato when id is not provided', () => {
    const store = createMockStore({
      current: null,
      message: null,
      status: STATUS.IDLE,
      statusError: null,
    });
    store.dispatch = mockDispatch;

    renderHook(() => useContrato(null), {
      wrapper: createWrapper(store),
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('does not dispatch getContrato when id is undefined', () => {
    const store = createMockStore({
      current: null,
      message: null,
      status: STATUS.IDLE,
      statusError: null,
    });
    store.dispatch = mockDispatch;

    renderHook(() => useContrato(), {
      wrapper: createWrapper(store),
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('returns contrato from state', () => {
    const mockContrato = {
      id: 1,
      dataInicio: '2024-01-01',
      dataTermino: '2024-12-31',
      totalAulas: 100,
    };

    const store = createMockStore({
      current: mockContrato,
      message: 'Success',
      status: STATUS.SUCCESS,
      statusError: null,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.contrato).toEqual(mockContrato);
  });

  it('returns message from state', () => {
    const store = createMockStore({
      current: null,
      message: 'Test message',
      status: STATUS.SUCCESS,
      statusError: null,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.message).toBe('Test message');
  });

  it('sets isLoading to true when status is IDLE', () => {
    const store = createMockStore({
      current: null,
      message: null,
      status: STATUS.IDLE,
      statusError: null,
      action: 'getContrato',
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('sets isLoading to true when status is LOADING', () => {
    const store = createMockStore({
      current: null,
      message: null,
      status: STATUS.LOADING,
      statusError: null,
      action: 'getContrato',
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('sets isLoading to false when status is SUCCESS', () => {
    const store = createMockStore({
      current: { id: 1 },
      message: null,
      status: STATUS.SUCCESS,
      statusError: null,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('sets isLoading to false when status is FAILED', () => {
    const store = createMockStore({
      current: null,
      message: 'Error',
      status: STATUS.FAILED,
      statusError: STATUS_ERROR.INTERNAL_SERVER_ERROR,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('sets isSuccess to true when status is SUCCESS', () => {
    const store = createMockStore({
      current: { id: 1 },
      message: null,
      status: STATUS.SUCCESS,
      statusError: null,
      action: 'getContrato',
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isSuccess).toBe(true);
  });

  it('sets isSuccess to false when status is not SUCCESS', () => {
    const store = createMockStore({
      current: null,
      message: null,
      status: STATUS.LOADING,
      statusError: null,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isSuccess).toBe(false);
  });

  it('sets isFailed to true when status is FAILED', () => {
    const store = createMockStore({
      current: null,
      message: 'Error',
      status: STATUS.FAILED,
      statusError: STATUS_ERROR.INTERNAL_SERVER_ERROR,
      action: 'getContrato',
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isFailed).toBe(true);
  });

  it('sets isFailed to false when status is not FAILED', () => {
    const store = createMockStore({
      current: { id: 1 },
      message: null,
      status: STATUS.SUCCESS,
      statusError: null,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isFailed).toBe(false);
  });

  it('sets isNotFound to true when statusError is NOT_FOUND and current is null', () => {
    const store = createMockStore({
      current: null,
      message: 'Not found',
      status: STATUS.FAILED,
      statusError: STATUS_ERROR.NOT_FOUND,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isNotFound).toBe(true);
  });

  it('sets isNotFound to true when statusError is BAD_REQUEST and current is null', () => {
    const store = createMockStore({
      current: null,
      message: 'Bad request',
      status: STATUS.FAILED,
      statusError: STATUS_ERROR.BAD_REQUEST,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isNotFound).toBe(true);
  });

  it('sets isNotFound to false when statusError is NOT_FOUND but current exists', () => {
    const store = createMockStore({
      current: { id: 1 },
      message: null,
      status: STATUS.FAILED,
      statusError: STATUS_ERROR.NOT_FOUND,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isNotFound).toBe(false);
  });

  it('sets isNotFound to false when statusError is not BAD_REQUEST or NOT_FOUND', () => {
    const store = createMockStore({
      current: null,
      message: 'Server error',
      status: STATUS.FAILED,
      statusError: STATUS_ERROR.INTERNAL_SERVER_ERROR,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isNotFound).toBe(false);
  });

  it('dispatches getContrato when id changes', () => {
    const store = createMockStore({
      current: null,
      message: null,
      status: STATUS.IDLE,
      statusError: null,
    });
    store.dispatch = mockDispatch;

    const { rerender } = renderHook(({ id }) => useContrato(id), {
      wrapper: createWrapper(store),
      initialProps: { id: 1 },
    });

    expect(mockDispatch).toHaveBeenCalledWith(getContrato({ id: 1 }));
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Change id
    rerender({ id: 2 });

    expect(mockDispatch).toHaveBeenCalledWith(getContrato({ id: 2 }));
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('does not dispatch getContrato when id does not change', () => {
    const store = createMockStore({
      current: null,
      message: null,
      status: STATUS.IDLE,
      statusError: null,
    });
    store.dispatch = mockDispatch;

    const { rerender } = renderHook(({ id }) => useContrato(id), {
      wrapper: createWrapper(store),
      initialProps: { id: 1 },
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Rerender with same id
    rerender({ id: 1 });

    // Should still be called only once
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('returns all expected properties', () => {
    const store = createMockStore({
      current: { id: 1 },
      message: 'Success',
      status: STATUS.SUCCESS,
      statusError: null,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toHaveProperty('contrato');
    expect(result.current).toHaveProperty('message');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('isSuccess');
    expect(result.current).toHaveProperty('isFailed');
    expect(result.current).toHaveProperty('isNotFound');
  });

  it('handles string id correctly', () => {
    const store = createMockStore({
      current: null,
      message: null,
      status: STATUS.IDLE,
      statusError: null,
    });
    store.dispatch = mockDispatch;

    renderHook(() => useContrato('123'), {
      wrapper: createWrapper(store),
    });

    expect(mockDispatch).toHaveBeenCalledWith(getContrato({ id: '123' }));
  });

  it('handles zero id correctly', () => {
    const store = createMockStore({
      current: null,
      message: null,
      status: STATUS.IDLE,
      statusError: null,
    });
    store.dispatch = mockDispatch;

    renderHook(() => useContrato(0), {
      wrapper: createWrapper(store),
    });

    // Zero is falsy, so it should not dispatch
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('handles complete contrato data structure', () => {
    const completeContrato = {
      id: 1,
      dataInicio: '2024-01-01',
      dataTermino: '2024-12-31',
      totalAulas: 100,
      totalAulasFeitas: 50,
      totalReposicoes: 5,
      totalFaltas: 3,
      totalAulasCanceladas: 2,
      nomeAluno: 'João Silva',
      nomeProfessor: 'Maria Santos',
      observacoes: 'Contrato de inglês',
    };

    const store = createMockStore({
      current: completeContrato,
      message: 'Success',
      status: STATUS.SUCCESS,
      statusError: null,
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.contrato).toEqual(completeContrato);
    expect(result.current.contrato.id).toBe(1);
    expect(result.current.contrato.nomeAluno).toBe('João Silva');
    expect(result.current.contrato.totalAulas).toBe(100);
  });

  it('handles multiple status flags correctly', () => {
    const store = createMockStore({
      current: { id: 1 },
      message: 'Success',
      status: STATUS.SUCCESS,
      statusError: null,
      action: 'getContrato',
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isFailed).toBe(false);
    expect(result.current.isNotFound).toBe(false);
  });

  it('handles error status flags correctly', () => {
    const store = createMockStore({
      current: null,
      message: 'Error',
      status: STATUS.FAILED,
      statusError: STATUS_ERROR.INTERNAL_SERVER_ERROR,
      action: 'getContrato',
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isFailed).toBe(true);
    expect(result.current.isNotFound).toBe(false);
  });

  it('handles not found status flags correctly', () => {
    const store = createMockStore({
      current: null,
      message: 'Not found',
      status: STATUS.FAILED,
      statusError: STATUS_ERROR.NOT_FOUND,
      action: 'getContrato',
    });
    store.dispatch = mockDispatch;

    const { result } = renderHook(() => useContrato(1), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isFailed).toBe(true);
    expect(result.current.isNotFound).toBe(true);
  });
});
