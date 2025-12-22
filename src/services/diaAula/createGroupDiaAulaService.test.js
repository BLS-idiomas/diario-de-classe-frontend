import { CreateGroupDiaAulaService } from './createGroupDiaAulaService';
import { DiaAulaApi } from '@/store/api/diaAulaApi';

// Mock da DiaAulaApi
jest.mock('@/store/api/diaAulaApi');

describe('CreateGroupDiaAulaService', () => {
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

    service = new CreateGroupDiaAulaService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided diaAulaApi', () => {
      expect(service.diaAulaApi).toBe(mockApi);
    });

    it('should store references correctly', () => {
      const customApi = { create: jest.fn() };
      const customService = new CreateGroupDiaAulaService(customApi);

      expect(customService.diaAulaApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should create group of dias aulas with array of objects', async () => {
      const diasAulasData = [
        {
          data: '2024-01-15',
          horario: '10:00',
          idProfessor: 1,
          idAluno: 2,
        },
        {
          data: '2024-01-16',
          horario: '14:00',
          idProfessor: 1,
          idAluno: 2,
        },
        {
          data: '2024-01-17',
          horario: '16:00',
          idProfessor: 1,
          idAluno: 2,
        },
      ];

      const mockResponse = {
        data: diasAulasData.map((item, index) => ({
          id: index + 1,
          ...item,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        })),
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diasAulasData);

      expect(mockApi.create).toHaveBeenCalledWith(diasAulasData);
      expect(mockApi.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(3);
    });

    it('should handle single item array', async () => {
      const diasAulasData = [
        {
          data: '2024-01-15',
          horario: '10:00',
        },
      ];

      const mockResponse = {
        data: [
          {
            id: 1,
            ...diasAulasData[0],
          },
        ],
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diasAulasData);

      expect(mockApi.create).toHaveBeenCalledWith(diasAulasData);
      expect(result.data).toHaveLength(1);
    });

    it('should handle empty array', async () => {
      const diasAulasData = [];

      const mockResponse = {
        data: [],
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diasAulasData);

      expect(mockApi.create).toHaveBeenCalledWith(diasAulasData);
      expect(result.data).toHaveLength(0);
    });

    it('should handle large array of dias aulas', async () => {
      const diasAulasData = Array.from({ length: 10 }, (_, i) => ({
        data: `2024-01-${15 + i}`,
        horario: '10:00',
        idProfessor: 1,
        idAluno: 2,
      }));

      const mockResponse = {
        data: diasAulasData.map((item, index) => ({
          id: index + 1,
          ...item,
        })),
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diasAulasData);

      expect(mockApi.create).toHaveBeenCalledWith(diasAulasData);
      expect(result.data).toHaveLength(10);
    });

    it('should handle array with different data structures', async () => {
      const diasAulasData = [
        {
          data: '2024-01-15',
          horario: '10:00',
          idProfessor: 1,
          idAluno: 2,
        },
        {
          data: '2024-01-16',
          horario: '14:00',
          idProfessor: 2,
          idAluno: 3,
          aulas: [{ id: 1, tema: 'Grammar' }],
        },
        {
          data: '2024-01-17',
          horario: '16:00',
          metadata: { location: 'Room 101' },
        },
      ];

      const mockResponse = {
        data: diasAulasData.map((item, index) => ({
          id: index + 1,
          ...item,
        })),
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diasAulasData);

      expect(mockApi.create).toHaveBeenCalledWith(diasAulasData);
      expect(result.data).toHaveLength(3);
    });

    it('should handle response with partial success', async () => {
      const diasAulasData = [
        { data: '2024-01-15', horario: '10:00' },
        { data: '2024-01-16', horario: '14:00' },
      ];

      const mockResponse = {
        data: [{ id: 1, data: '2024-01-15', horario: '10:00' }],
        errors: [{ index: 1, message: 'Horário já ocupado' }],
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diasAulasData);

      expect(mockApi.create).toHaveBeenCalledWith(diasAulasData);
      expect(result.data).toHaveLength(1);
      expect(result.errors).toHaveLength(1);
    });

    it('should propagate errors from api', async () => {
      const diasAulasData = [{ data: '2024-01-15', horario: '10:00' }];

      const mockError = new Error('API Error');
      mockApi.create.mockRejectedValue(mockError);

      await expect(service.execute(diasAulasData)).rejects.toThrow('API Error');
      expect(mockApi.create).toHaveBeenCalledWith(diasAulasData);
    });

    it('should handle validation errors for array', async () => {
      const diasAulasData = [
        { data: 'invalid-date', horario: '25:00' },
        { data: '2024-01-16', horario: '14:00' },
      ];

      const mockError = {
        response: {
          status: 422,
          data: {
            errors: [
              { index: 0, field: 'data', message: 'Data inválida' },
              { index: 0, field: 'horario', message: 'Horário inválido' },
            ],
          },
        },
      };

      mockApi.create.mockRejectedValue(mockError);

      await expect(service.execute(diasAulasData)).rejects.toEqual(mockError);
    });

    it('should handle response with metadata', async () => {
      const diasAulasData = [
        { data: '2024-01-15', horario: '10:00' },
        { data: '2024-01-16', horario: '14:00' },
      ];

      const mockResponse = {
        data: diasAulasData.map((item, index) => ({
          id: index + 1,
          ...item,
        })),
        meta: {
          totalCreated: 2,
          totalFailed: 0,
        },
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diasAulasData);

      expect(result.meta.totalCreated).toBe(2);
      expect(result.meta.totalFailed).toBe(0);
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute with array', async () => {
      const diasAulasData = [
        { data: '2024-01-15', horario: '10:00' },
        { data: '2024-01-16', horario: '14:00' },
      ];

      const mockResponse = {
        data: diasAulasData.map((item, index) => ({
          id: index + 1,
          ...item,
        })),
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await CreateGroupDiaAulaService.handle(diasAulasData);

      expect(DiaAulaApi).toHaveBeenCalled();
      expect(mockApi.create).toHaveBeenCalledWith(diasAulasData);
      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(2);
    });

    it('should handle errors in static method', async () => {
      const diasAulasData = [{ data: '2024-01-15', horario: '10:00' }];

      const mockError = new Error('Static method error');
      mockApi.create.mockRejectedValue(mockError);

      await expect(
        CreateGroupDiaAulaService.handle(diasAulasData)
      ).rejects.toThrow('Static method error');
    });

    it('should create new instances on each call', async () => {
      const diasAulasData1 = [{ data: '2024-01-15', horario: '10:00' }];
      const diasAulasData2 = [{ data: '2024-01-16', horario: '14:00' }];

      mockApi.create.mockResolvedValue({ data: [] });

      await CreateGroupDiaAulaService.handle(diasAulasData1);
      await CreateGroupDiaAulaService.handle(diasAulasData2);

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

    it('should handle array with null elements', async () => {
      const diasAulasData = [
        { data: '2024-01-15', horario: '10:00' },
        null,
        { data: '2024-01-16', horario: '14:00' },
      ];

      const mockResponse = {
        data: [
          { id: 1, data: '2024-01-15', horario: '10:00' },
          { id: 3, data: '2024-01-16', horario: '14:00' },
        ],
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diasAulasData);

      expect(mockApi.create).toHaveBeenCalledWith(diasAulasData);
      expect(result.data).toHaveLength(2);
    });

    it('should handle network errors', async () => {
      const diasAulasData = [{ data: '2024-01-15', horario: '10:00' }];
      const networkError = new Error('Network Error');
      networkError.code = 'ECONNREFUSED';

      mockApi.create.mockRejectedValue(networkError);

      await expect(service.execute(diasAulasData)).rejects.toThrow(
        'Network Error'
      );
    });

    it('should handle timeout errors', async () => {
      const diasAulasData = [{ data: '2024-01-15', horario: '10:00' }];
      const timeoutError = new Error('Timeout');
      timeoutError.code = 'ETIMEDOUT';

      mockApi.create.mockRejectedValue(timeoutError);

      await expect(service.execute(diasAulasData)).rejects.toThrow('Timeout');
    });

    it('should handle server errors with array', async () => {
      const diasAulasData = [
        { data: '2024-01-15', horario: '10:00' },
        { data: '2024-01-16', horario: '14:00' },
      ];

      const serverError = {
        response: {
          status: 500,
          data: {
            message: 'Internal server error',
          },
        },
      };

      mockApi.create.mockRejectedValue(serverError);

      await expect(service.execute(diasAulasData)).rejects.toEqual(serverError);
    });

    it('should handle array with duplicate data', async () => {
      const diasAulasData = [
        { data: '2024-01-15', horario: '10:00' },
        { data: '2024-01-15', horario: '10:00' },
      ];

      const mockResponse = {
        data: [{ id: 1, data: '2024-01-15', horario: '10:00' }],
        errors: [{ index: 1, message: 'Dia de aula duplicado' }],
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diasAulasData);

      expect(result.data).toHaveLength(1);
      expect(result.errors).toHaveLength(1);
    });

    it('should handle array with very large number of items', async () => {
      const diasAulasData = Array.from({ length: 100 }, (_, i) => ({
        data: `2024-01-${15 + (i % 15)}`,
        horario: `${10 + (i % 8)}:00`,
      }));

      const mockResponse = {
        data: diasAulasData.map((item, index) => ({
          id: index + 1,
          ...item,
        })),
      };

      mockApi.create.mockResolvedValue(mockResponse);

      const result = await service.execute(diasAulasData);

      expect(mockApi.create).toHaveBeenCalledWith(diasAulasData);
      expect(result.data).toHaveLength(100);
    });
  });
});
