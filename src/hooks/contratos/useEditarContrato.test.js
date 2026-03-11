import { renderHook, act } from '@testing-library/react';
import { useEditarContrato } from './useEditarContrato';
import { STATUS, STATUS_ERROR } from '@/constants';

const mockDispatch = jest.fn();
const mockPush = jest.fn();
const mockSuccessToast = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/providers/ToastProvider', () => ({
  useToast: () => ({
    success: mockSuccessToast,
  }),
}));

jest.mock('@/store/slices/contratosSlice', () => ({
  updateContrato: jest.fn(data => ({ type: 'updateContrato', payload: data })),
  getContrato: jest.fn(data => ({ type: 'getContrato', payload: data })),
  clearStatus: jest.fn(() => ({ type: 'clearStatus' })),
  clearCurrent: jest.fn(() => ({ type: 'clearCurrent' })),
}));

describe('useEditarContrato', () => {
  const mockUseSelector = require('react-redux').useSelector;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockClear();
  });

  it('should return initial state', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.IDLE,
          message: '',
          errors: [],
          current: null,
          action: '',
          statusError: null,
        },
      })
    );

    const { result } = renderHook(() => useEditarContrato('123'));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isNotFound).toBe(false);
    expect(result.current.current).toBeNull();
    expect(result.current.message).toBe('');
    expect(typeof result.current.submit).toBe('function');
  });

  it('should fetch contrato on mount when id is provided', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.IDLE,
          message: '',
          errors: [],
          current: null,
          action: '',
          statusError: null,
        },
      })
    );

    renderHook(() => useEditarContrato('123'));

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should not fetch contrato when id is not provided', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.IDLE,
          message: '',
          errors: [],
          current: null,
          action: '',
          statusError: null,
        },
      })
    );

    const dispatchBefore = mockDispatch.mock.calls.length;
    renderHook(() => useEditarContrato(null));
    const dispatchAfter = mockDispatch.mock.calls.length;

    // Only should dispatch once for clearStatus
    expect(dispatchAfter - dispatchBefore).toBeLessThanOrEqual(1);
  });

  it('should show loading state during update', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.LOADING,
          message: '',
          errors: [],
          current: { id: '123', name: 'Contrato' },
          action: 'updateContrato',
          statusError: null,
        },
      })
    );

    const { result } = renderHook(() => useEditarContrato('123'));

    expect(result.current.isLoading).toBe(true);
  });

  it('should return current contrato data', () => {
    const mockContrato = {
      id: '123',
      alunoId: '1',
      professorId: '2',
      dataInicio: '2024-01-01',
      dataTermino: '2024-12-31',
    };

    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.IDLE,
          message: '',
          errors: [],
          current: mockContrato,
          action: '',
          statusError: null,
        },
      })
    );

    const { result } = renderHook(() => useEditarContrato('123'));

    expect(result.current.current).toEqual(mockContrato);
  });

  it('should submit contrato changes', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.IDLE,
          message: '',
          errors: [],
          current: { id: '123', name: 'Contrato' },
          action: '',
          statusError: null,
        },
      })
    );

    const { result } = renderHook(() => useEditarContrato('123'));

    act(() => {
      result.current.submit('123', { name: 'Updated Contrato' });
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should show success message on successful update', () => {
    const mockContrato = { id: '123', name: 'Updated Contrato' };

    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.SUCCESS,
          message: 'Success',
          errors: [],
          current: mockContrato,
          action: 'updateContrato',
          statusError: null,
        },
      })
    );

    renderHook(() => useEditarContrato('123'));

    expect(mockSuccessToast).toHaveBeenCalledWith(
      'Contrato editado com sucesso!'
    );
  });

  it('should detect not found error', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.IDLE,
          message: 'Not found',
          errors: [],
          current: null,
          action: 'getContrato',
          statusError: STATUS_ERROR.NOT_FOUND,
        },
      })
    );

    const { result } = renderHook(() => useEditarContrato('invalidId'));

    expect(result.current.isNotFound).toBe(true);
  });

  it('should detect bad request error', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.IDLE,
          message: 'Bad request',
          errors: [],
          current: null,
          action: 'getContrato',
          statusError: STATUS_ERROR.BAD_REQUEST,
        },
      })
    );

    const { result } = renderHook(() => useEditarContrato('123'));

    expect(result.current.isNotFound).toBe(true);
  });

  it('should return errors array', () => {
    const mockErrors = ['Campo obrigatório', 'Formato inválido'];

    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.FAILED,
          message: 'Validation failed',
          errors: mockErrors,
          current: null,
          action: 'updateContrato',
          statusError: null,
        },
      })
    );

    const { result } = renderHook(() => useEditarContrato('123'));

    expect(result.current.errors).toEqual(mockErrors);
  });

  it('should redirect to contrato detail on success', () => {
    const mockContrato = { id: '999', name: 'New Contrato' };

    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.SUCCESS,
          message: 'Success',
          errors: [],
          current: mockContrato,
          action: 'updateContrato',
          statusError: null,
        },
      })
    );

    renderHook(() => useEditarContrato('123'));

    expect(mockPush).toHaveBeenCalledWith('/contratos/999');
  });
});
