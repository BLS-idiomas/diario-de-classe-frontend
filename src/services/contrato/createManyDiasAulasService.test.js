import { CreateManyDiasAulasService } from './createManyDiasAulasService';
import { ContratoApi } from '@/store/api/contratoApi';

jest.mock('@/store/api/contratoApi');

describe('CreateManyDiasAulasService', () => {
  let contratoApi;
  let service;

  beforeEach(() => {
    contratoApi = new ContratoApi();
    service = new CreateManyDiasAulasService(contratoApi);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with contratoApi', () => {
      expect(service).toBeInstanceOf(CreateManyDiasAulasService);
      expect(service.contratoApi).toBe(contratoApi);
    });

    it('should store the contratoApi parameter', () => {
      const customApi = new ContratoApi();
      const customService = new CreateManyDiasAulasService(customApi);

      expect(customService.contratoApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should call contratoApi.createManyDiasAulas with correct id and data', async () => {
      const id = 123;
      const diasAulasData = [
        { diaSemana: 1, horaInicio: '09:00', horaFim: '10:00' },
        { diaSemana: 3, horaInicio: '14:00', horaFim: '15:00' },
      ];
      const mockResponse = { data: diasAulasData };
      contratoApi.createManyDiasAulas.mockResolvedValue(mockResponse);

      await service.execute(id, diasAulasData);

      expect(contratoApi.createManyDiasAulas).toHaveBeenCalledWith(
        id,
        diasAulasData
      );
      expect(contratoApi.createManyDiasAulas).toHaveBeenCalledTimes(1);
    });

    it('should return the created dias aulas from contratoApi.createManyDiasAulas', async () => {
      const id = 456;
      const diasAulasData = [
        { diaSemana: 2, horaInicio: '10:00', horaFim: '11:00' },
      ];
      const mockResponse = { data: [{ id: 1, ...diasAulasData[0] }] };
      contratoApi.createManyDiasAulas.mockResolvedValue(mockResponse);

      const result = await service.execute(id, diasAulasData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty array of dias aulas', async () => {
      const id = 789;
      const diasAulasData = [];
      const mockResponse = { data: [] };
      contratoApi.createManyDiasAulas.mockResolvedValue(mockResponse);

      await service.execute(id, diasAulasData);

      expect(contratoApi.createManyDiasAulas).toHaveBeenCalledWith(id, []);
    });

    it('should handle single dia aula in array', async () => {
      const id = 101;
      const diasAulasData = [
        { diaSemana: 5, horaInicio: '08:00', horaFim: '09:00' },
      ];
      const mockResponse = { data: [{ id: 5, ...diasAulasData[0] }] };
      contratoApi.createManyDiasAulas.mockResolvedValue(mockResponse);

      const result = await service.execute(id, diasAulasData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle multiple dias aulas for different weekdays', async () => {
      const id = 202;
      const diasAulasData = [
        { diaSemana: 1, horaInicio: '09:00', horaFim: '10:00' },
        { diaSemana: 3, horaInicio: '09:00', horaFim: '10:00' },
        { diaSemana: 5, horaInicio: '09:00', horaFim: '10:00' },
      ];
      const mockResponse = { data: diasAulasData };
      contratoApi.createManyDiasAulas.mockResolvedValue(mockResponse);

      const result = await service.execute(id, diasAulasData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle error from contratoApi.createManyDiasAulas', async () => {
      const id = 303;
      const diasAulasData = [{ diaSemana: 1 }];
      const error = new Error('Failed to create dias aulas');
      contratoApi.createManyDiasAulas.mockRejectedValue(error);

      await expect(service.execute(id, diasAulasData)).rejects.toThrow(
        'Failed to create dias aulas'
      );
    });

    it('should handle string id', async () => {
      const id = 'abc123';
      const diasAulasData = [{ diaSemana: 2 }];
      const mockResponse = { data: diasAulasData };
      contratoApi.createManyDiasAulas.mockResolvedValue(mockResponse);

      await service.execute(id, diasAulasData);

      expect(contratoApi.createManyDiasAulas).toHaveBeenCalledWith(
        id,
        diasAulasData
      );
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute', async () => {
      const id = 999;
      const diasAulasData = [
        { diaSemana: 4, horaInicio: '10:00', horaFim: '11:00' },
      ];
      const mockResponse = { data: diasAulasData };
      ContratoApi.mockImplementation(() => ({
        createManyDiasAulas: jest.fn().mockResolvedValue(mockResponse),
      }));

      const result = await CreateManyDiasAulasService.handle(id, diasAulasData);

      expect(result).toEqual(mockResponse);
    });

    it('should create new ContratoApi instance', async () => {
      const id = 888;
      const diasAulasData = [];
      ContratoApi.mockImplementation(() => ({
        createManyDiasAulas: jest.fn().mockResolvedValue({ data: [] }),
      }));

      const instancesCountBefore = ContratoApi.mock.instances.length;
      await CreateManyDiasAulasService.handle(id, diasAulasData);

      expect(ContratoApi.mock.instances.length).toBeGreaterThan(
        instancesCountBefore
      );
    });

    it('should handle errors in static method', async () => {
      const id = 777;
      const diasAulasData = [{ diaSemana: 6 }];
      const error = new Error('Static method error');
      ContratoApi.mockImplementation(() => ({
        createManyDiasAulas: jest.fn().mockRejectedValue(error),
      }));

      await expect(
        CreateManyDiasAulasService.handle(id, diasAulasData)
      ).rejects.toThrow('Static method error');
    });
  });
});
