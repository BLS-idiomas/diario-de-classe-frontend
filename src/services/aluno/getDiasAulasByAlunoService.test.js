import { GetDiasAulasByAlunoService } from './getDiasAulasByAlunoService';
import { AlunoApi } from '@/store/api/alunoApi';

// Mock das dependências
jest.mock('@/store/api/alunoApi');

describe('GetDiasAulasByAlunoService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      getDiasAulasByAluno: jest.fn(),
    };

    // Mock do constructor do AlunoApi
    AlunoApi.mockImplementation(() => mockApi);

    service = new GetDiasAulasByAlunoService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided alunoApi', () => {
      expect(service.alunoApi).toBe(mockApi);
    });

    it('should store api instance correctly', () => {
      const customApi = { getDiasAulasByAluno: jest.fn() };
      const customService = new GetDiasAulasByAlunoService(customApi);

      expect(customService.alunoApi).toBe(customApi);
    });

    it('should accept null or undefined dependencies', () => {
      const serviceWithNull = new GetDiasAulasByAlunoService(null);
      expect(serviceWithNull.alunoApi).toBeNull();
    });
  });

  describe('execute', () => {
    it('should call api.getDiasAulasByAluno with correct ID', async () => {
      const testId = 123;
      const mockResponse = {
        data: [
          { dia: 'Segunda', horario: '08:00' },
          { dia: 'Quarta', horario: '10:00' },
        ],
      };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getDiasAulasByAluno).toHaveBeenCalledWith(testId);
      expect(mockApi.getDiasAulasByAluno).toHaveBeenCalledTimes(1);
    });

    it('should return dias aulas list from API response', async () => {
      const testId = 456;
      const diasAulasData = [
        { dia: 'Segunda-feira', horario: '08:00', sala: 'A1' },
        { dia: 'Terça-feira', horario: '09:00', sala: 'B2' },
        { dia: 'Quarta-feira', horario: '10:00', sala: 'C3' },
      ];
      const mockResponse = { data: diasAulasData };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toEqual(diasAulasData);
      expect(result.data).toHaveLength(3);
    });

    it('should return empty array when no dias aulas exist', async () => {
      const testId = 789;
      const mockResponse = { data: [] };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toEqual([]);
      expect(result.data).toHaveLength(0);
    });

    it('should handle null data in response', async () => {
      const testId = 999;
      const mockResponse = { data: null };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toBeNull();
    });

    it('should handle undefined data in response', async () => {
      const testId = 111;
      const mockResponse = { data: undefined };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toBeUndefined();
    });

    it('should propagate API errors', async () => {
      const testId = 222;
      const mockError = new Error('API Error');

      mockApi.getDiasAulasByAluno.mockRejectedValue(mockError);

      await expect(service.execute(testId)).rejects.toThrow('API Error');
    });

    it('should handle network errors', async () => {
      const testId = 333;
      const networkError = new Error('Network Error');

      mockApi.getDiasAulasByAluno.mockRejectedValue(networkError);

      await expect(service.execute(testId)).rejects.toThrow('Network Error');
    });

    it('should handle 404 errors', async () => {
      const testId = 444;
      const notFoundError = new Error('Aluno not found');

      mockApi.getDiasAulasByAluno.mockRejectedValue(notFoundError);

      await expect(service.execute(testId)).rejects.toThrow('Aluno not found');
    });

    it('should call API with string ID', async () => {
      const testId = '555';
      const mockResponse = { data: [] };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getDiasAulasByAluno).toHaveBeenCalledWith('555');
    });

    it('should handle weekly schedule', async () => {
      const testId = 666;
      const weeklySchedule = [
        { dia: 'Segunda', horario: '08:00' },
        { dia: 'Terça', horario: '08:00' },
        { dia: 'Quarta', horario: '08:00' },
        { dia: 'Quinta', horario: '08:00' },
        { dia: 'Sexta', horario: '08:00' },
      ];
      const mockResponse = { data: weeklySchedule };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toHaveLength(5);
      expect(result.data).toEqual(weeklySchedule);
    });

    it('should return response with additional metadata', async () => {
      const testId = 777;
      const mockResponse = {
        data: [{ dia: 'Segunda', horario: '08:00' }],
        metadata: { turno: 'manhã', total: 1 },
      };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toHaveLength(1);
      expect(result.metadata).toEqual({ turno: 'manhã', total: 1 });
    });

    it('should handle multiple time slots per day', async () => {
      const testId = 888;
      const multipleSlots = [
        { dia: 'Segunda', horario: '08:00' },
        { dia: 'Segunda', horario: '14:00' },
        { dia: 'Quarta', horario: '10:00' },
      ];
      const mockResponse = { data: multipleSlots };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result.data).toHaveLength(3);
      expect(result.data.filter(item => item.dia === 'Segunda')).toHaveLength(
        2
      );
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and call execute', async () => {
      const testId = 888;
      const mockResponse = {
        data: [{ dia: 'Segunda', horario: '08:00' }],
      };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      const result = await GetDiasAulasByAlunoService.handle(testId);

      expect(AlunoApi).toHaveBeenCalled();
      expect(mockApi.getDiasAulasByAluno).toHaveBeenCalledWith(testId);
      expect(result.data).toEqual([{ dia: 'Segunda', horario: '08:00' }]);
    });

    it('should work with different IDs', async () => {
      const testIds = [1, 2, 3];
      const mockResponse = { data: [] };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      for (const id of testIds) {
        await GetDiasAulasByAlunoService.handle(id);
        expect(mockApi.getDiasAulasByAluno).toHaveBeenCalledWith(id);
      }
    });

    it('should propagate errors from execute method', async () => {
      const testId = 999;
      const mockError = new Error('Service Error');

      mockApi.getDiasAulasByAluno.mockRejectedValue(mockError);

      await expect(GetDiasAulasByAlunoService.handle(testId)).rejects.toThrow(
        'Service Error'
      );
    });

    it('should create new API instance each time', async () => {
      const testId = 101;
      const mockResponse = { data: [] };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      await GetDiasAulasByAlunoService.handle(testId);
      await GetDiasAulasByAlunoService.handle(testId);

      expect(AlunoApi).toHaveBeenCalledTimes(2);
    });

    it('should handle concurrent calls', async () => {
      const ids = [1, 2, 3, 4, 5];
      const mockResponse = { data: [] };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      const promises = ids.map(id => GetDiasAulasByAlunoService.handle(id));
      await Promise.all(promises);

      expect(mockApi.getDiasAulasByAluno).toHaveBeenCalledTimes(5);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete workflow', async () => {
      const alunoId = 123;
      const diasAulasData = [
        { dia: 'Segunda', horario: '08:00', professor: 'Prof A' },
        { dia: 'Quarta', horario: '10:00', professor: 'Prof B' },
      ];
      const mockResponse = { data: diasAulasData };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      const result = await GetDiasAulasByAlunoService.handle(alunoId);

      expect(result.data).toEqual(diasAulasData);
      expect(AlunoApi).toHaveBeenCalled();
    });

    it('should handle error scenarios in workflow', async () => {
      const alunoId = 456;
      const error = new Error('Database connection failed');

      mockApi.getDiasAulasByAluno.mockRejectedValue(error);

      await expect(GetDiasAulasByAlunoService.handle(alunoId)).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should maintain data integrity through service layers', async () => {
      const alunoId = 789;
      const originalData = [{ dia: 'Terça', horario: '14:00', sala: 'Lab1' }];
      const mockResponse = { data: originalData };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(alunoId);

      expect(result.data).toEqual(originalData);
      expect(result.data[0]).toEqual(originalData[0]);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero as ID', async () => {
      const testId = 0;
      const mockResponse = { data: [] };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getDiasAulasByAluno).toHaveBeenCalledWith(0);
    });

    it('should handle negative ID', async () => {
      const testId = -1;
      const mockResponse = { data: [] };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getDiasAulasByAluno).toHaveBeenCalledWith(-1);
    });

    it('should handle very large ID numbers', async () => {
      const testId = 9999999999;
      const mockResponse = { data: [] };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      await service.execute(testId);

      expect(mockApi.getDiasAulasByAluno).toHaveBeenCalledWith(9999999999);
    });

    it('should handle response without data property', async () => {
      const testId = 123;
      const mockResponse = { diasAulas: [] };

      mockApi.getDiasAulasByAluno.mockResolvedValue(mockResponse);

      const result = await service.execute(testId);

      expect(result).toEqual(mockResponse);
    });

    it('should handle timeout errors', async () => {
      const testId = 456;
      const timeoutError = new Error('Request timeout');

      mockApi.getDiasAulasByAluno.mockRejectedValue(timeoutError);

      await expect(service.execute(testId)).rejects.toThrow('Request timeout');
    });
  });
});
