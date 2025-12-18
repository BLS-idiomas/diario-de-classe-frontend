import { GetDiasAulasByContratoService } from './getDiasAulasByContratoService';
import { ContratoApi } from '@/store/api/contratoApi';

jest.mock('@/store/api/contratoApi');

describe('GetDiasAulasByContratoService', () => {
  let contratoApi;
  let service;

  beforeEach(() => {
    contratoApi = new ContratoApi();
    service = new GetDiasAulasByContratoService(contratoApi);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with contratoApi', () => {
      expect(service).toBeInstanceOf(GetDiasAulasByContratoService);
      expect(service.contratoApi).toBe(contratoApi);
    });

    it('should store the contratoApi parameter', () => {
      const customApi = new ContratoApi();
      const customService = new GetDiasAulasByContratoService(customApi);

      expect(customService.contratoApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should call contratoApi.getDiasAulasByContrato with correct id', async () => {
      const id = 123;
      const mockResponse = {
        data: [
          { id: 1, diaSemana: 1, horaInicio: '09:00', horaFim: '10:00' },
          { id: 2, diaSemana: 3, horaInicio: '14:00', horaFim: '15:00' },
        ],
      };
      contratoApi.getDiasAulasByContrato.mockResolvedValue(mockResponse);

      await service.execute(id);

      expect(contratoApi.getDiasAulasByContrato).toHaveBeenCalledWith(id);
      expect(contratoApi.getDiasAulasByContrato).toHaveBeenCalledTimes(1);
    });

    it('should return the dias aulas from contratoApi.getDiasAulasByContrato', async () => {
      const id = 456;
      const mockResponse = {
        data: [
          {
            id: 1,
            diaSemana: 2,
            horaInicio: '10:00',
            horaFim: '11:00',
          },
        ],
      };
      contratoApi.getDiasAulasByContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty dias aulas list', async () => {
      const id = 789;
      const mockResponse = { data: [] };
      contratoApi.getDiasAulasByContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(0);
    });

    it('should handle multiple dias aulas for different weekdays', async () => {
      const id = 101;
      const mockResponse = {
        data: [
          { id: 1, diaSemana: 1, horaInicio: '09:00', horaFim: '10:00' },
          { id: 2, diaSemana: 3, horaInicio: '09:00', horaFim: '10:00' },
          { id: 3, diaSemana: 5, horaInicio: '09:00', horaFim: '10:00' },
        ],
      };
      contratoApi.getDiasAulasByContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(3);
    });

    it('should handle error from contratoApi.getDiasAulasByContrato', async () => {
      const id = 303;
      const error = new Error('Failed to get dias aulas');
      contratoApi.getDiasAulasByContrato.mockRejectedValue(error);

      await expect(service.execute(id)).rejects.toThrow(
        'Failed to get dias aulas'
      );
    });

    it('should handle string id', async () => {
      const id = 'abc123';
      const mockResponse = { data: [] };
      contratoApi.getDiasAulasByContrato.mockResolvedValue(mockResponse);

      await service.execute(id);

      expect(contratoApi.getDiasAulasByContrato).toHaveBeenCalledWith(id);
    });

    it('should handle numeric zero as id', async () => {
      const id = 0;
      const mockResponse = { data: [] };
      contratoApi.getDiasAulasByContrato.mockResolvedValue(mockResponse);

      await service.execute(id);

      expect(contratoApi.getDiasAulasByContrato).toHaveBeenCalledWith(0);
    });

    it('should handle dias aulas with complete data structure', async () => {
      const id = 202;
      const mockResponse = {
        data: [
          {
            id: 1,
            diaSemana: 2,
            horaInicio: '09:00',
            horaFim: '10:00',
            professorId: 5,
            observacoes: 'Terça-feira',
          },
        ],
      };
      contratoApi.getDiasAulasByContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
      expect(result.data[0]).toHaveProperty('diaSemana');
      expect(result.data[0]).toHaveProperty('professorId');
    });

    it('should handle all weekdays (0-6)', async () => {
      const id = 303;
      const mockResponse = {
        data: [
          { id: 1, diaSemana: 0, horaInicio: '09:00', horaFim: '10:00' },
          { id: 2, diaSemana: 1, horaInicio: '09:00', horaFim: '10:00' },
          { id: 3, diaSemana: 2, horaInicio: '09:00', horaFim: '10:00' },
          { id: 4, diaSemana: 3, horaInicio: '09:00', horaFim: '10:00' },
          { id: 5, diaSemana: 4, horaInicio: '09:00', horaFim: '10:00' },
          { id: 6, diaSemana: 5, horaInicio: '09:00', horaFim: '10:00' },
          { id: 7, diaSemana: 6, horaInicio: '09:00', horaFim: '10:00' },
        ],
      };
      contratoApi.getDiasAulasByContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(7);
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute', async () => {
      const id = 999;
      const mockResponse = {
        data: [{ id: 1, diaSemana: 1, horaInicio: '10:00', horaFim: '11:00' }],
      };
      ContratoApi.mockImplementation(() => ({
        getDiasAulasByContrato: jest.fn().mockResolvedValue(mockResponse),
      }));

      const result = await GetDiasAulasByContratoService.handle(id);

      expect(result).toEqual(mockResponse);
    });

    it('should create new ContratoApi instance', async () => {
      const id = 888;
      ContratoApi.mockImplementation(() => ({
        getDiasAulasByContrato: jest.fn().mockResolvedValue({ data: [] }),
      }));

      const instancesCountBefore = ContratoApi.mock.instances.length;
      await GetDiasAulasByContratoService.handle(id);

      expect(ContratoApi.mock.instances.length).toBeGreaterThan(
        instancesCountBefore
      );
    });

    it('should handle errors in static method', async () => {
      const id = 777;
      const error = new Error('Static method error');
      ContratoApi.mockImplementation(() => ({
        getDiasAulasByContrato: jest.fn().mockRejectedValue(error),
      }));

      await expect(GetDiasAulasByContratoService.handle(id)).rejects.toThrow(
        'Static method error'
      );
    });
  });
});
