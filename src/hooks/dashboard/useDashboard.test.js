import { renderHook } from '@testing-library/react';
import { useDashboard } from './useDashboard';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import React from 'react';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@/store/slices/dashboardSlice', () => ({
  getDashboard: jest.fn(() => ({ type: 'dashboard/getDashboard' })),
}));

jest.mock('@/store/slices/aulasSlice', () => ({
  updateAula: jest.fn(() => ({ type: 'aulas/updateAula' })),
  clearStatus: jest.fn(() => ({ type: 'aulas/clearStatus' })),
}));

jest.mock('../professores/useProfessores', () => ({
  useProfessores: jest.fn(() => ({ professores: [] })),
}));

jest.mock('../useSweetAlert', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    showForm: jest.fn(),
    showSuccess: jest.fn(),
  })),
}));

jest.mock('@/providers/ToastProvider', () => ({
  useToast: jest.fn(() => ({
    success: jest.fn(),
    error: jest.fn(),
  })),
}));

describe('useDashboard', () => {
  let dispatchMock;
  const mockCurrentUser = { id: 1 };

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch getDashboard on mount', () => {
    useSelector.mockImplementation(selector => {
      const state = {
        dashboard: { data: {}, status: STATUS.IDLE },
        aulas: { status: STATUS.IDLE, action: null },
      };
      return selector(state);
    });
    renderHook(() => useDashboard(mockCurrentUser));
    expect(dispatchMock).toHaveBeenCalled();
  });

  it('should return correct values from state', () => {
    const mockData = {
      totalAulas: 5,
      totalAlunos: 10,
      totalContratos: 3,
      aulas: [{ id: 1 }, { id: 2 }],
    };
    useSelector.mockImplementation(selector => {
      const state = {
        dashboard: { data: mockData, status: STATUS.SUCCESS },
        aulas: { status: STATUS.IDLE, action: null },
      };
      return selector(state);
    });
    const { result } = renderHook(() => useDashboard(mockCurrentUser));
    expect(result.current.aulas).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.current.status).toBe(STATUS.SUCCESS);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.homeCardValues).toHaveLength(3);
    expect(result.current.homeCardValues[0].value).toBe(10);
    expect(result.current.homeCardValues[1].value).toBe(5);
    expect(result.current.homeCardValues[2].value).toBe(3);
  });

  it('should return isLoading true if status is IDLE or LOADING', () => {
    useSelector.mockImplementation(selector => {
      const state = {
        dashboard: { data: {}, status: STATUS.IDLE },
        aulas: { status: STATUS.IDLE, action: null },
      };
      return selector(state);
    });
    let { result } = renderHook(() => useDashboard(mockCurrentUser));
    expect(result.current.isLoading).toBe(true);

    useSelector.mockImplementation(selector => {
      const state = {
        dashboard: { data: {}, status: STATUS.LOADING },
        aulas: { status: STATUS.IDLE, action: null },
      };
      return selector(state);
    });
    const { result: result2 } = renderHook(() => useDashboard(mockCurrentUser));
    expect(result2.current.isLoading).toBe(true);
  });
});
