import { UpdateGroupDiaAulaService } from './updateGroupDiaAulaService';
import { DiaAulaApi } from '@/store/api/diaAulaApi';

// Mock da DiaAulaApi
jest.mock('@/store/api/diaAulaApi');

describe('UpdateGroupDiaAulaService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      update: jest.fn(),
    };

    // Mock do constructor do DiaAulaApi
    DiaAulaApi.mockImplementation(() => mockApi);

    service = new UpdateGroupDiaAulaService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided diaAulaApi', () => {
      expect(service.diaAulaApi).toBe(mockApi);
    });

    it('should store references correctly', () => {
      const customApi = { update: jest.fn() };
      const customService = new UpdateGroupDiaAulaService(customApi);

      expect(customService.diaAulaApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should update group of dias aulas with array of objects', async () => {
      const groupId = 1;
      const diasAulasData = [
        {
          id: 1,
          data: '2024-01-15',
          horario: '10:00',
          idProfessor: 1,
          idAluno: 2,
        },
        {
          id: 2,
          data: '2024-01-16',
          horario: '14:00',
          idProfessor: 1,
          idAluno: 2,
        },
        {
          id: 3,
          data: '2024-01-17',
          horario: '16:00',
          idProfessor: 1,
          idAluno: 2,
        },
      ];

      const mockResponse = {
        data: diasAulasData.map(item => ({
          ...item,
          updatedAt: '2024-01-15T10:00:00Z',
        })),
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(groupId, diasAulasData);

      expect(mockApi.update).toHaveBeenCalledWith(groupId, diasAulasData);
      expect(mockApi.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(3);
    });

    it('should handle single item array', async () => {
      const groupId = 5;
      const diasAulasData = [
        {
          id: 10,
          data: '2024-01-15',
          horario: '10:00',
        },
      ];

      const mockResponse = {
        data: [
          {
            ...diasAulasData[0],
            updatedAt: '2024-01-15T10:00:00Z',
          },
        ],
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(groupId, diasAulasData);

      expect(mockApi.update).toHaveBeenCalledWith(groupId, diasAulasData);
      expect(result.data).toHaveLength(1);
    });

    it('should handle empty array', async () => {
      const groupId = 10;
      const diasAulasData = [];

      const mockResponse = {
        data: [],
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(groupId, diasAulasData);

      expect(mockApi.update).toHaveBeenCalledWith(groupId, diasAulasData);
      expect(result.data).toHaveLength(0);
    });

    it('should handle partial updates in array', async () => {
      const groupId = 15;
      const diasAulasData = [
        { id: 1, horario: '11:00' },
        { id: 2, data: '2024-01-20' },
        { id: 3, horario: '17:00', data: '2024-01-21' },
      ];

      const mockResponse = {
        data: [
          { id: 1, data: '2024-01-15', horario: '11:00' },
          { id: 2, data: '2024-01-20', horario: '14:00' },
          { id: 3, data: '2024-01-21', horario: '17:00' },
        ],
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(groupId, diasAulasData);

      expect(mockApi.update).toHaveBeenCalledWith(groupId, diasAulasData);
      expect(result.data).toHaveLength(3);
    });

    it('should handle large array of dias aulas', async () => {
      const groupId = 20;
      const diasAulasData = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        data: `2024-01-${15 + i}`,
        horario: '10:00',
      }));

      const mockResponse = {
        data: diasAulasData.map(item => ({
          ...item,
          updatedAt: '2024-01-15T10:00:00Z',
        })),
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(groupId, diasAulasData);

      expect(mockApi.update).toHaveBeenCalledWith(groupId, diasAulasData);
      expect(result.data).toHaveLength(10);
    });

    it('should handle array with different data structures', async () => {
      const groupId = 25;
      const diasAulasData = [
        {
          id: 1,
          data: '2024-01-15',
          horario: '10:00',
        },
        {
          id: 2,
          data: '2024-01-16',
          aulas: [{ id: 1, tema: 'Grammar' }],
        },
        {
          id: 3,
          metadata: { location: 'Room 101' },
        },
      ];

      const mockResponse = {
        data: diasAulasData.map(item => ({
          ...item,
          updatedAt: '2024-01-15T10:00:00Z',
        })),
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(groupId, diasAulasData);

      expect(mockApi.update).toHaveBeenCalledWith(groupId, diasAulasData);
      expect(result.data).toHaveLength(3);
    });

    it('should handle response with partial success', async () => {
      const groupId = 30;
      const diasAulasData = [
        { id: 1, data: '2024-01-15', horario: '10:00' },
        { id: 2, data: '2024-01-16', horario: '14:00' },
      ];

      const mockResponse = {
        data: [{ id: 1, data: '2024-01-15', horario: '10:00' }],
        errors: [{ id: 2, message: 'Horário já ocupado' }],
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(groupId, diasAulasData);

      expect(mockApi.update).toHaveBeenCalledWith(groupId, diasAulasData);
      expect(result.data).toHaveLength(1);
      expect(result.errors).toHaveLength(1);
    });

    it('should handle string group id', async () => {
      const groupId = '123';
      const diasAulasData = [{ id: 1, horario: '10:00' }];

      const mockResponse = {
        data: diasAulasData,
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(groupId, diasAulasData);

      expect(mockApi.update).toHaveBeenCalledWith(groupId, diasAulasData);
    });

    it('should propagate errors from api', async () => {
      const groupId = 35;
      const diasAulasData = [{ id: 1, horario: '10:00' }];

      const mockError = new Error('API Error');
      mockApi.update.mockRejectedValue(mockError);

      await expect(service.execute(groupId, diasAulasData)).rejects.toThrow(
        'API Error'
      );
      expect(mockApi.update).toHaveBeenCalledWith(groupId, diasAulasData);
    });

    it('should handle validation errors for array', async () => {
      const groupId = 40;
      const diasAulasData = [
        { id: 1, data: 'invalid-date', horario: '25:00' },
        { id: 2, data: '2024-01-16', horario: '14:00' },
      ];

      const mockError = {
        response: {
          status: 422,
          data: {
            errors: [
              { id: 1, field: 'data', message: 'Data inválida' },
              { id: 1, field: 'horario', message: 'Horário inválido' },
            ],
          },
        },
      };

      mockApi.update.mockRejectedValue(mockError);

      await expect(service.execute(groupId, diasAulasData)).rejects.toEqual(
        mockError
      );
    });

    it('should handle not found errors', async () => {
      const groupId = 404;
      const diasAulasData = [{ id: 1, horario: '10:00' }];

      const mockError = {
        response: {
          status: 404,
          data: {
            message: 'Group not found',
          },
        },
      };

      mockApi.update.mockRejectedValue(mockError);

      await expect(service.execute(groupId, diasAulasData)).rejects.toEqual(
        mockError
      );
    });

    it('should handle response with metadata', async () => {
      const groupId = 45;
      const diasAulasData = [
        { id: 1, horario: '10:00' },
        { id: 2, horario: '14:00' },
      ];

      const mockResponse = {
        data: diasAulasData,
        meta: {
          totalUpdated: 2,
          totalFailed: 0,
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(groupId, diasAulasData);

      expect(result.meta.totalUpdated).toBe(2);
      expect(result.meta.totalFailed).toBe(0);
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute with array', async () => {
      const groupId = 50;
      const diasAulasData = [
        { id: 1, data: '2024-01-15', horario: '10:00' },
        { id: 2, data: '2024-01-16', horario: '14:00' },
      ];

      const mockResponse = {
        data: diasAulasData,
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await UpdateGroupDiaAulaService.handle(
        groupId,
        diasAulasData
      );

      expect(DiaAulaApi).toHaveBeenCalled();
      expect(mockApi.update).toHaveBeenCalledWith(groupId, diasAulasData);
      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(2);
    });

    it('should handle errors in static method', async () => {
      const groupId = 55;
      const diasAulasData = [{ id: 1, horario: '10:00' }];

      const mockError = new Error('Static method error');
      mockApi.update.mockRejectedValue(mockError);

      await expect(
        UpdateGroupDiaAulaService.handle(groupId, diasAulasData)
      ).rejects.toThrow('Static method error');
    });

    it('should create new instances on each call', async () => {
      const groupId1 = 60;
      const groupId2 = 61;
      const diasAulasData1 = [{ id: 1, horario: '10:00' }];
      const diasAulasData2 = [{ id: 2, horario: '14:00' }];

      mockApi.update.mockResolvedValue({ data: [] });

      await UpdateGroupDiaAulaService.handle(groupId1, diasAulasData1);
      await UpdateGroupDiaAulaService.handle(groupId2, diasAulasData2);

      expect(DiaAulaApi).toHaveBeenCalledTimes(2);
      expect(mockApi.update).toHaveBeenCalledTimes(2);
      expect(mockApi.update).toHaveBeenNthCalledWith(
        1,
        groupId1,
        diasAulasData1
      );
      expect(mockApi.update).toHaveBeenNthCalledWith(
        2,
        groupId2,
        diasAulasData2
      );
    });
  });

  describe('edge cases', () => {
    it('should handle group id as 0', async () => {
      const groupId = 0;
      const diasAulasData = [{ id: 1, horario: '10:00' }];

      mockApi.update.mockResolvedValue({ data: diasAulasData });

      const result = await service.execute(groupId, diasAulasData);

      expect(mockApi.update).toHaveBeenCalledWith(0, diasAulasData);
    });

    it('should handle negative group id', async () => {
      const groupId = -1;
      const diasAulasData = [{ id: 1, horario: '10:00' }];

      const mockError = {
        response: {
          data: {
            message: 'Invalid group id',
          },
        },
      };

      mockApi.update.mockRejectedValue(mockError);

      await expect(service.execute(groupId, diasAulasData)).rejects.toEqual(
        mockError
      );
    });

    it('should handle null group id', async () => {
      const diasAulasData = [{ id: 1, horario: '10:00' }];

      mockApi.update.mockResolvedValue({ data: diasAulasData });

      const result = await service.execute(null, diasAulasData);

      expect(mockApi.update).toHaveBeenCalledWith(null, diasAulasData);
    });

    it('should handle undefined group id', async () => {
      const diasAulasData = [{ id: 1, horario: '10:00' }];

      mockApi.update.mockResolvedValue({ data: diasAulasData });

      const result = await service.execute(undefined, diasAulasData);

      expect(mockApi.update).toHaveBeenCalledWith(undefined, diasAulasData);
    });

    it('should handle null data', async () => {
      const groupId = 65;

      mockApi.update.mockResolvedValue({ data: null });

      const result = await service.execute(groupId, null);

      expect(mockApi.update).toHaveBeenCalledWith(groupId, null);
      expect(result).toEqual({ data: null });
    });

    it('should handle undefined data', async () => {
      const groupId = 70;

      mockApi.update.mockResolvedValue({ data: undefined });

      const result = await service.execute(groupId, undefined);

      expect(mockApi.update).toHaveBeenCalledWith(groupId, undefined);
    });

    it('should handle array with null elements', async () => {
      const groupId = 75;
      const diasAulasData = [
        { id: 1, horario: '10:00' },
        null,
        { id: 2, horario: '14:00' },
      ];

      const mockResponse = {
        data: [
          { id: 1, horario: '10:00' },
          { id: 2, horario: '14:00' },
        ],
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(groupId, diasAulasData);

      expect(mockApi.update).toHaveBeenCalledWith(groupId, diasAulasData);
      expect(result.data).toHaveLength(2);
    });

    it('should handle network errors', async () => {
      const groupId = 80;
      const diasAulasData = [{ id: 1, horario: '10:00' }];
      const networkError = new Error('Network Error');
      networkError.code = 'ECONNREFUSED';

      mockApi.update.mockRejectedValue(networkError);

      await expect(service.execute(groupId, diasAulasData)).rejects.toThrow(
        'Network Error'
      );
    });

    it('should handle timeout errors', async () => {
      const groupId = 85;
      const diasAulasData = [{ id: 1, horario: '10:00' }];
      const timeoutError = new Error('Timeout');
      timeoutError.code = 'ETIMEDOUT';

      mockApi.update.mockRejectedValue(timeoutError);

      await expect(service.execute(groupId, diasAulasData)).rejects.toThrow(
        'Timeout'
      );
    });

    it('should handle server errors with array', async () => {
      const groupId = 90;
      const diasAulasData = [
        { id: 1, horario: '10:00' },
        { id: 2, horario: '14:00' },
      ];

      const serverError = {
        response: {
          status: 500,
          data: {
            message: 'Internal server error',
          },
        },
      };

      mockApi.update.mockRejectedValue(serverError);

      await expect(service.execute(groupId, diasAulasData)).rejects.toEqual(
        serverError
      );
    });

    it('should handle concurrent updates', async () => {
      const groupId = 95;
      const diasAulasData1 = [{ id: 1, horario: '10:00' }];
      const diasAulasData2 = [{ id: 1, horario: '11:00' }];

      mockApi.update
        .mockResolvedValueOnce({ data: [{ id: 1, horario: '10:00' }] })
        .mockResolvedValueOnce({ data: [{ id: 1, horario: '11:00' }] });

      const result1 = await service.execute(groupId, diasAulasData1);
      const result2 = await service.execute(groupId, diasAulasData2);

      expect(mockApi.update).toHaveBeenCalledTimes(2);
      expect(result1.data[0].horario).toBe('10:00');
      expect(result2.data[0].horario).toBe('11:00');
    });

    it('should handle array with very large number of items', async () => {
      const groupId = 100;
      const diasAulasData = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        horario: `${10 + (i % 8)}:00`,
      }));

      const mockResponse = {
        data: diasAulasData,
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(groupId, diasAulasData);

      expect(mockApi.update).toHaveBeenCalledWith(groupId, diasAulasData);
      expect(result.data).toHaveLength(100);
    });

    it('should preserve extra fields in update data', async () => {
      const groupId = 105;
      const diasAulasData = [
        {
          id: 1,
          horario: '10:00',
          extraField1: 'value1',
          extraField2: { nested: 'value2' },
        },
      ];

      const mockResponse = {
        data: diasAulasData,
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(groupId, diasAulasData);

      expect(result.data[0].extraField1).toBe('value1');
      expect(result.data[0].extraField2).toEqual({ nested: 'value2' });
    });
  });
});
