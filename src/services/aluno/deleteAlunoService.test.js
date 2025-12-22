import { DeleteAlunoService } from './deleteAlunoService';
import { AlunoApi } from '@/store/api/alunoApi';

// Mock da AlunoApi
jest.mock('@/store/api/alunoApi');

describe('DeleteAlunoService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      delete: jest.fn(),
    };

    service = new DeleteAlunoService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided api', () => {
      expect(service.alunoApi).toBe(mockApi);
    });

    it('should store api reference correctly', () => {
      const customApi = { delete: jest.fn() };
      const customService = new DeleteAlunoService(customApi);

      expect(customService.alunoApi).toBe(customApi);
    });

    it('should accept null or undefined dependencies', () => {
      const serviceWithNull = new DeleteAlunoService(null);
      expect(serviceWithNull.alunoApi).toBeNull();

      const serviceWithUndefined = new DeleteAlunoService(undefined);
      expect(serviceWithUndefined.alunoApi).toBeUndefined();
    });
  });

  describe('execute', () => {
    it('should call api.delete with correct ID', async () => {
      const id = 123;
      const mockResponse = { success: true, message: 'Aluno deleted' };
      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(mockApi.delete).toHaveBeenCalledWith(id);
      expect(mockApi.delete).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockResponse);
    });

    it('should handle successful deletion with detailed response', async () => {
      const id = 456;
      const mockResponse = {
        success: true,
        message: 'Aluno removido com sucesso',
        deletedId: id,
        deletedAt: '2024-11-08T10:00:00Z',
      };
      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
      expect(result.deletedId).toBe(id);
    });

    it('should handle API errors', async () => {
      const id = 123;
      const error = new Error('API Error');
      mockApi.delete.mockRejectedValue(error);

      await expect(service.execute(id)).rejects.toThrow('API Error');
      expect(mockApi.delete).toHaveBeenCalledWith(id);
    });

    it('should handle not found errors', async () => {
      const id = 404;
      const notFoundError = new Error('Aluno not found');
      notFoundError.status = 404;
      mockApi.delete.mockRejectedValue(notFoundError);

      await expect(service.execute(id)).rejects.toThrow('Aluno not found');
      expect(mockApi.delete).toHaveBeenCalledWith(id);
    });

    it('should work with different ID types', async () => {
      const stringId = '456';
      const mockResponse = { success: true };
      mockApi.delete.mockResolvedValue(mockResponse);

      await service.execute(stringId);

      expect(mockApi.delete).toHaveBeenCalledWith(stringId);
    });

    it('should work with UUID string IDs', async () => {
      const uuidId = 'uuid-123-456-789';
      const mockResponse = { success: true, deletedId: uuidId };
      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(uuidId);

      expect(mockApi.delete).toHaveBeenCalledWith(uuidId);
      expect(result.deletedId).toBe(uuidId);
    });

    it('should handle numeric zero ID', async () => {
      const id = 0;
      const mockResponse = { success: true };
      mockApi.delete.mockResolvedValue(mockResponse);

      await service.execute(id);

      expect(mockApi.delete).toHaveBeenCalledWith(id);
    });

    it('should handle network errors', async () => {
      const id = 500;
      const networkError = new Error('Network timeout');
      networkError.code = 'TIMEOUT';
      mockApi.delete.mockRejectedValue(networkError);

      await expect(service.execute(id)).rejects.toThrow('Network timeout');
      expect(mockApi.delete).toHaveBeenCalledWith(id);
    });

    it('should handle unauthorized deletion', async () => {
      const id = 401;
      const authError = new Error('Unauthorized');
      authError.status = 401;
      mockApi.delete.mockRejectedValue(authError);

      await expect(service.execute(id)).rejects.toThrow('Unauthorized');
    });

    it('should handle forbidden deletion', async () => {
      const id = 403;
      const forbiddenError = new Error('Forbidden - cannot delete this aluno');
      forbiddenError.status = 403;
      mockApi.delete.mockRejectedValue(forbiddenError);

      await expect(service.execute(id)).rejects.toThrow(
        'Forbidden - cannot delete this aluno'
      );
    });

    it('should handle server errors', async () => {
      const id = 500;
      const serverError = new Error('Internal server error');
      serverError.status = 500;
      mockApi.delete.mockRejectedValue(serverError);

      await expect(service.execute(id)).rejects.toThrow(
        'Internal server error'
      );
    });

    it('should preserve response structure', async () => {
      const id = 789;
      const mockResponse = {
        success: true,
        message: 'Deletion successful',
        data: {
          id,
          deleted: true,
        },
        meta: {
          timestamp: '2024-11-08T10:00:00Z',
        },
      };
      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
      expect(result.meta.timestamp).toBeDefined();
    });
  });

  describe('static handle method', () => {
    beforeEach(() => {
      // Mock dos módulos para static methods
      AlunoApi.mockImplementation(() => mockApi);
    });

    it('should create service instance and execute', async () => {
      const id = 789;
      const mockResponse = { success: true, deletedId: id };
      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await DeleteAlunoService.handle(id);

      expect(AlunoApi).toHaveBeenCalledTimes(1);
      expect(mockApi.delete).toHaveBeenCalledWith(id);
      expect(result).toBe(mockResponse);
    });

    it('should handle errors in static method', async () => {
      const id = 123;
      const error = new Error('Static method error');
      mockApi.delete.mockRejectedValue(error);

      await expect(DeleteAlunoService.handle(id)).rejects.toThrow(
        'Static method error'
      );

      expect(AlunoApi).toHaveBeenCalledTimes(1);
      expect(mockApi.delete).toHaveBeenCalledWith(id);
    });

    it('should work with different ID types in static method', async () => {
      const stringId = 'abc-123';
      const mockResponse = { success: true };
      mockApi.delete.mockResolvedValue(mockResponse);

      await DeleteAlunoService.handle(stringId);

      expect(mockApi.delete).toHaveBeenCalledWith(stringId);
    });

    it('should create new instances each time', async () => {
      const id1 = 111;
      const id2 = 222;

      mockApi.delete.mockResolvedValue({ success: true });
      await DeleteAlunoService.handle(id1);

      mockApi.delete.mockResolvedValue({ success: true });
      await DeleteAlunoService.handle(id2);

      expect(AlunoApi).toHaveBeenCalledTimes(2);
      expect(mockApi.delete).toHaveBeenCalledTimes(2);
      expect(mockApi.delete).toHaveBeenNthCalledWith(1, id1);
      expect(mockApi.delete).toHaveBeenNthCalledWith(2, id2);
    });

    it('should handle null ID in static method', async () => {
      const nullError = new Error('Invalid ID');
      mockApi.delete.mockRejectedValue(nullError);

      await expect(DeleteAlunoService.handle(null)).rejects.toThrow(
        'Invalid ID'
      );
    });

    it('should handle undefined ID in static method', async () => {
      const undefinedError = new Error('Invalid ID');
      mockApi.delete.mockRejectedValue(undefinedError);

      await expect(DeleteAlunoService.handle(undefined)).rejects.toThrow(
        'Invalid ID'
      );
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete deletion workflow', async () => {
      const id = 999;
      const mockResponse = {
        success: true,
        message: 'Aluno e todos os dados relacionados foram removidos',
        deletedData: {
          alunoId: id,
          nome: 'João Silva',
          matriculas: 2,
          aulasConcluidas: 15,
        },
        deletedAt: '2024-11-08T15:30:00Z',
        deletedBy: 'admin',
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(mockApi.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockResponse);
      expect(result.deletedData.alunoId).toBe(id);
      expect(result.deletedData.matriculas).toBe(2);
    });

    it('should handle cascade deletion information', async () => {
      const id = 888;
      const mockResponse = {
        success: true,
        message: 'Deletion successful with cascading',
        cascadeInfo: {
          matriculas: 3,
          presencas: 45,
          avaliacoes: 10,
        },
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result.cascadeInfo).toBeDefined();
      expect(result.cascadeInfo.matriculas).toBe(3);
    });

    it('should maintain audit trail on deletion', async () => {
      const id = 777;
      const mockResponse = {
        success: true,
        audit: {
          action: 'DELETE',
          entityType: 'ALUNO',
          entityId: id,
          timestamp: '2024-11-08T16:00:00Z',
          performedBy: 'admin@escola.com',
          reason: 'Transferência para outra instituição',
        },
      };

      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result.audit).toBeDefined();
      expect(result.audit.action).toBe('DELETE');
      expect(result.audit.entityId).toBe(id);
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle deletion of already deleted aluno', async () => {
      const id = 409;
      const conflictError = new Error('Aluno already deleted');
      conflictError.status = 410;
      mockApi.delete.mockRejectedValue(conflictError);

      await expect(service.execute(id)).rejects.toThrow(
        'Aluno already deleted'
      );
    });

    it('should handle deletion with active dependencies', async () => {
      const id = 400;
      const dependencyError = new Error(
        'Cannot delete aluno with active enrollments'
      );
      dependencyError.status = 400;
      mockApi.delete.mockRejectedValue(dependencyError);

      await expect(service.execute(id)).rejects.toThrow(
        'Cannot delete aluno with active enrollments'
      );
    });

    it('should handle concurrent deletion attempts', async () => {
      const id = 409;
      const concurrencyError = new Error('Resource being modified');
      concurrencyError.status = 409;
      mockApi.delete.mockRejectedValue(concurrencyError);

      await expect(service.execute(id)).rejects.toThrow(
        'Resource being modified'
      );
    });

    it('should handle service unavailable', async () => {
      const id = 503;
      const serviceError = new Error('Service temporarily unavailable');
      serviceError.status = 503;
      mockApi.delete.mockRejectedValue(serviceError);

      await expect(service.execute(id)).rejects.toThrow(
        'Service temporarily unavailable'
      );
    });
  });

  describe('performance and reliability', () => {
    it('should handle multiple sequential deletions', async () => {
      const ids = [1, 2, 3, 4, 5];
      mockApi.delete.mockResolvedValue({ success: true });

      for (const id of ids) {
        await service.execute(id);
      }

      expect(mockApi.delete).toHaveBeenCalledTimes(5);
      ids.forEach((id, index) => {
        expect(mockApi.delete).toHaveBeenNthCalledWith(index + 1, id);
      });
    });

    it('should handle deletion timeout gracefully', async () => {
      const id = 504;
      const timeoutError = new Error('Gateway timeout');
      timeoutError.status = 504;
      timeoutError.code = 'ETIMEDOUT';
      mockApi.delete.mockRejectedValue(timeoutError);

      await expect(service.execute(id)).rejects.toThrow('Gateway timeout');
    });
  });
});
