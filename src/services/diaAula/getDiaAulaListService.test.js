import { GetDiaAulaListService } from './getDiaAulaListService';
import { DiaAulaApi } from '@/store/api/diaAulaApi';

// Mock da DiaAulaApi
jest.mock('@/store/api/diaAulaApi');

describe('GetDiaAulaListService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      getAll: jest.fn(),
    };

    // Mock do constructor do DiaAulaApi
    DiaAulaApi.mockImplementation(() => mockApi);

    service = new GetDiaAulaListService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided diaAulaApi', () => {
      expect(service.diaAulaApi).toBe(mockApi);
    });

    it('should store references correctly', () => {
      const customApi = { getAll: jest.fn() };
      const customService = new GetDiaAulaListService(customApi);

      expect(customService.diaAulaApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should get list of dias aulas with search param', async () => {
      const searchParam = 'test';

      const mockResponse = {
        data: [
          {
            id: 1,
            data: '2024-01-15',
            horario: '10:00',
            idProfessor: 1,
            idAluno: 2,
          },
          {
            id: 2,
            data: '2024-01-16',
            horario: '14:00',
            idProfessor: 2,
            idAluno: 3,
          },
        ],
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(mockApi.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty search param', async () => {
      const searchParam = '';

      const mockResponse = {
        data: [
          { id: 1, data: '2024-01-15' },
          { id: 2, data: '2024-01-16' },
          { id: 3, data: '2024-01-17' },
        ],
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: '' });
      expect(result).toEqual(mockResponse);
    });

    it('should handle null search param', async () => {
      const searchParam = null;

      const mockResponse = {
        data: [],
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: null });
      expect(result).toEqual(mockResponse);
    });

    it('should handle undefined search param', async () => {
      const searchParam = undefined;

      const mockResponse = {
        data: [],
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('should handle response with empty array', async () => {
      const searchParam = 'nonexistent';

      const mockResponse = {
        data: [],
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(result).toEqual(mockResponse);
    });

    it('should handle response with complete dia aula data', async () => {
      const searchParam = 'complete';

      const mockResponse = {
        data: [
          {
            id: 10,
            data: '2024-01-18',
            horario: '09:00',
            idProfessor: 5,
            idAluno: 3,
            professor: {
              id: 5,
              nome: 'Prof. João',
            },
            aluno: {
              id: 3,
              nome: 'Maria',
            },
            aulas: [
              { id: 1, tema: 'Grammar' },
              { id: 2, tema: 'Vocabulary' },
            ],
            status: 'confirmado',
            createdAt: '2024-01-18T09:00:00Z',
            updatedAt: '2024-01-18T09:00:00Z',
          },
        ],
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(result).toEqual(mockResponse);
    });

    it('should handle response with pagination metadata', async () => {
      const searchParam = 'paginated';

      const mockResponse = {
        data: [
          { id: 1, data: '2024-01-15' },
          { id: 2, data: '2024-01-16' },
        ],
        meta: {
          currentPage: 1,
          totalPages: 5,
          totalItems: 50,
          perPage: 10,
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(result).toEqual(mockResponse);
    });

    it('should handle special characters in search param', async () => {
      const searchParam = 'test@#$%&*()';

      const mockResponse = {
        data: [],
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(result).toEqual(mockResponse);
    });

    it('should handle numeric search param', async () => {
      const searchParam = 123;

      const mockResponse = {
        data: [{ id: 123, data: '2024-01-15' }],
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: 123 });
      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors from api', async () => {
      const searchParam = 'error';

      const mockError = new Error('API Error');
      mockApi.getAll.mockRejectedValue(mockError);

      await expect(service.execute(searchParam)).rejects.toThrow('API Error');
      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
    });

    it('should handle unauthorized errors', async () => {
      const searchParam = 'unauthorized';

      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'Unauthorized',
          },
        },
      };

      mockApi.getAll.mockRejectedValue(mockError);

      await expect(service.execute(searchParam)).rejects.toEqual(mockError);
    });

    it('should handle server errors', async () => {
      const searchParam = 'server-error';

      const mockError = {
        response: {
          status: 500,
          data: {
            message: 'Internal server error',
          },
        },
      };

      mockApi.getAll.mockRejectedValue(mockError);

      await expect(service.execute(searchParam)).rejects.toEqual(mockError);
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute', async () => {
      const searchParam = 'static';

      const mockResponse = {
        data: [
          { id: 1, data: '2024-01-15' },
          { id: 2, data: '2024-01-16' },
        ],
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await GetDiaAulaListService.handle(searchParam);

      expect(DiaAulaApi).toHaveBeenCalled();
      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors in static method', async () => {
      const searchParam = 'error';

      const mockError = new Error('Static method error');
      mockApi.getAll.mockRejectedValue(mockError);

      await expect(GetDiaAulaListService.handle(searchParam)).rejects.toThrow(
        'Static method error'
      );
    });

    it('should create new instances on each call', async () => {
      const searchParam1 = 'first';
      const searchParam2 = 'second';

      mockApi.getAll.mockResolvedValue({ data: [] });

      await GetDiaAulaListService.handle(searchParam1);
      await GetDiaAulaListService.handle(searchParam2);

      expect(DiaAulaApi).toHaveBeenCalledTimes(2);
      expect(mockApi.getAll).toHaveBeenCalledTimes(2);
      expect(mockApi.getAll).toHaveBeenNthCalledWith(1, { q: searchParam1 });
      expect(mockApi.getAll).toHaveBeenNthCalledWith(2, { q: searchParam2 });
    });

    it('should handle empty search param in static method', async () => {
      const searchParam = '';

      mockApi.getAll.mockResolvedValue({ data: [] });

      const result = await GetDiaAulaListService.handle(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: '' });
      expect(result).toEqual({ data: [] });
    });
  });

  describe('edge cases', () => {
    it('should handle very long search param', async () => {
      const searchParam = 'a'.repeat(1000);

      const mockResponse = {
        data: [],
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(result).toEqual(mockResponse);
    });

    it('should handle search param with whitespace', async () => {
      const searchParam = '  test  ';

      const mockResponse = {
        data: [{ id: 1, data: '2024-01-15' }],
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(result).toEqual(mockResponse);
    });

    it('should handle network errors', async () => {
      const searchParam = 'network';
      const networkError = new Error('Network Error');
      networkError.code = 'ECONNREFUSED';

      mockApi.getAll.mockRejectedValue(networkError);

      await expect(service.execute(searchParam)).rejects.toThrow(
        'Network Error'
      );
    });

    it('should handle timeout errors', async () => {
      const searchParam = 'timeout';
      const timeoutError = new Error('Timeout');
      timeoutError.code = 'ETIMEDOUT';

      mockApi.getAll.mockRejectedValue(timeoutError);

      await expect(service.execute(searchParam)).rejects.toThrow('Timeout');
    });

    it('should handle response with null data', async () => {
      const searchParam = 'null-data';

      const mockResponse = {
        data: null,
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(result).toEqual(mockResponse);
    });

    it('should handle search param with unicode characters', async () => {
      const searchParam = '测试 тест テスト';

      const mockResponse = {
        data: [],
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(result).toEqual(mockResponse);
    });

    it('should handle boolean search param', async () => {
      const searchParam = true;

      const mockResponse = {
        data: [],
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: true });
      expect(result).toEqual(mockResponse);
    });

    it('should handle object search param', async () => {
      const searchParam = { test: 'value' };

      const mockResponse = {
        data: [],
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(result).toEqual(mockResponse);
    });
  });
});
