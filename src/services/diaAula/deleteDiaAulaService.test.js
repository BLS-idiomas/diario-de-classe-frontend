import { DeleteDiaAulaService } from './deleteDiaAulaService';
import { DiaAulaApi } from '@/store/api/diaAulaApi';

// Mock da DiaAulaApi
jest.mock('@/store/api/diaAulaApi');

describe('DeleteDiaAulaService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      delete: jest.fn(),
    };

    // Mock do constructor do DiaAulaApi
    DiaAulaApi.mockImplementation(() => mockApi);

    service = new DeleteDiaAulaService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided diaAulaApi', () => {
      expect(service.diaAulaApi).toBe(mockApi);
    });

    it('should store references correctly', () => {
      const customApi = { delete: jest.fn() };
      const customService = new DeleteDiaAulaService(customApi);

      expect(customService.diaAulaApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should delete dia aula by id and return response', async () => {
      const diaAulaId = 1;

      const mockResponse = {
        data: {
          message: 'Dia aula deleted successfully',
        },
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId);

      expect(mockApi.delete).toHaveBeenCalledWith(diaAulaId);
      expect(mockApi.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('should handle string id', async () => {
      const diaAulaId = '123';

      const mockResponse = {
        data: {
          message: 'Dia aula deleted successfully',
        },
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId);

      expect(mockApi.delete).toHaveBeenCalledWith(diaAulaId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle numeric id', async () => {
      const diaAulaId = 456;

      const mockResponse = {
        data: {
          message: 'Dia aula deleted successfully',
        },
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId);

      expect(mockApi.delete).toHaveBeenCalledWith(diaAulaId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle response with null data', async () => {
      const diaAulaId = 789;

      const mockResponse = {
        data: null,
        message: 'Deleted',
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId);

      expect(mockApi.delete).toHaveBeenCalledWith(diaAulaId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle successful deletion with additional metadata', async () => {
      const diaAulaId = 10;

      const mockResponse = {
        data: {
          id: diaAulaId,
          message: 'Dia aula deleted successfully',
          deletedAt: '2024-01-15T10:00:00Z',
        },
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId);

      expect(mockApi.delete).toHaveBeenCalledWith(diaAulaId);
      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors from api', async () => {
      const diaAulaId = 999;

      const mockError = new Error('API Error');
      mockApi.delete.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaId)).rejects.toThrow('API Error');
      expect(mockApi.delete).toHaveBeenCalledWith(diaAulaId);
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

      mockApi.delete.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaId)).rejects.toEqual(mockError);
    });

    it('should handle forbidden errors', async () => {
      const diaAulaId = 500;

      const mockError = {
        response: {
          status: 403,
          data: {
            message: 'Forbidden to delete this dia aula',
          },
        },
      };

      mockApi.delete.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaId)).rejects.toEqual(mockError);
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute', async () => {
      const diaAulaId = 100;

      const mockResponse = {
        data: {
          message: 'Dia aula deleted successfully',
        },
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await DeleteDiaAulaService.handle(diaAulaId);

      expect(DiaAulaApi).toHaveBeenCalled();
      expect(mockApi.delete).toHaveBeenCalledWith(diaAulaId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors in static method', async () => {
      const diaAulaId = 200;

      const mockError = new Error('Static method error');
      mockApi.delete.mockRejectedValue(mockError);

      await expect(DeleteDiaAulaService.handle(diaAulaId)).rejects.toThrow(
        'Static method error'
      );
    });

    it('should create new instances on each call', async () => {
      const diaAulaId1 = 301;
      const diaAulaId2 = 302;

      mockApi.delete.mockResolvedValue({ data: { message: 'Deleted' } });

      await DeleteDiaAulaService.handle(diaAulaId1);
      await DeleteDiaAulaService.handle(diaAulaId2);

      expect(DiaAulaApi).toHaveBeenCalledTimes(2);
      expect(mockApi.delete).toHaveBeenCalledTimes(2);
    });
  });

  describe('edge cases', () => {
    it('should handle id as 0', async () => {
      const diaAulaId = 0;

      mockApi.delete.mockResolvedValue({ data: { message: 'Deleted' } });

      const result = await service.execute(diaAulaId);

      expect(mockApi.delete).toHaveBeenCalledWith(0);
      expect(result).toEqual({ data: { message: 'Deleted' } });
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

      mockApi.delete.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaId)).rejects.toEqual(mockError);
    });

    it('should handle null id', async () => {
      mockApi.delete.mockResolvedValue({ data: null });

      const result = await service.execute(null);

      expect(mockApi.delete).toHaveBeenCalledWith(null);
      expect(result).toEqual({ data: null });
    });

    it('should handle undefined id', async () => {
      mockApi.delete.mockResolvedValue({ data: undefined });

      const result = await service.execute(undefined);

      expect(mockApi.delete).toHaveBeenCalledWith(undefined);
      expect(result).toEqual({ data: undefined });
    });

    it('should handle network errors', async () => {
      const diaAulaId = 600;
      const networkError = new Error('Network Error');
      networkError.code = 'ECONNREFUSED';

      mockApi.delete.mockRejectedValue(networkError);

      await expect(service.execute(diaAulaId)).rejects.toThrow('Network Error');
    });

    it('should handle timeout errors', async () => {
      const diaAulaId = 700;
      const timeoutError = new Error('Timeout');
      timeoutError.code = 'ETIMEDOUT';

      mockApi.delete.mockRejectedValue(timeoutError);

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

      mockApi.delete.mockRejectedValue(serverError);

      await expect(service.execute(diaAulaId)).rejects.toEqual(serverError);
    });
  });
});
