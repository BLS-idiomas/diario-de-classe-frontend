import { GetContratosByAlunoService } from './getContratosByAlunoService';
import { AlunoApi } from '@/store/api/alunoApi';

// Mock das dependências
jest.mock('@/store/api/alunoApi');

describe('GetContratosByAlunoService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      getContratosByAluno: jest.fn(),
    };

    // Mock do constructor do AlunoApi
    AlunoApi.mockImplementation(() => mockApi);

    service = new GetContratosByAlunoService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided alunoApi', () => {
      expect(service.alunoApi).toBe(mockApi);
    });

    it('should store api instance correctly', () => {
      const customApi = { getContratosByAluno: jest.fn() };
      const customService = new GetContratosByAlunoService(customApi);

      expect(customService.alunoApi).toBe(customApi);
    });

    it('should accept null or undefined dependencies', () => {
      const serviceWithNull = new GetContratosByAlunoService(null);
      expect(serviceWithNull.alunoApi).toBeNull();
    });
  });

  describe('execute', () => {
    it('should call api.getContratosByAluno with correct ID', async () => {
      const testId = 123;
      const mockResponse = {
        data: [
          {
            id: 1,
            numero: 'CONT-2024-001',
            dataInicio: '2024-01-01',
            dataFim: '2024-12-31',
          },
        ],
      };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getContratosByAluno).toHaveBeenCalledWith(testId);
      expect(mockApi.getContratosByAluno).toHaveBeenCalledTimes(1);
    });

    it('should return contratos data from API response', async () => {
      const testId = 456;
      const contratosData = [
        {
          id: 1,
          numero: 'CONT-2024-001',
          dataInicio: '2024-01-15',
          dataFim: '2024-12-15',
          valor: 1500.0,
          status: 'ativo',
        },
        {
          id: 2,
          numero: 'CONT-2024-002',
          dataInicio: '2023-01-15',
          dataFim: '2023-12-15',
          valor: 1200.0,
          status: 'finalizado',
        },
      ];
      const mockResponse = { data: contratosData };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toEqual(contratosData);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].numero).toBe('CONT-2024-001');
      expect(result.data[1].numero).toBe('CONT-2024-002');
    });

    it('should handle multiple contratos with all details', async () => {
      const testId = 789;
      const fullContratosData = [
        {
          id: 1,
          numero: 'CONT-2024-001',
          dataInicio: '2024-02-01',
          dataFim: '2025-01-31',
          valor: 2000.0,
          status: 'ativo',
          modalidade: 'presencial',
          cargaHoraria: 120,
          observacoes: 'Contrato anual',
        },
        {
          id: 2,
          numero: 'CONT-2023-005',
          dataInicio: '2023-02-01',
          dataFim: '2024-01-31',
          valor: 1800.0,
          status: 'finalizado',
          modalidade: 'online',
          cargaHoraria: 100,
          observacoes: 'Contrato anterior',
        },
        {
          id: 3,
          numero: 'CONT-2022-010',
          dataInicio: '2022-02-01',
          dataFim: '2023-01-31',
          valor: 1500.0,
          status: 'cancelado',
          modalidade: 'hibrido',
          cargaHoraria: 80,
          observacoes: 'Cancelado pelo aluno',
        },
      ];
      const mockResponse = { data: fullContratosData };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toEqual(fullContratosData);
      expect(result.data).toHaveLength(3);
      expect(result.data[0].cargaHoraria).toBe(120);
      expect(result.data[2].status).toBe('cancelado');
    });

    it('should return empty array when no contratos exist', async () => {
      const testId = 999;
      const mockResponse = { data: [] };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toEqual([]);
      expect(result.data).toHaveLength(0);
    });

    it('should handle single contrato in array', async () => {
      const testId = 111;
      const mockResponse = {
        data: [
          {
            id: 1,
            numero: 'CONT-2024-001',
            dataInicio: '2024-01-01',
            dataFim: '2024-12-31',
            valor: 1000.0,
            status: 'ativo',
          },
        ],
      };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].numero).toBe('CONT-2024-001');
    });

    it('should handle null data in response', async () => {
      const testId = 222;
      const mockResponse = { data: null };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toBeNull();
    });

    it('should handle undefined data in response', async () => {
      const testId = 333;
      const mockResponse = { data: undefined };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toBeUndefined();
    });

    it('should propagate API errors', async () => {
      const testId = 444;
      const mockError = new Error('API Error');

      mockApi.getContratosByAluno.mockRejectedValue(mockError);

      await expect(service.execute(testId)).rejects.toThrow('API Error');
    });

    it('should handle network errors', async () => {
      const testId = 555;
      const networkError = new Error('Network Error');

      mockApi.getContratosByAluno.mockRejectedValue(networkError);

      await expect(service.execute(testId)).rejects.toThrow('Network Error');
    });

    it('should handle 404 errors when contratos not found', async () => {
      const testId = 666;
      const notFoundError = new Error('Contratos not found');
      notFoundError.status = 404;

      mockApi.getContratosByAluno.mockRejectedValue(notFoundError);

      await expect(service.execute(testId)).rejects.toThrow(
        'Contratos not found'
      );
      await expect(service.execute(testId)).rejects.toMatchObject({
        status: 404,
      });
    });

    it('should handle 500 server errors', async () => {
      const testId = 777;
      const serverError = new Error('Internal Server Error');
      serverError.status = 500;

      mockApi.getContratosByAluno.mockRejectedValue(serverError);

      await expect(service.execute(testId)).rejects.toThrow(
        'Internal Server Error'
      );
    });

    it('should handle timeout errors', async () => {
      const testId = 888;
      const timeoutError = new Error('Request timeout');

      mockApi.getContratosByAluno.mockRejectedValue(timeoutError);

      await expect(service.execute(testId)).rejects.toThrow('Request timeout');
    });

    it('should preserve response structure', async () => {
      const testId = 999;
      const mockResponse = {
        data: [
          {
            id: 1,
            numero: 'CONT-2024-001',
          },
        ],
        metadata: {
          total: 1,
          page: 1,
        },
      };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result).toEqual(mockResponse);
      expect(result.metadata).toBeDefined();
      expect(result.metadata.total).toBe(1);
    });

    it('should handle contratos ordered by date', async () => {
      const testId = 1010;
      const mockResponse = {
        data: [
          {
            id: 3,
            numero: 'CONT-2024-003',
            dataInicio: '2024-03-01',
          },
          {
            id: 2,
            numero: 'CONT-2024-002',
            dataInicio: '2024-02-01',
          },
          {
            id: 1,
            numero: 'CONT-2024-001',
            dataInicio: '2024-01-01',
          },
        ],
      };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data[0].dataInicio).toBe('2024-03-01');
      expect(result.data[2].dataInicio).toBe('2024-01-01');
    });

    it('should handle contratos with different status', async () => {
      const testId = 1111;
      const mockResponse = {
        data: [
          { id: 1, numero: 'CONT-001', status: 'ativo' },
          { id: 2, numero: 'CONT-002', status: 'finalizado' },
          { id: 3, numero: 'CONT-003', status: 'cancelado' },
          { id: 4, numero: 'CONT-004', status: 'suspenso' },
        ],
      };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toHaveLength(4);
      expect(result.data.map(c => c.status)).toEqual([
        'ativo',
        'finalizado',
        'cancelado',
        'suspenso',
      ]);
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute', async () => {
      const testId = 123;
      const mockResponse = {
        data: [
          {
            id: 1,
            numero: 'CONT-2024-001',
          },
        ],
      };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await GetContratosByAlunoService.handle(testId);

      expect(result.data).toEqual(mockResponse.data);
      expect(mockApi.getContratosByAluno).toHaveBeenCalledWith(testId);
    });

    it('should create new AlunoApi instance', async () => {
      const testId = 456;
      const mockResponse = { data: [] };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      await GetContratosByAlunoService.handle(testId);

      expect(AlunoApi).toHaveBeenCalled();
    });

    it('should handle errors in static method', async () => {
      const testId = 789;
      const mockError = new Error('Static method error');

      mockApi.getContratosByAluno.mockRejectedValue(mockError);

      await expect(GetContratosByAlunoService.handle(testId)).rejects.toThrow(
        'Static method error'
      );
    });

    it('should return same result as instance method', async () => {
      const testId = 999;
      const mockResponse = {
        data: [
          { id: 1, numero: 'CONT-001' },
          { id: 2, numero: 'CONT-002' },
        ],
      };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const staticResult = await GetContratosByAlunoService.handle(testId);
      const instanceResult = await service.execute(testId);

      expect(staticResult).toEqual(instanceResult);
    });

    it('should work with different IDs', async () => {
      const mockResponses = {
        1: { data: [{ id: 1, numero: 'CONT-001' }] },
        2: { data: [{ id: 2, numero: 'CONT-002' }] },
        3: { data: [{ id: 3, numero: 'CONT-003' }] },
      };

      for (const [id, response] of Object.entries(mockResponses)) {
        mockApi.getContratosByAluno.mockResolvedValue(response);
        const result = await GetContratosByAlunoService.handle(Number(id));
        expect(result.data[0].numero).toBe(response.data[0].numero);
      }
    });

    it('should handle string IDs', async () => {
      const testId = '123';
      const mockResponse = { data: [{ id: 1, numero: 'CONT-001' }] };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await GetContratosByAlunoService.handle(testId);

      expect(result.data).toEqual(mockResponse.data);
      expect(mockApi.getContratosByAluno).toHaveBeenCalledWith(testId);
    });

    it('should handle zero as ID', async () => {
      const testId = 0;
      const mockResponse = { data: [] };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await GetContratosByAlunoService.handle(testId);

      expect(result.data).toEqual([]);
      expect(mockApi.getContratosByAluno).toHaveBeenCalledWith(0);
    });

    it('should handle negative IDs', async () => {
      const testId = -1;
      const mockResponse = { data: [] };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await GetContratosByAlunoService.handle(testId);

      expect(mockApi.getContratosByAluno).toHaveBeenCalledWith(-1);
    });
  });

  describe('edge cases', () => {
    it('should handle very large arrays of contratos', async () => {
      const testId = 1234;
      const largeArray = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        numero: `CONT-2024-${String(i + 1).padStart(3, '0')}`,
        status: 'ativo',
      }));
      const mockResponse = { data: largeArray };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toHaveLength(100);
      expect(result.data[0].numero).toBe('CONT-2024-001');
      expect(result.data[99].numero).toBe('CONT-2024-100');
    });

    it('should handle contratos with missing optional fields', async () => {
      const testId = 5678;
      const mockResponse = {
        data: [
          {
            id: 1,
            numero: 'CONT-001',
            // missing dataInicio, dataFim, valor, etc.
          },
        ],
      };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data[0]).toEqual({ id: 1, numero: 'CONT-001' });
    });

    it('should handle contratos with extra unexpected fields', async () => {
      const testId = 9012;
      const mockResponse = {
        data: [
          {
            id: 1,
            numero: 'CONT-001',
            unexpectedField: 'value',
            anotherField: 123,
          },
        ],
      };

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data[0].unexpectedField).toBe('value');
      expect(result.data[0].anotherField).toBe(123);
    });

    it('should handle API returning response without data property', async () => {
      const testId = 3456;
      const mockResponse = [{ id: 1, numero: 'CONT-001' }];

      mockApi.getContratosByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result).toEqual(mockResponse);
    });

    it('should handle concurrent calls', async () => {
      const mockResponse1 = { data: [{ id: 1, numero: 'CONT-001' }] };
      const mockResponse2 = { data: [{ id: 2, numero: 'CONT-002' }] };
      const mockResponse3 = { data: [{ id: 3, numero: 'CONT-003' }] };

      mockApi.getContratosByAluno
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2)
        .mockResolvedValueOnce(mockResponse3);

      const [result1, result2, result3] = await Promise.all([
        service.execute(1),
        service.execute(2),
        service.execute(3),
      ]);

      expect(result1.data[0].numero).toBe('CONT-001');
      expect(result2.data[0].numero).toBe('CONT-002');
      expect(result3.data[0].numero).toBe('CONT-003');
    });
  });
});
