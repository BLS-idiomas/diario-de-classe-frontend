const mockRefreshToken = jest.fn().mockResolvedValue('refresh-result');
jest.mock('@/store/api/authApi', () => ({
  AuthApi: jest
    .fn()
    .mockImplementation(() => ({ refreshToken: mockRefreshToken })),
}));

import { RefreshTokenService } from './refreshTokenService';

describe('RefreshTokenService', () => {
  it('should call authApi.refreshToken with data when execute is called', async () => {
    const mockApi = { refreshToken: jest.fn().mockResolvedValue('result') };
    const service = new RefreshTokenService(mockApi);
    const data = { token: 'abc' };
    const result = await service.execute(data);
    expect(mockApi.refreshToken).toHaveBeenCalledWith(data);
    expect(result).toBe('result');
  });

  it('static handle should instantiate AuthApi and call execute', async () => {
    const data = { token: 'def' };
    const result = await RefreshTokenService.handle(data);
    expect(mockRefreshToken).toHaveBeenCalledWith(data);
    expect(result).toBe('refresh-result');
  });
});
