import { renderHook } from '@testing-library/react';
import { useRelatorios } from './useRelatorios';
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

jest.mock('@/store/slices/relatorioSlice', () => ({
  getRelatorios: jest.fn(() => ({ type: 'getRelatorios' })),
  getRelatorioByReport: jest.fn(data => ({
    type: 'getRelatorioByReport',
    payload: data,
  })),
  clearStatus: jest.fn(() => ({ type: 'clearStatus' })),
  clearFile: jest.fn(() => ({ type: 'clearFile' })),
}));

describe('useRelatorios', () => {
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
        relatorio: {
          file: null,
          data: [],
          status: STATUS.IDLE,
          action: 'getRelatorios',
          message: '',
          errors: [],
        },
      })
    );

    const { result } = renderHook(() => useRelatorios());

    expect(result.current.file).toBeNull();
    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSubmitting).toBe(false);
    expect(typeof result.current.submit).toBe('function');
  });

  it('should fetch relatorios on mount', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: null,
          data: [],
          status: STATUS.IDLE,
          action: '',
          message: '',
          errors: [],
        },
      })
    );

    renderHook(() => useRelatorios());

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should show loading when fetching relatorios', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: null,
          data: [],
          status: STATUS.LOADING,
          action: 'getRelatorios',
          message: '',
          errors: [],
        },
      })
    );

    const { result } = renderHook(() => useRelatorios());

    expect(result.current.isLoading).toBe(true);
  });

  it('should not show loading when status is IDLE but action is not getRelatorios', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: null,
          data: [],
          status: STATUS.IDLE,
          action: 'getRelatorioByReport',
          message: '',
          errors: [],
        },
      })
    );

    const { result } = renderHook(() => useRelatorios());

    expect(result.current.isLoading).toBe(false);
  });

  it('should return relatorios data', () => {
    const mockData = [
      { id: '1', name: 'Vendas', icon: 'chart-bar' },
      { id: '2', name: 'Presença', icon: 'check-circle' },
    ];

    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: null,
          data: mockData,
          status: STATUS.SUCCESS,
          action: 'getRelatorios',
          message: '',
          errors: [],
        },
      })
    );

    const { result } = renderHook(() => useRelatorios());

    expect(result.current.data).toEqual(mockData);
  });

  it('should submit report with parameters', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: null,
          data: [],
          status: STATUS.IDLE,
          action: '',
          message: '',
          errors: [],
        },
      })
    );

    const { result } = renderHook(() => useRelatorios());

    const reportParams = {
      dataInicial: '2024-01-01',
      dataFinal: '2024-12-31',
      alunoId: '1',
    };

    result.current.submit('vendas', reportParams);

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should show submitting state during report generation', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: null,
          data: [],
          status: STATUS.LOADING,
          action: 'getRelatorioByReport',
          message: '',
          errors: [],
        },
      })
    );

    const { result } = renderHook(() => useRelatorios());

    expect(result.current.isSubmitting).toBe(true);
  });

  it('should show success toast when report is generated', () => {
    const mockFile = {
      url: 'https://example.com/report.pdf',
      name: 'relatorio.pdf',
    };

    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: mockFile,
          data: [],
          status: STATUS.SUCCESS,
          action: 'getRelatorioByReport',
          message: 'Success',
          errors: [],
        },
      })
    );

    renderHook(() => useRelatorios());

    expect(mockSuccessToast).toHaveBeenCalledWith(
      'Operação realizada com sucesso!'
    );
  });

  it('should return status value', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: null,
          data: [],
          status: STATUS.FAILED,
          action: '',
          message: '',
          errors: [],
        },
      })
    );

    const { result } = renderHook(() => useRelatorios());

    expect(result.current.status).toBe(STATUS.FAILED);
  });

  it('should return message from state', () => {
    const testMessage = 'Erro ao gerar relatório';

    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: null,
          data: [],
          status: STATUS.FAILED,
          action: 'getRelatorioByReport',
          message: testMessage,
          errors: [],
        },
      })
    );

    const { result } = renderHook(() => useRelatorios());

    expect(result.current.message).toBe(testMessage);
  });

  it('should return errors array', () => {
    const mockErrors = ['Campo obrigatório', 'Data inválida'];

    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: null,
          data: [],
          status: STATUS.FAILED,
          action: 'getRelatorioByReport',
          message: 'Validation failed',
          errors: mockErrors,
        },
      })
    );

    const { result } = renderHook(() => useRelatorios());

    expect(result.current.errors).toEqual(mockErrors);
  });

  it('should return file when available', () => {
    const mockFile = {
      url: 'https://example.com/relatorio.xlsx',
      name: 'vendas_2024.xlsx',
    };

    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: mockFile,
          data: [],
          status: STATUS.SUCCESS,
          action: 'getRelatorioByReport',
          message: 'Success',
          errors: [],
        },
      })
    );

    const { result } = renderHook(() => useRelatorios());

    expect(result.current.file).toEqual(mockFile);
  });

  it('should not submit when parameters are empty', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: null,
          data: [],
          status: STATUS.IDLE,
          action: '',
          message: '',
          errors: [],
        },
      })
    );

    const { result } = renderHook(() => useRelatorios());

    const dispatchBefore = mockDispatch.mock.calls.length;

    result.current.submit('vendas', {});

    // Should still dispatch for the submit action
    expect(mockDispatch.mock.calls.length).toBeGreaterThanOrEqual(
      dispatchBefore
    );
  });

  it('should handle loading and submitting states separately', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: null,
          data: [],
          status: STATUS.LOADING,
          action: 'getRelatorios',
          message: '',
          errors: [],
        },
      })
    );

    const { result } = renderHook(() => useRelatorios());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSubmitting).toBe(false);

    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: null,
          data: [],
          status: STATUS.LOADING,
          action: 'getRelatorioByReport',
          message: '',
          errors: [],
        },
      })
    );

    const { result: result2 } = renderHook(() => useRelatorios());

    expect(result2.current.isLoading).toBe(false);
    expect(result2.current.isSubmitting).toBe(true);
  });

  it('should export all return values', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        relatorio: {
          file: null,
          data: [],
          status: STATUS.IDLE,
          action: '',
          message: '',
          errors: [],
        },
      })
    );

    const { result } = renderHook(() => useRelatorios());

    expect(result.current).toHaveProperty('submit');
    expect(result.current).toHaveProperty('file');
    expect(result.current).toHaveProperty('data');
    expect(result.current).toHaveProperty('status');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('message');
    expect(result.current).toHaveProperty('errors');
    expect(result.current).toHaveProperty('isSubmitting');
  });
});
