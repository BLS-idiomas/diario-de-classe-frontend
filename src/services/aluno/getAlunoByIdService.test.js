import { GetAlunoByIdService } from './getAlunoByIdService';
import { AlunoApi } from '@/store/api/alunoApi';

// Mock das dependências
jest.mock('@/store/api/alunoApi');

describe('GetAlunoByIdService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      getById: jest.fn(),
    };

    // Mock do constructor do AlunoApi
    AlunoApi.mockImplementation(() => mockApi);

    // Clear all mocks
    jest.clearAllMocks();

    service = new GetAlunoByIdService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided entityApi', () => {
      expect(service.alunoApi).toBe(mockApi);
    });

    it('should store api instance correctly', () => {
      const customApi = { getById: jest.fn() };
      const customService = new GetAlunoByIdService(customApi);

      expect(customService.alunoApi).toBe(customApi);
    });

    it('should accept null or undefined dependencies', () => {
      const serviceWithNulls = new GetAlunoByIdService(null);
      expect(serviceWithNulls.alunoApi).toBeNull();
    });
  });

  describe('execute', () => {
    it('should call api.getById with correct ID', async () => {
      const testId = 123;
      const mockResponse = {
        data: {
          id: testId,
          nome: 'João Silva',
          email: 'joao@aluno.com',
        },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getById).toHaveBeenCalledWith(testId);
      expect(mockApi.getById).toHaveBeenCalledTimes(1);
    });

    it('should return response data when data exists', async () => {
      const testId = 456;
      const responseData = {
        id: testId,
        nome: 'Maria Santos',
        email: 'maria@aluno.com',
        telefone: '11999999999',
      };
      const mockResponse = { data: responseData };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toEqual(responseData);
    });

    it('should return original response when data is null', async () => {
      const testId = 789;
      const mockResponse = { data: null };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result).toEqual(mockResponse);
      expect(result.data).toBeNull();
    });

    it('should return original response when data is undefined', async () => {
      const testId = 999;
      const mockResponse = { data: undefined };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result).toEqual(mockResponse);
      expect(result.data).toBeUndefined();
    });

    it('should handle string IDs', async () => {
      const testId = 'uuid-123-456';
      const mockResponse = {
        data: {
          id: testId,
          nome: 'Aluno UUID',
          email: 'uuid@aluno.com',
        },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getById).toHaveBeenCalledWith(testId);
    });

    it('should handle complex aluno data', async () => {
      const testId = 111;
      const complexData = {
        id: testId,
        nome: 'Ana Costa',
        email: 'ana@aluno.com',
        telefone: '11888888888',
        matriculas: ['Inglês Básico', 'Espanhol Intermediário'],
        responsavel: {
          nome: 'José Costa',
          telefone: '11777777777',
        },
        active: true,
      };
      const mockResponse = { data: complexData };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toEqual(complexData);
    });

    it('should propagate API errors', async () => {
      const testId = 404;
      const apiError = new Error('Aluno not found');
      apiError.status = 404;

      mockApi.getById.mockRejectedValue(apiError);

      await expect(service.execute(testId)).rejects.toThrow('Aluno not found');
      expect(mockApi.getById).toHaveBeenCalledWith(testId);
    });

    it('should handle network errors', async () => {
      const testId = 500;
      const networkError = new Error('Network timeout');
      networkError.code = 'TIMEOUT';

      mockApi.getById.mockRejectedValue(networkError);

      await expect(service.execute(testId)).rejects.toThrow('Network timeout');
      expect(mockApi.getById).toHaveBeenCalledWith(testId);
    });

    it('should handle empty response data object', async () => {
      const testId = 777;
      const mockResponse = { data: {} };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toEqual({});
    });

    it('should preserve response metadata', async () => {
      const testId = 888;
      const mockResponse = {
        data: {
          id: testId,
          nome: 'Test Aluno',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.status).toBe(200);
      expect(result.statusText).toBe('OK');
      expect(result.headers).toEqual({ 'content-type': 'application/json' });
    });
  });

  describe('static handle method', () => {
    it('should create service instance and execute with provided ID', async () => {
      const testId = 123;
      const mockResponse = {
        data: {
          id: testId,
          nome: 'Static Test Aluno',
          email: 'static@aluno.com',
        },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await GetAlunoByIdService.handle(testId);

      expect(AlunoApi).toHaveBeenCalledTimes(1);
      expect(mockApi.getById).toHaveBeenCalledWith(testId);
      expect(result.data).toEqual(
        expect.objectContaining({
          id: testId,
          nome: 'Static Test Aluno',
          email: 'static@aluno.com',
        })
      );
    });

    it('should handle errors in static method', async () => {
      const testId = 404;
      const apiError = new Error('Not found');
      apiError.status = 404;

      mockApi.getById.mockRejectedValue(apiError);

      await expect(GetAlunoByIdService.handle(testId)).rejects.toThrow(
        'Not found'
      );
      expect(AlunoApi).toHaveBeenCalledTimes(1);
      expect(mockApi.getById).toHaveBeenCalledWith(testId);
    });

    it('should work with different ID types', async () => {
      const stringId = 'abc-123';
      const mockResponse = {
        data: {
          id: stringId,
          nome: 'String ID Aluno',
        },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      await GetAlunoByIdService.handle(stringId);

      expect(mockApi.getById).toHaveBeenCalledWith(stringId);
    });

    it('should create new instances each time', async () => {
      const testId1 = 111;
      const testId2 = 222;

      mockApi.getById.mockResolvedValue({ data: { id: testId1 } });
      await GetAlunoByIdService.handle(testId1);

      mockApi.getById.mockResolvedValue({ data: { id: testId2 } });
      await GetAlunoByIdService.handle(testId2);

      expect(AlunoApi).toHaveBeenCalledTimes(2);
      expect(mockApi.getById).toHaveBeenCalledTimes(2);
    });

    it('should handle null or undefined IDs', async () => {
      mockApi.getById.mockResolvedValue({ data: null });

      await GetAlunoByIdService.handle(null);
      await GetAlunoByIdService.handle(undefined);

      expect(mockApi.getById).toHaveBeenCalledWith(null);
      expect(mockApi.getById).toHaveBeenCalledWith(undefined);
      expect(mockApi.getById).toHaveBeenCalledTimes(2);
    });
  });

  describe('integration scenarios', () => {
    it('should work with real-like aluno data structure', async () => {
      const testId = 999;
      const alunoData = {
        id: testId,
        nome: 'Carlos Mendes',
        sobrenome: 'Silva',
        email: 'carlos.mendes@aluno.com',
        telefone: '+55 11 98765-4321',
        dataNascimento: '2006-05-15',
        nivel: 'Intermediário',
        matriculas: [
          {
            curso: 'Inglês Intermediário',
            turma: 'B2',
            dataInicio: '2023-01-15',
          },
        ],
        responsavel: {
          nome: 'Maria Silva',
          telefone: '(11) 99999-9999',
          email: 'maria@email.com',
        },
        active: true,
        createdAt: '2020-01-15T10:30:00Z',
        updatedAt: '2024-11-08T14:22:00Z',
      };

      const mockResponse = { data: alunoData };
      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toEqual(alunoData);
    });

    it('should maintain data integrity through transformation', async () => {
      const testId = 777;
      const originalData = {
        id: testId,
        nome: 'Data Integrity Test',
        sensitive: 'should be preserved',
        metadata: { version: 1, lastModified: Date.now() },
      };

      const mockResponse = { data: originalData };
      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toEqual(originalData);
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle zero as valid ID', async () => {
      const testId = 0;
      const mockResponse = { data: { id: testId, nome: 'Zero ID Aluno' } };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(mockApi.getById).toHaveBeenCalledWith(testId);
      expect(result.data).toEqual(expect.objectContaining({ id: testId }));
    });

    it('should handle authentication errors', async () => {
      const testId = 401;
      const authError = new Error('Unauthorized access');
      authError.status = 401;

      mockApi.getById.mockRejectedValue(authError);

      await expect(service.execute(testId)).rejects.toThrow(
        'Unauthorized access'
      );
    });

    it('should handle forbidden access errors', async () => {
      const testId = 403;
      const forbiddenError = new Error('Access forbidden');
      forbiddenError.status = 403;

      mockApi.getById.mockRejectedValue(forbiddenError);

      await expect(service.execute(testId)).rejects.toThrow('Access forbidden');
    });

    it('should handle server errors', async () => {
      const testId = 500;
      const serverError = new Error('Internal server error');
      serverError.status = 500;

      mockApi.getById.mockRejectedValue(serverError);

      await expect(service.execute(testId)).rejects.toThrow(
        'Internal server error'
      );
    });

    it('should handle service unavailable errors', async () => {
      const testId = 503;
      const serviceError = new Error('Service temporarily unavailable');
      serviceError.status = 503;

      mockApi.getById.mockRejectedValue(serviceError);

      await expect(service.execute(testId)).rejects.toThrow(
        'Service temporarily unavailable'
      );
    });
  });

  describe('performance and reliability', () => {
    it('should handle large aluno data objects efficiently', async () => {
      const testId = 1000;
      const largeData = {
        id: testId,
        nome: 'Performance Test Aluno',
        ...Array.from({ length: 100 }, (_, i) => ({
          [`field${i}`]: `value${i}`,
        })).reduce((acc, obj) => ({ ...acc, ...obj }), {}),
      };

      const mockResponse = { data: largeData };
      mockApi.getById.mockResolvedValue(mockResponse);

      const startTime = Date.now();
      const result = await service.execute(testId);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(result.data).toEqual(
        expect.objectContaining({
          id: testId,
          nome: 'Performance Test Aluno',
        })
      );
    });

    it('should handle concurrent requests gracefully', async () => {
      const testIds = [1, 2, 3, 4, 5];
      const promises = testIds.map(id => {
        mockApi.getById.mockResolvedValueOnce({
          data: { id, nome: `Aluno ${id}` },
        });
        return service.execute(id);
      });

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach((result, index) => {
        expect(result.data).toEqual(
          expect.objectContaining({
            id: testIds[index],
            nome: `Aluno ${testIds[index]}`,
          })
        );
      });
    });
  });
});
