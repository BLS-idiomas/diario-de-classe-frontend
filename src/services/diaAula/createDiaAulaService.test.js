import { CreateDiaAulaService } from './createDiaAulaService';
import { DiaAulaApi } from '@/store/api/diaAulaApi';

// Mock da DiaAulaApi
jest.mock('@/store/api/diaAulaApi');

describe('CreateDiaAulaService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      create: jest.fn(),
    };

    // Mock do constructor do DiaAulaApi
    DiaAulaApi.mockImplementation(() => mockApi);

    service = new CreateDiaAulaService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided diaAulaApi', () => {
      expect(service.diaAulaApi).toBe(mockApi);
    });

    it('should store references correctly', () => {
      const customApi = { create: jest.fn() };
      const customService = new CreateDiaAulaService(customApi);

      expect(customService.diaAulaApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should create dia aula and return response', async () => {
      const diaAulaData = {
        data: '2024-01-15',
        horario: '10:00',
        idProfessor: 1,
        idAluno: 2,
      };

      const mockResponse = {
        data: {
          id: 1,
          ...diaAulaData,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaData);

      expect(mockApi.create).toHaveBeenCalledWith(diaAulaData);
      expect(mockApi.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('should handle response without id', async () => {
      const diaAulaData = {
        data: '2024-01-16',
        horario: '14:00',
      };

      const mockResponse = {
        data: {
          ...diaAulaData,
          message: 'Dia aula created successfully',
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaData);

      expect(mockApi.create).toHaveBeenCalledWith(diaAulaData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle response with null data', async () => {
      const diaAulaData = {
        data: '2024-01-17',
        horario: '16:00',
      };

      const mockResponse = {
        data: null,
        message: 'Error creating dia aula',
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaData);

      expect(mockApi.create).toHaveBeenCalledWith(diaAulaData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty data object', async () => {
      const diaAulaData = {};

      const mockResponse = {
        data: {
          id: 1,
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaData);

      expect(mockApi.create).toHaveBeenCalledWith(diaAulaData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle complex data structure', async () => {
      const diaAulaData = {
        data: '2024-01-18',
        horario: '09:00',
        idProfessor: 1,
        idAluno: 2,
        aulas: [
          { id: 1, tema: 'Grammar' },
          { id: 2, tema: 'Vocabulary' },
        ],
        metadata: {
          created: true,
          location: 'Room 101',
        },
      };

      const mockResponse = {
        data: {
          id: 5,
          ...diaAulaData,
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaData);

      expect(mockApi.create).toHaveBeenCalledWith(diaAulaData);
      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors from api', async () => {
      const diaAulaData = {
        data: '2024-01-19',
        horario: '11:00',
      };

      const mockError = new Error('API Error');
      mockApi.create.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaData)).rejects.toThrow('API Error');
      expect(mockApi.create).toHaveBeenCalledWith(diaAulaData);
    });

    it('should handle validation errors', async () => {
      const diaAulaData = {
        data: 'invalid-date',
        horario: '25:00',
      };

      const mockError = {
        response: {
          data: {
            errors: {
              data: ['Data inválida'],
              horario: ['Horário inválido'],
            },
          },
        },
      };

      mockApi.create.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaData)).rejects.toEqual(mockError);
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute', async () => {
      const diaAulaData = {
        data: '2024-01-20',
        horario: '15:00',
      };

      const mockResponse = {
        data: {
          id: 10,
          ...diaAulaData,
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await CreateDiaAulaService.handle(diaAulaData);

      expect(DiaAulaApi).toHaveBeenCalled();
      expect(mockApi.create).toHaveBeenCalledWith(diaAulaData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors in static method', async () => {
      const diaAulaData = {
        data: '2024-01-21',
        horario: '17:00',
      };

      const mockError = new Error('Static method error');
      mockApi.create.mockRejectedValue(mockError);

      await expect(CreateDiaAulaService.handle(diaAulaData)).rejects.toThrow(
        'Static method error'
      );
    });

    it('should create new instances on each call', async () => {
      const diaAulaData1 = { data: '2024-01-22', horario: '10:00' };
      const diaAulaData2 = { data: '2024-01-23', horario: '11:00' };

      mockApi.create.mockResolvedValue({ data: { id: 1 } });

      await CreateDiaAulaService.handle(diaAulaData1);
      await CreateDiaAulaService.handle(diaAulaData2);

      expect(DiaAulaApi).toHaveBeenCalledTimes(2);
      expect(mockApi.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('edge cases', () => {
    it('should handle null data', async () => {
      mockApi.create.mockResolvedValue({ data: null });

      const result = await service.execute(null);

      expect(mockApi.create).toHaveBeenCalledWith(null);
      expect(result).toEqual({ data: null });
    });

    it('should handle undefined data', async () => {
      mockApi.create.mockResolvedValue({ data: undefined });

      const result = await service.execute(undefined);

      expect(mockApi.create).toHaveBeenCalledWith(undefined);
      expect(result).toEqual({ data: undefined });
    });

    it('should handle network errors', async () => {
      const diaAulaData = { data: '2024-01-24', horario: '12:00' };
      const networkError = new Error('Network Error');
      networkError.code = 'ECONNREFUSED';

      mockApi.create.mockRejectedValue(networkError);

      await expect(service.execute(diaAulaData)).rejects.toThrow(
        'Network Error'
      );
    });

    it('should handle timeout errors', async () => {
      const diaAulaData = { data: '2024-01-25', horario: '13:00' };
      const timeoutError = new Error('Timeout');
      timeoutError.code = 'ETIMEDOUT';

      mockApi.create.mockRejectedValue(timeoutError);

      await expect(service.execute(diaAulaData)).rejects.toThrow('Timeout');
    });
  });
});
