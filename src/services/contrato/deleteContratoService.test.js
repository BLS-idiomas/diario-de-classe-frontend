import { DeleteContratoService } from './deleteContratoService';
import { ContratoApi } from '@/store/api/contratoApi';

jest.mock('@/store/api/contratoApi');

describe('DeleteContratoService', () => {
  let contratoApi;
  let service;

  beforeEach(() => {
    contratoApi = new ContratoApi();
    service = new DeleteContratoService(contratoApi);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with contratoApi', () => {
      expect(service).toBeInstanceOf(DeleteContratoService);
      expect(service.contratoApi).toBe(contratoApi);
    });

    it('should store the contratoApi parameter', () => {
      const customApi = new ContratoApi();
      const customService = new DeleteContratoService(customApi);

      expect(customService.contratoApi).toBe(customApi);
    });

    it('should not create contratoApi if provided', () => {
      const apiCallCount = ContratoApi.mock.instances.length;
      new DeleteContratoService(contratoApi);

      expect(ContratoApi.mock.instances.length).toBe(apiCallCount);
    });
  });

  describe('execute', () => {
    it('should call contratoApi.delete with correct id', async () => {
      const contratoId = 1;
      contratoApi.delete.mockResolvedValue({ success: true });

      await service.execute(contratoId);

      expect(contratoApi.delete).toHaveBeenCalledWith(contratoId);
      expect(contratoApi.delete).toHaveBeenCalledTimes(1);
    });

    it('should return the result from contratoApi.delete', async () => {
      const mockResponse = { success: true, message: 'Contrato deleted' };
      contratoApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(5);

      expect(result).toEqual(mockResponse);
    });

    it('should handle string id', async () => {
      const contratoId = '123';
      contratoApi.delete.mockResolvedValue({ success: true });

      await service.execute(contratoId);

      expect(contratoApi.delete).toHaveBeenCalledWith('123');
    });

    it('should handle zero as id', async () => {
      contratoApi.delete.mockResolvedValue({ success: true });

      await service.execute(0);

      expect(contratoApi.delete).toHaveBeenCalledWith(0);
    });

    it('should handle negative id', async () => {
      contratoApi.delete.mockResolvedValue({ success: true });

      await service.execute(-1);

      expect(contratoApi.delete).toHaveBeenCalledWith(-1);
    });

    it('should propagate errors from contratoApi.delete', async () => {
      const error = new Error('Delete failed');
      contratoApi.delete.mockRejectedValue(error);

      await expect(service.execute(1)).rejects.toThrow('Delete failed');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      contratoApi.delete.mockRejectedValue(networkError);

      await expect(service.execute(1)).rejects.toThrow('Network error');
    });

    it('should handle 404 errors', async () => {
      const notFoundError = new Error('Contrato not found');
      contratoApi.delete.mockRejectedValue(notFoundError);

      await expect(service.execute(999)).rejects.toThrow('Contrato not found');
    });

    it('should handle 403 errors', async () => {
      const forbiddenError = new Error('Forbidden');
      contratoApi.delete.mockRejectedValue(forbiddenError);

      await expect(service.execute(1)).rejects.toThrow('Forbidden');
    });

    it('should handle 500 errors', async () => {
      const serverError = new Error('Internal server error');
      contratoApi.delete.mockRejectedValue(serverError);

      await expect(service.execute(1)).rejects.toThrow('Internal server error');
    });

    it('should handle null id', async () => {
      contratoApi.delete.mockResolvedValue({ success: true });

      await service.execute(null);

      expect(contratoApi.delete).toHaveBeenCalledWith(null);
    });

    it('should handle undefined id', async () => {
      contratoApi.delete.mockResolvedValue({ success: true });

      await service.execute(undefined);

      expect(contratoApi.delete).toHaveBeenCalledWith(undefined);
    });

    it('should work with consecutive calls', async () => {
      contratoApi.delete.mockResolvedValue({ success: true });

      await service.execute(1);
      await service.execute(2);
      await service.execute(3);

      expect(contratoApi.delete).toHaveBeenCalledTimes(3);
      expect(contratoApi.delete).toHaveBeenNthCalledWith(1, 1);
      expect(contratoApi.delete).toHaveBeenNthCalledWith(2, 2);
      expect(contratoApi.delete).toHaveBeenNthCalledWith(3, 3);
    });

    it('should return different responses for different ids', async () => {
      contratoApi.delete
        .mockResolvedValueOnce({ success: true, id: 1 })
        .mockResolvedValueOnce({ success: true, id: 2 });

      const result1 = await service.execute(1);
      const result2 = await service.execute(2);

      expect(result1).toEqual({ success: true, id: 1 });
      expect(result2).toEqual({ success: true, id: 2 });
    });
  });

  describe('handle (static method)', () => {
    it('should create ContratoApi instance', async () => {
      const initialCount = ContratoApi.mock.instances.length;
      ContratoApi.mockImplementation(() => ({
        delete: jest.fn().mockResolvedValue({ success: true }),
      }));

      await DeleteContratoService.handle(1);

      expect(ContratoApi.mock.instances.length).toBe(initialCount + 1);
    });

    it('should create DeleteContratoService instance', async () => {
      ContratoApi.mockImplementation(() => ({
        delete: jest.fn().mockResolvedValue({ success: true }),
      }));

      const result = await DeleteContratoService.handle(1);

      expect(result).toEqual({ success: true });
    });

    it('should call execute with correct id', async () => {
      const mockDelete = jest.fn().mockResolvedValue({ success: true });
      ContratoApi.mockImplementation(() => ({
        delete: mockDelete,
      }));

      await DeleteContratoService.handle(5);

      expect(mockDelete).toHaveBeenCalledWith(5);
    });

    it('should return result from execute', async () => {
      const mockResponse = { success: true, message: 'Deleted successfully' };
      ContratoApi.mockImplementation(() => ({
        delete: jest.fn().mockResolvedValue(mockResponse),
      }));

      const result = await DeleteContratoService.handle(1);

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors from execute', async () => {
      const error = new Error('Delete failed');
      ContratoApi.mockImplementation(() => ({
        delete: jest.fn().mockRejectedValue(error),
      }));

      await expect(DeleteContratoService.handle(1)).rejects.toThrow(
        'Delete failed'
      );
    });

    it('should work with string id', async () => {
      const mockDelete = jest.fn().mockResolvedValue({ success: true });
      ContratoApi.mockImplementation(() => ({
        delete: mockDelete,
      }));

      await DeleteContratoService.handle('456');

      expect(mockDelete).toHaveBeenCalledWith('456');
    });

    it('should work with consecutive calls', async () => {
      const mockDelete = jest.fn().mockResolvedValue({ success: true });
      ContratoApi.mockImplementation(() => ({
        delete: mockDelete,
      }));

      await DeleteContratoService.handle(1);
      await DeleteContratoService.handle(2);

      expect(mockDelete).toHaveBeenCalledTimes(2);
    });

    it('should create new instances for each call', async () => {
      const initialCount = ContratoApi.mock.instances.length;
      ContratoApi.mockImplementation(() => ({
        delete: jest.fn().mockResolvedValue({ success: true }),
      }));

      await DeleteContratoService.handle(1);
      await DeleteContratoService.handle(2);

      expect(ContratoApi.mock.instances.length).toBe(initialCount + 2);
    });
  });

  describe('integration tests', () => {
    it('should delete contrato successfully', async () => {
      const mockResponse = { success: true, message: 'Contrato deleted' };
      contratoApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(1);

      expect(result).toEqual(mockResponse);
      expect(contratoApi.delete).toHaveBeenCalledWith(1);
    });

    it('should handle deletion of multiple contratos', async () => {
      contratoApi.delete.mockResolvedValue({ success: true });

      await service.execute(1);
      await service.execute(2);
      await service.execute(3);

      expect(contratoApi.delete).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent deletions', async () => {
      contratoApi.delete.mockResolvedValue({ success: true });

      const promises = [
        service.execute(1),
        service.execute(2),
        service.execute(3),
      ];

      await Promise.all(promises);

      expect(contratoApi.delete).toHaveBeenCalledTimes(3);
    });
  });
});
