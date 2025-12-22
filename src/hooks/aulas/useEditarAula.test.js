import { renderHook, act } from '@testing-library/react';
import { useEditarAula } from './useEditarAula';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock('@/providers/ToastProvider', () => ({
  useToast: () => ({ success: jest.fn() }),
}));
jest.mock('@/store/slices/aulasSlice', () => ({
  updateAula: jest.fn(() => ({ type: 'updateAula' })),
  getAula: jest.fn(() => ({ type: 'getAula' })),
  clearStatus: jest.fn(() => ({ type: 'clearStatus' })),
  clearCurrent: jest.fn(() => ({ type: 'clearCurrent' })),
}));

const mockDispatch = jest.fn();

beforeEach(() => {
  require('react-redux').useDispatch.mockReturnValue(mockDispatch);
  require('react-redux').useSelector.mockImplementation(cb =>
    cb({
      aulas: {
        status: 'IDLE',
        message: '',
        errors: [],
        current: null,
        action: '',
        statusError: null,
      },
    })
  );
  jest.clearAllMocks();
});

describe('useEditarAula', () => {
  it('should return default values and call submit', () => {
    const { result } = renderHook(() => useEditarAula(1));
    act(() => {
      result.current.submit({ id: 1, dataToSend: { nome: 'Aula' } });
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});
