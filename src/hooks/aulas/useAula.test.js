import { renderHook } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useAula } from './useAula';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('@/store/slices/aulasSlice', () => ({
  getAula: jest.fn(id => ({ type: 'getAula', payload: id })),
}));

const mockDispatch = jest.fn();

beforeEach(() => {
  useDispatch.mockReturnValue(mockDispatch);
  jest.clearAllMocks();
});

describe('useAula', () => {
  it('should dispatch getAula on mount if id is provided', () => {
    useSelector.mockImplementation(cb =>
      cb({ aulas: { current: null, status: 'IDLE', statusError: null } })
    );
    renderHook(() => useAula(123));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should return aula and status flags', () => {
    useSelector.mockImplementation(cb =>
      cb({
        aulas: {
          current: { id: 1 },
          status: 'success',
          statusError: null,
          action: 'getAula',
        },
      })
    );
    const { result } = renderHook(() => useAula(1));
    expect(result.current.aula).toEqual({ id: 1 });
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFailed).toBe(false);
  });
});
