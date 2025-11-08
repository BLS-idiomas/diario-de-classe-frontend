import { DeleteProfessorService } from '../deleteProfessorService';

// Mock do Professor model
jest.mock('@/models/Professor', () => ({
  Professor: jest.fn(),
}));

// Mock da ProfessorApi
jest.mock('@/store/api/professorApi', () => ({
  ProfessorApi: jest.fn().mockImplementation(() => ({
    delete: jest.fn(),
  })),
}));

describe('DeleteProfessorService', () => {
  let mockApi;
  let mockModel;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      delete: jest.fn(),
    };

    // Mock do Model
    mockModel = jest.fn();

    service = new DeleteProfessorService(mockApi, mockModel);
  });

  describe('constructor', () => {
    it('should initialize with provided api and model', () => {
      expect(service.api).toBe(mockApi);
      expect(service.Model).toBe(mockModel);
    });

    it('should store references correctly', () => {
      const customApi = { delete: jest.fn() };
      const customModel = jest.fn();
      const customService = new DeleteProfessorService(customApi, customModel);

      expect(customService.api).toBe(customApi);
      expect(customService.Model).toBe(customModel);
    });

    it('should work with different API implementations', () => {
      const alternativeApi = {
        delete: jest.fn(),
        customMethod: jest.fn(),
      };
      const alternativeModel = class AlternativeModel {};

      const altService = new DeleteProfessorService(
        alternativeApi,
        alternativeModel
      );

      expect(altService.api).toBe(alternativeApi);
      expect(altService.Model).toBe(alternativeModel);
    });
  });

  describe('execute', () => {
    it('should call delete method with correct ID', async () => {
      const professorId = 123;
      const mockResponse = {
        data: { message: 'Professor deleted successfully' },
        status: 200,
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(professorId);

      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle string IDs', async () => {
      const professorId = 'prof-uuid-123';
      const mockResponse = {
        data: { message: 'Professor deleted successfully' },
        status: 200,
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(professorId);

      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle numeric zero as valid ID', async () => {
      const professorId = 0;
      const mockResponse = {
        data: { message: 'Professor deleted successfully' },
        status: 200,
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(professorId);

      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle not found error', async () => {
      const professorId = 999;
      const mockError = new Error('Professor not found');
      mockError.status = 404;
      mockApi.delete.mockRejectedValue(mockError);

      await expect(service.execute(professorId)).rejects.toThrow(
        'Professor not found'
      );
      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
    });

    it('should handle already deleted error', async () => {
      const professorId = 123;
      const mockError = new Error('Professor already deleted');
      mockError.status = 410;
      mockApi.delete.mockRejectedValue(mockError);

      await expect(service.execute(professorId)).rejects.toThrow(
        'Professor already deleted'
      );
      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
    });

    it('should handle authorization error', async () => {
      const professorId = 123;
      const mockError = new Error('Unauthorized to delete professor');
      mockError.status = 403;
      mockApi.delete.mockRejectedValue(mockError);

      await expect(service.execute(professorId)).rejects.toThrow(
        'Unauthorized to delete professor'
      );
      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
    });

    it('should handle network errors', async () => {
      const professorId = 123;
      const networkError = new Error('Network Error');
      networkError.code = 'NETWORK_ERROR';
      mockApi.delete.mockRejectedValue(networkError);

      await expect(service.execute(professorId)).rejects.toThrow(
        'Network Error'
      );
      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
    });

    it('should handle server errors', async () => {
      const professorId = 123;
      const serverError = new Error('Internal Server Error');
      serverError.status = 500;
      mockApi.delete.mockRejectedValue(serverError);

      await expect(service.execute(professorId)).rejects.toThrow(
        'Internal Server Error'
      );
      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
    });

    it('should handle null ID', async () => {
      const mockResponse = {
        data: { message: 'Invalid ID provided' },
        status: 400,
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(null);

      expect(mockApi.delete).toHaveBeenCalledWith(null);
      expect(result).toEqual(mockResponse);
    });

    it('should handle undefined ID', async () => {
      const mockResponse = {
        data: { message: 'Invalid ID provided' },
        status: 400,
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(undefined);

      expect(mockApi.delete).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockResponse);
    });

    it('should handle successful deletion with detailed response', async () => {
      const professorId = 456;
      const mockResponse = {
        data: {
          message: 'Professor deleted successfully',
          deletedId: professorId,
          deletedAt: '2023-11-08T10:00:00Z',
          deletedBy: 'admin',
        },
        status: 200,
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(professorId);

      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
      expect(result).toEqual(mockResponse);
      expect(result.data.deletedId).toBe(professorId);
      expect(result.data.deletedAt).toBe('2023-11-08T10:00:00Z');
    });

    it('should handle soft delete response', async () => {
      const professorId = 789;
      const mockResponse = {
        data: {
          message: 'Professor deactivated successfully',
          id: professorId,
          status: 'inactive',
          deactivatedAt: '2023-11-08T10:00:00Z',
        },
        status: 200,
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(professorId);

      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
      expect(result).toEqual(mockResponse);
      expect(result.data.status).toBe('inactive');
    });

    it('should handle cascade deletion response', async () => {
      const professorId = 100;
      const mockResponse = {
        data: {
          message: 'Professor and related data deleted successfully',
          deletedProfessor: { id: professorId, name: 'João Silva' },
          cascadeDeleted: {
            classes: 5,
            assignments: 12,
            grades: 48,
          },
        },
        status: 200,
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(professorId);

      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
      expect(result).toEqual(mockResponse);
      expect(result.data.cascadeDeleted.classes).toBe(5);
      expect(result.data.cascadeDeleted.assignments).toBe(12);
    });
  });

  describe('static handle method', () => {
    beforeEach(() => {
      // Reset mocks dos módulos
      const { ProfessorApi } = require('@/store/api/professorApi');
      const { Professor } = require('@/models/Professor');
      ProfessorApi.mockClear();
      Professor.mockClear();
    });

    it('should create service instance and execute with default dependencies', async () => {
      const professorId = 123;
      const mockResponse = {
        data: { message: 'Professor deleted successfully' },
        status: 200,
      };

      // Mock da API
      const mockDelete = jest.fn().mockResolvedValue(mockResponse);
      const { ProfessorApi } = require('@/store/api/professorApi');
      ProfessorApi.mockImplementation(() => ({
        delete: mockDelete,
      }));

      const result = await DeleteProfessorService.handle(professorId);

      expect(ProfessorApi).toHaveBeenCalledTimes(1);
      expect(mockDelete).toHaveBeenCalledWith(professorId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors in static method', async () => {
      const professorId = 999;
      const mockError = new Error('Static method error');
      const mockDelete = jest.fn().mockRejectedValue(mockError);
      const { ProfessorApi } = require('@/store/api/professorApi');
      ProfessorApi.mockImplementation(() => ({
        delete: mockDelete,
      }));

      await expect(DeleteProfessorService.handle(professorId)).rejects.toThrow(
        'Static method error'
      );

      expect(ProfessorApi).toHaveBeenCalledTimes(1);
      expect(mockDelete).toHaveBeenCalledWith(professorId);
    });

    it('should work with different ID types in static method', async () => {
      const stringId = 'uuid-abc-123';
      const mockResponse = {
        data: { message: 'Professor deleted successfully' },
        status: 200,
      };

      const mockDelete = jest.fn().mockResolvedValue(mockResponse);
      const { ProfessorApi } = require('@/store/api/professorApi');
      ProfessorApi.mockImplementation(() => ({
        delete: mockDelete,
      }));

      const result = await DeleteProfessorService.handle(stringId);

      expect(mockDelete).toHaveBeenCalledWith(stringId);
      expect(result).toEqual(mockResponse);
    });

    it('should handle null ID in static method', async () => {
      const mockResponse = {
        data: { message: 'Invalid ID provided' },
        status: 400,
      };

      const mockDelete = jest.fn().mockResolvedValue(mockResponse);
      const { ProfessorApi } = require('@/store/api/professorApi');
      ProfessorApi.mockImplementation(() => ({
        delete: mockDelete,
      }));

      const result = await DeleteProfessorService.handle(null);

      expect(mockDelete).toHaveBeenCalledWith(null);
      expect(result.status).toBe(400);
    });

    it('should handle authorization error in static method', async () => {
      const professorId = 123;
      const authError = new Error('Unauthorized');
      authError.status = 403;
      const mockDelete = jest.fn().mockRejectedValue(authError);
      const { ProfessorApi } = require('@/store/api/professorApi');
      ProfessorApi.mockImplementation(() => ({
        delete: mockDelete,
      }));

      await expect(DeleteProfessorService.handle(professorId)).rejects.toThrow(
        'Unauthorized'
      );

      expect(mockDelete).toHaveBeenCalledWith(professorId);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete deletion workflow', async () => {
      const professorId = 123;
      const mockResponse = {
        data: {
          message: 'Professor deletion completed',
          professor: {
            id: professorId,
            name: 'João Silva',
            email: 'joao.silva@escola.com',
            status: 'deleted',
          },
          deletionDetails: {
            deletedAt: '2023-11-08T10:00:00Z',
            deletedBy: 'admin',
            reason: 'Administrative decision',
          },
          affectedRecords: {
            classes: 3,
            students: 45,
            assignments: 8,
          },
        },
        status: 200,
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(professorId);

      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
      expect(result).toEqual(mockResponse);
      expect(result.data.professor.status).toBe('deleted');
      expect(result.data.affectedRecords.students).toBe(45);
    });

    it('should maintain referential integrity during deletion', async () => {
      const professorId = 456;
      const mockResponse = {
        data: {
          message: 'Professor deleted with referential integrity maintained',
          deletedProfessor: { id: professorId },
          updatedRecords: {
            classesReassigned: 2,
            studentsNotified: 30,
            gradesArchived: 120,
          },
          integrityChecks: {
            passed: true,
            checks: ['foreign_keys', 'constraints', 'cascades'],
          },
        },
        status: 200,
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(professorId);

      expect(result.data.integrityChecks.passed).toBe(true);
      expect(result.data.updatedRecords.classesReassigned).toBe(2);
      expect(result.data.updatedRecords.studentsNotified).toBe(30);
    });

    it('should handle batch deletion scenario', async () => {
      const professorIds = [101, 102, 103];
      const responses = professorIds.map(id => ({
        data: {
          message: `Professor ${id} deleted successfully`,
          deletedId: id,
        },
        status: 200,
      }));

      mockApi.delete
        .mockResolvedValueOnce(responses[0])
        .mockResolvedValueOnce(responses[1])
        .mockResolvedValueOnce(responses[2]);

      const results = await Promise.all(
        professorIds.map(id => service.execute(id))
      );

      expect(mockApi.delete).toHaveBeenCalledTimes(3);
      expect(mockApi.delete).toHaveBeenNthCalledWith(1, 101);
      expect(mockApi.delete).toHaveBeenNthCalledWith(2, 102);
      expect(mockApi.delete).toHaveBeenNthCalledWith(3, 103);

      results.forEach((result, index) => {
        expect(result).toEqual(responses[index]);
        expect(result.data.deletedId).toBe(professorIds[index]);
      });
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle concurrent deletion attempts', async () => {
      const professorId = 123;
      const concurrencyError = new Error(
        'Resource is being modified by another operation'
      );
      concurrencyError.status = 409;
      mockApi.delete.mockRejectedValue(concurrencyError);

      await expect(service.execute(professorId)).rejects.toThrow(
        'Resource is being modified by another operation'
      );
      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
    });

    it('should handle deletion of professor with active dependencies', async () => {
      const professorId = 123;
      const dependencyError = new Error(
        'Cannot delete professor with active classes'
      );
      dependencyError.status = 422;
      dependencyError.details = {
        activeClasses: 3,
        activeStudents: 45,
        pendingGrades: 12,
      };
      mockApi.delete.mockRejectedValue(dependencyError);

      await expect(service.execute(professorId)).rejects.toThrow(
        'Cannot delete professor with active classes'
      );
      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
    });

    it('should handle malformed ID parameters', async () => {
      const malformedIds = ['', '   ', 'invalid-format', NaN, Infinity, -1];

      for (const malformedId of malformedIds) {
        const mockResponse = {
          data: { message: 'Invalid ID format' },
          status: 400,
        };

        mockApi.delete.mockResolvedValueOnce(mockResponse);

        const result = await service.execute(malformedId);

        expect(mockApi.delete).toHaveBeenCalledWith(malformedId);
        expect(result.status).toBe(400);
      }

      expect(mockApi.delete).toHaveBeenCalledTimes(malformedIds.length);
    });

    it('should handle timeout errors', async () => {
      const professorId = 123;
      const timeoutError = new Error('Request timeout');
      timeoutError.code = 'TIMEOUT';
      mockApi.delete.mockRejectedValue(timeoutError);

      await expect(service.execute(professorId)).rejects.toThrow(
        'Request timeout'
      );
      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
    });

    it('should handle database connection errors', async () => {
      const professorId = 123;
      const dbError = new Error('Database connection failed');
      dbError.code = 'ECONNREFUSED';
      mockApi.delete.mockRejectedValue(dbError);

      await expect(service.execute(professorId)).rejects.toThrow(
        'Database connection failed'
      );
      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
    });

    it('should handle partial deletion failures', async () => {
      const professorId = 123;
      const partialError = new Error('Partial deletion completed');
      partialError.status = 206;
      partialError.details = {
        professorDeleted: true,
        classesDeleted: false,
        gradesDeleted: true,
        failedOperations: ['classes_cleanup'],
      };
      mockApi.delete.mockRejectedValue(partialError);

      await expect(service.execute(professorId)).rejects.toThrow(
        'Partial deletion completed'
      );
      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
    });

    it('should handle empty response from API', async () => {
      const professorId = 123;
      mockApi.delete.mockResolvedValue(undefined);

      const result = await service.execute(professorId);

      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
      expect(result).toBeUndefined();
    });

    it('should handle response with missing data property', async () => {
      const professorId = 123;
      const mockResponse = {
        status: 200,
        message: 'Deleted successfully',
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(professorId);

      expect(mockApi.delete).toHaveBeenCalledWith(professorId);
      expect(result).toEqual(mockResponse);
      expect(result.status).toBe(200);
    });
  });

  describe('performance and reliability', () => {
    it('should handle multiple rapid deletion requests', async () => {
      const professorIds = Array.from({ length: 10 }, (_, i) => i + 1);
      const mockResponses = professorIds.map(id => ({
        data: { message: `Professor ${id} deleted` },
        status: 200,
      }));

      // Setup multiple mock responses
      professorIds.forEach((_, index) => {
        mockApi.delete.mockResolvedValueOnce(mockResponses[index]);
      });

      const startTime = Date.now();
      const promises = professorIds.map(id => service.execute(id));
      const results = await Promise.all(promises);
      const endTime = Date.now();

      expect(results).toHaveLength(10);
      expect(mockApi.delete).toHaveBeenCalledTimes(10);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle deletion retry scenarios', async () => {
      const professorId = 123;
      const retryError = new Error('Temporary server error');
      retryError.status = 503;

      const successResponse = {
        data: { message: 'Professor deleted successfully' },
        status: 200,
      };

      // First call fails, second succeeds
      mockApi.delete
        .mockRejectedValueOnce(retryError)
        .mockResolvedValueOnce(successResponse);

      // First attempt should fail
      await expect(service.execute(professorId)).rejects.toThrow(
        'Temporary server error'
      );

      // Second attempt should succeed
      const result = await service.execute(professorId);
      expect(result).toEqual(successResponse);
      expect(mockApi.delete).toHaveBeenCalledTimes(2);
    });
  });
});
