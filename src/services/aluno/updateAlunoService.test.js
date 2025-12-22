import { UpdateAlunoService } from './updateAlunoService';
import { AlunoApi } from '@/store/api/alunoApi';

jest.mock('@/store/api/alunoApi');

describe('UpdateAlunoService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApi = { update: jest.fn() };
    AlunoApi.mockImplementation(() => mockApi);
    service = new UpdateAlunoService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided alunoApi', () => {
      expect(service.alunoApi).toBe(mockApi);
    });

    it('should store api reference correctly', () => {
      const customApi = { update: jest.fn() };
      const customService = new UpdateAlunoService(customApi);

      expect(customService.alunoApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should call api.update with correct parameters', async () => {
      const id = 123;
      const updateData = { nome: 'João Updated', email: 'joao.new@aluno.com' };
      const mockResponse = {
        data: {
          id,
          ...updateData,
          updatedAt: '2024-11-08T10:00:00Z',
        },
      };
      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(id, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(id, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle partial updates', async () => {
      const id = 456;
      const partialData = { telefone: '(11) 88888-8888' };
      const mockResponse = {
        data: {
          id,
          nome: 'Maria',
          ...partialData,
        },
      };
      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(id, partialData);

      expect(mockApi.update).toHaveBeenCalledWith(id, partialData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle complex nested data updates', async () => {
      const id = 789;
      const complexData = {
        nome: 'Carlos',
        endereco: {
          rua: 'Nova Rua, 123',
          cidade: 'Rio de Janeiro',
        },
        responsavel: {
          nome: 'Ana Silva',
          telefone: '(21) 99999-9999',
        },
      };
      const mockResponse = { data: { id, ...complexData } };
      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(id, complexData);

      expect(mockApi.update).toHaveBeenCalledWith(id, complexData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty update data', async () => {
      const id = 111;
      const emptyData = {};
      const mockResponse = { data: { id, message: 'No changes' } };
      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(id, emptyData);

      expect(mockApi.update).toHaveBeenCalledWith(id, emptyData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle null update data', async () => {
      const id = 222;
      const mockResponse = { data: { id, message: 'Null data' } };
      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(id, null);

      expect(mockApi.update).toHaveBeenCalledWith(id, null);
      expect(result).toEqual(mockResponse);
    });

    it('should handle string IDs', async () => {
      const id = 'uuid-123-456';
      const updateData = { nome: 'Updated Aluno' };
      const mockResponse = { data: { id, ...updateData } };
      mockApi.update.mockResolvedValue(mockResponse);

      await service.execute(id, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(id, updateData);
    });

    it('should propagate API errors', async () => {
      const id = 404;
      const updateData = { nome: 'Test' };
      const apiError = new Error('Aluno not found');
      apiError.status = 404;

      mockApi.update.mockRejectedValue(apiError);

      await expect(service.execute(id, updateData)).rejects.toThrow(
        'Aluno not found'
      );
      expect(mockApi.update).toHaveBeenCalledWith(id, updateData);
    });

    it('should handle validation errors', async () => {
      const id = 123;
      const invalidData = { email: 'invalid-email' };
      const validationError = new Error('Invalid email format');
      validationError.status = 400;

      mockApi.update.mockRejectedValue(validationError);

      await expect(service.execute(id, invalidData)).rejects.toThrow(
        'Invalid email format'
      );
    });

    it('should handle network errors', async () => {
      const id = 123;
      const updateData = { nome: 'Test' };
      const networkError = new Error('Network timeout');
      networkError.code = 'TIMEOUT';

      mockApi.update.mockRejectedValue(networkError);

      await expect(service.execute(id, updateData)).rejects.toThrow(
        'Network timeout'
      );
    });

    it('should preserve response metadata', async () => {
      const id = 555;
      const updateData = { nome: 'Metadata Test' };
      const mockResponse = {
        data: { id, ...updateData },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(id, updateData);

      expect(result.status).toBe(200);
      expect(result.statusText).toBe('OK');
      expect(result.headers).toEqual({ 'content-type': 'application/json' });
    });
  });

  describe('static handle method', () => {
    beforeEach(() => {
      AlunoApi.mockClear();
    });

    it('should create service instance and execute', async () => {
      const id = 789;
      const updateData = { nome: 'Static Test' };
      const mockResponse = { data: { id, ...updateData } };
      mockApi.update.mockResolvedValue(mockResponse);

      const result = await UpdateAlunoService.handle(id, updateData);

      expect(AlunoApi).toHaveBeenCalledTimes(1);
      expect(mockApi.update).toHaveBeenCalledWith(id, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors in static method', async () => {
      const id = 123;
      const updateData = { nome: 'Error Test' };
      const error = new Error('Static method error');
      mockApi.update.mockRejectedValue(error);

      await expect(UpdateAlunoService.handle(id, updateData)).rejects.toThrow(
        'Static method error'
      );

      expect(AlunoApi).toHaveBeenCalledTimes(1);
      expect(mockApi.update).toHaveBeenCalledWith(id, updateData);
    });

    it('should work with different data types', async () => {
      const id = 'string-id';
      const updateData = {
        status: 'inativo',
        nivel: 'Avançado',
        observacoes: 'Aluno transferido',
      };
      const mockResponse = { data: { id, ...updateData } };
      mockApi.update.mockResolvedValue(mockResponse);

      const result = await UpdateAlunoService.handle(id, updateData);

      expect(result).toEqual(mockResponse);
    });

    it('should create new instances each time', async () => {
      const id1 = 111;
      const id2 = 222;
      const data1 = { nome: 'First' };
      const data2 = { nome: 'Second' };

      mockApi.update.mockResolvedValue({ data: { id: id1 } });
      await UpdateAlunoService.handle(id1, data1);

      mockApi.update.mockResolvedValue({ data: { id: id2 } });
      await UpdateAlunoService.handle(id2, data2);

      expect(AlunoApi).toHaveBeenCalledTimes(2);
      expect(mockApi.update).toHaveBeenCalledTimes(2);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete aluno update workflow', async () => {
      const id = 999;
      const fullUpdateData = {
        nome: 'Complete Update',
        sobrenome: 'Test',
        email: 'complete@aluno.com',
        telefone: '(11) 99999-9999',
        dataNascimento: '2006-01-01',
        endereco: {
          rua: 'Rua Nova, 789',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567',
        },
        responsavel: {
          nome: 'José Silva',
          telefone: '(11) 88888-8888',
        },
        nivel: 'Intermediário',
        status: 'ativo',
      };

      const mockResponse = {
        data: {
          id,
          ...fullUpdateData,
          updatedAt: '2024-11-08T15:30:00Z',
          updatedBy: 'admin',
        },
        message: 'Aluno atualizado com sucesso',
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(id, fullUpdateData);

      expect(mockApi.update).toHaveBeenCalledWith(id, fullUpdateData);
      expect(result).toEqual(mockResponse);
      expect(result.data.updatedAt).toBeDefined();
    });

    it('should maintain data integrity during update', async () => {
      const id = 888;
      const originalData = {
        nome: 'Original',
        metadata: { source: 'test', version: 2 },
      };

      const mockResponse = {
        data: {
          id,
          ...originalData,
          updatedAt: new Date().toISOString(),
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(id, originalData);

      expect(result.data.metadata).toEqual(originalData.metadata);
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle unauthorized update attempts', async () => {
      const id = 401;
      const updateData = { nome: 'Unauthorized' };
      const authError = new Error('Unauthorized');
      authError.status = 401;

      mockApi.update.mockRejectedValue(authError);

      await expect(service.execute(id, updateData)).rejects.toThrow(
        'Unauthorized'
      );
    });

    it('should handle forbidden updates', async () => {
      const id = 403;
      const updateData = { nome: 'Forbidden' };
      const forbiddenError = new Error('Forbidden');
      forbiddenError.status = 403;

      mockApi.update.mockRejectedValue(forbiddenError);

      await expect(service.execute(id, updateData)).rejects.toThrow(
        'Forbidden'
      );
    });

    it('should handle conflict errors', async () => {
      const id = 409;
      const updateData = { email: 'existing@aluno.com' };
      const conflictError = new Error('Email already exists');
      conflictError.status = 409;

      mockApi.update.mockRejectedValue(conflictError);

      await expect(service.execute(id, updateData)).rejects.toThrow(
        'Email already exists'
      );
    });

    it('should handle server errors', async () => {
      const id = 500;
      const updateData = { nome: 'Server Error' };
      const serverError = new Error('Internal server error');
      serverError.status = 500;

      mockApi.update.mockRejectedValue(serverError);

      await expect(service.execute(id, updateData)).rejects.toThrow(
        'Internal server error'
      );
    });
  });
});
