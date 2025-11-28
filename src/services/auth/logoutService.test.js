const mockLogout = jest.fn().mockResolvedValue('logout-result');
jest.mock('@/store/api/authApi', () => ({
  AuthApi: jest.fn().mockImplementation(() => ({ logout: mockLogout })),
}));

import { LogoutService } from './logoutService';

describe('LogoutService', () => {
  it('should call authApi.logout when execute is called', async () => {
    const mockApi = { logout: jest.fn().mockResolvedValue('result') };
    const service = new LogoutService(mockApi);
    const result = await service.execute();
    expect(mockApi.logout).toHaveBeenCalled();
    expect(result).toBe('result');
  });

  it('static handle should instantiate AuthApi and call execute', async () => {
    const result = await LogoutService.handle();
    expect(mockLogout).toHaveBeenCalled();
    expect(result).toBe('logout-result');
  });
});
