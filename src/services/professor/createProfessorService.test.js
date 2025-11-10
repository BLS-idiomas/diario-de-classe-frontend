import { CreateProfessorService } from './createProfessorService';
import { ProfessorApi } from '@/store/api/professorApi';

// Mock da ProfessorApi
jest.mock('@/store/api/professorApi');

describe('CreateProfessorService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      create: jest.fn(),
    };

    // Mock do constructor do ProfessorApi
    ProfessorApi.mockImplementation(() => mockApi);

    service = new CreateProfessorService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided professorApi', () => {
      expect(service.professorApi).toBe(mockApi);
    });

    it('should store references correctly', () => {
      const customApi = { create: jest.fn() };
      const customService = new CreateProfessorService(customApi);

      expect(customService.professorApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should create professor and return response with model instance', async () => {
      const professorData = {
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joao.silva@escola.com',
        telefone: '(11) 99999-9999',
        status: 'ativo',
        especialidades: ['Matemática', 'Física'],
      };

      const mockResponse = {
        data: {
          id: 1,
          ...professorData,
          createdAt: '2023-11-08T10:00:00Z',
          updatedAt: '2023-11-08T10:00:00Z',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(professorData);

      expect(mockApi.create).toHaveBeenCalledWith(professorData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle response without id', async () => {
      const professorData = {
        nome: 'Maria',
        sobrenome: 'Santos',
        email: 'maria.santos@escola.com',
      };

      const mockResponse = {
        data: {
          ...professorData,
          message: 'Professor created successfully',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(professorData);

      expect(mockApi.create).toHaveBeenCalledWith(professorData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle response with null data', async () => {
      const professorData = {
        nome: 'Pedro',
        sobrenome: 'Oliveira',
        email: 'pedro.oliveira@escola.com',
      };

      const mockResponse = {
        data: null,
        message: 'Error creating professor',
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(professorData);

      expect(mockApi.create).toHaveBeenCalledWith(professorData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle response without data property', async () => {
      const professorData = {
        nome: 'Ana',
        sobrenome: 'Costa',
        email: 'ana.costa@escola.com',
      };

      const mockResponse = {
        message: 'Professor created',
        status: 'success',
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(professorData);

      expect(mockApi.create).toHaveBeenCalledWith(professorData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const professorData = {
        nome: 'Carlos',
        sobrenome: 'Lima',
        email: 'invalid-email',
      };

      const mockError = new Error('Validation failed');
      mockError.status = 400;
      mockApi.create.mockRejectedValue(mockError);

      await expect(service.execute(professorData)).rejects.toThrow(
        'Validation failed'
      );
      expect(mockApi.create).toHaveBeenCalledWith(professorData);
    });

    it('should handle network errors', async () => {
      const professorData = {
        nome: 'Lucia',
        sobrenome: 'Ferreira',
        email: 'lucia.ferreira@escola.com',
      };

      const networkError = new Error('Network Error');
      networkError.code = 'NETWORK_ERROR';
      mockApi.create.mockRejectedValue(networkError);

      await expect(service.execute(professorData)).rejects.toThrow(
        'Network Error'
      );
      expect(mockApi.create).toHaveBeenCalledWith(professorData);
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

    it('should handle complex professor data with nested objects', async () => {
      const complexProfessorData = {
        nome: 'Roberto',
        sobrenome: 'Almeida',
        email: 'roberto.almeida@escola.com',
        telefone: '(11) 88888-8888',
        status: 'ativo',
        endereco: {
          rua: 'Rua das Flores, 123',
          cidade: 'São Paulo',
          cep: '01234-567',
        },
        especialidades: ['Química', 'Biologia'],
        certificacoes: [
          {
            nome: 'Especialização em Química Orgânica',
            instituicao: 'USP',
            ano: 2020,
          },
          {
            nome: 'Mestrado em Biologia',
            instituicao: 'UNICAMP',
            ano: 2018,
          },
        ],
        experienciaProfissional: {
          anosExperiencia: 10,
          escolasAnteriores: ['Escola ABC', 'Colégio XYZ'],
        },
      };

      const mockResponse = {
        data: {
          id: 1,
          ...complexProfessorData,
          createdAt: '2023-11-08T10:00:00Z',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(complexProfessorData);

      expect(mockApi.create).toHaveBeenCalledWith(complexProfessorData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('static handle method', () => {
    beforeEach(() => {
      // Reset mocks dos módulos
      ProfessorApi.mockClear();
    });

    it('should create service instance and execute with default dependencies', async () => {
      const professorData = {
        nome: 'Static',
        sobrenome: 'Test',
        email: 'static.test@escola.com',
        status: 'ativo',
      };

      const mockResponse = {
        data: {
          id: 1,
          ...professorData,
          createdAt: '2023-11-08T10:00:00Z',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await CreateProfessorService.handle(professorData);

      expect(ProfessorApi).toHaveBeenCalledTimes(1);
      expect(mockApi.create).toHaveBeenCalledWith(professorData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors in static method', async () => {
      const professorData = {
        nome: 'Error',
        sobrenome: 'Test',
        email: 'error.test@escola.com',
      };

      const mockError = new Error('Static method error');
      mockApi.create.mockRejectedValue(mockError);

      await expect(
        CreateProfessorService.handle(professorData)
      ).rejects.toThrow('Static method error');

      expect(ProfessorApi).toHaveBeenCalledTimes(1);
      expect(mockApi.create).toHaveBeenCalledWith(professorData);
    });

    it('should work with different professor data formats in static method', async () => {
      const professorData = {
        nome: 'Flexible',
        sobrenome: 'Format',
        email: 'flexible.format@escola.com',
        disciplinas: ['Português', 'Literatura'],
        salario: 5000.0,
        dataAdmissao: '2023-01-15',
      };

      const mockResponse = {
        data: {
          id: 2,
          ...professorData,
          status: 'ativo',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await CreateProfessorService.handle(professorData);

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

      const result = await CreateProfessorService.handle(null);

      expect(mockApi.create).toHaveBeenCalledWith(null);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete professor creation workflow', async () => {
      const fullProfessorData = {
        nome: 'Integration',
        sobrenome: 'Test',
        email: 'integration.test@escola.com',
        telefone: '(11) 77777-7777',
        cpf: '123.456.789-00',
        rg: '12.345.678-9',
        dataNascimento: '1980-05-15',
        genero: 'masculino',
        estadoCivil: 'casado',
        endereco: {
          rua: 'Rua da Integração, 456',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567',
        },
        formacaoAcademica: {
          graduacao: 'Licenciatura em Matemática',
          instituicaoGraduacao: 'USP',
          anoGraduacao: 2003,
          posGraduacao: 'Mestrado em Educação Matemática',
          instituicaoPosGraduacao: 'PUC-SP',
          anoPosGraduacao: 2005,
        },
        especialidades: ['Matemática', 'Estatística'],
        status: 'ativo',
        dataAdmissao: '2023-02-01',
        salario: 7500.0,
        cargaHorariaSemanal: 40,
        observacoes: 'Professor experiente com foco em metodologias ativas',
      };

      const mockResponse = {
        data: {
          id: 100,
          ...fullProfessorData,
          createdAt: '2023-11-08T10:00:00Z',
          updatedAt: '2023-11-08T10:00:00Z',
          createdBy: 'admin',
        },
        status: 201,
        message: 'Professor criado com sucesso',
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(fullProfessorData);

      expect(mockApi.create).toHaveBeenCalledWith(fullProfessorData);
      expect(result).toEqual(mockResponse);
    });

    it('should maintain data integrity throughout the process', async () => {
      const originalData = {
        nome: 'DataIntegrity',
        sobrenome: 'Test',
        email: 'data.integrity@escola.com',
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
      const professorData = {
        nome: 'Malformed',
        sobrenome: 'Response',
        email: 'malformed.response@escola.com',
      };

      const malformedResponse = {
        data: 'not an object',
      };

      mockApi.create.mockResolvedValue(malformedResponse);

      const result = await service.execute(professorData);

      expect(mockApi.create).toHaveBeenCalledWith(professorData);
      expect(result).toEqual(malformedResponse);
    });

    it('should handle response with id but no other data', async () => {
      const professorData = {
        nome: 'IdOnly',
        sobrenome: 'Response',
        email: 'id.only@escola.com',
      };

      const minimalResponse = {
        data: {
          id: 999,
        },
      };

      mockApi.create.mockResolvedValue(minimalResponse);

      const result = await service.execute(professorData);

      expect(mockApi.create).toHaveBeenCalledWith(professorData);
      expect(result).toEqual(minimalResponse);
    });

    it('should handle undefined response', async () => {
      const professorData = {
        nome: 'Undefined',
        sobrenome: 'Response',
        email: 'undefined.response@escola.com',
      };

      mockApi.create.mockResolvedValue(undefined);

      const result = await service.execute(professorData);

      expect(mockApi.create).toHaveBeenCalledWith(professorData);
      expect(result).toBeUndefined();
    });
  });
});
