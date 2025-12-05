import { GetContratoByAlunoService } from './getContratoByAlunoService';
import { AlunoApi } from '@/store/api/alunoApi';

// Mock das dependências
jest.mock('@/store/api/alunoApi');

describe('GetContratoByAlunoService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      getContratoByAluno: jest.fn(),
    };

    // Mock do constructor do AlunoApi
    AlunoApi.mockImplementation(() => mockApi);

    service = new GetContratoByAlunoService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided alunoApi', () => {
      expect(service.alunoApi).toBe(mockApi);
    });

    it('should store api instance correctly', () => {
      const customApi = { getContratoByAluno: jest.fn() };
      const customService = new GetContratoByAlunoService(customApi);

      expect(customService.alunoApi).toBe(customApi);
    });

    it('should accept null or undefined dependencies', () => {
      const serviceWithNull = new GetContratoByAlunoService(null);
      expect(serviceWithNull.alunoApi).toBeNull();
    });
  });

  describe('execute', () => {
    it('should call api.getContratoByAluno with correct ID', async () => {
      const testId = 123;
      const mockResponse = {
        data: {
          id: 1,
          numero: 'CONT-2024-001',
          dataInicio: '2024-01-01',
          dataFim: '2024-12-31',
        },
      };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getContratoByAluno).toHaveBeenCalledWith(testId);
      expect(mockApi.getContratoByAluno).toHaveBeenCalledTimes(1);
    });

    it('should return contrato data from API response', async () => {
      const testId = 456;
      const contratoData = {
        id: 2,
        numero: 'CONT-2024-002',
        dataInicio: '2024-01-15',
        dataFim: '2024-12-15',
        valor: 1500.0,
        status: 'ativo',
      };
      const mockResponse = { data: contratoData };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toEqual(contratoData);
      expect(result.data.numero).toBe('CONT-2024-002');
    });

    it('should handle contrato with all details', async () => {
      const testId = 789;
      const fullContratoData = {
        id: 3,
        numero: 'CONT-2024-003',
        dataInicio: '2024-02-01',
        dataFim: '2025-01-31',
        valor: 2000.0,
        status: 'ativo',
        modalidade: 'presencial',
        cargaHoraria: 120,
        observacoes: 'Contrato anual',
      };
      const mockResponse = { data: fullContratoData };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toEqual(fullContratoData);
      expect(result.data.cargaHoraria).toBe(120);
    });

    it('should return null when no contrato exists', async () => {
      const testId = 999;
      const mockResponse = { data: null };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toBeNull();
    });

    it('should handle undefined data in response', async () => {
      const testId = 111;
      const mockResponse = { data: undefined };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toBeUndefined();
    });

    it('should propagate API errors', async () => {
      const testId = 222;
      const mockError = new Error('API Error');

      mockApi.getContratoByAluno.mockRejectedValue(mockError);

      await expect(service.execute(testId)).rejects.toThrow('API Error');
    });

    it('should handle network errors', async () => {
      const testId = 333;
      const networkError = new Error('Network Error');

      mockApi.getContratoByAluno.mockRejectedValue(networkError);

      await expect(service.execute(testId)).rejects.toThrow('Network Error');
    });

    it('should handle 404 errors when contrato not found', async () => {
      const testId = 444;
      const notFoundError = new Error('Contrato not found');

      mockApi.getContratoByAluno.mockRejectedValue(notFoundError);

      await expect(service.execute(testId)).rejects.toThrow(
        'Contrato not found'
      );
    });

    it('should call API with string ID', async () => {
      const testId = '555';
      const mockResponse = { data: null };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getContratoByAluno).toHaveBeenCalledWith('555');
    });

    it('should handle expired contrato', async () => {
      const testId = 666;
      const expiredContrato = {
        id: 4,
        numero: 'CONT-2023-001',
        dataInicio: '2023-01-01',
        dataFim: '2023-12-31',
        status: 'expirado',
      };
      const mockResponse = { data: expiredContrato };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data.status).toBe('expirado');
      expect(result.data).toEqual(expiredContrato);
    });

    it('should return response with additional metadata', async () => {
      const testId = 777;
      const mockResponse = {
        data: { id: 5, numero: 'CONT-2024-005' },
        metadata: { lastUpdated: '2024-01-01', version: 1 },
      };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data.numero).toBe('CONT-2024-005');
      expect(result.metadata).toEqual({
        lastUpdated: '2024-01-01',
        version: 1,
      });
    });

    it('should handle contrato with payment information', async () => {
      const testId = 888;
      const contratoWithPayment = {
        id: 6,
        numero: 'CONT-2024-006',
        valor: 3000.0,
        formaPagamento: 'mensal',
        numeroParcelas: 12,
        valorParcela: 250.0,
      };
      const mockResponse = { data: contratoWithPayment };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data.numeroParcelas).toBe(12);
      expect(result.data.valorParcela).toBe(250.0);
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and call execute', async () => {
      const testId = 888;
      const mockResponse = {
        data: { id: 7, numero: 'CONT-2024-007' },
      };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      const result = await GetContratoByAlunoService.handle(testId);

      expect(AlunoApi).toHaveBeenCalled();
      expect(mockApi.getContratoByAluno).toHaveBeenCalledWith(testId);
      expect(result.data).toEqual({ id: 7, numero: 'CONT-2024-007' });
    });

    it('should work with different IDs', async () => {
      const testIds = [1, 2, 3];
      const mockResponse = { data: null };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      for (const id of testIds) {
        await GetContratoByAlunoService.handle(id);
        expect(mockApi.getContratoByAluno).toHaveBeenCalledWith(id);
      }
    });

    it('should propagate errors from execute method', async () => {
      const testId = 999;
      const mockError = new Error('Service Error');

      mockApi.getContratoByAluno.mockRejectedValue(mockError);

      await expect(GetContratoByAlunoService.handle(testId)).rejects.toThrow(
        'Service Error'
      );
    });

    it('should create new API instance each time', async () => {
      const testId = 101;
      const mockResponse = { data: null };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      await GetContratoByAlunoService.handle(testId);
      await GetContratoByAlunoService.handle(testId);

      expect(AlunoApi).toHaveBeenCalledTimes(2);
    });

    it('should handle concurrent calls', async () => {
      const ids = [1, 2, 3, 4, 5];
      const mockResponse = { data: null };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      const promises = ids.map(id => GetContratoByAlunoService.handle(id));
      await Promise.all(promises);

      expect(mockApi.getContratoByAluno).toHaveBeenCalledTimes(5);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete workflow', async () => {
      const alunoId = 123;
      const contratoData = {
        id: 8,
        numero: 'CONT-2024-008',
        dataInicio: '2024-03-01',
        status: 'ativo',
      };
      const mockResponse = { data: contratoData };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      const result = await GetContratoByAlunoService.handle(alunoId);

      expect(result.data).toEqual(contratoData);
      expect(AlunoApi).toHaveBeenCalled();
    });

    it('should handle error scenarios in workflow', async () => {
      const alunoId = 456;
      const error = new Error('Database connection failed');

      mockApi.getContratoByAluno.mockRejectedValue(error);

      await expect(GetContratoByAlunoService.handle(alunoId)).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should maintain data integrity through service layers', async () => {
      const alunoId = 789;
      const originalData = {
        id: 9,
        numero: 'CONT-2024-009',
        valor: 5000.0,
      };
      const mockResponse = { data: originalData };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(alunoId);

      expect(result.data).toEqual(originalData);
      expect(result.data.valor).toBe(5000.0);
    });

    it('should handle renewal workflow', async () => {
      const alunoId = 321;
      const renewedContrato = {
        id: 10,
        numero: 'CONT-2024-010',
        numeroAnterior: 'CONT-2023-010',
        tipo: 'renovacao',
      };
      const mockResponse = { data: renewedContrato };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(alunoId);

      expect(result.data.tipo).toBe('renovacao');
      expect(result.data.numeroAnterior).toBe('CONT-2023-010');
    });
  });

  describe('Edge cases', () => {
    it('should handle zero as ID', async () => {
      const testId = 0;
      const mockResponse = { data: null };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getContratoByAluno).toHaveBeenCalledWith(0);
    });

    it('should handle negative ID', async () => {
      const testId = -1;
      const mockResponse = { data: null };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getContratoByAluno).toHaveBeenCalledWith(-1);
    });

    it('should handle very large ID numbers', async () => {
      const testId = 9999999999;
      const mockResponse = { data: null };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getContratoByAluno).toHaveBeenCalledWith(9999999999);
    });

    it('should handle response without data property', async () => {
      const testId = 123;
      const mockResponse = { contrato: {} };

      mockApi.getContratoByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result).toEqual(mockResponse);
    });

    it('should handle timeout errors', async () => {
      const testId = 456;
      const timeoutError = new Error('Request timeout');

      mockApi.getContratoByAluno.mockRejectedValue(timeoutError);

      await expect(service.execute(testId)).rejects.toThrow('Request timeout');
    });

    it('should handle authorization errors', async () => {
      const testId = 789;
      const authError = new Error('Unauthorized access');

      mockApi.getContratoByAluno.mockRejectedValue(authError);

      await expect(service.execute(testId)).rejects.toThrow(
        'Unauthorized access'
      );
    });

    it('should handle malformed response', async () => {
      const testId = 101;
      const malformedResponse = { error: 'Invalid format' };

      mockApi.getContratoByAluno.mockResolvedValue(malformedResponse);

      const result = await service.execute(testId);

      expect(result).toEqual(malformedResponse);
      expect(result.error).toBe('Invalid format');
    });
  });
});
