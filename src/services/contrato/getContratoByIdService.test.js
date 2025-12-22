import { GetContratoByIdService } from './getContratoByIdService';
import { ContratoApi } from '@/store/api/contratoApi';

jest.mock('@/store/api/contratoApi');

describe('GetContratoByIdService', () => {
  let contratoApi;
  let service;

  beforeEach(() => {
    contratoApi = new ContratoApi();
    service = new GetContratoByIdService(contratoApi, true);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with contratoApi and withRelations', () => {
      expect(service).toBeInstanceOf(GetContratoByIdService);
      expect(service.contratoApi).toBe(contratoApi);
      expect(service.withRelations).toBe(true);
    });

    it('should store the contratoApi and withRelations parameters', () => {
      const customApi = new ContratoApi();
      const customService = new GetContratoByIdService(customApi, false);

      expect(customService.contratoApi).toBe(customApi);
      expect(customService.withRelations).toBe(false);
    });

    it('should handle withRelations as undefined', () => {
      const customApi = new ContratoApi();
      const customService = new GetContratoByIdService(customApi);

      expect(customService.contratoApi).toBe(customApi);
      expect(customService.withRelations).toBeUndefined();
    });

    it('should not create contratoApi if provided', () => {
      const apiCallCount = ContratoApi.mock.instances.length;
      new GetContratoByIdService(contratoApi);

      expect(ContratoApi.mock.instances.length).toBe(apiCallCount);
    });
  });

  describe('execute', () => {
    it('should call contratoApi.getById with correct id and params', async () => {
      const contratoId = 1;
      const mockContrato = { id: 1, nome: 'Contrato 1' };
      contratoApi.getById.mockResolvedValue(mockContrato);

      await service.execute(contratoId);

      expect(contratoApi.getById).toHaveBeenCalledWith(contratoId, {
        withRelations: true,
      });
      expect(contratoApi.getById).toHaveBeenCalledTimes(1);
    });

    it('should return the contrato from contratoApi.getById', async () => {
      const mockContrato = {
        id: 5,
        nome: 'Contrato Teste',
        descricao: 'Descrição do contrato',
        valor: 1500.0,
      };
      contratoApi.getById.mockResolvedValue(mockContrato);

      const result = await service.execute(5);

      expect(result).toEqual(mockContrato);
    });

    it('should handle string id', async () => {
      const contratoId = '123';
      const mockContrato = { id: 123, nome: 'Contrato 123' };
      contratoApi.getById.mockResolvedValue(mockContrato);

      await service.execute(contratoId);

      expect(contratoApi.getById).toHaveBeenCalledWith('123', {
        withRelations: true,
      });
    });

    it('should handle zero as id', async () => {
      const mockContrato = { id: 0, nome: 'Contrato Zero' };
      contratoApi.getById.mockResolvedValue(mockContrato);

      await service.execute(0);

      expect(contratoApi.getById).toHaveBeenCalledWith(0, {
        withRelations: true,
      });
    });

    it('should handle negative id', async () => {
      const mockContrato = { id: -1, nome: 'Contrato Negativo' };
      contratoApi.getById.mockResolvedValue(mockContrato);

      await service.execute(-1);

      expect(contratoApi.getById).toHaveBeenCalledWith(-1, {
        withRelations: true,
      });
    });

    it('should propagate errors from contratoApi.getById', async () => {
      const error = new Error('Failed to fetch contrato');
      contratoApi.getById.mockRejectedValue(error);

      await expect(service.execute(1)).rejects.toThrow(
        'Failed to fetch contrato'
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      contratoApi.getById.mockRejectedValue(networkError);

      await expect(service.execute(1)).rejects.toThrow('Network error');
    });

    it('should handle 404 errors', async () => {
      const notFoundError = new Error('Contrato not found');
      contratoApi.getById.mockRejectedValue(notFoundError);

      await expect(service.execute(999)).rejects.toThrow('Contrato not found');
    });

    it('should handle 403 errors', async () => {
      const forbiddenError = new Error('Forbidden');
      contratoApi.getById.mockRejectedValue(forbiddenError);

      await expect(service.execute(1)).rejects.toThrow('Forbidden');
    });

    it('should handle 500 errors', async () => {
      const serverError = new Error('Internal server error');
      contratoApi.getById.mockRejectedValue(serverError);

      await expect(service.execute(1)).rejects.toThrow('Internal server error');
    });

    it('should handle null id', async () => {
      const mockContrato = { id: null };
      contratoApi.getById.mockResolvedValue(mockContrato);

      await service.execute(null);

      expect(contratoApi.getById).toHaveBeenCalledWith(null, {
        withRelations: true,
      });
    });

    it('should handle undefined id', async () => {
      const mockContrato = { id: undefined };
      contratoApi.getById.mockResolvedValue(mockContrato);

      await service.execute(undefined);

      expect(contratoApi.getById).toHaveBeenCalledWith(undefined, {
        withRelations: true,
      });
    });

    it('should call contratoApi.getById with withRelations false when specified', async () => {
      const serviceWithoutRelations = new GetContratoByIdService(
        contratoApi,
        false
      );
      const mockContrato = { id: 1, nome: 'Contrato Sem Relações' };
      contratoApi.getById.mockResolvedValue(mockContrato);

      await serviceWithoutRelations.execute(1);

      expect(contratoApi.getById).toHaveBeenCalledWith(1, {
        withRelations: false,
      });
    });

    it('should call contratoApi.getById with withRelations undefined when not specified', async () => {
      const serviceWithoutParam = new GetContratoByIdService(contratoApi);
      const mockContrato = { id: 1, nome: 'Contrato' };
      contratoApi.getById.mockResolvedValue(mockContrato);

      await serviceWithoutParam.execute(1);

      expect(contratoApi.getById).toHaveBeenCalledWith(1, {
        withRelations: undefined,
      });
    });

    it('should work with consecutive calls', async () => {
      // You can implement this test or remove it if not needed.
    });

    it('should call contratoApi.getById with withRelations undefined when not specified', async () => {
      const serviceWithoutParam = new GetContratoByIdService(contratoApi);
      const mockContrato = { id: 1, nome: 'Contrato' };
      contratoApi.getById.mockResolvedValue(mockContrato);

      await serviceWithoutParam.execute(1);

      expect(contratoApi.getById).toHaveBeenCalledWith(1, {
        withRelations: undefined,
      });
    });
    it('should work with consecutive calls', async () => {
      const mockContrato1 = { id: 1, nome: 'Contrato 1' };
      const mockContrato2 = { id: 2, nome: 'Contrato 2' };
      const mockContrato3 = { id: 3, nome: 'Contrato 3' };

      contratoApi.getById
        .mockResolvedValueOnce(mockContrato1)
        .mockResolvedValueOnce(mockContrato2)
        .mockResolvedValueOnce(mockContrato3);

      await service.execute(1);
      await service.execute(2);
      await service.execute(3);

      expect(contratoApi.getById).toHaveBeenCalledTimes(3);
      expect(contratoApi.getById).toHaveBeenNthCalledWith(1, 1, {
        withRelations: true,
      });
      expect(contratoApi.getById).toHaveBeenNthCalledWith(2, 2, {
        withRelations: true,
      });
      expect(contratoApi.getById).toHaveBeenNthCalledWith(3, 3, {
        withRelations: true,
      });
    });

    it('should return different contratos for different ids', async () => {
      const mockContrato1 = { id: 1, nome: 'Contrato A' };
      const mockContrato2 = { id: 2, nome: 'Contrato B' };

      contratoApi.getById
        .mockResolvedValueOnce(mockContrato1)
        .mockResolvedValueOnce(mockContrato2);

      const result1 = await service.execute(1);
      const result2 = await service.execute(2);

      expect(result1).toEqual(mockContrato1);
      expect(result2).toEqual(mockContrato2);
    });

    it('should handle contrato with complete data', async () => {
      const mockContrato = {
        id: 1,
        nome: 'Contrato Premium',
        descricao: 'Contrato com todos os benefícios',
        valor: 2500.0,
        dataInicio: '2025-01-01',
        dataFim: '2025-12-31',
        status: 'ativo',
        alunoId: 10,
        professorId: 5,
      };
      contratoApi.getById.mockResolvedValue(mockContrato);

      const result = await service.execute(1);

      expect(result).toEqual(mockContrato);
    });

    it('should handle contrato with minimal data', async () => {
      const mockContrato = { id: 1 };
      contratoApi.getById.mockResolvedValue(mockContrato);

      const result = await service.execute(1);

      expect(result).toEqual(mockContrato);
    });

    it('should handle empty contrato object', async () => {
      const mockContrato = {};
      contratoApi.getById.mockResolvedValue(mockContrato);

      const result = await service.execute(1);

      expect(result).toEqual({});
    });
  });

  describe('handle (static method)', () => {
    it('should create ContratoApi instance', async () => {
      const initialCount = ContratoApi.mock.instances.length;
      ContratoApi.mockImplementation(() => ({
        getById: jest.fn().mockResolvedValue({ id: 1 }),
      }));

      await GetContratoByIdService.handle(1, true);

      expect(ContratoApi.mock.instances.length).toBe(initialCount + 1);
    });

    it('should create GetContratoByIdService instance', async () => {
      ContratoApi.mockImplementation(() => ({
        getById: jest.fn().mockResolvedValue({ id: 1, nome: 'Contrato' }),
      }));

      const result = await GetContratoByIdService.handle(1);

      expect(result).toEqual({ id: 1, nome: 'Contrato' });
    });

    it('should call execute with correct id and withRelations', async () => {
      const mockGetById = jest.fn().mockResolvedValue({ id: 5, nome: 'Test' });
      ContratoApi.mockImplementation(() => ({
        getById: mockGetById,
      }));

      await GetContratoByIdService.handle(5, true);

      expect(mockGetById).toHaveBeenCalledWith(5, { withRelations: true });
    });

    it('should call execute with withRelations false', async () => {
      const mockGetById = jest.fn().mockResolvedValue({ id: 5, nome: 'Test' });
      ContratoApi.mockImplementation(() => ({
        getById: mockGetById,
      }));

      await GetContratoByIdService.handle(5, false);

      expect(mockGetById).toHaveBeenCalledWith(5, { withRelations: false });
    });

    it('should return result from execute', async () => {
      const mockContrato = {
        id: 1,
        nome: 'Contrato Especial',
        valor: 3000.0,
      };
      ContratoApi.mockImplementation(() => ({
        getById: jest.fn().mockResolvedValue(mockContrato),
      }));

      const result = await GetContratoByIdService.handle(1);

      expect(result).toEqual(mockContrato);
    });

    it('should handle errors from execute', async () => {
      const error = new Error('Failed to get contrato');
      ContratoApi.mockImplementation(() => ({
        getById: jest.fn().mockRejectedValue(error),
      }));

      await expect(GetContratoByIdService.handle(1)).rejects.toThrow(
        'Failed to get contrato'
      );
    });

    it('should work with string id', async () => {
      const mockGetById = jest
        .fn()
        .mockResolvedValue({ id: '456', nome: 'Contrato String' });
      ContratoApi.mockImplementation(() => ({
        getById: mockGetById,
      }));

      await GetContratoByIdService.handle('456', true);

      expect(mockGetById).toHaveBeenCalledWith('456', { withRelations: true });
    });

    it('should work with consecutive calls', async () => {
      const mockGetById = jest
        .fn()
        .mockResolvedValueOnce({ id: 1, nome: 'First' })
        .mockResolvedValueOnce({ id: 2, nome: 'Second' });

      ContratoApi.mockImplementation(() => ({
        getById: mockGetById,
      }));

      await GetContratoByIdService.handle(1);
      await GetContratoByIdService.handle(2);

      expect(mockGetById).toHaveBeenCalledTimes(2);
    });

    it('should create new instances for each call', async () => {
      const initialCount = ContratoApi.mock.instances.length;
      ContratoApi.mockImplementation(() => ({
        getById: jest.fn().mockResolvedValue({ id: 1 }),
      }));

      await GetContratoByIdService.handle(1);
      await GetContratoByIdService.handle(2);

      expect(ContratoApi.mock.instances.length).toBe(initialCount + 2);
    });
  });

  describe('integration tests', () => {
    it('should get contrato successfully', async () => {
      const mockContrato = {
        id: 1,
        nome: 'Contrato Integration',
        descricao: 'Test integration',
      };
      contratoApi.getById.mockResolvedValue(mockContrato);

      const result = await service.execute(1);

      expect(result).toEqual(mockContrato);
      expect(contratoApi.getById).toHaveBeenCalledWith(1, {
        withRelations: true,
      });
    });

    it('should handle getting multiple contratos', async () => {
      const mockContrato1 = { id: 1, nome: 'Contrato 1' };
      const mockContrato2 = { id: 2, nome: 'Contrato 2' };
      const mockContrato3 = { id: 3, nome: 'Contrato 3' };

      contratoApi.getById
        .mockResolvedValueOnce(mockContrato1)
        .mockResolvedValueOnce(mockContrato2)
        .mockResolvedValueOnce(mockContrato3);

      await service.execute(1);
      await service.execute(2);
      await service.execute(3);

      expect(contratoApi.getById).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent requests', async () => {
      const mockContrato1 = { id: 1, nome: 'Contrato 1' };
      const mockContrato2 = { id: 2, nome: 'Contrato 2' };
      const mockContrato3 = { id: 3, nome: 'Contrato 3' };

      contratoApi.getById
        .mockResolvedValueOnce(mockContrato1)
        .mockResolvedValueOnce(mockContrato2)
        .mockResolvedValueOnce(mockContrato3);

      const promises = [
        service.execute(1),
        service.execute(2),
        service.execute(3),
      ];

      const results = await Promise.all(promises);

      expect(results).toEqual([mockContrato1, mockContrato2, mockContrato3]);
      expect(contratoApi.getById).toHaveBeenCalledTimes(3);
    });

    it('should handle large contrato data', async () => {
      const mockContrato = {
        id: 1,
        nome: 'Contrato Grande',
        descricao: 'A'.repeat(1000),
        valor: 9999.99,
        metadata: {
          createdAt: '2025-01-01',
          updatedAt: '2025-12-11',
          author: 'Sistema',
          tags: ['premium', 'vip', 'especial'],
        },
      };
      contratoApi.getById.mockResolvedValue(mockContrato);

      const result = await service.execute(1);

      expect(result).toEqual(mockContrato);
      expect(result.descricao.length).toBe(1000);
    });
  });
});
