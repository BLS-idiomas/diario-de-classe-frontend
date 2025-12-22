import { GetContratoListService } from './getContratoListService';
import { ContratoApi } from '@/store/api/contratoApi';

jest.mock('@/store/api/contratoApi');

describe('GetContratoListService', () => {
  let contratoApi;
  let service;

  beforeEach(() => {
    contratoApi = new ContratoApi();
    service = new GetContratoListService(contratoApi);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with contratoApi', () => {
      expect(service).toBeInstanceOf(GetContratoListService);
      expect(service.contratoApi).toBe(contratoApi);
    });

    it('should store the contratoApi parameter', () => {
      const customApi = new ContratoApi();
      const customService = new GetContratoListService(customApi);

      expect(customService.contratoApi).toBe(customApi);
    });

    it('should not create contratoApi if provided', () => {
      const apiCallCount = ContratoApi.mock.instances.length;
      new GetContratoListService(contratoApi);

      expect(ContratoApi.mock.instances.length).toBe(apiCallCount);
    });
  });

  describe('execute', () => {
    it('should call contratoApi.getAll with search param', async () => {
      const searchParam = 'test';
      const mockContratos = [{ id: 1, nome: 'Contrato 1' }];
      contratoApi.getAll.mockResolvedValue(mockContratos);

      await service.execute(searchParam);

      expect(contratoApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(contratoApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return the list of contratos from contratoApi.getAll', async () => {
      const mockContratos = [
        { id: 1, nome: 'Contrato A', valor: 1000 },
        { id: 2, nome: 'Contrato B', valor: 2000 },
        { id: 3, nome: 'Contrato C', valor: 3000 },
      ];
      contratoApi.getAll.mockResolvedValue(mockContratos);

      const result = await service.execute('test');

      expect(result).toEqual(mockContratos);
    });

    it('should handle empty search param', async () => {
      const mockContratos = [{ id: 1, nome: 'All Contratos' }];
      contratoApi.getAll.mockResolvedValue(mockContratos);

      await service.execute('');

      expect(contratoApi.getAll).toHaveBeenCalledWith({ q: '' });
    });

    it('should handle undefined search param', async () => {
      const mockContratos = [];
      contratoApi.getAll.mockResolvedValue(mockContratos);

      await service.execute(undefined);

      expect(contratoApi.getAll).toHaveBeenCalledWith({ q: undefined });
    });

    it('should handle null search param', async () => {
      const mockContratos = [];
      contratoApi.getAll.mockResolvedValue(mockContratos);

      await service.execute(null);

      expect(contratoApi.getAll).toHaveBeenCalledWith({ q: null });
    });

    it('should handle numeric search param', async () => {
      const mockContratos = [{ id: 123, nome: 'Contrato 123' }];
      contratoApi.getAll.mockResolvedValue(mockContratos);

      await service.execute(123);

      expect(contratoApi.getAll).toHaveBeenCalledWith({ q: 123 });
    });

    it('should return empty array when no contratos found', async () => {
      contratoApi.getAll.mockResolvedValue([]);

      const result = await service.execute('nonexistent');

      expect(result).toEqual([]);
    });

    it('should propagate errors from contratoApi.getAll', async () => {
      const error = new Error('Failed to fetch contratos');
      contratoApi.getAll.mockRejectedValue(error);

      await expect(service.execute('test')).rejects.toThrow(
        'Failed to fetch contratos'
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      contratoApi.getAll.mockRejectedValue(networkError);

      await expect(service.execute('test')).rejects.toThrow('Network error');
    });

    it('should handle 404 errors', async () => {
      const notFoundError = new Error('Not found');
      contratoApi.getAll.mockRejectedValue(notFoundError);

      await expect(service.execute('test')).rejects.toThrow('Not found');
    });

    it('should handle 403 errors', async () => {
      const forbiddenError = new Error('Forbidden');
      contratoApi.getAll.mockRejectedValue(forbiddenError);

      await expect(service.execute('test')).rejects.toThrow('Forbidden');
    });

    it('should handle 500 errors', async () => {
      const serverError = new Error('Internal server error');
      contratoApi.getAll.mockRejectedValue(serverError);

      await expect(service.execute('test')).rejects.toThrow(
        'Internal server error'
      );
    });

    it('should work with consecutive calls', async () => {
      const mockContratos1 = [{ id: 1, nome: 'First' }];
      const mockContratos2 = [{ id: 2, nome: 'Second' }];
      const mockContratos3 = [{ id: 3, nome: 'Third' }];

      contratoApi.getAll
        .mockResolvedValueOnce(mockContratos1)
        .mockResolvedValueOnce(mockContratos2)
        .mockResolvedValueOnce(mockContratos3);

      await service.execute('first');
      await service.execute('second');
      await service.execute('third');

      expect(contratoApi.getAll).toHaveBeenCalledTimes(3);
      expect(contratoApi.getAll).toHaveBeenNthCalledWith(1, { q: 'first' });
      expect(contratoApi.getAll).toHaveBeenNthCalledWith(2, { q: 'second' });
      expect(contratoApi.getAll).toHaveBeenNthCalledWith(3, { q: 'third' });
    });

    it('should return different lists for different search params', async () => {
      const mockContratos1 = [{ id: 1, nome: 'Premium' }];
      const mockContratos2 = [{ id: 2, nome: 'Basic' }];

      contratoApi.getAll
        .mockResolvedValueOnce(mockContratos1)
        .mockResolvedValueOnce(mockContratos2);

      const result1 = await service.execute('premium');
      const result2 = await service.execute('basic');

      expect(result1).toEqual(mockContratos1);
      expect(result2).toEqual(mockContratos2);
    });

    it('should handle large result sets', async () => {
      const mockContratos = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        nome: `Contrato ${i + 1}`,
      }));
      contratoApi.getAll.mockResolvedValue(mockContratos);

      const result = await service.execute('all');

      expect(result).toHaveLength(100);
      expect(contratoApi.getAll).toHaveBeenCalledWith({ q: 'all' });
    });

    it('should handle special characters in search param', async () => {
      const searchParam = 'test@#$%';
      const mockContratos = [{ id: 1, nome: 'Special' }];
      contratoApi.getAll.mockResolvedValue(mockContratos);

      await service.execute(searchParam);

      expect(contratoApi.getAll).toHaveBeenCalledWith({ q: searchParam });
    });

    it('should handle long search strings', async () => {
      const longSearchParam = 'a'.repeat(1000);
      const mockContratos = [];
      contratoApi.getAll.mockResolvedValue(mockContratos);

      await service.execute(longSearchParam);

      expect(contratoApi.getAll).toHaveBeenCalledWith({ q: longSearchParam });
    });

    it('should handle contratos with complete data structure', async () => {
      const mockContratos = [
        {
          id: 1,
          nome: 'Contrato Premium',
          descricao: 'Contrato completo',
          valor: 5000.0,
          dataInicio: '2025-01-01',
          dataFim: '2025-12-31',
          status: 'ativo',
          alunoId: 10,
          professorId: 5,
        },
      ];
      contratoApi.getAll.mockResolvedValue(mockContratos);

      const result = await service.execute('premium');

      expect(result).toEqual(mockContratos);
    });
  });

  describe('handle (static method)', () => {
    it('should create ContratoApi instance', async () => {
      const initialCount = ContratoApi.mock.instances.length;
      ContratoApi.mockImplementation(() => ({
        getAll: jest.fn().mockResolvedValue([]),
      }));

      await GetContratoListService.handle('test');

      expect(ContratoApi.mock.instances.length).toBe(initialCount + 1);
    });

    it('should create GetContratoListService instance', async () => {
      const mockContratos = [{ id: 1, nome: 'Contrato' }];
      ContratoApi.mockImplementation(() => ({
        getAll: jest.fn().mockResolvedValue(mockContratos),
      }));

      const result = await GetContratoListService.handle('test');

      expect(result).toEqual(mockContratos);
    });

    it('should call execute with correct search param', async () => {
      const mockGetAll = jest.fn().mockResolvedValue([{ id: 1 }]);
      ContratoApi.mockImplementation(() => ({
        getAll: mockGetAll,
      }));

      await GetContratoListService.handle('search');

      expect(mockGetAll).toHaveBeenCalledWith({ q: 'search' });
    });

    it('should return result from execute', async () => {
      const mockContratos = [
        { id: 1, nome: 'First' },
        { id: 2, nome: 'Second' },
      ];
      ContratoApi.mockImplementation(() => ({
        getAll: jest.fn().mockResolvedValue(mockContratos),
      }));

      const result = await GetContratoListService.handle('test');

      expect(result).toEqual(mockContratos);
    });

    it('should handle errors from execute', async () => {
      const error = new Error('Failed to get list');
      ContratoApi.mockImplementation(() => ({
        getAll: jest.fn().mockRejectedValue(error),
      }));

      await expect(GetContratoListService.handle('test')).rejects.toThrow(
        'Failed to get list'
      );
    });

    it('should work with empty search param', async () => {
      const mockGetAll = jest.fn().mockResolvedValue([]);
      ContratoApi.mockImplementation(() => ({
        getAll: mockGetAll,
      }));

      await GetContratoListService.handle('');

      expect(mockGetAll).toHaveBeenCalledWith({ q: '' });
    });

    it('should work with consecutive calls', async () => {
      const mockGetAll = jest
        .fn()
        .mockResolvedValueOnce([{ id: 1 }])
        .mockResolvedValueOnce([{ id: 2 }]);

      ContratoApi.mockImplementation(() => ({
        getAll: mockGetAll,
      }));

      await GetContratoListService.handle('first');
      await GetContratoListService.handle('second');

      expect(mockGetAll).toHaveBeenCalledTimes(2);
    });

    it('should create new instances for each call', async () => {
      const initialCount = ContratoApi.mock.instances.length;
      ContratoApi.mockImplementation(() => ({
        getAll: jest.fn().mockResolvedValue([]),
      }));

      await GetContratoListService.handle('test1');
      await GetContratoListService.handle('test2');

      expect(ContratoApi.mock.instances.length).toBe(initialCount + 2);
    });
  });

  describe('integration tests', () => {
    it('should get contratos list successfully', async () => {
      const mockContratos = [
        { id: 1, nome: 'Contrato A' },
        { id: 2, nome: 'Contrato B' },
      ];
      contratoApi.getAll.mockResolvedValue(mockContratos);

      const result = await service.execute('test');

      expect(result).toEqual(mockContratos);
      expect(contratoApi.getAll).toHaveBeenCalledWith({ q: 'test' });
    });

    it('should handle multiple search operations', async () => {
      const mockContratos1 = [{ id: 1, nome: 'Premium' }];
      const mockContratos2 = [{ id: 2, nome: 'Basic' }];
      const mockContratos3 = [{ id: 3, nome: 'Standard' }];

      contratoApi.getAll
        .mockResolvedValueOnce(mockContratos1)
        .mockResolvedValueOnce(mockContratos2)
        .mockResolvedValueOnce(mockContratos3);

      await service.execute('premium');
      await service.execute('basic');
      await service.execute('standard');

      expect(contratoApi.getAll).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent search requests', async () => {
      const mockContratos1 = [{ id: 1, nome: 'First' }];
      const mockContratos2 = [{ id: 2, nome: 'Second' }];
      const mockContratos3 = [{ id: 3, nome: 'Third' }];

      contratoApi.getAll
        .mockResolvedValueOnce(mockContratos1)
        .mockResolvedValueOnce(mockContratos2)
        .mockResolvedValueOnce(mockContratos3);

      const promises = [
        service.execute('first'),
        service.execute('second'),
        service.execute('third'),
      ];

      const results = await Promise.all(promises);

      expect(results).toEqual([mockContratos1, mockContratos2, mockContratos3]);
      expect(contratoApi.getAll).toHaveBeenCalledTimes(3);
    });

    it('should handle pagination in large datasets', async () => {
      const mockContratos = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        nome: `Contrato ${i + 1}`,
        valor: (i + 1) * 100,
      }));
      contratoApi.getAll.mockResolvedValue(mockContratos);

      const result = await service.execute('all');

      expect(result).toHaveLength(50);
      expect(result[0].id).toBe(1);
      expect(result[49].id).toBe(50);
    });

    it('should preserve data integrity in search results', async () => {
      const mockContratos = [
        {
          id: 1,
          nome: 'Contrato Test',
          descricao: 'Test Description',
          valor: 1500.5,
          metadata: {
            created: '2025-01-01',
            tags: ['premium', 'active'],
          },
        },
      ];
      contratoApi.getAll.mockResolvedValue(mockContratos);

      const result = await service.execute('test');

      expect(result[0]).toEqual(mockContratos[0]);
      expect(result[0].metadata.tags).toEqual(['premium', 'active']);
    });
  });
});
