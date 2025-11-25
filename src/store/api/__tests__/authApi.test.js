import { AuthApi } from '../authApi';

// Mock do axios
const mockAxiosInstance = {
  defaults: {
    headers: {
      common: {},
    },
  },
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// Mock do axios create
jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
}));

describe.skip('AuthApi', () => {
  let authApi;

  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();

    authApi = new AuthApi();
  });

  describe('constructor', () => {
    it('should extend BaseApi and initialize correctly', () => {
      expect(authApi).toBeInstanceOf(AuthApi);
      expect(authApi.api).toBe(mockAxiosInstance);
    });

    it('should have access to axios instance through api property', () => {
      expect(authApi.api).toBeDefined();
      expect(authApi.api).toBe(mockAxiosInstance);
    });
  });

  describe('addToken', () => {
    it('should add Bearer token to Authorization header', () => {
      const token = 'test-jwt-token';

      authApi.addToken(token);

      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe(
        `Bearer ${token}`
      );
    });

    it('should replace existing token with new one', () => {
      const firstToken = 'first-token';
      const secondToken = 'second-token';

      // Adicionar primeiro token
      authApi.addToken(firstToken);
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe(
        `Bearer ${firstToken}`
      );

      // Substituir com segundo token
      authApi.addToken(secondToken);
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe(
        `Bearer ${secondToken}`
      );
    });

    it('should handle empty token', () => {
      authApi.addToken('');

      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe(
        'Bearer '
      );
    });

    it('should handle null token', () => {
      authApi.addToken(null);

      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe(
        'Bearer null'
      );
    });

    it('should handle undefined token', () => {
      authApi.addToken(undefined);

      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe(
        'Bearer undefined'
      );
    });
  });

  describe('login', () => {
    it('should call POST /auth/login with credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'testPassword123',
      };

      const mockResponse = {
        data: {
          token: 'jwt-token',
          user: {
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authApi.login(credentials);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/auth/login',
        credentials
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle login with additional fields', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'testPassword123',
        rememberMe: true,
        deviceInfo: 'Chrome/Windows',
      };

      const mockResponse = {
        data: {
          token: 'jwt-token',
          refreshToken: 'refresh-token',
          user: { id: 1, email: 'test@example.com' },
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authApi.login(credentials);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/auth/login',
        credentials
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle login errors', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      const mockError = new Error('Invalid credentials');

      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(authApi.login(credentials)).rejects.toThrow(
        'Invalid credentials'
      );
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/auth/login',
        credentials
      );
    });

    it('should handle empty credentials', async () => {
      const credentials = {};
      const mockResponse = { data: { message: 'Missing credentials' } };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authApi.login(credentials);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/auth/login',
        credentials
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should call POST /auth/logout', async () => {
      const mockResponse = { data: { message: 'Logout successful' } };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authApi.logout();

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/logout');
      expect(result).toEqual(mockResponse);
    });

    it('should handle logout errors', async () => {
      const mockError = new Error('Token expired');

      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(authApi.logout()).rejects.toThrow('Token expired');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('should handle server errors during logout', async () => {
      const mockError = new Error('Internal Server Error');

      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(authApi.logout()).rejects.toThrow('Internal Server Error');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('refreshToken', () => {
    it('should call POST /auth/refresh-token', async () => {
      const mockResponse = {
        data: {
          token: 'new-jwt-token',
          refreshToken: 'new-refresh-token',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authApi.refreshToken();

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/auth/refresh-token'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle refresh token errors', async () => {
      const mockError = new Error('Refresh token expired');

      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(authApi.refreshToken()).rejects.toThrow(
        'Refresh token expired'
      );
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/auth/refresh-token'
      );
    });

    it('should handle network errors during refresh', async () => {
      const mockError = new Error('Network Error');

      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(authApi.refreshToken()).rejects.toThrow('Network Error');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/auth/refresh-token'
      );
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete authentication flow', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'testPassword123',
      };

      const loginResponse = {
        data: {
          token: 'jwt-token',
          user: { id: 1, email: 'test@example.com' },
        },
      };

      const logoutResponse = { data: { message: 'Logout successful' } };

      mockAxiosInstance.post
        .mockResolvedValueOnce(loginResponse)
        .mockResolvedValueOnce(logoutResponse);

      // Login
      const loginResult = await authApi.login(credentials);
      expect(loginResult).toEqual(loginResponse);
      expect(mockAxiosInstance.post).toHaveBeenNthCalledWith(
        1,
        '/auth/login',
        credentials
      );

      // Add token
      authApi.addToken(loginResponse.data.token);
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe(
        `Bearer ${loginResponse.data.token}`
      );

      // Logout
      const logoutResult = await authApi.logout();
      expect(logoutResult).toEqual(logoutResponse);
      expect(mockAxiosInstance.post).toHaveBeenNthCalledWith(2, '/auth/logout');
    });

    it('should handle token refresh flow', async () => {
      const token = 'original-token';
      const refreshResponse = {
        data: {
          token: 'new-token',
          refreshToken: 'new-refresh-token',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(refreshResponse);

      // Set initial token
      authApi.addToken(token);
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe(
        `Bearer ${token}`
      );

      // Refresh token
      const result = await authApi.refreshToken();
      expect(result).toEqual(refreshResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/auth/refresh-token'
      );

      // Update with new token
      authApi.addToken(refreshResponse.data.token);
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe(
        `Bearer ${refreshResponse.data.token}`
      );
    });

    it('should handle multiple authentication operations', async () => {
      const operations = [
        {
          type: 'login',
          data: { email: 'test@example.com', password: 'pass' },
        },
        { type: 'refresh', data: null },
        { type: 'logout', data: null },
      ];

      const responses = [
        { data: { token: 'login-token' } },
        { data: { token: 'refresh-token' } },
        { data: { message: 'Logged out' } },
      ];

      mockAxiosInstance.post
        .mockResolvedValueOnce(responses[0])
        .mockResolvedValueOnce(responses[1])
        .mockResolvedValueOnce(responses[2]);

      // Executar operações
      const results = [];
      results.push(await authApi.login(operations[0].data));
      results.push(await authApi.refreshToken());
      results.push(await authApi.logout());

      expect(results).toEqual(responses);
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(3);
    });
  });

  describe('edge cases', () => {
    it('should handle very long tokens', () => {
      const longToken = 'a'.repeat(1000);

      authApi.addToken(longToken);

      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe(
        `Bearer ${longToken}`
      );
    });

    it('should handle special characters in credentials', async () => {
      const credentials = {
        email: 'test+special@example.com',
        password: 'P@ssw0rd!@#$%^&*()',
      };

      const mockResponse = { data: { token: 'token-with-special-chars' } };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authApi.login(credentials);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/auth/login',
        credentials
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle simultaneous authentication requests', async () => {
      const credentials1 = { email: 'user1@example.com', password: 'pass1' };
      const credentials2 = { email: 'user2@example.com', password: 'pass2' };

      const response1 = { data: { token: 'token1' } };
      const response2 = { data: { token: 'token2' } };

      mockAxiosInstance.post
        .mockResolvedValueOnce(response1)
        .mockResolvedValueOnce(response2);

      // Executar requisições simultâneas
      const [result1, result2] = await Promise.all([
        authApi.login(credentials1),
        authApi.login(credentials2),
      ]);

      expect(result1).toEqual(response1);
      expect(result2).toEqual(response2);
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2);
    });
  });
});
