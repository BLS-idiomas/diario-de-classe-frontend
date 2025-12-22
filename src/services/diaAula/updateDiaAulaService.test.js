import { UpdateDiaAulaService } from './updateDiaAulaService';
import { DiaAulaApi } from '@/store/api/diaAulaApi';

// Mock da DiaAulaApi
jest.mock('@/store/api/diaAulaApi');

describe('UpdateDiaAulaService', () => {
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

    service = new UpdateDiaAulaService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided diaAulaApi', () => {
      expect(service.diaAulaApi).toBe(mockApi);
    });

    it('should store references correctly', () => {
      const customApi = { update: jest.fn() };
      const customService = new UpdateDiaAulaService(customApi);

      expect(customService.diaAulaApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should update dia aula and return response', async () => {
      const diaAulaId = 1;
      const updateData = {
        data: '2024-01-15',
        horario: '10:00',
        idProfessor: 1,
        idAluno: 2,
      };

      const mockResponse = {
        data: {
          id: diaAulaId,
          ...updateData,
          updatedAt: '2024-01-15T10:00:00Z',
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(diaAulaId, updateData);
      expect(mockApi.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('should handle string id', async () => {
      const diaAulaId = '123';
      const updateData = { data: '2024-01-16', horario: '14:00' };

      const mockResponse = {
        data: {
          id: 123,
          ...updateData,
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(diaAulaId, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle numeric id', async () => {
      const diaAulaId = 456;
      const updateData = { horario: '16:00' };

      const mockResponse = {
        data: {
          id: diaAulaId,
          ...updateData,
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(diaAulaId, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle partial update', async () => {
      const diaAulaId = 10;
      const updateData = {
        horario: '11:00',
      };

      const mockResponse = {
        data: {
          id: diaAulaId,
          data: '2024-01-15',
          horario: '11:00',
          idProfessor: 1,
          idAluno: 2,
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(diaAulaId, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle complete update with nested data', async () => {
      const diaAulaId = 15;
      const updateData = {
        data: '2024-01-18',
        horario: '09:00',
        idProfessor: 5,
        idAluno: 3,
        aulas: [
          { id: 1, tema: 'Grammar', duracao: 60 },
          { id: 2, tema: 'Vocabulary', duracao: 30 },
        ],
        metadata: {
          updated: true,
          location: 'Room 202',
        },
      };

      const mockResponse = {
        data: {
          id: diaAulaId,
          ...updateData,
          updatedAt: '2024-01-18T09:00:00Z',
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(diaAulaId, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty data object', async () => {
      const diaAulaId = 20;
      const updateData = {};

      const mockResponse = {
        data: {
          id: diaAulaId,
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(diaAulaId, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle response with null data', async () => {
      const diaAulaId = 789;
      const updateData = { data: '2024-01-17' };

      const mockResponse = {
        data: null,
        message: 'Update failed',
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(diaAulaId, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors from api', async () => {
      const diaAulaId = 999;
      const updateData = { horario: '12:00' };

      const mockError = new Error('API Error');
      mockApi.update.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaId, updateData)).rejects.toThrow(
        'API Error'
      );
      expect(mockApi.update).toHaveBeenCalledWith(diaAulaId, updateData);
    });

    it('should handle not found errors', async () => {
      const diaAulaId = 404;
      const updateData = { horario: '13:00' };

      const mockError = {
        response: {
          status: 404,
          data: {
            message: 'Dia aula not found',
          },
        },
      };

      mockApi.update.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaId, updateData)).rejects.toEqual(
        mockError
      );
    });

    it('should handle validation errors', async () => {
      const diaAulaId = 500;
      const updateData = {
        data: 'invalid-date',
        horario: '25:00',
      };

      const mockError = {
        response: {
          status: 422,
          data: {
            errors: {
              data: ['Data inválida'],
              horario: ['Horário inválido'],
            },
          },
        },
      };

      mockApi.update.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaId, updateData)).rejects.toEqual(
        mockError
      );
    });

    it('should handle forbidden errors', async () => {
      const diaAulaId = 600;
      const updateData = { horario: '14:00' };

      const mockError = {
        response: {
          status: 403,
          data: {
            message: 'Forbidden to update this dia aula',
          },
        },
      };

      mockApi.update.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaId, updateData)).rejects.toEqual(
        mockError
      );
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute', async () => {
      const diaAulaId = 100;
      const updateData = {
        data: '2024-01-20',
        horario: '15:00',
      };

      const mockResponse = {
        data: {
          id: diaAulaId,
          ...updateData,
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await UpdateDiaAulaService.handle(diaAulaId, updateData);

      expect(DiaAulaApi).toHaveBeenCalled();
      expect(mockApi.update).toHaveBeenCalledWith(diaAulaId, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors in static method', async () => {
      const diaAulaId = 200;
      const updateData = { horario: '16:00' };

      const mockError = new Error('Static method error');
      mockApi.update.mockRejectedValue(mockError);

      await expect(
        UpdateDiaAulaService.handle(diaAulaId, updateData)
      ).rejects.toThrow('Static method error');
    });

    it('should create new instances on each call', async () => {
      const diaAulaId1 = 301;
      const diaAulaId2 = 302;
      const updateData1 = { horario: '10:00' };
      const updateData2 = { horario: '11:00' };

      mockApi.update.mockResolvedValue({ data: { id: 1 } });

      await UpdateDiaAulaService.handle(diaAulaId1, updateData1);
      await UpdateDiaAulaService.handle(diaAulaId2, updateData2);

      expect(DiaAulaApi).toHaveBeenCalledTimes(2);
      expect(mockApi.update).toHaveBeenCalledTimes(2);
      expect(mockApi.update).toHaveBeenNthCalledWith(
        1,
        diaAulaId1,
        updateData1
      );
      expect(mockApi.update).toHaveBeenNthCalledWith(
        2,
        diaAulaId2,
        updateData2
      );
    });
  });

  describe('edge cases', () => {
    it('should handle id as 0', async () => {
      const diaAulaId = 0;
      const updateData = { horario: '10:00' };

      mockApi.update.mockResolvedValue({ data: { id: 0 } });

      const result = await service.execute(diaAulaId, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(0, updateData);
      expect(result).toEqual({ data: { id: 0 } });
    });

    it('should handle negative id', async () => {
      const diaAulaId = -1;
      const updateData = { horario: '11:00' };

      const mockError = {
        response: {
          data: {
            message: 'Invalid id',
          },
        },
      };

      mockApi.update.mockRejectedValue(mockError);

      await expect(service.execute(diaAulaId, updateData)).rejects.toEqual(
        mockError
      );
    });

    it('should handle null id', async () => {
      const updateData = { horario: '12:00' };

      mockApi.update.mockResolvedValue({ data: null });

      const result = await service.execute(null, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(null, updateData);
      expect(result).toEqual({ data: null });
    });

    it('should handle undefined id', async () => {
      const updateData = { horario: '13:00' };

      mockApi.update.mockResolvedValue({ data: undefined });

      const result = await service.execute(undefined, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(undefined, updateData);
      expect(result).toEqual({ data: undefined });
    });

    it('should handle null data', async () => {
      const diaAulaId = 400;

      mockApi.update.mockResolvedValue({ data: { id: diaAulaId } });

      const result = await service.execute(diaAulaId, null);

      expect(mockApi.update).toHaveBeenCalledWith(diaAulaId, null);
      expect(result).toEqual({ data: { id: diaAulaId } });
    });

    it('should handle undefined data', async () => {
      const diaAulaId = 500;

      mockApi.update.mockResolvedValue({ data: { id: diaAulaId } });

      const result = await service.execute(diaAulaId, undefined);

      expect(mockApi.update).toHaveBeenCalledWith(diaAulaId, undefined);
      expect(result).toEqual({ data: { id: diaAulaId } });
    });

    it('should handle network errors', async () => {
      const diaAulaId = 600;
      const updateData = { horario: '14:00' };
      const networkError = new Error('Network Error');
      networkError.code = 'ECONNREFUSED';

      mockApi.update.mockRejectedValue(networkError);

      await expect(service.execute(diaAulaId, updateData)).rejects.toThrow(
        'Network Error'
      );
    });

    it('should handle timeout errors', async () => {
      const diaAulaId = 700;
      const updateData = { horario: '15:00' };
      const timeoutError = new Error('Timeout');
      timeoutError.code = 'ETIMEDOUT';

      mockApi.update.mockRejectedValue(timeoutError);

      await expect(service.execute(diaAulaId, updateData)).rejects.toThrow(
        'Timeout'
      );
    });

    it('should handle server errors', async () => {
      const diaAulaId = 800;
      const updateData = { horario: '16:00' };
      const serverError = {
        response: {
          status: 500,
          data: {
            message: 'Internal server error',
          },
        },
      };

      mockApi.update.mockRejectedValue(serverError);

      await expect(service.execute(diaAulaId, updateData)).rejects.toEqual(
        serverError
      );
    });

    it('should handle concurrent updates', async () => {
      const diaAulaId = 900;
      const updateData1 = { horario: '10:00' };
      const updateData2 = { horario: '11:00' };

      mockApi.update
        .mockResolvedValueOnce({ data: { id: diaAulaId, horario: '10:00' } })
        .mockResolvedValueOnce({ data: { id: diaAulaId, horario: '11:00' } });

      const result1 = await service.execute(diaAulaId, updateData1);
      const result2 = await service.execute(diaAulaId, updateData2);

      expect(mockApi.update).toHaveBeenCalledTimes(2);
      expect(result1.data.horario).toBe('10:00');
      expect(result2.data.horario).toBe('11:00');
    });

    it('should preserve extra fields in update data', async () => {
      const diaAulaId = 1000;
      const updateData = {
        data: '2024-01-25',
        horario: '17:00',
        extraField1: 'value1',
        extraField2: { nested: 'value2' },
      };

      const mockResponse = {
        data: {
          id: diaAulaId,
          ...updateData,
        },
      };

      mockApi.update.mockResolvedValue(mockResponse);

      const result = await service.execute(diaAulaId, updateData);

      expect(mockApi.update).toHaveBeenCalledWith(diaAulaId, updateData);
      expect(result.data.extraField1).toBe('value1');
      expect(result.data.extraField2).toEqual({ nested: 'value2' });
    });
  });
});
