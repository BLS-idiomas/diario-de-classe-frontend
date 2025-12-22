import { renderHook } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useAulas } from './useAulas';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('@/store/slices/aulasSlice', () => ({
  getAulas: jest.fn(() => ({ type: 'getAulas' })),
}));

const mockDispatch = jest.fn();

beforeEach(() => {
  useDispatch.mockReturnValue(mockDispatch);
  jest.clearAllMocks();
});

describe('useAulas', () => {
  it('should dispatch getAulas on mount', () => {
    useSelector.mockImplementation(cb =>
      cb({ aulas: { list: [], status: 'IDLE' } })
    );
    renderHook(() => useAulas());
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should return aulas and status', () => {
    useSelector.mockImplementation(cb =>
      cb({ aulas: { list: [1, 2], status: 'SUCCESS' } })
    );
    const { result } = renderHook(() => useAulas());
    expect(result.current.aulas).toEqual([1, 2]);
    expect(result.current.status).toBe('SUCCESS');
    expect(result.current.isLoading).toBe(false);
  });
});
