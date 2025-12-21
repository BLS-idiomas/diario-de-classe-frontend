import { renderHook } from '@testing-library/react-hooks';
import { useDashboard } from './useDashboard';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@/store/slices/dashboardSlice', () => ({
  getDashboard: jest.fn(() => ({ type: 'dashboard/getDashboard' })),
}));

describe('useDashboard', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch getDashboard on mount', () => {
    useSelector.mockReturnValue({ data: {}, status: STATUS.IDLE });
    renderHook(() => useDashboard());
    expect(dispatchMock).toHaveBeenCalled();
  });

  it('should return correct values from state', () => {
    const mockData = {
      totalAulas: 5,
      totalAlunos: 10,
      totalContratos: 3,
      minhasAulas: [{ id: 1 }],
      todasAsAulas: [{ id: 2 }],
    };
    useSelector.mockReturnValue({ data: mockData, status: STATUS.SUCCESS });
    const { result } = renderHook(() => useDashboard());
    expect(result.current.totalAulas).toBe(5);
    expect(result.current.totalAlunos).toBe(10);
    expect(result.current.totalContratos).toBe(3);
    expect(result.current.minhasAulas).toEqual([{ id: 1 }]);
    expect(result.current.todasAsAulas).toEqual([{ id: 2 }]);
    expect(result.current.status).toBe(STATUS.SUCCESS);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return isLoading true if status is IDLE or LOADING', () => {
    useSelector.mockReturnValue({ data: {}, status: STATUS.IDLE });
    let { result, rerender } = renderHook(() => useDashboard());
    expect(result.current.isLoading).toBe(true);
    useSelector.mockReturnValue({ data: {}, status: STATUS.LOADING });
    rerender();
    expect(result.current.isLoading).toBe(true);
  });
});
