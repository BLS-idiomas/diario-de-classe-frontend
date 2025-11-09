import { GetProfessorByIdService } from '../getProfessorByIdService';
import { Professor } from '@/models/Professor';
import { ProfessorApi } from '@/store/api/professorApi';

// Mock das dependências
jest.mock('@/models/Professor');
jest.mock('@/store/api/professorApi');

describe('GetProfessorByIdService', () => {
  let mockApi;
  let mockModel;
  let service;

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      getById: jest.fn(),
    };

    // Mock do Model
    mockModel = jest.fn().mockImplementation(data => ({
      id: data.id,
      name: data.name,
      email: data.email,
      ...data,
    }));

    // Mock do constructor do ProfessorApi
    ProfessorApi.mockImplementation(() => mockApi);

    // Mock do Professor como classe
    Professor.mockImplementation(data => mockModel(data));

    service = new GetProfessorByIdService(mockApi, mockModel);
  });

  describe('constructor', () => {
    it('should initialize with provided entityApi and entityModel', () => {
      expect(service.api).toBe(mockApi);
      expect(service.Model).toBe(mockModel);
    });

    it('should store api instance correctly', () => {
      const customApi = { getById: jest.fn() };
      const customModel = jest.fn();
      const customService = new GetProfessorByIdService(customApi, customModel);

      expect(customService.api).toBe(customApi);
      expect(customService.Model).toBe(customModel);
    });

    it('should accept null or undefined dependencies', () => {
      const serviceWithNulls = new GetProfessorByIdService(null, null);
      expect(serviceWithNulls.api).toBeNull();
      expect(serviceWithNulls.Model).toBeNull();
    });
  });

  describe('execute', () => {
    it('should call api.getById with correct ID', async () => {
      const testId = 123;
      const mockResponse = {
        data: {
          id: testId,
          name: 'João Silva',
          email: 'joao@email.com',
        },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getById).toHaveBeenCalledWith(testId);
      expect(mockApi.getById).toHaveBeenCalledTimes(1);
    });

    it('should transform response data using Model when data exists', async () => {
      const testId = 456;
      const responseData = {
        id: testId,
        name: 'Maria Santos',
        email: 'maria@email.com',
        phone: '11999999999',
      };
      const mockResponse = { data: responseData };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(mockModel).toHaveBeenCalledWith(responseData);
      expect(result.data).toEqual(
        expect.objectContaining({
          id: testId,
          name: 'Maria Santos',
          email: 'maria@email.com',
        })
      );
    });

    it('should return original response when data is null', async () => {
      const testId = 789;
      const mockResponse = { data: null };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(mockModel).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
      expect(result.data).toBeNull();
    });

    it('should return original response when data is undefined', async () => {
      const testId = 999;
      const mockResponse = { data: undefined };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(mockModel).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
      expect(result.data).toBeUndefined();
    });

    it('should handle string IDs', async () => {
      const testId = 'uuid-123-456';
      const mockResponse = {
        data: {
          id: testId,
          name: 'Professor UUID',
          email: 'uuid@email.com',
        },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getById).toHaveBeenCalledWith(testId);
    });

    it('should handle complex professor data', async () => {
      const testId = 111;
      const complexData = {
        id: testId,
        name: 'Ana Costa',
        email: 'ana@email.com',
        phone: '11888888888',
        subjects: ['Mathematics', 'Physics'],
        credentials: {
          degree: 'PhD',
          university: 'USP',
        },
        active: true,
      };
      const mockResponse = { data: complexData };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(mockModel).toHaveBeenCalledWith(complexData);
      expect(result.data).toEqual(
        expect.objectContaining({
          id: testId,
          name: 'Ana Costa',
          email: 'ana@email.com',
        })
      );
    });

    it('should propagate API errors', async () => {
      const testId = 404;
      const apiError = new Error('Professor not found');
      apiError.status = 404;

      mockApi.getById.mockRejectedValue(apiError);

      await expect(service.execute(testId)).rejects.toThrow(
        'Professor not found'
      );
      expect(mockApi.getById).toHaveBeenCalledWith(testId);
      expect(mockModel).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const testId = 500;
      const networkError = new Error('Network timeout');
      networkError.code = 'TIMEOUT';

      mockApi.getById.mockRejectedValue(networkError);

      await expect(service.execute(testId)).rejects.toThrow('Network timeout');
      expect(mockApi.getById).toHaveBeenCalledWith(testId);
    });

    it('should handle Model constructor errors', async () => {
      const testId = 666;
      const mockResponse = {
        data: {
          id: testId,
          name: 'Invalid Professor',
        },
      };

      mockApi.getById.mockResolvedValue(mockResponse);
      mockModel.mockImplementation(() => {
        throw new Error('Model validation failed');
      });

      await expect(service.execute(testId)).rejects.toThrow(
        'Model validation failed'
      );
      expect(mockApi.getById).toHaveBeenCalledWith(testId);
      expect(mockModel).toHaveBeenCalledWith(mockResponse.data);
    });

    it('should handle empty response data object', async () => {
      const testId = 777;
      const mockResponse = { data: {} };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      // Model não é chamado para objetos sem ID
      expect(mockModel).not.toHaveBeenCalled();
      expect(result.data).toEqual({});
    });

    it('should preserve response metadata', async () => {
      const testId = 888;
      const mockResponse = {
        data: {
          id: testId,
          name: 'Test Professor',
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
          name: 'Static Test Professor',
          email: 'static@email.com',
        },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await GetProfessorByIdService.handle(testId);

      expect(ProfessorApi).toHaveBeenCalledTimes(1);
      expect(mockApi.getById).toHaveBeenCalledWith(testId);
      expect(result.data).toEqual(
        expect.objectContaining({
          id: testId,
          name: 'Static Test Professor',
          email: 'static@email.com',
        })
      );
    });

    it('should handle errors in static method', async () => {
      const testId = 404;
      const apiError = new Error('Not found');
      apiError.status = 404;

      mockApi.getById.mockRejectedValue(apiError);

      await expect(GetProfessorByIdService.handle(testId)).rejects.toThrow(
        'Not found'
      );
      expect(ProfessorApi).toHaveBeenCalledTimes(1);
      expect(mockApi.getById).toHaveBeenCalledWith(testId);
    });

    it('should work with different ID types', async () => {
      const stringId = 'abc-123';
      const mockResponse = {
        data: {
          id: stringId,
          name: 'String ID Professor',
        },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      await GetProfessorByIdService.handle(stringId);

      expect(mockApi.getById).toHaveBeenCalledWith(stringId);
    });

    it('should create new instances each time', async () => {
      const testId1 = 111;
      const testId2 = 222;

      mockApi.getById.mockResolvedValue({ data: { id: testId1 } });
      await GetProfessorByIdService.handle(testId1);

      mockApi.getById.mockResolvedValue({ data: { id: testId2 } });
      await GetProfessorByIdService.handle(testId2);

      expect(ProfessorApi).toHaveBeenCalledTimes(2);
      expect(mockApi.getById).toHaveBeenCalledTimes(2);
    });

    it('should handle null or undefined IDs', async () => {
      mockApi.getById.mockResolvedValue({ data: null });

      await GetProfessorByIdService.handle(null);
      await GetProfessorByIdService.handle(undefined);

      expect(mockApi.getById).toHaveBeenCalledWith(null);
      expect(mockApi.getById).toHaveBeenCalledWith(undefined);
      expect(mockApi.getById).toHaveBeenCalledTimes(2);
    });
  });

  describe('integration scenarios', () => {
    it('should work with real-like professor data structure', async () => {
      const testId = 999;
      const professorData = {
        id: testId,
        name: 'Dr. Carlos Mendes',
        email: 'carlos.mendes@universidade.edu.br',
        phone: '+55 11 98765-4321',
        department: 'Computer Science',
        subjects: ['Data Structures', 'Algorithms', 'Software Engineering'],
        qualifications: [
          'PhD in Computer Science - MIT',
          'MSc in Software Engineering - Stanford',
        ],
        experience: {
          years: 15,
          institutions: ['MIT', 'Stanford', 'USP'],
        },
        active: true,
        createdAt: '2020-01-15T10:30:00Z',
        updatedAt: '2024-11-08T14:22:00Z',
      };

      const mockResponse = { data: professorData };
      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(mockModel).toHaveBeenCalledWith(professorData);
      expect(result.data).toEqual(
        expect.objectContaining({
          id: testId,
          name: 'Dr. Carlos Mendes',
          email: 'carlos.mendes@universidade.edu.br',
        })
      );
    });

    it('should handle service composition patterns', async () => {
      const testId = 555;
      const mockResponse = { data: { id: testId, name: 'Composed Professor' } };

      mockApi.getById.mockResolvedValue(mockResponse);

      // Test using the service in a composed manner
      const composedResult = await service.execute(testId);

      // Could be used by another service or component
      expect(composedResult).toBeDefined();
      expect(composedResult.data).toEqual(
        expect.objectContaining({
          id: testId,
          name: 'Composed Professor',
        })
      );
    });

    it('should maintain data integrity through transformation', async () => {
      const testId = 777;
      const originalData = {
        id: testId,
        name: 'Data Integrity Test',
        sensitive: 'should be preserved',
        metadata: { version: 1, lastModified: Date.now() },
      };

      const mockResponse = { data: originalData };
      mockApi.getById.mockResolvedValue(mockResponse);

      // Mock the model to preserve all data
      mockModel.mockImplementation(data => ({ ...data, transformed: true }));

      const result = await service.execute(testId);

      expect(result.data).toEqual(
        expect.objectContaining({
          id: testId,
          name: 'Data Integrity Test',
          sensitive: 'should be preserved',
          transformed: true,
        })
      );
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle zero as valid ID', async () => {
      const testId = 0;
      const mockResponse = { data: { id: testId, name: 'Zero ID Professor' } };

      mockApi.getById.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(mockApi.getById).toHaveBeenCalledWith(testId);
      expect(result.data).toEqual(expect.objectContaining({ id: testId }));
    });

    it('should handle boolean IDs', async () => {
      const testId = true;
      const mockResponse = {
        data: { id: testId, name: 'Boolean ID Professor' },
      };

      mockApi.getById.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getById).toHaveBeenCalledWith(testId);
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
    it('should handle large professor data objects efficiently', async () => {
      const testId = 1000;
      const largeData = {
        id: testId,
        name: 'Performance Test Professor',
        // Simulate large data
        ...Array.from({ length: 100 }, (_, i) => ({
          [`field${i}`]: `value${i}`,
        })).reduce((acc, obj) => ({ ...acc, ...obj }), {}),
      };

      const mockResponse = { data: largeData };
      mockApi.getById.mockResolvedValue(mockResponse);

      const startTime = Date.now();
      const result = await service.execute(testId);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
      expect(result.data).toEqual(
        expect.objectContaining({
          id: testId,
          name: 'Performance Test Professor',
        })
      );
    });

    it('should handle concurrent requests gracefully', async () => {
      const testIds = [1, 2, 3, 4, 5];
      const promises = testIds.map(id => {
        mockApi.getById.mockResolvedValueOnce({
          data: { id, name: `Professor ${id}` },
        });
        return service.execute(id);
      });

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach((result, index) => {
        expect(result.data).toEqual(
          expect.objectContaining({
            id: testIds[index],
            name: `Professor ${testIds[index]}`,
          })
        );
      });
    });
  });
});
