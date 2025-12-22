import { CreateContratoService } from './createContratoService';
import { ContratoApi } from '@/store/api/contratoApi';

jest.mock('@/store/api/contratoApi');

describe('CreateContratoService', () => {
  let contratoApi;
  let service;

  beforeEach(() => {
    contratoApi = new ContratoApi();
    service = new CreateContratoService(contratoApi);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with contratoApi', () => {
      expect(service).toBeInstanceOf(CreateContratoService);
      expect(service.contratoApi).toBe(contratoApi);
    });

    it('should store the contratoApi parameter', () => {
      const customApi = new ContratoApi();
      const customService = new CreateContratoService(customApi);

      expect(customService.contratoApi).toBe(customApi);
    });

    it('should not create contratoApi if provided', () => {
      const apiCallCount = ContratoApi.mock.instances.length;
      new CreateContratoService(contratoApi);

      expect(ContratoApi.mock.instances.length).toBe(apiCallCount);
    });
  });

  describe('execute', () => {
    it('should call contratoApi.create with correct data', async () => {
      const contratoData = { nome: 'Contrato Novo', valor: 1000 };
      const mockResponse = { id: 1, ...contratoData };
      contratoApi.create.mockResolvedValue(mockResponse);

      await service.execute(contratoData);

      expect(contratoApi.create).toHaveBeenCalledWith(contratoData);
      expect(contratoApi.create).toHaveBeenCalledTimes(1);
    });

    it('should return the created contrato from contratoApi.create', async () => {
      const contratoData = {
        nome: 'Contrato Premium',
        descricao: 'Descrição do contrato',
        valor: 2500.0,
      };
      const mockResponse = { id: 5, ...contratoData };
      contratoApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle minimal contrato data', async () => {
      const contratoData = { nome: 'Contrato Básico' };
      const mockResponse = { id: 1, ...contratoData };
      contratoApi.create.mockResolvedValue(mockResponse);

      await service.execute(contratoData);

      expect(contratoApi.create).toHaveBeenCalledWith(contratoData);
    });

    it('should handle complete contrato data', async () => {
      const contratoData = {
        nome: 'Contrato Completo',
        descricao: 'Descrição completa',
        valor: 5000.0,
        dataInicio: '2025-01-01',
        dataFim: '2025-12-31',
        status: 'ativo',
        alunoId: 10,
        professorId: 5,
      };
      const mockResponse = { id: 1, ...contratoData };
      contratoApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty object', async () => {
      const contratoData = {};
      const mockResponse = { id: 1 };
      contratoApi.create.mockResolvedValue(mockResponse);

      await service.execute(contratoData);

      expect(contratoApi.create).toHaveBeenCalledWith({});
    });

    it('should handle null data', async () => {
      const mockResponse = { id: 1 };
      contratoApi.create.mockResolvedValue(mockResponse);

      await service.execute(null);

      expect(contratoApi.create).toHaveBeenCalledWith(null);
    });

    it('should handle undefined data', async () => {
      const mockResponse = { id: 1 };
      contratoApi.create.mockResolvedValue(mockResponse);

      await service.execute(undefined);

      expect(contratoApi.create).toHaveBeenCalledWith(undefined);
    });

    it('should propagate errors from contratoApi.create', async () => {
      const error = new Error('Failed to create contrato');
      contratoApi.create.mockRejectedValue(error);

      await expect(service.execute({ nome: 'Test' })).rejects.toThrow(
        'Failed to create contrato'
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      contratoApi.create.mockRejectedValue(networkError);

      await expect(service.execute({ nome: 'Test' })).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle validation errors', async () => {
      const validationError = new Error('Validation failed');
      contratoApi.create.mockRejectedValue(validationError);

      await expect(service.execute({ nome: '' })).rejects.toThrow(
        'Validation failed'
      );
    });

    it('should handle 400 errors', async () => {
      const badRequestError = new Error('Bad request');
      contratoApi.create.mockRejectedValue(badRequestError);

      await expect(service.execute({ nome: 'Test' })).rejects.toThrow(
        'Bad request'
      );
    });

    it('should handle 403 errors', async () => {
      const forbiddenError = new Error('Forbidden');
      contratoApi.create.mockRejectedValue(forbiddenError);

      await expect(service.execute({ nome: 'Test' })).rejects.toThrow(
        'Forbidden'
      );
    });

    it('should handle 500 errors', async () => {
      const serverError = new Error('Internal server error');
      contratoApi.create.mockRejectedValue(serverError);

      await expect(service.execute({ nome: 'Test' })).rejects.toThrow(
        'Internal server error'
      );
    });

    it('should work with consecutive calls', async () => {
      const contratoData1 = { nome: 'Contrato 1', valor: 1000 };
      const contratoData2 = { nome: 'Contrato 2', valor: 2000 };
      const contratoData3 = { nome: 'Contrato 3', valor: 3000 };

      contratoApi.create
        .mockResolvedValueOnce({ id: 1, ...contratoData1 })
        .mockResolvedValueOnce({ id: 2, ...contratoData2 })
        .mockResolvedValueOnce({ id: 3, ...contratoData3 });

      await service.execute(contratoData1);
      await service.execute(contratoData2);
      await service.execute(contratoData3);

      expect(contratoApi.create).toHaveBeenCalledTimes(3);
      expect(contratoApi.create).toHaveBeenNthCalledWith(1, contratoData1);
      expect(contratoApi.create).toHaveBeenNthCalledWith(2, contratoData2);
      expect(contratoApi.create).toHaveBeenNthCalledWith(3, contratoData3);
    });

    it('should return different contratos for different data', async () => {
      const contratoData1 = { nome: 'Premium', valor: 3000 };
      const contratoData2 = { nome: 'Basic', valor: 1000 };

      contratoApi.create
        .mockResolvedValueOnce({ id: 1, ...contratoData1 })
        .mockResolvedValueOnce({ id: 2, ...contratoData2 });

      const result1 = await service.execute(contratoData1);
      const result2 = await service.execute(contratoData2);

      expect(result1).toEqual({ id: 1, ...contratoData1 });
      expect(result2).toEqual({ id: 2, ...contratoData2 });
    });

    it('should handle contrato with numeric valor', async () => {
      const contratoData = { nome: 'Test', valor: 999.99 };
      const mockResponse = { id: 1, ...contratoData };
      contratoApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoData);

      expect(result.valor).toBe(999.99);
    });

    it('should handle contrato with zero valor', async () => {
      const contratoData = { nome: 'Free', valor: 0 };
      const mockResponse = { id: 1, ...contratoData };
      contratoApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoData);

      expect(result.valor).toBe(0);
    });

    it('should handle contrato with nested objects', async () => {
      const contratoData = {
        nome: 'Contrato Complexo',
        metadata: {
          createdBy: 'user123',
          tags: ['premium', 'vip'],
        },
      };
      const mockResponse = { id: 1, ...contratoData };
      contratoApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoData);

      expect(result.metadata).toEqual(contratoData.metadata);
    });

    it('should handle contrato with special characters in nome', async () => {
      const contratoData = { nome: 'Contrato @#$% Especial' };
      const mockResponse = { id: 1, ...contratoData };
      contratoApi.create.mockResolvedValue(mockResponse);

      await service.execute(contratoData);

      expect(contratoApi.create).toHaveBeenCalledWith(contratoData);
    });

    it('should handle contrato with long strings', async () => {
      const contratoData = {
        nome: 'A'.repeat(500),
        descricao: 'B'.repeat(1000),
      };
      const mockResponse = { id: 1, ...contratoData };
      contratoApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoData);

      expect(result.nome.length).toBe(500);
      expect(result.descricao.length).toBe(1000);
    });
  });

  describe('handle (static method)', () => {
    it('should create ContratoApi instance', async () => {
      const initialCount = ContratoApi.mock.instances.length;
      ContratoApi.mockImplementation(() => ({
        create: jest.fn().mockResolvedValue({ id: 1 }),
      }));

      await CreateContratoService.handle({ nome: 'Test' });

      expect(ContratoApi.mock.instances.length).toBe(initialCount + 1);
    });

    it('should create CreateContratoService instance', async () => {
      const contratoData = { nome: 'Contrato Test' };
      const mockResponse = { id: 1, ...contratoData };
      ContratoApi.mockImplementation(() => ({
        create: jest.fn().mockResolvedValue(mockResponse),
      }));

      const result = await CreateContratoService.handle(contratoData);

      expect(result).toEqual(mockResponse);
    });

    it('should call execute with correct data', async () => {
      const contratoData = { nome: 'Test', valor: 1500 };
      const mockCreate = jest
        .fn()
        .mockResolvedValue({ id: 1, ...contratoData });
      ContratoApi.mockImplementation(() => ({
        create: mockCreate,
      }));

      await CreateContratoService.handle(contratoData);

      expect(mockCreate).toHaveBeenCalledWith(contratoData);
    });

    it('should return result from execute', async () => {
      const contratoData = { nome: 'Premium', valor: 5000 };
      const mockResponse = {
        id: 1,
        nome: 'Premium',
        valor: 5000,
        createdAt: '2025-12-11',
      };
      ContratoApi.mockImplementation(() => ({
        create: jest.fn().mockResolvedValue(mockResponse),
      }));

      const result = await CreateContratoService.handle(contratoData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors from execute', async () => {
      const error = new Error('Failed to create');
      ContratoApi.mockImplementation(() => ({
        create: jest.fn().mockRejectedValue(error),
      }));

      await expect(
        CreateContratoService.handle({ nome: 'Test' })
      ).rejects.toThrow('Failed to create');
    });

    it('should work with minimal data', async () => {
      const mockCreate = jest.fn().mockResolvedValue({ id: 1, nome: 'Basic' });
      ContratoApi.mockImplementation(() => ({
        create: mockCreate,
      }));

      await CreateContratoService.handle({ nome: 'Basic' });

      expect(mockCreate).toHaveBeenCalledWith({ nome: 'Basic' });
    });

    it('should work with consecutive calls', async () => {
      const mockCreate = jest
        .fn()
        .mockResolvedValueOnce({ id: 1, nome: 'First' })
        .mockResolvedValueOnce({ id: 2, nome: 'Second' });

      ContratoApi.mockImplementation(() => ({
        create: mockCreate,
      }));

      await CreateContratoService.handle({ nome: 'First' });
      await CreateContratoService.handle({ nome: 'Second' });

      expect(mockCreate).toHaveBeenCalledTimes(2);
    });

    it('should create new instances for each call', async () => {
      const initialCount = ContratoApi.mock.instances.length;
      ContratoApi.mockImplementation(() => ({
        create: jest.fn().mockResolvedValue({ id: 1 }),
      }));

      await CreateContratoService.handle({ nome: 'Test1' });
      await CreateContratoService.handle({ nome: 'Test2' });

      expect(ContratoApi.mock.instances.length).toBe(initialCount + 2);
    });
  });

  describe('integration tests', () => {
    it('should create contrato successfully', async () => {
      const contratoData = {
        nome: 'Contrato Integration',
        valor: 2000,
      };
      const mockResponse = { id: 1, ...contratoData };
      contratoApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoData);

      expect(result).toEqual(mockResponse);
      expect(contratoApi.create).toHaveBeenCalledWith(contratoData);
    });

    it('should handle creating multiple contratos', async () => {
      const contratoData1 = { nome: 'Contrato 1', valor: 1000 };
      const contratoData2 = { nome: 'Contrato 2', valor: 2000 };
      const contratoData3 = { nome: 'Contrato 3', valor: 3000 };

      contratoApi.create
        .mockResolvedValueOnce({ id: 1, ...contratoData1 })
        .mockResolvedValueOnce({ id: 2, ...contratoData2 })
        .mockResolvedValueOnce({ id: 3, ...contratoData3 });

      await service.execute(contratoData1);
      await service.execute(contratoData2);
      await service.execute(contratoData3);

      expect(contratoApi.create).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent create requests', async () => {
      const contratoData1 = { nome: 'First', valor: 1000 };
      const contratoData2 = { nome: 'Second', valor: 2000 };
      const contratoData3 = { nome: 'Third', valor: 3000 };

      contratoApi.create
        .mockResolvedValueOnce({ id: 1, ...contratoData1 })
        .mockResolvedValueOnce({ id: 2, ...contratoData2 })
        .mockResolvedValueOnce({ id: 3, ...contratoData3 });

      const promises = [
        service.execute(contratoData1),
        service.execute(contratoData2),
        service.execute(contratoData3),
      ];

      const results = await Promise.all(promises);

      expect(results).toEqual([
        { id: 1, ...contratoData1 },
        { id: 2, ...contratoData2 },
        { id: 3, ...contratoData3 },
      ]);
      expect(contratoApi.create).toHaveBeenCalledTimes(3);
    });

    it('should preserve all data fields in created contrato', async () => {
      const contratoData = {
        nome: 'Contrato Full',
        descricao: 'Descrição completa do contrato',
        valor: 7500.5,
        dataInicio: '2025-01-01',
        dataFim: '2025-12-31',
        status: 'ativo',
        alunoId: 15,
        professorId: 8,
        observacoes: 'Observações importantes',
      };
      const mockResponse = { id: 1, ...contratoData, createdAt: '2025-12-11' };
      contratoApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoData);

      expect(result.nome).toBe(contratoData.nome);
      expect(result.descricao).toBe(contratoData.descricao);
      expect(result.valor).toBe(contratoData.valor);
      expect(result.alunoId).toBe(contratoData.alunoId);
      expect(result.professorId).toBe(contratoData.professorId);
    });

    it('should handle creation with auto-generated fields', async () => {
      const contratoData = { nome: 'Contrato Auto', valor: 1200 };
      const mockResponse = {
        id: 99,
        ...contratoData,
        createdAt: '2025-12-11T10:00:00Z',
        updatedAt: '2025-12-11T10:00:00Z',
      };
      contratoApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoData);

      expect(result.id).toBe(99);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });
  });
});
