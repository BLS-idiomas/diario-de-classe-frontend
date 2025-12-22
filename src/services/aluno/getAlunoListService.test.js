import { GetAlunoListService } from './getAlunoListService';
import { AlunoApi } from '@/store/api/alunoApi';

// Mock das dependências
jest.mock('@/store/api/alunoApi');

describe('GetAlunoListService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      getAll: jest.fn(),
    };

    // Mock do constructor do AlunoApi
    AlunoApi.mockImplementation(() => mockApi);

    // Clear all mocks
    jest.clearAllMocks();

    service = new GetAlunoListService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided entityApi', () => {
      expect(service.alunoApi).toBe(mockApi);
    });

    it('should store api instance correctly', () => {
      const customApi = { getAll: jest.fn() };
      const customService = new GetAlunoListService(customApi);

      expect(customService.alunoApi).toBe(customApi);
    });

    it('should accept null or undefined dependencies', () => {
      const serviceWithNulls = new GetAlunoListService(null);
      expect(serviceWithNulls.alunoApi).toBeNull();
    });
  });

  describe('execute', () => {
    it('should call api.getAll with search parameter', async () => {
      const searchParam = 'João';
      const mockResponse = {
        data: {
          data: [
            { id: 1, nome: 'João Silva', email: 'joao@aluno.com' },
            { id: 2, nome: 'João Santos', email: 'santos@aluno.com' },
          ],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(mockApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return list of alunos from response data', async () => {
      const searchParam = 'Maria';
      const alunoData1 = {
        id: 1,
        nome: 'Maria Silva',
        email: 'maria@aluno.com',
      };
      const alunoData2 = {
        id: 2,
        nome: 'Maria Santos',
        email: 'santos@aluno.com',
      };
      const mockResponse = {
        data: {
          data: [alunoData1, alunoData2],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(result.data.data).toHaveLength(2);
      expect(result.data.data[0]).toEqual(alunoData1);
      expect(result.data.data[1]).toEqual(alunoData2);
    });

    it('should handle empty search parameter', async () => {
      const searchParam = '';
      const mockResponse = {
        data: {
          data: [
            { id: 1, nome: 'Aluno 1', email: 'aluno1@email.com' },
            { id: 2, nome: 'Aluno 2', email: 'aluno2@email.com' },
          ],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: '' });
    });

    it('should handle null search parameter', async () => {
      const searchParam = null;
      const mockResponse = {
        data: {
          data: [{ id: 1, nome: 'Aluno', email: 'aluno@email.com' }],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: null });
    });

    it('should handle undefined search parameter', async () => {
      const searchParam = undefined;
      const mockResponse = {
        data: {
          data: [{ id: 1, nome: 'Aluno', email: 'aluno@email.com' }],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: undefined });
    });

    it('should handle empty alunos list', async () => {
      const searchParam = 'nonexistent';
      const mockResponse = {
        data: {
          data: [],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(result.data.data).toEqual([]);
      expect(result.data.data).toHaveLength(0);
    });

    it('should handle complex aluno data structures', async () => {
      const searchParam = 'Ana';
      const complexAlunoData = {
        id: 1,
        nome: 'Ana Costa',
        email: 'ana@aluno.com',
        telefone: '11999999999',
        dataNascimento: '2006-05-15',
        matriculas: ['Inglês Básico', 'Espanhol'],
        responsavel: {
          nome: 'José Costa',
          telefone: '11888888888',
        },
        active: true,
        createdAt: '2020-01-15T10:30:00Z',
      };

      const mockResponse = {
        data: {
          data: [complexAlunoData],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(result.data.data[0]).toEqual(complexAlunoData);
    });

    it('should preserve response metadata while transforming data', async () => {
      const searchParam = 'test';
      const mockResponse = {
        data: {
          data: [{ id: 1, nome: 'Test Aluno', email: 'test@aluno.com' }],
          total: 1,
          page: 1,
          limit: 10,
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(result.data.total).toBe(1);
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
      expect(result.status).toBe(200);
      expect(result.statusText).toBe('OK');
      expect(result.headers).toEqual({ 'content-type': 'application/json' });
    });

    it('should handle large lists of alunos efficiently', async () => {
      const searchParam = 'performance';
      const largeAlunosList = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        nome: `Aluno ${i + 1}`,
        email: `aluno${i + 1}@email.com`,
      }));

      const mockResponse = {
        data: {
          data: largeAlunosList,
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const startTime = Date.now();
      const result = await service.execute(searchParam);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(result.data.data).toHaveLength(100);
      expect(result.data.data).toEqual(largeAlunosList);
    });

    it('should propagate API errors', async () => {
      const searchParam = 'error';
      const apiError = new Error('API request failed');
      apiError.status = 500;

      mockApi.getAll.mockRejectedValue(apiError);

      await expect(service.execute(searchParam)).rejects.toThrow(
        'API request failed'
      );
      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
    });

    it('should handle network errors', async () => {
      const searchParam = 'network';
      const networkError = new Error('Network timeout');
      networkError.code = 'TIMEOUT';

      mockApi.getAll.mockRejectedValue(networkError);

      await expect(service.execute(searchParam)).rejects.toThrow(
        'Network timeout'
      );
      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
    });

    it('should handle special characters in search parameter', async () => {
      const searchParam = 'José@aluno.com';
      const mockResponse = {
        data: {
          data: [{ id: 1, nome: 'José Silva', email: 'jose@aluno.com' }],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: 'José@aluno.com' });
    });

    it('should handle numeric search parameters', async () => {
      const searchParam = 123;
      const mockResponse = {
        data: {
          data: [{ id: 123, nome: 'Aluno 123', email: 'aluno123@email.com' }],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: 123 });
    });

    it('should handle boolean search parameters', async () => {
      const searchParam = true;
      const mockResponse = {
        data: {
          data: [{ id: 1, nome: 'Active Aluno', email: 'active@aluno.com' }],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: true });
    });
  });

  describe('static handle method', () => {
    it('should create service instance and execute with provided search parameter', async () => {
      const searchParam = 'static test';
      const mockResponse = {
        data: {
          data: [
            { id: 1, nome: 'Static Test Aluno', email: 'static@aluno.com' },
          ],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await GetAlunoListService.handle(searchParam);

      expect(AlunoApi).toHaveBeenCalledTimes(1);
      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(result.data.data).toHaveLength(1);
      expect(result.data.data[0]).toEqual(
        expect.objectContaining({
          id: 1,
          nome: 'Static Test Aluno',
          email: 'static@aluno.com',
        })
      );
    });

    it('should handle errors in static method', async () => {
      const searchParam = 'error test';
      const apiError = new Error('Static method error');
      apiError.status = 404;

      mockApi.getAll.mockRejectedValue(apiError);

      await expect(GetAlunoListService.handle(searchParam)).rejects.toThrow(
        'Static method error'
      );
      expect(AlunoApi).toHaveBeenCalledTimes(1);
      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
    });

    it('should work with empty search parameter', async () => {
      const searchParam = '';
      const mockResponse = {
        data: {
          data: [
            { id: 1, nome: 'All Alunos', email: 'all@aluno.com' },
            { id: 2, nome: 'Another Aluno', email: 'another@aluno.com' },
          ],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await GetAlunoListService.handle(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: '' });
      expect(result.data.data).toHaveLength(2);
    });

    it('should create new instances each time', async () => {
      const searchParam1 = 'first';
      const searchParam2 = 'second';

      mockApi.getAll.mockResolvedValue({ data: { data: [] } });

      await GetAlunoListService.handle(searchParam1);
      await GetAlunoListService.handle(searchParam2);

      expect(AlunoApi).toHaveBeenCalledTimes(2);
      expect(mockApi.getAll).toHaveBeenCalledTimes(2);
      expect(mockApi.getAll).toHaveBeenNthCalledWith(1, { q: 'first' });
      expect(mockApi.getAll).toHaveBeenNthCalledWith(2, { q: 'second' });
    });

    it('should handle null search parameter in static method', async () => {
      const searchParam = null;
      mockApi.getAll.mockResolvedValue({ data: { data: [] } });

      await GetAlunoListService.handle(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: null });
    });

    it('should handle undefined search parameter in static method', async () => {
      const searchParam = undefined;
      mockApi.getAll.mockResolvedValue({ data: { data: [] } });

      await GetAlunoListService.handle(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: undefined });
    });
  });

  describe('integration scenarios', () => {
    it('should work with real-like paginated aluno data', async () => {
      const searchParam = 'integration';
      const alunosList = [
        {
          id: 1,
          nome: 'Maria Silva',
          sobrenome: 'Costa',
          email: 'maria.silva@aluno.com',
          telefone: '+55 11 98765-4321',
          dataNascimento: '2006-03-15',
          nivel: 'Intermediário',
          matriculas: ['Inglês B1', 'Conversação'],
          active: true,
        },
        {
          id: 2,
          nome: 'João Santos',
          sobrenome: 'Oliveira',
          email: 'joao.santos@aluno.com',
          telefone: '+55 11 87654-3210',
          dataNascimento: '2005-08-20',
          nivel: 'Básico',
          matriculas: ['Inglês A1'],
          active: true,
        },
      ];

      const mockResponse = {
        data: {
          data: alunosList,
          total: 25,
          page: 1,
          limit: 10,
          totalPages: 3,
        },
        status: 200,
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(result.data.data).toHaveLength(2);
      expect(result.data.total).toBe(25);
      expect(result.data.totalPages).toBe(3);
      expect(result.data.data[0]).toEqual(
        expect.objectContaining({
          id: 1,
          nome: 'Maria Silva',
          email: 'maria.silva@aluno.com',
        })
      );
    });

    it('should handle mixed data types in aluno list', async () => {
      const searchParam = 'mixed';
      const mixedAlunos = [
        { id: 1, nome: 'String ID Aluno', email: 'string@aluno.com' },
        { id: 'uuid-123', nome: 'UUID Aluno', email: 'uuid@aluno.com' },
        { id: 999, nome: 'Numeric ID Aluno', email: 'numeric@aluno.com' },
      ];

      const mockResponse = {
        data: {
          data: mixedAlunos,
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(result.data.data).toHaveLength(3);
      expect(result.data.data).toEqual(mixedAlunos);
    });

    it('should handle service composition with filters', async () => {
      const searchParam = 'active alunos';
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              nome: 'Active Aluno 1',
              email: 'active1@aluno.com',
              active: true,
            },
            {
              id: 2,
              nome: 'Active Aluno 2',
              email: 'active2@aluno.com',
              active: true,
            },
          ],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      // Could be further processed by other services
      const activeAlunos = result.data.data.filter(
        aluno => aluno.active !== false
      );
      expect(activeAlunos).toHaveLength(2);
    });

    it('should maintain data consistency through transformation pipeline', async () => {
      const searchParam = 'consistency';
      const originalData = [
        {
          id: 1,
          nome: 'Consistency Test Aluno',
          originalField: 'should be preserved',
          metadata: { version: 1 },
        },
      ];

      const mockResponse = {
        data: {
          data: originalData,
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(result.data.data[0].metadata).toEqual(originalData[0].metadata);
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle authentication errors', async () => {
      const searchParam = 'auth test';
      const authError = new Error('Unauthorized access');
      authError.status = 401;

      mockApi.getAll.mockRejectedValue(authError);

      await expect(service.execute(searchParam)).rejects.toThrow(
        'Unauthorized access'
      );
    });

    it('should handle forbidden access errors', async () => {
      const searchParam = 'forbidden test';
      const forbiddenError = new Error('Access forbidden');
      forbiddenError.status = 403;

      mockApi.getAll.mockRejectedValue(forbiddenError);

      await expect(service.execute(searchParam)).rejects.toThrow(
        'Access forbidden'
      );
    });

    it('should handle server errors', async () => {
      const searchParam = 'server error';
      const serverError = new Error('Internal server error');
      serverError.status = 500;

      mockApi.getAll.mockRejectedValue(serverError);

      await expect(service.execute(searchParam)).rejects.toThrow(
        'Internal server error'
      );
    });

    it('should handle service unavailable errors', async () => {
      const searchParam = 'service error';
      const serviceError = new Error('Service temporarily unavailable');
      serviceError.status = 503;

      mockApi.getAll.mockRejectedValue(serviceError);

      await expect(service.execute(searchParam)).rejects.toThrow(
        'Service temporarily unavailable'
      );
    });

    it('should handle malformed response data structure', async () => {
      const searchParam = 'malformed';
      const malformedResponse = {
        data: {
          // Missing 'data' property
          alunos: [{ id: 1, nome: 'Test' }],
        },
      };

      mockApi.getAll.mockResolvedValue(malformedResponse);

      const result = await service.execute(searchParam);
      expect(result).toEqual(malformedResponse);
    });

    it('should handle null response data', async () => {
      const searchParam = 'null data';
      const nullResponse = {
        data: {
          data: null,
        },
      };

      mockApi.getAll.mockResolvedValue(nullResponse);

      const result = await service.execute(searchParam);
      expect(result).toEqual(nullResponse);
    });

    it('should handle undefined response data', async () => {
      const searchParam = 'undefined data';
      const undefinedResponse = {
        data: {
          data: undefined,
        },
      };

      mockApi.getAll.mockResolvedValue(undefinedResponse);

      const result = await service.execute(searchParam);
      expect(result).toEqual(undefinedResponse);
    });
  });

  describe('performance and reliability', () => {
    it('should handle concurrent search requests gracefully', async () => {
      const searchParams = [
        'search1',
        'search2',
        'search3',
        'search4',
        'search5',
      ];
      const promises = searchParams.map((param, index) => {
        mockApi.getAll.mockResolvedValueOnce({
          data: {
            data: [
              {
                id: index + 1,
                nome: `Aluno ${param}`,
                email: `${param}@aluno.com`,
              },
            ],
          },
        });
        return service.execute(param);
      });

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach((result, index) => {
        expect(result.data.data).toHaveLength(1);
        expect(result.data.data[0]).toEqual(
          expect.objectContaining({
            id: index + 1,
            nome: `Aluno ${searchParams[index]}`,
          })
        );
      });
    });

    it('should handle memory efficiency with large datasets', async () => {
      const searchParam = 'memory test';
      const largeAlunosList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        nome: `Aluno ${i + 1}`,
        email: `aluno${i + 1}@email.com`,
        data: Array.from({ length: 50 }, (_, j) => `field${j}`),
      }));

      const mockResponse = {
        data: {
          data: largeAlunosList,
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const startTime = Date.now();
      const result = await service.execute(searchParam);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000);
      expect(result.data.data).toHaveLength(1000);
    });

    it('should maintain performance with repeated calls', async () => {
      const searchParam = 'repeated';
      const mockResponse = {
        data: {
          data: [
            { id: 1, nome: 'Repeated Aluno', email: 'repeated@aluno.com' },
          ],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const calls = Array.from({ length: 10 }, () =>
        service.execute(searchParam)
      );
      const startTime = Date.now();
      await Promise.all(calls);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(200);
      expect(mockApi.getAll).toHaveBeenCalledTimes(10);
    });
  });
});
