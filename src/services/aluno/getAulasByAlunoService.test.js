import { GetAulasByAlunoService } from './getAulasByAlunoService';
import { AlunoApi } from '@/store/api/alunoApi';

// Mock das dependências
jest.mock('@/store/api/alunoApi');

describe('GetAulasByAlunoService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      getAulasByAluno: jest.fn(),
    };

    // Mock do constructor do AlunoApi
    AlunoApi.mockImplementation(() => mockApi);

    service = new GetAulasByAlunoService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided alunoApi', () => {
      expect(service.alunoApi).toBe(mockApi);
    });

    it('should store api instance correctly', () => {
      const customApi = { getAulasByAluno: jest.fn() };
      const customService = new GetAulasByAlunoService(customApi);

      expect(customService.alunoApi).toBe(customApi);
    });

    it('should accept null or undefined dependencies', () => {
      const serviceWithNull = new GetAulasByAlunoService(null);
      expect(serviceWithNull.alunoApi).toBeNull();
    });
  });

  describe('execute', () => {
    it('should call api.getAulasByAluno with correct ID', async () => {
      const testId = 123;
      const mockResponse = {
        data: [
          { id: 1, titulo: 'Aula 1', data: '2024-01-01' },
          { id: 2, titulo: 'Aula 2', data: '2024-01-02' },
        ],
      };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getAulasByAluno).toHaveBeenCalledWith(testId);
      expect(mockApi.getAulasByAluno).toHaveBeenCalledTimes(1);
    });

    it('should return aulas list from API response', async () => {
      const testId = 456;
      const aulasData = [
        { id: 1, titulo: 'Aula de Inglês', data: '2024-01-01' },
        { id: 2, titulo: 'Aula de Espanhol', data: '2024-01-02' },
        { id: 3, titulo: 'Aula de Francês', data: '2024-01-03' },
      ];
      const mockResponse = { data: aulasData };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toEqual(aulasData);
      expect(result.data).toHaveLength(3);
    });

    it('should return empty array when no aulas exist', async () => {
      const testId = 789;
      const mockResponse = { data: [] };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toEqual([]);
      expect(result.data).toHaveLength(0);
    });

    it('should handle null data in response', async () => {
      const testId = 999;
      const mockResponse = { data: null };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toBeNull();
    });

    it('should handle undefined data in response', async () => {
      const testId = 111;
      const mockResponse = { data: undefined };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toBeUndefined();
    });

    it('should propagate API errors', async () => {
      const testId = 222;
      const mockError = new Error('API Error');

      mockApi.getAulasByAluno.mockRejectedValue(mockError);

      await expect(service.execute(testId)).rejects.toThrow('API Error');
    });

    it('should handle network errors', async () => {
      const testId = 333;
      const networkError = new Error('Network Error');

      mockApi.getAulasByAluno.mockRejectedValue(networkError);

      await expect(service.execute(testId)).rejects.toThrow('Network Error');
    });

    it('should handle 404 errors', async () => {
      const testId = 444;
      const notFoundError = new Error('Aluno not found');

      mockApi.getAulasByAluno.mockRejectedValue(notFoundError);

      await expect(service.execute(testId)).rejects.toThrow('Aluno not found');
    });

    it('should call API with string ID', async () => {
      const testId = '555';
      const mockResponse = { data: [] };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getAulasByAluno).toHaveBeenCalledWith('555');
    });

    it('should handle large datasets', async () => {
      const testId = 666;
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        titulo: `Aula ${i + 1}`,
        data: '2024-01-01',
      }));
      const mockResponse = { data: largeDataset };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toHaveLength(1000);
      expect(result.data[0]).toEqual({
        id: 1,
        titulo: 'Aula 1',
        data: '2024-01-01',
      });
    });

    it('should return response with additional metadata', async () => {
      const testId = 777;
      const mockResponse = {
        data: [{ id: 1, titulo: 'Aula 1' }],
        metadata: { total: 1, page: 1 },
      };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toHaveLength(1);
      expect(result.metadata).toEqual({ total: 1, page: 1 });
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and call execute', async () => {
      const testId = 888;
      const mockResponse = {
        data: [{ id: 1, titulo: 'Aula Teste' }],
      };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      const result = await GetAulasByAlunoService.handle(testId);

      expect(AlunoApi).toHaveBeenCalled();
      expect(mockApi.getAulasByAluno).toHaveBeenCalledWith(testId);
      expect(result.data).toEqual([{ id: 1, titulo: 'Aula Teste' }]);
    });

    it('should work with different IDs', async () => {
      const testIds = [1, 2, 3];
      const mockResponse = { data: [] };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      for (const id of testIds) {
        await GetAulasByAlunoService.handle(id);
        expect(mockApi.getAulasByAluno).toHaveBeenCalledWith(id);
      }
    });

    it('should propagate errors from execute method', async () => {
      const testId = 999;
      const mockError = new Error('Service Error');

      mockApi.getAulasByAluno.mockRejectedValue(mockError);

      await expect(GetAulasByAlunoService.handle(testId)).rejects.toThrow(
        'Service Error'
      );
    });

    it('should create new API instance each time', async () => {
      const testId = 101;
      const mockResponse = { data: [] };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      await GetAulasByAlunoService.handle(testId);
      await GetAulasByAlunoService.handle(testId);

      expect(AlunoApi).toHaveBeenCalledTimes(2);
    });

    it('should handle concurrent calls', async () => {
      const ids = [1, 2, 3, 4, 5];
      const mockResponse = { data: [] };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      const promises = ids.map(id => GetAulasByAlunoService.handle(id));
      await Promise.all(promises);

      expect(mockApi.getAulasByAluno).toHaveBeenCalledTimes(5);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete workflow', async () => {
      const alunoId = 123;
      const aulasData = [
        { id: 1, titulo: 'Aula 1', professor: 'Prof A' },
        { id: 2, titulo: 'Aula 2', professor: 'Prof B' },
      ];
      const mockResponse = { data: aulasData };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      const result = await GetAulasByAlunoService.handle(alunoId);

      expect(result.data).toEqual(aulasData);
      expect(AlunoApi).toHaveBeenCalled();
    });

    it('should handle error scenarios in workflow', async () => {
      const alunoId = 456;
      const error = new Error('Database connection failed');

      mockApi.getAulasByAluno.mockRejectedValue(error);

      await expect(GetAulasByAlunoService.handle(alunoId)).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should maintain data integrity through service layers', async () => {
      const alunoId = 789;
      const originalData = [{ id: 1, titulo: 'Original', data: '2024-01-01' }];
      const mockResponse = { data: originalData };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(alunoId);

      expect(result.data).toEqual(originalData);
      expect(result.data[0]).toEqual(originalData[0]);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero as ID', async () => {
      const testId = 0;
      const mockResponse = { data: [] };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getAulasByAluno).toHaveBeenCalledWith(0);
    });

    it('should handle negative ID', async () => {
      const testId = -1;
      const mockResponse = { data: [] };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getAulasByAluno).toHaveBeenCalledWith(-1);
    });

    it('should handle very large ID numbers', async () => {
      const testId = 9999999999;
      const mockResponse = { data: [] };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getAulasByAluno).toHaveBeenCalledWith(9999999999);
    });

    it('should handle response without data property', async () => {
      const testId = 123;
      const mockResponse = { aulas: [] };

      mockApi.getAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result).toEqual(mockResponse);
    });

    it('should handle timeout errors', async () => {
      const testId = 456;
      const timeoutError = new Error('Request timeout');

      mockApi.getAulasByAluno.mockRejectedValue(timeoutError);

      await expect(service.execute(testId)).rejects.toThrow('Request timeout');
    });
  });
});
