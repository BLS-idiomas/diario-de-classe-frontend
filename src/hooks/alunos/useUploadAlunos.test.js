import { renderHook, act } from '@testing-library/react';
import { useUploadAlunos } from './useUploadAlunos';
import { STATUS } from '@/constants';

const mockDispatch = jest.fn();
const mockShowInput = jest.fn();
const mockSuccessToast = jest.fn();
const mockErrorToast = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

jest.mock('@/providers/ToastProvider', () => ({
  useToast: () => ({
    success: mockSuccessToast,
    error: mockErrorToast,
  }),
}));

jest.mock('../useSweetAlert', () => () => ({
  showInput: mockShowInput,
}));

jest.mock('@/store/slices/alunosSlice', () => ({
  uploadAlunos: jest.fn(() => ({ type: 'uploadAlunos' })),
  clearStatus: jest.fn(() => ({ type: 'clearStatus' })),
}));

describe('useUploadAlunos', () => {
  const mockUseSelector = require('react-redux').useSelector;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockClear();
  });

  it('should return initial state', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        alunos: {
          status: 'IDLE',
          message: '',
          list: [],
          action: '',
        },
      })
    );

    const { result } = renderHook(() => useUploadAlunos());

    expect(result.current.isUploading).toBe(false);
    expect(result.current.message).toBe('');
    expect(typeof result.current.handleModalUpload).toBe('function');
  });

  it('should handle file upload modal', async () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        alunos: {
          status: 'IDLE',
          message: '',
          list: [],
          action: '',
        },
      })
    );

    mockShowInput.mockResolvedValueOnce({
      isConfirmed: true,
      value: new File(['test'], 'test.csv', { type: 'text/csv' }),
    });

    const { result } = renderHook(() => useUploadAlunos());

    await act(async () => {
      await result.current.handleModalUpload();
    });

    expect(mockShowInput).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should not upload when modal is cancelled', async () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        alunos: {
          status: 'IDLE',
          message: '',
          list: [],
          action: '',
        },
      })
    );

    mockShowInput.mockResolvedValueOnce({
      isConfirmed: false,
      value: null,
    });

    const { result } = renderHook(() => useUploadAlunos());

    const dispatchCallsBefore = mockDispatch.mock.calls.length;

    await act(async () => {
      await result.current.handleModalUpload();
    });

    // Upload dispatch should not have been called
    const uploadCalls = mockDispatch.mock.calls.slice(dispatchCallsBefore);
    const hasUploadCall = uploadCalls.some(
      call => call[0]?.type === 'uploadAlunos'
    );
    expect(hasUploadCall).toBe(false);
  });

  it('should show loading state during upload', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        alunos: {
          status: STATUS.LOADING,
          message: '',
          list: [],
          action: 'uploadAlunos',
        },
      })
    );

    const { result } = renderHook(() => useUploadAlunos());

    expect(result.current.isUploading).toBe(true);
  });

  it('should show success toast on successful upload', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        alunos: {
          status: STATUS.SUCCESS,
          message: 'Upload successful',
          list: [{ id: 1, name: 'John' }],
          action: 'uploadAlunos',
        },
      })
    );

    renderHook(() => useUploadAlunos());

    expect(mockSuccessToast).toHaveBeenCalledWith(
      'Alunos criados com sucesso!'
    );
  });

  it('should show error toast on failed upload', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        alunos: {
          status: STATUS.FAILED,
          message: 'File format invalid',
          list: [],
          action: 'uploadAlunos',
        },
      })
    );

    renderHook(() => useUploadAlunos());

    expect(mockErrorToast).toHaveBeenCalledWith(
      'Erro ao criar alunos: File format invalid'
    );
  });

  it('should show error toast without message on failed upload', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        alunos: {
          status: STATUS.FAILED,
          message: '',
          list: [],
          action: 'uploadAlunos',
        },
      })
    );

    renderHook(() => useUploadAlunos());

    expect(mockErrorToast).toHaveBeenCalledWith('Erro ao criar alunos!');
  });

  it('should call clearStatus on mount', () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        alunos: {
          status: 'IDLE',
          message: '',
          list: [],
          action: '',
        },
      })
    );

    renderHook(() => useUploadAlunos());

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should validate file input in modal', async () => {
    mockUseSelector.mockImplementation(cb =>
      cb({
        alunos: {
          status: 'IDLE',
          message: '',
          list: [],
          action: '',
        },
      })
    );

    // Mock showInput to return cancelled result to avoid executing upload
    mockShowInput.mockResolvedValueOnce({ isConfirmed: false });

    const { result } = renderHook(() => useUploadAlunos());

    await act(async () => {
      await result.current.handleModalUpload();
    });

    const showInputCall = mockShowInput.mock.calls[0][0];
    expect(showInputCall.inputValidator).toBeDefined();
    expect(showInputCall.inputValidator(null)).toBe('Selecione um arquivo!');
    expect(showInputCall.inputValidator('file.csv')).toBeUndefined();
  });
});
