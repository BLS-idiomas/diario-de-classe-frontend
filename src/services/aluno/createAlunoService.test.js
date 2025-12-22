import { CreateAlunoService } from './createAlunoService';
import { AlunoApi } from '@/store/api/alunoApi';

// Mock da AlunoApi
jest.mock('@/store/api/alunoApi');

describe('CreateAlunoService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      create: jest.fn(),
    };

    // Mock do constructor do AlunoApi
    AlunoApi.mockImplementation(() => mockApi);

    service = new CreateAlunoService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided alunoApi', () => {
      expect(service.alunoApi).toBe(mockApi);
    });

    it('should store references correctly', () => {
      const customApi = { create: jest.fn() };
      const customService = new CreateAlunoService(customApi);

      expect(customService.alunoApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should create aluno and return response with model instance', async () => {
      const alunoData = {
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joao.silva@aluno.com',
        telefone: '(11) 99999-9999',
        status: 'ativo',
        dataNascimento: '2005-05-15',
      };

      const mockResponse = {
        data: {
          id: 1,
          ...alunoData,
          createdAt: '2023-11-08T10:00:00Z',
          updatedAt: '2023-11-08T10:00:00Z',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(alunoData);

      expect(mockApi.create).toHaveBeenCalledWith(alunoData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle response without id', async () => {
      const alunoData = {
        nome: 'Maria',
        sobrenome: 'Santos',
        email: 'maria.santos@aluno.com',
      };

      const mockResponse = {
        data: {
          ...alunoData,
          message: 'Aluno created successfully',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(alunoData);

      expect(mockApi.create).toHaveBeenCalledWith(alunoData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle response with null data', async () => {
      const alunoData = {
        nome: 'Pedro',
        sobrenome: 'Oliveira',
        email: 'pedro.oliveira@aluno.com',
      };

      const mockResponse = {
        data: null,
        message: 'Error creating aluno',
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(alunoData);

      expect(mockApi.create).toHaveBeenCalledWith(alunoData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle response without data property', async () => {
      const alunoData = {
        nome: 'Ana',
        sobrenome: 'Costa',
        email: 'ana.costa@aluno.com',
      };

      const mockResponse = {
        message: 'Aluno created',
        status: 'success',
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(alunoData);

      expect(mockApi.create).toHaveBeenCalledWith(alunoData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const alunoData = {
        nome: 'Carlos',
        sobrenome: 'Lima',
        email: 'invalid-email',
      };

      const mockError = new Error('Validation failed');
      mockError.status = 400;
      mockApi.create.mockRejectedValue(mockError);

      await expect(service.execute(alunoData)).rejects.toThrow(
        'Validation failed'
      );
      expect(mockApi.create).toHaveBeenCalledWith(alunoData);
    });

    it('should handle network errors', async () => {
      const alunoData = {
        nome: 'Lucia',
        sobrenome: 'Ferreira',
        email: 'lucia.ferreira@aluno.com',
      };

      const networkError = new Error('Network Error');
      networkError.code = 'NETWORK_ERROR';
      mockApi.create.mockRejectedValue(networkError);

      await expect(service.execute(alunoData)).rejects.toThrow('Network Error');
      expect(mockApi.create).toHaveBeenCalledWith(alunoData);
    });

    it('should handle empty data', async () => {
      const emptyData = {};
      const mockResponse = {
        data: {
          id: 1,
          ...emptyData,
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(emptyData);

      expect(mockApi.create).toHaveBeenCalledWith(emptyData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle null input data', async () => {
      const mockResponse = {
        data: {
          id: 1,
          message: 'Created with null data',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(null);

      expect(mockApi.create).toHaveBeenCalledWith(null);
      expect(result).toEqual(mockResponse);
    });

    it('should handle complex aluno data with nested objects', async () => {
      const complexAlunoData = {
        nome: 'Roberto',
        sobrenome: 'Almeida',
        email: 'roberto.almeida@aluno.com',
        telefone: '(11) 88888-8888',
        status: 'ativo',
        dataNascimento: '2006-03-20',
        endereco: {
          rua: 'Rua das Flores, 123',
          cidade: 'São Paulo',
          cep: '01234-567',
        },
        responsavel: {
          nome: 'Maria Almeida',
          telefone: '(11) 77777-7777',
          email: 'maria@email.com',
        },
        matriculas: [
          {
            curso: 'Inglês Básico',
            dataInicio: '2023-01-15',
            turma: 'A1',
          },
        ],
      };

      const mockResponse = {
        data: {
          id: 1,
          ...complexAlunoData,
          createdAt: '2023-11-08T10:00:00Z',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(complexAlunoData);

      expect(mockApi.create).toHaveBeenCalledWith(complexAlunoData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('static handle method', () => {
    beforeEach(() => {
      // Reset mocks dos módulos
      AlunoApi.mockClear();
    });

    it('should create service instance and execute with default dependencies', async () => {
      const alunoData = {
        nome: 'Static',
        sobrenome: 'Test',
        email: 'static.test@aluno.com',
        status: 'ativo',
      };

      const mockResponse = {
        data: {
          id: 1,
          ...alunoData,
          createdAt: '2023-11-08T10:00:00Z',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await CreateAlunoService.handle(alunoData);

      expect(AlunoApi).toHaveBeenCalledTimes(1);
      expect(mockApi.create).toHaveBeenCalledWith(alunoData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors in static method', async () => {
      const alunoData = {
        nome: 'Error',
        sobrenome: 'Test',
        email: 'error.test@aluno.com',
      };

      const mockError = new Error('Static method error');
      mockApi.create.mockRejectedValue(mockError);

      await expect(CreateAlunoService.handle(alunoData)).rejects.toThrow(
        'Static method error'
      );

      expect(AlunoApi).toHaveBeenCalledTimes(1);
      expect(mockApi.create).toHaveBeenCalledWith(alunoData);
    });

    it('should work with different aluno data formats in static method', async () => {
      const alunoData = {
        nome: 'Flexible',
        sobrenome: 'Format',
        email: 'flexible.format@aluno.com',
        nivel: 'Intermediário',
        dataMatricula: '2023-01-15',
      };

      const mockResponse = {
        data: {
          id: 2,
          ...alunoData,
          status: 'ativo',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await CreateAlunoService.handle(alunoData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle null data in static method', async () => {
      const mockResponse = {
        data: {
          id: 3,
          message: 'Created with null data',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await CreateAlunoService.handle(null);

      expect(mockApi.create).toHaveBeenCalledWith(null);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete aluno creation workflow', async () => {
      const fullAlunoData = {
        nome: 'Integration',
        sobrenome: 'Test',
        email: 'integration.test@aluno.com',
        telefone: '(11) 77777-7777',
        cpf: '123.456.789-00',
        rg: '12.345.678-9',
        dataNascimento: '2005-05-15',
        genero: 'masculino',
        endereco: {
          rua: 'Rua da Integração, 456',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567',
        },
        responsavel: {
          nome: 'José Silva',
          cpf: '987.654.321-00',
          telefone: '(11) 66666-6666',
          email: 'jose.silva@email.com',
          parentesco: 'pai',
        },
        status: 'ativo',
        dataMatricula: '2023-02-01',
        nivel: 'Básico',
        observacoes: 'Aluno dedicado',
      };

      const mockResponse = {
        data: {
          id: 100,
          ...fullAlunoData,
          createdAt: '2023-11-08T10:00:00Z',
          updatedAt: '2023-11-08T10:00:00Z',
          createdBy: 'admin',
        },
        status: 201,
        message: 'Aluno criado com sucesso',
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(fullAlunoData);

      expect(mockApi.create).toHaveBeenCalledWith(fullAlunoData);
      expect(result).toEqual(mockResponse);
    });

    it('should maintain data integrity throughout the process', async () => {
      const originalData = {
        nome: 'DataIntegrity',
        sobrenome: 'Test',
        email: 'data.integrity@aluno.com',
        metadata: {
          source: 'manual_entry',
          priority: 'high',
        },
      };

      const mockResponse = {
        data: {
          id: 200,
          ...originalData,
          processedAt: '2023-11-08T10:00:00Z',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(originalData);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle malformed response data', async () => {
      const alunoData = {
        nome: 'Malformed',
        sobrenome: 'Response',
        email: 'malformed.response@aluno.com',
      };

      const malformedResponse = {
        data: 'not an object',
      };

      mockApi.create.mockResolvedValue(malformedResponse);

      const result = await service.execute(alunoData);

      expect(mockApi.create).toHaveBeenCalledWith(alunoData);
      expect(result).toEqual(malformedResponse);
    });

    it('should handle response with id but no other data', async () => {
      const alunoData = {
        nome: 'IdOnly',
        sobrenome: 'Response',
        email: 'id.only@aluno.com',
      };

      const minimalResponse = {
        data: {
          id: 999,
        },
      };

      mockApi.create.mockResolvedValue(minimalResponse);

      const result = await service.execute(alunoData);

      expect(mockApi.create).toHaveBeenCalledWith(alunoData);
      expect(result).toEqual(minimalResponse);
    });

    it('should handle undefined response', async () => {
      const alunoData = {
        nome: 'Undefined',
        sobrenome: 'Response',
        email: 'undefined.response@aluno.com',
      };

      mockApi.create.mockResolvedValue(undefined);

      const result = await service.execute(alunoData);

      expect(mockApi.create).toHaveBeenCalledWith(alunoData);
      expect(result).toBeUndefined();
    });
  });
});
