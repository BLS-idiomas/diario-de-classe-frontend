import { renderHook } from '@testing-library/react';
import { useLogout } from './useLogout';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';
import { useUserAuth } from '@/providers/UserAuthProvider';

jest.mock('react-redux', () => ({ useDispatch: jest.fn() }));
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/providers/ToastProvider', () => ({ useToast: jest.fn() }));
jest.mock('@/providers/UserAuthProvider', () => ({ useUserAuth: jest.fn() }));
jest.mock('@/store/slices/authSlice', () => ({
  logout: jest.fn(),
  clearStatus: jest.fn(),
}));

describe('useLogout', () => {
  let dispatchMock, routerMock, infoMock, removeAuthenticateMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    routerMock = { push: jest.fn() };
    infoMock = jest.fn();
    removeAuthenticateMock = jest.fn();

    useDispatch.mockReturnValue(dispatchMock);
    useRouter.mockReturnValue(routerMock);
    useToast.mockReturnValue({ info: infoMock });
    useUserAuth.mockReturnValue({ removeAuthenticate: removeAuthenticateMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should clear status on mount', () => {
    const { result } = renderHook(() => useLogout());
    const { clearStatus } = require('@/store/slices/authSlice');
    expect(dispatchMock).toHaveBeenCalledWith(clearStatus());
  });

  it('should logout user and redirect', () => {
    const { result } = renderHook(() => useLogout());
    result.current.logoutUser();
    expect(dispatchMock).toHaveBeenCalled();
    expect(removeAuthenticateMock).toHaveBeenCalled();
    expect(infoMock).toHaveBeenCalledWith('Você saiu.');
    expect(routerMock.push).toHaveBeenCalledWith('/login');
  });
});
