import { renderHook } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useAulas } from './useAulas';
import { getAulas } from '@/store/slices/aulasSlice';

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

  it('should return searchParams function', () => {
    useSelector.mockImplementation(cb =>
      cb({ aulas: { list: [], status: 'IDLE' } })
    );
    const { result } = renderHook(() => useAulas());

    expect(result.current.searchParams).toBeDefined();
    expect(typeof result.current.searchParams).toBe('function');
  });

  it('should dispatch getAulas with query when searchParams is called', () => {
    useSelector.mockImplementation(cb =>
      cb({ aulas: { list: [], status: 'IDLE' } })
    );
    const { result } = renderHook(() => useAulas());

    result.current.searchParams('classroom search');

    expect(mockDispatch).toHaveBeenCalledWith(
      getAulas({ q: 'classroom search' })
    );
  });
});
