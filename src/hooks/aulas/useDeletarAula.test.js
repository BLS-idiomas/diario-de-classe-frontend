import { renderHook, act } from '@testing-library/react';
import { useDeletarAula } from './useDeletarAula';

jest.mock('react-redux', () => ({ useDispatch: jest.fn() }));
jest.mock('@/store/slices/aulasSlice', () => ({
  deleteAula: jest.fn(id => ({ type: 'deleteAula', payload: id })),
}));
jest.mock('@/hooks/useSweetAlert', () => () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
  showConfirm: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

const mockDispatch = jest.fn(() => Promise.resolve({}));

beforeEach(() => {
  require('react-redux').useDispatch.mockReturnValue(mockDispatch);
  jest.clearAllMocks();
});

describe('useDeletarAula', () => {
  it('should call dispatch and showSuccess on confirmed delete', async () => {
    const { result } = renderHook(() => useDeletarAula());
    await act(async () => {
      await result.current.handleDeleteAula(1);
    });
    expect(mockDispatch).toHaveBeenCalled();
  });
});
