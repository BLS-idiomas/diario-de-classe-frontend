import { UpdateContratoService } from './updateContratoService';
import { ContratoApi } from '@/store/api/contratoApi';

jest.mock('@/store/api/contratoApi');

describe('UpdateContratoService', () => {
  let contratoApi;
  let service;

  beforeEach(() => {
    contratoApi = new ContratoApi();
    service = new UpdateContratoService(contratoApi);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with contratoApi', () => {
      expect(service).toBeInstanceOf(UpdateContratoService);
      expect(service.contratoApi).toBe(contratoApi);
    });

    it('should store the contratoApi parameter', () => {
      const customApi = new ContratoApi();
      const customService = new UpdateContratoService(customApi);

      expect(customService.contratoApi).toBe(customApi);
    });

    it('should not create contratoApi if provided', () => {
      const apiCallCount = ContratoApi.mock.instances.length;
      new UpdateContratoService(contratoApi);

      expect(ContratoApi.mock.instances.length).toBe(apiCallCount);
    });
  });

  describe('execute', () => {
    it('should call contratoApi.update with correct id and data', async () => {
      const contratoId = 1;
      const contratoData = { nome: 'Contrato Atualizado', valor: 1500 };
      const mockResponse = { id: contratoId, ...contratoData };
      contratoApi.update.mockResolvedValue(mockResponse);

      await service.execute(contratoId, contratoData);

      expect(contratoApi.update).toHaveBeenCalledWith(contratoId, contratoData);
      expect(contratoApi.update).toHaveBeenCalledTimes(1);
    });

    it('should return the updated contrato from contratoApi.update', async () => {
      const contratoId = 5;
      const contratoData = {
        nome: 'Contrato Premium Atualizado',
        descricao: 'Nova descrição',
        valor: 3000.0,
      };
      const mockResponse = {
        id: contratoId,
        ...contratoData,
        updatedAt: '2025-12-11',
      };
      contratoApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoId, contratoData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle partial update with minimal data', async () => {
      const contratoId = 1;
      const contratoData = { nome: 'Novo Nome' };
      const mockResponse = { id: contratoId, ...contratoData };
      contratoApi.update.mockResolvedValue(mockResponse);

      await service.execute(contratoId, contratoData);

      expect(contratoApi.update).toHaveBeenCalledWith(contratoId, contratoData);
    });

    it('should handle complete update with all fields', async () => {
      const contratoId = 1;
      const contratoData = {
        nome: 'Contrato Completo Atualizado',
        descricao: 'Descrição atualizada',
        valor: 7500.0,
        dataInicio: '2025-01-15',
        dataFim: '2025-12-15',
        status: 'ativo',
        alunoId: 20,
        professorId: 10,
      };
      const mockResponse = { id: contratoId, ...contratoData };
      contratoApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoId, contratoData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle string id', async () => {
      const contratoId = '123';
      const contratoData = { nome: 'Updated' };
      const mockResponse = { id: 123, ...contratoData };
      contratoApi.update.mockResolvedValue(mockResponse);

      await service.execute(contratoId, contratoData);

      expect(contratoApi.update).toHaveBeenCalledWith('123', contratoData);
    });

    it('should handle zero as id', async () => {
      const contratoData = { nome: 'Updated' };
      const mockResponse = { id: 0, ...contratoData };
      contratoApi.update.mockResolvedValue(mockResponse);

      await service.execute(0, contratoData);

      expect(contratoApi.update).toHaveBeenCalledWith(0, contratoData);
    });

    it('should handle negative id', async () => {
      const contratoData = { nome: 'Updated' };
      const mockResponse = { id: -1, ...contratoData };
      contratoApi.update.mockResolvedValue(mockResponse);

      await service.execute(-1, contratoData);

      expect(contratoApi.update).toHaveBeenCalledWith(-1, contratoData);
    });

    it('should handle empty object as data', async () => {
      const contratoId = 1;
      const mockResponse = { id: contratoId };
      contratoApi.update.mockResolvedValue(mockResponse);

      await service.execute(contratoId, {});

      expect(contratoApi.update).toHaveBeenCalledWith(contratoId, {});
    });

    it('should handle null data', async () => {
      const contratoId = 1;
      const mockResponse = { id: contratoId };
      contratoApi.update.mockResolvedValue(mockResponse);

      await service.execute(contratoId, null);

      expect(contratoApi.update).toHaveBeenCalledWith(contratoId, null);
    });

    it('should handle undefined data', async () => {
      const contratoId = 1;
      const mockResponse = { id: contratoId };
      contratoApi.update.mockResolvedValue(mockResponse);

      await service.execute(contratoId, undefined);

      expect(contratoApi.update).toHaveBeenCalledWith(contratoId, undefined);
    });

    it('should propagate errors from contratoApi.update', async () => {
      const error = new Error('Failed to update contrato');
      contratoApi.update.mockRejectedValue(error);

      await expect(service.execute(1, { nome: 'Test' })).rejects.toThrow(
        'Failed to update contrato'
      );
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      contratoApi.update.mockRejectedValue(networkError);

      await expect(service.execute(1, { nome: 'Test' })).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle validation errors', async () => {
      const validationError = new Error('Validation failed');
      contratoApi.update.mockRejectedValue(validationError);

      await expect(service.execute(1, { nome: '' })).rejects.toThrow(
        'Validation failed'
      );
    });

    it('should handle 404 errors', async () => {
      const notFoundError = new Error('Contrato not found');
      contratoApi.update.mockRejectedValue(notFoundError);

      await expect(service.execute(999, { nome: 'Test' })).rejects.toThrow(
        'Contrato not found'
      );
    });

    it('should handle 403 errors', async () => {
      const forbiddenError = new Error('Forbidden');
      contratoApi.update.mockRejectedValue(forbiddenError);

      await expect(service.execute(1, { nome: 'Test' })).rejects.toThrow(
        'Forbidden'
      );
    });

    it('should handle 500 errors', async () => {
      const serverError = new Error('Internal server error');
      contratoApi.update.mockRejectedValue(serverError);

      await expect(service.execute(1, { nome: 'Test' })).rejects.toThrow(
        'Internal server error'
      );
    });

    it('should work with consecutive calls', async () => {
      const updates = [
        { id: 1, data: { nome: 'First Update', valor: 1000 } },
        { id: 2, data: { nome: 'Second Update', valor: 2000 } },
        { id: 3, data: { nome: 'Third Update', valor: 3000 } },
      ];

      contratoApi.update
        .mockResolvedValueOnce({ id: 1, ...updates[0].data })
        .mockResolvedValueOnce({ id: 2, ...updates[1].data })
        .mockResolvedValueOnce({ id: 3, ...updates[2].data });

      await service.execute(updates[0].id, updates[0].data);
      await service.execute(updates[1].id, updates[1].data);
      await service.execute(updates[2].id, updates[2].data);

      expect(contratoApi.update).toHaveBeenCalledTimes(3);
      expect(contratoApi.update).toHaveBeenNthCalledWith(1, 1, updates[0].data);
      expect(contratoApi.update).toHaveBeenNthCalledWith(2, 2, updates[1].data);
      expect(contratoApi.update).toHaveBeenNthCalledWith(3, 3, updates[2].data);
    });

    it('should return different responses for different updates', async () => {
      const update1 = { id: 1, data: { nome: 'Premium', valor: 5000 } };
      const update2 = { id: 2, data: { nome: 'Basic', valor: 1000 } };

      contratoApi.update
        .mockResolvedValueOnce({ id: 1, ...update1.data })
        .mockResolvedValueOnce({ id: 2, ...update2.data });

      const result1 = await service.execute(update1.id, update1.data);
      const result2 = await service.execute(update2.id, update2.data);

      expect(result1).toEqual({ id: 1, ...update1.data });
      expect(result2).toEqual({ id: 2, ...update2.data });
    });

    it('should handle update with numeric valor', async () => {
      const contratoId = 1;
      const contratoData = { valor: 4567.89 };
      const mockResponse = { id: contratoId, ...contratoData };
      contratoApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoId, contratoData);

      expect(result.valor).toBe(4567.89);
    });

    it('should handle update with zero valor', async () => {
      const contratoId = 1;
      const contratoData = { valor: 0 };
      const mockResponse = { id: contratoId, ...contratoData };
      contratoApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoId, contratoData);

      expect(result.valor).toBe(0);
    });

    it('should handle update with nested objects', async () => {
      const contratoId = 1;
      const contratoData = {
        nome: 'Contrato Complexo',
        metadata: {
          updatedBy: 'user456',
          tags: ['updated', 'premium'],
        },
      };
      const mockResponse = { id: contratoId, ...contratoData };
      contratoApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoId, contratoData);

      expect(result.metadata).toEqual(contratoData.metadata);
    });

    it('should handle update with special characters', async () => {
      const contratoId = 1;
      const contratoData = { nome: 'Contrato @#$% Atualizado' };
      const mockResponse = { id: contratoId, ...contratoData };
      contratoApi.update.mockResolvedValue(mockResponse);

      await service.execute(contratoId, contratoData);

      expect(contratoApi.update).toHaveBeenCalledWith(contratoId, contratoData);
    });

    it('should handle update with long strings', async () => {
      const contratoId = 1;
      const contratoData = {
        nome: 'C'.repeat(500),
        descricao: 'D'.repeat(1000),
      };
      const mockResponse = { id: contratoId, ...contratoData };
      contratoApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoId, contratoData);

      expect(result.nome.length).toBe(500);
      expect(result.descricao.length).toBe(1000);
    });

    it('should handle null id', async () => {
      const contratoData = { nome: 'Test' };
      const mockResponse = { id: null, ...contratoData };
      contratoApi.update.mockResolvedValue(mockResponse);

      await service.execute(null, contratoData);

      expect(contratoApi.update).toHaveBeenCalledWith(null, contratoData);
    });

    it('should handle undefined id', async () => {
      const contratoData = { nome: 'Test' };
      const mockResponse = { id: undefined, ...contratoData };
      contratoApi.update.mockResolvedValue(mockResponse);

      await service.execute(undefined, contratoData);

      expect(contratoApi.update).toHaveBeenCalledWith(undefined, contratoData);
    });
  });

  describe('handle (static method)', () => {
    it('should create ContratoApi instance', async () => {
      const initialCount = ContratoApi.mock.instances.length;
      ContratoApi.mockImplementation(() => ({
        update: jest.fn().mockResolvedValue({ id: 1, nome: 'Updated' }),
      }));

      await UpdateContratoService.handle(1, { nome: 'Test' });

      expect(ContratoApi.mock.instances.length).toBe(initialCount + 1);
    });

    it('should create UpdateContratoService instance', async () => {
      const contratoId = 1;
      const contratoData = { nome: 'Updated Contrato' };
      const mockResponse = { id: contratoId, ...contratoData };
      ContratoApi.mockImplementation(() => ({
        update: jest.fn().mockResolvedValue(mockResponse),
      }));

      const result = await UpdateContratoService.handle(
        contratoId,
        contratoData
      );

      expect(result).toEqual(mockResponse);
    });

    it('should call execute with correct id and data', async () => {
      const contratoId = 5;
      const contratoData = { nome: 'Test', valor: 2000 };
      const mockUpdate = jest
        .fn()
        .mockResolvedValue({ id: contratoId, ...contratoData });
      ContratoApi.mockImplementation(() => ({
        update: mockUpdate,
      }));

      await UpdateContratoService.handle(contratoId, contratoData);

      expect(mockUpdate).toHaveBeenCalledWith(contratoId, contratoData);
    });

    it('should return result from execute', async () => {
      const contratoId = 1;
      const contratoData = { nome: 'Premium Updated', valor: 6000 };
      const mockResponse = {
        id: contratoId,
        ...contratoData,
        updatedAt: '2025-12-11T12:00:00Z',
      };
      ContratoApi.mockImplementation(() => ({
        update: jest.fn().mockResolvedValue(mockResponse),
      }));

      const result = await UpdateContratoService.handle(
        contratoId,
        contratoData
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors from execute', async () => {
      const error = new Error('Failed to update');
      ContratoApi.mockImplementation(() => ({
        update: jest.fn().mockRejectedValue(error),
      }));

      await expect(
        UpdateContratoService.handle(1, { nome: 'Test' })
      ).rejects.toThrow('Failed to update');
    });

    it('should work with partial data', async () => {
      const mockUpdate = jest
        .fn()
        .mockResolvedValue({ id: 1, nome: 'Partial' });
      ContratoApi.mockImplementation(() => ({
        update: mockUpdate,
      }));

      await UpdateContratoService.handle(1, { nome: 'Partial' });

      expect(mockUpdate).toHaveBeenCalledWith(1, { nome: 'Partial' });
    });

    it('should work with consecutive calls', async () => {
      const mockUpdate = jest
        .fn()
        .mockResolvedValueOnce({ id: 1, nome: 'First' })
        .mockResolvedValueOnce({ id: 2, nome: 'Second' });

      ContratoApi.mockImplementation(() => ({
        update: mockUpdate,
      }));

      await UpdateContratoService.handle(1, { nome: 'First' });
      await UpdateContratoService.handle(2, { nome: 'Second' });

      expect(mockUpdate).toHaveBeenCalledTimes(2);
    });

    it('should create new instances for each call', async () => {
      const initialCount = ContratoApi.mock.instances.length;
      ContratoApi.mockImplementation(() => ({
        update: jest.fn().mockResolvedValue({ id: 1 }),
      }));

      await UpdateContratoService.handle(1, { nome: 'Test1' });
      await UpdateContratoService.handle(2, { nome: 'Test2' });

      expect(ContratoApi.mock.instances.length).toBe(initialCount + 2);
    });
  });

  describe('integration tests', () => {
    it('should update contrato successfully', async () => {
      const contratoId = 1;
      const contratoData = {
        nome: 'Contrato Integration Updated',
        valor: 3500,
      };
      const mockResponse = {
        id: contratoId,
        ...contratoData,
        updatedAt: '2025-12-11',
      };
      contratoApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoId, contratoData);

      expect(result).toEqual(mockResponse);
      expect(contratoApi.update).toHaveBeenCalledWith(contratoId, contratoData);
    });

    it('should handle updating multiple contratos', async () => {
      const updates = [
        { id: 1, data: { nome: 'First', valor: 1000 } },
        { id: 2, data: { nome: 'Second', valor: 2000 } },
        { id: 3, data: { nome: 'Third', valor: 3000 } },
      ];

      contratoApi.update
        .mockResolvedValueOnce({ id: 1, ...updates[0].data })
        .mockResolvedValueOnce({ id: 2, ...updates[1].data })
        .mockResolvedValueOnce({ id: 3, ...updates[2].data });

      await service.execute(updates[0].id, updates[0].data);
      await service.execute(updates[1].id, updates[1].data);
      await service.execute(updates[2].id, updates[2].data);

      expect(contratoApi.update).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent update requests', async () => {
      const updates = [
        { id: 1, data: { nome: 'First', valor: 1000 } },
        { id: 2, data: { nome: 'Second', valor: 2000 } },
        { id: 3, data: { nome: 'Third', valor: 3000 } },
      ];

      contratoApi.update
        .mockResolvedValueOnce({ id: 1, ...updates[0].data })
        .mockResolvedValueOnce({ id: 2, ...updates[1].data })
        .mockResolvedValueOnce({ id: 3, ...updates[2].data });

      const promises = [
        service.execute(updates[0].id, updates[0].data),
        service.execute(updates[1].id, updates[1].data),
        service.execute(updates[2].id, updates[2].data),
      ];

      const results = await Promise.all(promises);

      expect(results).toEqual([
        { id: 1, ...updates[0].data },
        { id: 2, ...updates[1].data },
        { id: 3, ...updates[2].data },
      ]);
      expect(contratoApi.update).toHaveBeenCalledTimes(3);
    });

    it('should preserve all updated fields in response', async () => {
      const contratoId = 1;
      const contratoData = {
        nome: 'Contrato Full Update',
        descricao: 'Descrição totalmente atualizada',
        valor: 9500.75,
        dataInicio: '2025-02-01',
        dataFim: '2026-01-31',
        status: 'renovado',
        alunoId: 25,
        professorId: 12,
        observacoes: 'Renovado com sucesso',
      };
      const mockResponse = {
        id: contratoId,
        ...contratoData,
        updatedAt: '2025-12-11T14:30:00Z',
      };
      contratoApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoId, contratoData);

      expect(result.nome).toBe(contratoData.nome);
      expect(result.descricao).toBe(contratoData.descricao);
      expect(result.valor).toBe(contratoData.valor);
      expect(result.status).toBe(contratoData.status);
      expect(result.alunoId).toBe(contratoData.alunoId);
      expect(result.professorId).toBe(contratoData.professorId);
      expect(result.updatedAt).toBeDefined();
    });

    it('should handle partial updates preserving existing data', async () => {
      const contratoId = 1;
      const existingData = {
        id: 1,
        nome: 'Old Name',
        descricao: 'Old Description',
        valor: 1000,
      };
      const updateData = { nome: 'New Name' };
      const mockResponse = {
        ...existingData,
        ...updateData,
        updatedAt: '2025-12-11',
      };
      contratoApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(contratoId, updateData);

      expect(result.nome).toBe('New Name');
      expect(result.descricao).toBe('Old Description');
      expect(result.valor).toBe(1000);
    });
  });
});
