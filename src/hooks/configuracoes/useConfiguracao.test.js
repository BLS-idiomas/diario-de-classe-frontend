import { renderHook, act } from '@testing-library/react';
import { useConfiguracao } from './useConfiguracao';
import { STATUS } from '@/constants';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/providers/ToastProvider', () => ({ useToast: jest.fn() }));
jest.mock('@/store/slices/configuracaoSlice', () => ({
  getConfiguracao: jest.fn(() => ({ type: 'getConfiguracao' })),
  updateConfiguracao: jest.fn(data => ({
    type: 'updateConfiguracao',
    payload: data,
  })),
  clearStatus: jest.fn(() => ({ type: 'clearStatus' })),
}));

describe('useConfiguracao', () => {
  let dispatchMock, routerMock, successMock, useSelectorMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    routerMock = { push: jest.fn() };
    successMock = jest.fn();
    useSelectorMock = require('react-redux').useSelector;
    require('react-redux').useDispatch.mockReturnValue(dispatchMock);
    require('next/navigation').useRouter.mockReturnValue(routerMock);
    require('@/providers/ToastProvider').useToast.mockReturnValue({
      success: successMock,
    });
    useSelectorMock.mockImplementation(fn =>
      fn({
        configuracao: {
          data: { foo: 'bar' },
          status: STATUS.IDLE,
          action: 'getConfiguracao',
          message: null,
          errors: [],
        },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve despachar getConfiguracao ao montar', () => {
    renderHook(() => useConfiguracao());
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'getConfiguracao' })
    );
  });

  it('deve retornar os valores do estado', () => {
    const { result } = renderHook(() => useConfiguracao());
    expect(result.current.configuracao).toEqual({ foo: 'bar' });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.status).toBe(STATUS.IDLE);
    expect(result.current.errors).toEqual([]);
  });

  it('deve despachar updateConfiguracao ao chamar submit', () => {
    const { result } = renderHook(() => useConfiguracao());
    act(() => {
      result.current.submit({ test: 123 });
    });
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'updateConfiguracao',
        payload: { test: 123 },
      })
    );
  });

  it('deve despachar clearStatus, mostrar toast e redirecionar após update com sucesso', () => {
    useSelectorMock.mockImplementation(fn =>
      fn({
        configuracao: {
          data: { foo: 'bar' },
          status: STATUS.SUCCESS,
          action: 'updateConfiguracao',
          message: null,
          errors: [],
        },
      })
    );
    renderHook(() => useConfiguracao());
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'clearStatus' })
    );
    expect(successMock).toHaveBeenCalledWith('Operação realizada com sucesso!');
    expect(routerMock.push).toHaveBeenCalledWith('/configuracoes');
  });
});
