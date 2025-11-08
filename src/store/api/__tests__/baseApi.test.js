import axios from 'axios';
import { BaseApi } from '../baseApi';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios;

describe('BaseApi', () => {
  let baseApi;
  let mockAxiosInstance;

  beforeEach(() => {
    // Mock da instância do axios
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);

    // Limpar mocks
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create axios instance with default API_URL when NEXT_PUBLIC_API_URL is not set', () => {
      // Garantir que a variável de ambiente não está definida
      delete process.env.NEXT_PUBLIC_API_URL;

      baseApi = new BaseApi();

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:3000/api',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should create axios instance with custom API_URL from environment variable', () => {
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';

      baseApi = new BaseApi();

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.example.com',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Limpar a variável de ambiente
      delete process.env.NEXT_PUBLIC_API_URL;
    });

    it('should set correct Content-Type header', () => {
      baseApi = new BaseApi();

      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  describe('HTTP methods', () => {
    beforeEach(() => {
      baseApi = new BaseApi();
    });

    describe('get', () => {
      it('should call axios get with endpoint and no params', async () => {
        const mockResponse = { data: { id: 1, name: 'Test' } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await baseApi.get('/users');

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users', {
          params: {},
        });
        expect(result).toEqual(mockResponse);
      });

      it('should call axios get with endpoint and params', async () => {
        const mockResponse = { data: [{ id: 1, name: 'Test' }] };
        const params = { page: 1, limit: 10 };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await baseApi.get('/users', params);

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users', {
          params,
        });
        expect(result).toEqual(mockResponse);
      });

      it('should handle get request errors', async () => {
        const mockError = new Error('Network Error');
        mockAxiosInstance.get.mockRejectedValue(mockError);

        await expect(baseApi.get('/users')).rejects.toThrow('Network Error');
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users', {
          params: {},
        });
      });
    });

    describe('post', () => {
      it('should call axios post with endpoint and data', async () => {
        const mockResponse = { data: { id: 1, name: 'Created User' } };
        const postData = { name: 'New User', email: 'user@example.com' };
        mockAxiosInstance.post.mockResolvedValue(mockResponse);

        const result = await baseApi.post('/users', postData);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', postData);
        expect(result).toEqual(mockResponse);
      });

      it('should handle post request errors', async () => {
        const mockError = new Error('Validation Error');
        const postData = { name: 'New User' };
        mockAxiosInstance.post.mockRejectedValue(mockError);

        await expect(baseApi.post('/users', postData)).rejects.toThrow(
          'Validation Error'
        );
        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', postData);
      });

      it('should handle post with undefined data', async () => {
        const mockResponse = { data: { message: 'Success' } };
        mockAxiosInstance.post.mockResolvedValue(mockResponse);

        const result = await baseApi.post('/users', undefined);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          '/users',
          undefined
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('put', () => {
      it('should call axios put with endpoint and data', async () => {
        const mockResponse = { data: { id: 1, name: 'Updated User' } };
        const putData = { name: 'Updated User', email: 'updated@example.com' };
        mockAxiosInstance.put.mockResolvedValue(mockResponse);

        const result = await baseApi.put('/users/1', putData);

        expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', putData);
        expect(result).toEqual(mockResponse);
      });

      it('should handle put request errors', async () => {
        const mockError = new Error('Not Found');
        const putData = { name: 'Updated User' };
        mockAxiosInstance.put.mockRejectedValue(mockError);

        await expect(baseApi.put('/users/999', putData)).rejects.toThrow(
          'Not Found'
        );
        expect(mockAxiosInstance.put).toHaveBeenCalledWith(
          '/users/999',
          putData
        );
      });

      it('should handle put with null data', async () => {
        const mockResponse = { data: { message: 'Updated' } };
        mockAxiosInstance.put.mockResolvedValue(mockResponse);

        const result = await baseApi.put('/users/1', null);

        expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', null);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('delete', () => {
      it('should call axios delete with endpoint', async () => {
        const mockResponse = { data: { message: 'User deleted' } };
        mockAxiosInstance.delete.mockResolvedValue(mockResponse);

        const result = await baseApi.delete('/users/1');

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1');
        expect(result).toEqual(mockResponse);
      });

      it('should handle delete request errors', async () => {
        const mockError = new Error('Forbidden');
        mockAxiosInstance.delete.mockRejectedValue(mockError);

        await expect(baseApi.delete('/users/1')).rejects.toThrow('Forbidden');
        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1');
      });

      it('should handle delete with empty endpoint', async () => {
        const mockResponse = { data: { message: 'Deleted' } };
        mockAxiosInstance.delete.mockResolvedValue(mockResponse);

        const result = await baseApi.delete('');

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('');
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('integration scenarios', () => {
    beforeEach(() => {
      baseApi = new BaseApi();
    });

    it('should handle multiple consecutive requests', async () => {
      const getUsersResponse = { data: [{ id: 1, name: 'User 1' }] };
      const createUserResponse = { data: { id: 2, name: 'User 2' } };
      const updateUserResponse = { data: { id: 2, name: 'Updated User 2' } };
      const deleteUserResponse = { data: { message: 'User deleted' } };

      mockAxiosInstance.get.mockResolvedValue(getUsersResponse);
      mockAxiosInstance.post.mockResolvedValue(createUserResponse);
      mockAxiosInstance.put.mockResolvedValue(updateUserResponse);
      mockAxiosInstance.delete.mockResolvedValue(deleteUserResponse);

      // Executar múltiplas requisições
      const users = await baseApi.get('/users');
      const newUser = await baseApi.post('/users', { name: 'User 2' });
      const updatedUser = await baseApi.put('/users/2', {
        name: 'Updated User 2',
      });
      const deleteResult = await baseApi.delete('/users/2');

      // Verificar se todas as chamadas foram feitas corretamente
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users', {
        params: {},
      });
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', {
        name: 'User 2',
      });
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/2', {
        name: 'Updated User 2',
      });
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/2');

      // Verificar os resultados
      expect(users).toEqual(getUsersResponse);
      expect(newUser).toEqual(createUserResponse);
      expect(updatedUser).toEqual(updateUserResponse);
      expect(deleteResult).toEqual(deleteUserResponse);
    });

    it('should handle mixed success and error responses', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: { success: true } });
      mockAxiosInstance.post.mockRejectedValue(new Error('Creation failed'));

      // Primeira requisição deve ter sucesso
      const getResult = await baseApi.get('/test');
      expect(getResult.data.success).toBe(true);

      // Segunda requisição deve falhar
      await expect(baseApi.post('/test', {})).rejects.toThrow(
        'Creation failed'
      );

      // Verificar que ambas as chamadas foram feitas
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      baseApi = new BaseApi();
    });

    it('should handle very long endpoints', async () => {
      const longEndpoint =
        '/very/long/endpoint/with/many/segments/and/parameters';
      const mockResponse = { data: { result: 'success' } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await baseApi.get(longEndpoint);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(longEndpoint, {
        params: {},
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle special characters in endpoints', async () => {
      const specialEndpoint = '/users/search?name=João&city=São Paulo';
      const mockResponse = { data: { users: [] } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await baseApi.get(specialEndpoint);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(specialEndpoint, {
        params: {},
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle large data objects', async () => {
      const largeData = {
        users: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          data: Array(100).fill('large data chunk'),
        })),
      };
      const mockResponse = { data: { message: 'Large data processed' } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await baseApi.post('/bulk-users', largeData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/bulk-users',
        largeData
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
