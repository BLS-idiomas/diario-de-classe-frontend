import { AuthApi } from './authApi';

describe('AuthApi', () => {
  let api;
  beforeEach(() => {
    api = new AuthApi();
  });

  it('should call api.post on login', async () => {
    api.api = { post: jest.fn().mockResolvedValue('login-result') };
    const credentials = { user: 'foo', pass: 'bar' };
    const result = await api.login(credentials);
    expect(api.api.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(result).toBe('login-result');
  });

  it('should call api.post on logout', async () => {
    api.api = { post: jest.fn().mockResolvedValue('logout-result') };
    const refreshToken = 'test-refresh-token-123';
    const result = await api.logout(refreshToken);
    expect(api.api.post).toHaveBeenCalledWith('/auth/logout', {
      refreshToken,
    });
    expect(result).toBe('logout-result');
  });

  it('should call api.post on logout without refreshToken', async () => {
    api.api = { post: jest.fn().mockResolvedValue('logout-result') };
    const result = await api.logout();
    expect(api.api.post).toHaveBeenCalledWith('/auth/logout', {
      refreshToken: undefined,
    });
    expect(result).toBe('logout-result');
  });

  it('should call api.post on refreshToken', async () => {
    api.api = { post: jest.fn().mockResolvedValue('refresh-result') };
    const result = await api.refreshToken();
    expect(api.api.post).toHaveBeenCalledWith('/auth/refresh-token');
    expect(result).toBe('refresh-result');
  });
});
