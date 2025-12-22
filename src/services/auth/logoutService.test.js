const mockLogout = jest.fn().mockResolvedValue('logout-result');
jest.mock('@/store/api/authApi', () => ({
  AuthApi: jest.fn().mockImplementation(() => ({ logout: mockLogout })),
}));

import { LogoutService } from './logoutService';

describe('LogoutService', () => {
  it('should call authApi.logout with refreshToken when execute is called', async () => {
    const mockApi = { logout: jest.fn().mockResolvedValue('result') };
    const service = new LogoutService(mockApi);
    const refreshToken = 'test-refresh-token-123';
    const result = await service.execute(refreshToken);
    expect(mockApi.logout).toHaveBeenCalledWith(refreshToken);
    expect(result).toBe('result');
  });

  it('should call authApi.logout without refreshToken when execute is called without parameter', async () => {
    const mockApi = { logout: jest.fn().mockResolvedValue('result') };
    const service = new LogoutService(mockApi);
    const result = await service.execute();
    expect(mockApi.logout).toHaveBeenCalledWith(undefined);
    expect(result).toBe('result');
  });

  it('static handle should instantiate AuthApi and call execute with refreshToken', async () => {
    const refreshToken = 'test-refresh-token-456';
    const result = await LogoutService.handle(refreshToken);
    expect(mockLogout).toHaveBeenCalledWith(refreshToken);
    expect(result).toBe('logout-result');
  });

  it('static handle should instantiate AuthApi and call execute without refreshToken', async () => {
    mockLogout.mockClear();
    const result = await LogoutService.handle();
    expect(mockLogout).toHaveBeenCalledWith(undefined);
    expect(result).toBe('logout-result');
  });
});
