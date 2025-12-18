import { CreateManyAulasService } from './createManyAulasService';
import { ContratoApi } from '@/store/api/contratoApi';

jest.mock('@/store/api/contratoApi');

describe('CreateManyAulasService', () => {
  let contratoApi;
  let service;

  beforeEach(() => {
    contratoApi = new ContratoApi();
    service = new CreateManyAulasService(contratoApi);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with contratoApi', () => {
      expect(service).toBeInstanceOf(CreateManyAulasService);
      expect(service.contratoApi).toBe(contratoApi);
    });

    it('should store the contratoApi parameter', () => {
      const customApi = new ContratoApi();
      const customService = new CreateManyAulasService(customApi);

      expect(customService.contratoApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should call contratoApi.createManyAulas with correct id and data', async () => {
      const id = 123;
      const aulasData = [
        { data: '2024-01-15', horaInicio: '09:00', horaFim: '10:00' },
        { data: '2024-01-17', horaInicio: '14:00', horaFim: '15:00' },
      ];
      const mockResponse = { data: aulasData };
      contratoApi.createManyAulas.mockResolvedValue(mockResponse);

      await service.execute(id, aulasData);

      expect(contratoApi.createManyAulas).toHaveBeenCalledWith(id, aulasData);
      expect(contratoApi.createManyAulas).toHaveBeenCalledTimes(1);
    });

    it('should return the created aulas from contratoApi.createManyAulas', async () => {
      const id = 456;
      const aulasData = [
        { data: '2024-02-01', horaInicio: '10:00', horaFim: '11:00' },
      ];
      const mockResponse = { data: [{ id: 1, ...aulasData[0] }] };
      contratoApi.createManyAulas.mockResolvedValue(mockResponse);

      const result = await service.execute(id, aulasData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty array of aulas', async () => {
      const id = 789;
      const aulasData = [];
      const mockResponse = { data: [] };
      contratoApi.createManyAulas.mockResolvedValue(mockResponse);

      await service.execute(id, aulasData);

      expect(contratoApi.createManyAulas).toHaveBeenCalledWith(id, []);
    });

    it('should handle single aula in array', async () => {
      const id = 101;
      const aulasData = [
        { data: '2024-03-15', horaInicio: '08:00', horaFim: '09:00' },
      ];
      const mockResponse = { data: [{ id: 5, ...aulasData[0] }] };
      contratoApi.createManyAulas.mockResolvedValue(mockResponse);

      const result = await service.execute(id, aulasData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle multiple aulas with different data', async () => {
      const id = 202;
      const aulasData = [
        { data: '2024-04-01', horaInicio: '09:00', horaFim: '10:00' },
        { data: '2024-04-03', horaInicio: '11:00', horaFim: '12:00' },
        { data: '2024-04-05', horaInicio: '14:00', horaFim: '15:00' },
      ];
      const mockResponse = { data: aulasData };
      contratoApi.createManyAulas.mockResolvedValue(mockResponse);

      const result = await service.execute(id, aulasData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle error from contratoApi.createManyAulas', async () => {
      const id = 303;
      const aulasData = [{ data: '2024-05-01' }];
      const error = new Error('Failed to create aulas');
      contratoApi.createManyAulas.mockRejectedValue(error);

      await expect(service.execute(id, aulasData)).rejects.toThrow(
        'Failed to create aulas'
      );
    });

    it('should handle string id', async () => {
      const id = 'abc123';
      const aulasData = [{ data: '2024-06-01' }];
      const mockResponse = { data: aulasData };
      contratoApi.createManyAulas.mockResolvedValue(mockResponse);

      await service.execute(id, aulasData);

      expect(contratoApi.createManyAulas).toHaveBeenCalledWith(id, aulasData);
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute', async () => {
      const id = 999;
      const aulasData = [
        { data: '2024-07-01', horaInicio: '10:00', horaFim: '11:00' },
      ];
      const mockResponse = { data: aulasData };
      ContratoApi.mockImplementation(() => ({
        createManyAulas: jest.fn().mockResolvedValue(mockResponse),
      }));

      const result = await CreateManyAulasService.handle(id, aulasData);

      expect(result).toEqual(mockResponse);
    });

    it('should create new ContratoApi instance', async () => {
      const id = 888;
      const aulasData = [];
      ContratoApi.mockImplementation(() => ({
        createManyAulas: jest.fn().mockResolvedValue({ data: [] }),
      }));

      const instancesCountBefore = ContratoApi.mock.instances.length;
      await CreateManyAulasService.handle(id, aulasData);

      expect(ContratoApi.mock.instances.length).toBeGreaterThan(
        instancesCountBefore
      );
    });

    it('should handle errors in static method', async () => {
      const id = 777;
      const aulasData = [{ data: '2024-08-01' }];
      const error = new Error('Static method error');
      ContratoApi.mockImplementation(() => ({
        createManyAulas: jest.fn().mockRejectedValue(error),
      }));

      await expect(
        CreateManyAulasService.handle(id, aulasData)
      ).rejects.toThrow('Static method error');
    });
  });
});
