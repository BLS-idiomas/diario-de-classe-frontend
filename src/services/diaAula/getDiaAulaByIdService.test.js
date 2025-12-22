import { GetDiaAulaByIdService } from './getDiaAulaByIdService';
import { DiaAulaApi } from '@/store/api/diaAulaApi';

// Mock da DiaAulaApi
jest.mock('@/store/api/diaAulaApi');

describe('GetDiaAulaByIdService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      getById: jest.fn(),
    };

    // Mock do constructor do DiaAulaApi
    DiaAulaApi.mockImplementation(() => mockApi);

    service = new GetDiaAulaByIdService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided diaAulaApi', () => {
      expect(service.diaAulaApi).toBe(mockApi);
    });

    it('should store references correctly', () => {
      const customApi = { getById: jest.fn() };
      const customService = new GetDiaAulaByIdService(customApi);

      expect(customService.diaAulaApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should get dia aula by id and return response', async () => {
      const diaAulaId = 1;

      const mockResponse = {
        data: {
          id: 1,
          data: '2024-01-15',
          horario: '10:00',
          idProfessor: 1,
          idAluno: 2,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId);

      expect(mockApi.getById).toHaveBeenCalledWith(diaAulaId);
      expect(mockApi.getById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('should handle string id', async () => {
      const diaAulaId = '123';

      const mockResponse = {
        data: {
          id: 123,
          data: '2024-01-16',
          horario: '14:00',
        },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId);

      expect(mockApi.getById).toHaveBeenCalledWith(diaAulaId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle numeric id', async () => {
      const diaAulaId = 456;

      const mockResponse = {
        data: {
          id: 456,
          data: '2024-01-17',
          horario: '16:00',
        },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId);

      expect(mockApi.getById).toHaveBeenCalledWith(diaAulaId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle response with complete dia aula data', async () => {
      const diaAulaId = 10;

      const mockResponse = {
        data: {
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
            { id: 1, tema: 'Grammar', duracao: 60 },
            { id: 2, tema: 'Vocabulary', duracao: 30 },
          ],
          status: 'confirmado',
          createdAt: '2024-01-18T09:00:00Z',
          updatedAt: '2024-01-18T09:00:00Z',
        },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId);

      expect(mockApi.getById).toHaveBeenCalledWith(diaAulaId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle response with null data', async () => {
      const diaAulaId = 789;

      const mockResponse = {
        data: null,
        message: 'Dia aula not found',
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId);

      expect(mockApi.getById).toHaveBeenCalledWith(diaAulaId);
      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors from api', async () => {
      const diaAulaId = 999;

      const mockError = new Error('API Error');
      mockApi.getById.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaId)).rejects.toThrow('API Error');
      expect(mockApi.getById).toHaveBeenCalledWith(diaAulaId);
    });

    it('should handle not found errors', async () => {
      const diaAulaId = 404;

      const mockError = {
        response: {
          status: 404,
          data: {
            message: 'Dia aula not found',
          },
        },
      };

      mockApi.getById.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaId)).rejects.toEqual(mockError);
    });

    it('should handle unauthorized errors', async () => {
      const diaAulaId = 500;

      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'Unauthorized',
          },
        },
      };

      mockApi.getById.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaId)).rejects.toEqual(mockError);
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute', async () => {
      const diaAulaId = 100;

      const mockResponse = {
        data: {
          id: 100,
          data: '2024-01-20',
          horario: '15:00',
        },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await GetDiaAulaByIdService.handle(diaAulaId);

      expect(DiaAulaApi).toHaveBeenCalled();
      expect(mockApi.getById).toHaveBeenCalledWith(diaAulaId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors in static method', async () => {
      const diaAulaId = 200;

      const mockError = new Error('Static method error');
      mockApi.getById.mockRejectedValue(mockError);

      await expect(GetDiaAulaByIdService.handle(diaAulaId)).rejects.toThrow(
        'Static method error'
      );
    });

    it('should create new instances on each call', async () => {
      const diaAulaId1 = 301;
      const diaAulaId2 = 302;

      mockApi.getById.mockResolvedValue({ data: { id: 1 } });

      await GetDiaAulaByIdService.handle(diaAulaId1);
      await GetDiaAulaByIdService.handle(diaAulaId2);

      expect(DiaAulaApi).toHaveBeenCalledTimes(2);
      expect(mockApi.getById).toHaveBeenCalledTimes(2);
    });
  });

  describe('edge cases', () => {
    it('should handle id as 0', async () => {
      const diaAulaId = 0;

      mockApi.getById.mockResolvedValue({ data: { id: 0 } });

      const result = await service.execute(diaAulaId);

      expect(mockApi.getById).toHaveBeenCalledWith(0);
      expect(result).toEqual({ data: { id: 0 } });
    });

    it('should handle negative id', async () => {
      const diaAulaId = -1;

      const mockError = {
        response: {
          data: {
            message: 'Invalid id',
          },
        },
      };

      mockApi.getById.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaId)).rejects.toEqual(mockError);
    });

    it('should handle null id', async () => {
      mockApi.getById.mockResolvedValue({ data: null });

      const result = await service.execute(null);

      expect(mockApi.getById).toHaveBeenCalledWith(null);
      expect(result).toEqual({ data: null });
    });

    it('should handle undefined id', async () => {
      mockApi.getById.mockResolvedValue({ data: undefined });

      const result = await service.execute(undefined);

      expect(mockApi.getById).toHaveBeenCalledWith(undefined);
      expect(result).toEqual({ data: undefined });
    });

    it('should handle network errors', async () => {
      const diaAulaId = 600;
      const networkError = new Error('Network Error');
      networkError.code = 'ECONNREFUSED';

      mockApi.getById.mockRejectedValue(networkError);

      await expect(service.execute(diaAulaId)).rejects.toThrow('Network Error');
    });

    it('should handle timeout errors', async () => {
      const diaAulaId = 700;
      const timeoutError = new Error('Timeout');
      timeoutError.code = 'ETIMEDOUT';

      mockApi.getById.mockRejectedValue(timeoutError);

      await expect(service.execute(diaAulaId)).rejects.toThrow('Timeout');
    });

    it('should handle server errors', async () => {
      const diaAulaId = 800;
      const serverError = {
        response: {
          status: 500,
          data: {
            message: 'Internal server error',
          },
        },
      };

      mockApi.getById.mockRejectedValue(serverError);

      await expect(service.execute(diaAulaId)).rejects.toEqual(serverError);
    });

    it('should handle empty response data', async () => {
      const diaAulaId = 900;

      const mockResponse = {
        data: {},
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId);

      expect(mockApi.getById).toHaveBeenCalledWith(diaAulaId);
      expect(result).toEqual(mockResponse);
    });
  });
});
