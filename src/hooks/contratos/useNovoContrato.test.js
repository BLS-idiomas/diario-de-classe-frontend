import { renderHook, act } from '@testing-library/react';
import { useNovoContrato } from './useNovoContrato';
import { STATUS } from '@/constants';

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
  createContrato: jest.fn(data => ({ type: 'createContrato', payload: data })),
  clearStatus: jest.fn(() => ({ type: 'clearStatus' })),
}));

describe('useNovoContrato', () => {
  const mockUseSelector = require('react-redux').useSelector;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockClear();
    mockPush.mockClear();
    mockSuccessToast.mockClear();
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
        },
      })
    );

    const { result } = renderHook(() => useNovoContrato());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.message).toBe('');
    expect(result.current.errors).toEqual([]);
    expect(typeof result.current.submit).toBe('function');
  });

  it('should call clearStatus on mount', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.IDLE,
          message: '',
          errors: [],
          current: null,
          action: '',
        },
      })
    );

    renderHook(() => useNovoContrato());

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should show loading state during creation', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.LOADING,
          message: '',
          errors: [],
          current: null,
          action: 'createContrato',
        },
      })
    );

    const { result } = renderHook(() => useNovoContrato());

    expect(result.current.isLoading).toBe(true);
  });

  it('should submit contrato data', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.IDLE,
          message: '',
          errors: [],
          current: null,
          action: '',
        },
      })
    );

    const { result } = renderHook(() => useNovoContrato());

    const contratoData = {
      alunoId: '1',
      professorId: '2',
      dataInicio: '2024-01-01',
      dataTermino: '2024-12-31',
    };

    act(() => {
      result.current.submit(contratoData);
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should show success toast on successful creation', () => {
    const mockContrato = {
      id: '123',
      alunoId: '1',
      professorId: '2',
    };

    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.SUCCESS,
          message: 'Created successfully',
          errors: [],
          current: mockContrato,
          action: 'createContrato',
        },
      })
    );

    renderHook(() => useNovoContrato());

    expect(mockSuccessToast).toHaveBeenCalledWith(
      'Contrato criado com sucesso!'
    );
  });

  it('should redirect to contrato detail on success', () => {
    const mockContrato = {
      id: '999',
      alunoId: '1',
      professorId: '2',
    };

    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.SUCCESS,
          message: 'Created successfully',
          errors: [],
          current: mockContrato,
          action: 'createContrato',
        },
      })
    );

    renderHook(() => useNovoContrato());

    expect(mockPush).toHaveBeenCalledWith('/contratos/999');
  });

  it('should return error messages', () => {
    const mockErrors = ['Aluno inválido', 'Data inválida'];

    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.FAILED,
          message: 'Validation failed',
          errors: mockErrors,
          current: null,
          action: 'createContrato',
        },
      })
    );

    const { result } = renderHook(() => useNovoContrato());

    expect(result.current.errors).toEqual(mockErrors);
  });

  it('should not show loading when action is different', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.LOADING,
          message: '',
          errors: [],
          current: null,
          action: 'fetchContratos',
        },
      })
    );

    const { result } = renderHook(() => useNovoContrato());

    expect(result.current.isLoading).toBe(false);
  });

  it('should handle empty errors array', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.IDLE,
          message: '',
          errors: [],
          current: null,
          action: '',
        },
      })
    );

    const { result } = renderHook(() => useNovoContrato());

    expect(result.current.errors).toHaveLength(0);
  });

  it('should not redirect when status is not success', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.LOADING,
          message: '',
          errors: [],
          current: { id: '123' },
          action: 'createContrato',
        },
      })
    );

    renderHook(() => useNovoContrato());

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should not redirect when current is null', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.SUCCESS,
          message: 'Success',
          errors: [],
          current: null,
          action: 'createContrato',
        },
      })
    );

    renderHook(() => useNovoContrato());

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should return message from state', () => {
    const testMessage = 'Contrato validado com sucesso';

    mockUseSelector.mockImplementation(cb =>
      cb({
        contratos: {
          status: STATUS.IDLE,
          message: testMessage,
          errors: [],
          current: null,
          action: '',
        },
      })
    );

    const { result } = renderHook(() => useNovoContrato());

    expect(result.current.message).toBe(testMessage);
  });
});
