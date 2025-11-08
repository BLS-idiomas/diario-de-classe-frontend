import { UpdateProfessorService } from '../updateProfessorService';
import { Professor } from '@/models/Professor';
import { ProfessorApi } from '@/store/api/professorApi';

// Mock das dependências
jest.mock('@/models/Professor');
jest.mock('@/store/api/professorApi');

describe('UpdateProfessorService', () => {
  let mockApi;
  let mockModel;
  let service;

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      update: jest.fn(),
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

    service = new UpdateProfessorService(mockApi, mockModel);
  });

  describe('constructor', () => {
    it('should initialize with provided entityApi and entityModel', () => {
      expect(service.api).toBe(mockApi);
      expect(service.Model).toBe(mockModel);
    });

    it('should store api instance correctly', () => {
      const customApi = { update: jest.fn() };
      const customModel = jest.fn();
      const customService = new UpdateProfessorService(customApi, customModel);

      expect(customService.api).toBe(customApi);
      expect(customService.Model).toBe(customModel);
    });

    it('should accept null or undefined dependencies', () => {
      const serviceWithNulls = new UpdateProfessorService(null, null);
      expect(serviceWithNulls.api).toBeNull();
      expect(serviceWithNulls.Model).toBeNull();
    });
  });

  describe('execute', () => {
    it('should call api.update with correct ID and data', async () => {
      const testId = 123;
      const updateData = {
        name: 'João Silva Atualizado',
        email: 'joao.updated@email.com',
        phone: '11999999999',
      };
      const mockResponse = {
        data: {
          id: testId,
          ...updateData,
          updatedAt: '2024-11-08T14:30:00Z',
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      await service.execute(testId, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(testId, updateData);
      expect(mockApi.update).toHaveBeenCalledTimes(1);
    });

    it('should transform response data using Model when response has data with id', async () => {
      const testId = 456;
      const updateData = {
        name: 'Maria Santos',
        email: 'maria@email.com',
      };
      const responseData = {
        id: testId,
        name: 'Maria Santos',
        email: 'maria@email.com',
        updatedAt: '2024-11-08T14:30:00Z',
      };
      const mockResponse = { data: responseData };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(testId, updateData);

      expect(mockModel).toHaveBeenCalledWith(responseData);
      expect(result.data).toEqual(
        expect.objectContaining({
          id: testId,
          name: 'Maria Santos',
          email: 'maria@email.com',
        })
      );
    });

    it('should not transform response when data is null', async () => {
      const testId = 789;
      const updateData = { name: 'Test' };
      const mockResponse = { data: null };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(testId, updateData);

      expect(mockModel).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
      expect(result.data).toBeNull();
    });

    it('should not transform response when data is undefined', async () => {
      const testId = 999;
      const updateData = { name: 'Test' };
      const mockResponse = { data: undefined };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(testId, updateData);

      expect(mockModel).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
      expect(result.data).toBeUndefined();
    });

    it('should not transform response when data has no id', async () => {
      const testId = 111;
      const updateData = { name: 'No ID Test' };
      const mockResponse = {
        data: {
          name: 'No ID Test',
          message: 'Update successful but no ID returned',
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(testId, updateData);

      expect(mockModel).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should handle string IDs', async () => {
      const testId = 'uuid-123-456';
      const updateData = { name: 'UUID Professor' };
      const mockResponse = {
        data: {
          id: testId,
          name: 'UUID Professor',
          email: 'uuid@email.com',
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      await service.execute(testId, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(testId, updateData);
    });

    it('should handle complex update data', async () => {
      const testId = 222;
      const complexUpdateData = {
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
      const mockResponse = {
        data: {
          id: testId,
          ...complexUpdateData,
          updatedAt: '2024-11-08T14:30:00Z',
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(testId, complexUpdateData);

      expect(mockApi.update).toHaveBeenCalledWith(testId, complexUpdateData);
      expect(mockModel).toHaveBeenCalledWith(mockResponse.data);
      expect(result.data).toEqual(
        expect.objectContaining({
          id: testId,
          name: 'Ana Costa',
          email: 'ana@email.com',
        })
      );
    });

    it('should handle partial updates', async () => {
      const testId = 333;
      const partialUpdateData = { name: 'Only Name Updated' };
      const mockResponse = {
        data: {
          id: testId,
          name: 'Only Name Updated',
          email: 'original@email.com', // Original data preserved
          phone: '11777777777',
          updatedAt: '2024-11-08T14:30:00Z',
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(testId, partialUpdateData);

      expect(mockApi.update).toHaveBeenCalledWith(testId, partialUpdateData);
      expect(result.data).toEqual(
        expect.objectContaining({
          id: testId,
          name: 'Only Name Updated',
          email: 'original@email.com',
        })
      );
    });

    it('should handle empty update data', async () => {
      const testId = 444;
      const emptyUpdateData = {};
      const mockResponse = {
        data: {
          id: testId,
          name: 'Original Name',
          email: 'original@email.com',
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      await service.execute(testId, emptyUpdateData);

      expect(mockApi.update).toHaveBeenCalledWith(testId, emptyUpdateData);
    });

    it('should handle null update data', async () => {
      const testId = 555;
      const nullUpdateData = null;
      const mockResponse = {
        data: {
          id: testId,
          name: 'Test Professor',
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      await service.execute(testId, nullUpdateData);

      expect(mockApi.update).toHaveBeenCalledWith(testId, nullUpdateData);
    });

    it('should propagate API errors', async () => {
      const testId = 404;
      const updateData = { name: 'Not Found Test' };
      const apiError = new Error('Professor not found');
      apiError.status = 404;

      mockApi.update.mockRejectedValue(apiError);

      await expect(service.execute(testId, updateData)).rejects.toThrow(
        'Professor not found'
      );
      expect(mockApi.update).toHaveBeenCalledWith(testId, updateData);
      expect(mockModel).not.toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      const testId = 400;
      const invalidData = { email: 'invalid-email' };
      const validationError = new Error('Validation failed');
      validationError.status = 400;

      mockApi.update.mockRejectedValue(validationError);

      await expect(service.execute(testId, invalidData)).rejects.toThrow(
        'Validation failed'
      );
      expect(mockApi.update).toHaveBeenCalledWith(testId, invalidData);
    });

    it('should handle network errors', async () => {
      const testId = 500;
      const updateData = { name: 'Network Test' };
      const networkError = new Error('Network timeout');
      networkError.code = 'TIMEOUT';

      mockApi.update.mockRejectedValue(networkError);

      await expect(service.execute(testId, updateData)).rejects.toThrow(
        'Network timeout'
      );
      expect(mockApi.update).toHaveBeenCalledWith(testId, updateData);
    });

    it('should handle Model constructor errors', async () => {
      const testId = 666;
      const updateData = { name: 'Model Error Test' };
      const mockResponse = {
        data: {
          id: testId,
          name: 'Model Error Test',
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);
      mockModel.mockImplementation(() => {
        throw new Error('Model validation failed');
      });

      await expect(service.execute(testId, updateData)).rejects.toThrow(
        'Model validation failed'
      );
      expect(mockApi.update).toHaveBeenCalledWith(testId, updateData);
      expect(mockModel).toHaveBeenCalledWith(mockResponse.data);
    });

    it('should preserve response metadata', async () => {
      const testId = 777;
      const updateData = { name: 'Metadata Test' };
      const mockResponse = {
        data: {
          id: testId,
          name: 'Metadata Test',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(testId, updateData);

      expect(result.status).toBe(200);
      expect(result.statusText).toBe('OK');
      expect(result.headers).toEqual({ 'content-type': 'application/json' });
    });

    it('should handle zero as valid ID', async () => {
      const testId = 0;
      const updateData = { name: 'Zero ID Professor' };
      const mockResponse = {
        data: { id: testId, name: 'Zero ID Professor' },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(testId, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(testId, updateData);
      expect(result.data).toEqual(expect.objectContaining({ id: testId }));
    });

    it('should handle boolean IDs', async () => {
      const testId = true;
      const updateData = { name: 'Boolean ID Professor' };
      const mockResponse = {
        data: { id: testId, name: 'Boolean ID Professor' },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      await service.execute(testId, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(testId, updateData);
    });

    it('should handle response with falsy id (empty string)', async () => {
      const testId = 888;
      const updateData = { name: 'Empty ID Test' };
      const mockResponse = {
        data: {
          id: '', // Falsy id
          name: 'Empty ID Test',
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(testId, updateData);

      expect(mockModel).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should handle response with falsy id (zero)', async () => {
      const testId = 999;
      const updateData = { name: 'Zero ID Response Test' };
      const mockResponse = {
        data: {
          id: 0, // Falsy but valid id
          name: 'Zero ID Response Test',
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(testId, updateData);

      expect(mockModel).not.toHaveBeenCalled(); // 0 is falsy, so won't transform
      expect(result).toEqual(mockResponse);
    });
  });

  describe('static handle method', () => {
    it('should create service instance and execute with provided ID and data', async () => {
      const testId = 123;
      const updateData = {
        name: 'Static Test Professor',
        email: 'static@email.com',
      };
      const mockResponse = {
        data: {
          id: testId,
          ...updateData,
          updatedAt: '2024-11-08T14:30:00Z',
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await UpdateProfessorService.handle(testId, updateData);

      expect(ProfessorApi).toHaveBeenCalledTimes(1);
      expect(mockApi.update).toHaveBeenCalledWith(testId, updateData);
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
      const updateData = { name: 'Static Error Test' };
      const apiError = new Error('Not found in static method');
      apiError.status = 404;

      mockApi.update.mockRejectedValue(apiError);

      await expect(
        UpdateProfessorService.handle(testId, updateData)
      ).rejects.toThrow('Not found in static method');
      expect(ProfessorApi).toHaveBeenCalledTimes(1);
      expect(mockApi.update).toHaveBeenCalledWith(testId, updateData);
    });

    it('should work with different ID types', async () => {
      const stringId = 'abc-123';
      const updateData = { name: 'String ID Professor' };
      const mockResponse = {
        data: {
          id: stringId,
          name: 'String ID Professor',
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      await UpdateProfessorService.handle(stringId, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(stringId, updateData);
    });

    it('should create new instances each time', async () => {
      const testId1 = 111;
      const testId2 = 222;
      const updateData1 = { name: 'First Update' };
      const updateData2 = { name: 'Second Update' };

      mockApi.update.mockResolvedValue({ data: { id: testId1 } });
      await UpdateProfessorService.handle(testId1, updateData1);

      mockApi.update.mockResolvedValue({ data: { id: testId2 } });
      await UpdateProfessorService.handle(testId2, updateData2);

      expect(ProfessorApi).toHaveBeenCalledTimes(2);
      expect(mockApi.update).toHaveBeenCalledTimes(2);
      expect(mockApi.update).toHaveBeenNthCalledWith(1, testId1, updateData1);
      expect(mockApi.update).toHaveBeenNthCalledWith(2, testId2, updateData2);
    });

    it('should handle null or undefined parameters', async () => {
      mockApi.update.mockResolvedValue({ data: { message: 'Updated' } });

      await UpdateProfessorService.handle(null, null);
      await UpdateProfessorService.handle(undefined, undefined);

      expect(mockApi.update).toHaveBeenCalledWith(null, null);
      expect(mockApi.update).toHaveBeenCalledWith(undefined, undefined);
      expect(mockApi.update).toHaveBeenCalledTimes(2);
    });

    it('should handle empty update data in static method', async () => {
      const testId = 333;
      const emptyData = {};
      mockApi.update.mockResolvedValue({ data: { id: testId } });

      await UpdateProfessorService.handle(testId, emptyData);

      expect(mockApi.update).toHaveBeenCalledWith(testId, emptyData);
    });
  });

  describe('integration scenarios', () => {
    it('should work with real-like professor update data', async () => {
      const testId = 999;
      const updateData = {
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
        updatedAt: '2024-11-08T14:22:00Z',
      };

      const mockResponse = { data: { id: testId, ...updateData } };
      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(testId, updateData);

      expect(mockModel).toHaveBeenCalledWith(mockResponse.data);
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
      const updateData = { name: 'Composed Update' };
      const mockResponse = { data: { id: testId, name: 'Composed Update' } };

      mockApi.update.mockResolvedValue(mockResponse);

      // Test using the service in a composed manner
      const composedResult = await service.execute(testId, updateData);

      // Could be used by another service or component
      expect(composedResult).toBeDefined();
      expect(composedResult.data).toEqual(
        expect.objectContaining({
          id: testId,
          name: 'Composed Update',
        })
      );
    });

    it('should maintain data integrity through transformation', async () => {
      const testId = 777;
      const updateData = {
        name: 'Data Integrity Test',
        sensitive: 'should be preserved',
        metadata: { version: 2, lastModified: Date.now() },
      };

      const mockResponse = { data: { id: testId, ...updateData } };
      mockApi.update.mockResolvedValue(mockResponse);

      // Mock the model to preserve all data
      mockModel.mockImplementation(data => ({ ...data, transformed: true }));

      const result = await service.execute(testId, updateData);

      expect(result.data).toEqual(
        expect.objectContaining({
          id: testId,
          name: 'Data Integrity Test',
          sensitive: 'should be preserved',
          transformed: true,
        })
      );
    });

    it('should handle optimistic updates scenario', async () => {
      const testId = 888;
      const optimisticData = {
        name: 'Optimistic Update',
        email: 'optimistic@email.com',
        version: 1,
      };

      const serverResponse = {
        name: 'Optimistic Update',
        email: 'optimistic@email.com',
        version: 2, // Server incremented version
        updatedAt: '2024-11-08T14:30:00Z',
      };

      const mockResponse = { data: { id: testId, ...serverResponse } };
      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(testId, optimisticData);

      expect(result.data).toEqual(
        expect.objectContaining({
          id: testId,
          version: 2, // Server version should be returned
          updatedAt: '2024-11-08T14:30:00Z',
        })
      );
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle authentication errors', async () => {
      const testId = 401;
      const updateData = { name: 'Auth Test' };
      const authError = new Error('Unauthorized access');
      authError.status = 401;

      mockApi.update.mockRejectedValue(authError);

      await expect(service.execute(testId, updateData)).rejects.toThrow(
        'Unauthorized access'
      );
    });

    it('should handle forbidden access errors', async () => {
      const testId = 403;
      const updateData = { name: 'Forbidden Test' };
      const forbiddenError = new Error('Access forbidden');
      forbiddenError.status = 403;

      mockApi.update.mockRejectedValue(forbiddenError);

      await expect(service.execute(testId, updateData)).rejects.toThrow(
        'Access forbidden'
      );
    });

    it('should handle conflict errors', async () => {
      const testId = 409;
      const updateData = { name: 'Conflict Test' };
      const conflictError = new Error('Conflict - resource was modified');
      conflictError.status = 409;

      mockApi.update.mockRejectedValue(conflictError);

      await expect(service.execute(testId, updateData)).rejects.toThrow(
        'Conflict - resource was modified'
      );
    });

    it('should handle unprocessable entity errors', async () => {
      const testId = 422;
      const updateData = { email: 'invalid-email-format' };
      const validationError = new Error('Unprocessable entity');
      validationError.status = 422;

      mockApi.update.mockRejectedValue(validationError);

      await expect(service.execute(testId, updateData)).rejects.toThrow(
        'Unprocessable entity'
      );
    });

    it('should handle server errors', async () => {
      const testId = 500;
      const updateData = { name: 'Server Error Test' };
      const serverError = new Error('Internal server error');
      serverError.status = 500;

      mockApi.update.mockRejectedValue(serverError);

      await expect(service.execute(testId, updateData)).rejects.toThrow(
        'Internal server error'
      );
    });

    it('should handle service unavailable errors', async () => {
      const testId = 503;
      const updateData = { name: 'Service Error Test' };
      const serviceError = new Error('Service temporarily unavailable');
      serviceError.status = 503;

      mockApi.update.mockRejectedValue(serviceError);

      await expect(service.execute(testId, updateData)).rejects.toThrow(
        'Service temporarily unavailable'
      );
    });

    it('should handle malformed response', async () => {
      const testId = 666;
      const updateData = { name: 'Malformed Test' };
      const malformedResponse = 'invalid json response';

      mockApi.update.mockResolvedValue(malformedResponse);

      // Should not throw, just return the malformed response as-is
      const result = await service.execute(testId, updateData);
      expect(result).toBe(malformedResponse);
    });
  });

  describe('performance and reliability', () => {
    it('should handle large update data objects efficiently', async () => {
      const testId = 1000;
      const largeUpdateData = {
        name: 'Performance Test Professor',
        // Simulate large data
        ...Array.from({ length: 100 }, (_, i) => ({
          [`field${i}`]: `value${i}`,
        })).reduce((acc, obj) => ({ ...acc, ...obj }), {}),
      };

      const mockResponse = { data: { id: testId, ...largeUpdateData } };
      mockApi.update.mockResolvedValue(mockResponse);

      const startTime = Date.now();
      const result = await service.execute(testId, largeUpdateData);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
      expect(result.data).toEqual(
        expect.objectContaining({
          id: testId,
          name: 'Performance Test Professor',
        })
      );
    });

    it('should handle concurrent update requests gracefully', async () => {
      const updates = [
        { id: 1, data: { name: 'Professor 1 Updated' } },
        { id: 2, data: { name: 'Professor 2 Updated' } },
        { id: 3, data: { name: 'Professor 3 Updated' } },
        { id: 4, data: { name: 'Professor 4 Updated' } },
        { id: 5, data: { name: 'Professor 5 Updated' } },
      ];

      const promises = updates.map(({ id, data }) => {
        mockApi.update.mockResolvedValueOnce({
          data: { id, ...data, updatedAt: new Date().toISOString() },
        });
        return service.execute(id, data);
      });

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach((result, index) => {
        expect(result.data).toEqual(
          expect.objectContaining({
            id: updates[index].id,
            name: updates[index].data.name,
          })
        );
      });
    });

    it('should maintain performance with repeated calls', async () => {
      const testId = 999;
      const updateData = { name: 'Repeated Update' };
      const mockResponse = {
        data: { id: testId, name: 'Repeated Update' },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const calls = Array.from({ length: 10 }, () =>
        service.execute(testId, updateData)
      );
      const startTime = Date.now();
      await Promise.all(calls);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(200); // Should complete quickly
      expect(mockApi.update).toHaveBeenCalledTimes(10);
      expect(mockModel).toHaveBeenCalledTimes(10);
    });
  });
});
