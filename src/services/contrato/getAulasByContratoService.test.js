import { GetAulasByContratoService } from './getAulasByContratoService';
import { ContratoApi } from '@/store/api/contratoApi';

jest.mock('@/store/api/contratoApi');

describe('GetAulasByContratoService', () => {
  let contratoApi;
  let service;

  beforeEach(() => {
    contratoApi = new ContratoApi();
    service = new GetAulasByContratoService(contratoApi);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with contratoApi', () => {
      expect(service).toBeInstanceOf(GetAulasByContratoService);
      expect(service.contratoApi).toBe(contratoApi);
    });

    it('should store the contratoApi parameter', () => {
      const customApi = new ContratoApi();
      const customService = new GetAulasByContratoService(customApi);

      expect(customService.contratoApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should call contratoApi.getAulasByContrato with correct id', async () => {
      const id = 123;
      const mockResponse = {
        data: [
          { id: 1, data: '2024-01-15', status: 'agendada' },
          { id: 2, data: '2024-01-17', status: 'realizada' },
        ],
      };
      contratoApi.getAulasByContrato.mockResolvedValue(mockResponse);

      await service.execute(id);

      expect(contratoApi.getAulasByContrato).toHaveBeenCalledWith(id);
      expect(contratoApi.getAulasByContrato).toHaveBeenCalledTimes(1);
    });

    it('should return the aulas from contratoApi.getAulasByContrato', async () => {
      const id = 456;
      const mockResponse = {
        data: [
          {
            id: 1,
            data: '2024-02-01',
            horaInicio: '09:00',
            horaFim: '10:00',
            status: 'agendada',
          },
        ],
      };
      contratoApi.getAulasByContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty aulas list', async () => {
      const id = 789;
      const mockResponse = { data: [] };
      contratoApi.getAulasByContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(0);
    });

    it('should handle multiple aulas with different statuses', async () => {
      const id = 101;
      const mockResponse = {
        data: [
          { id: 1, data: '2024-03-01', status: 'agendada' },
          { id: 2, data: '2024-03-03', status: 'realizada' },
          { id: 3, data: '2024-03-05', status: 'cancelada' },
        ],
      };
      contratoApi.getAulasByContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(3);
    });

    it('should handle error from contratoApi.getAulasByContrato', async () => {
      const id = 303;
      const error = new Error('Failed to get aulas');
      contratoApi.getAulasByContrato.mockRejectedValue(error);

      await expect(service.execute(id)).rejects.toThrow('Failed to get aulas');
    });

    it('should handle string id', async () => {
      const id = 'abc123';
      const mockResponse = { data: [] };
      contratoApi.getAulasByContrato.mockResolvedValue(mockResponse);

      await service.execute(id);

      expect(contratoApi.getAulasByContrato).toHaveBeenCalledWith(id);
    });

    it('should handle numeric zero as id', async () => {
      const id = 0;
      const mockResponse = { data: [] };
      contratoApi.getAulasByContrato.mockResolvedValue(mockResponse);

      await service.execute(id);

      expect(contratoApi.getAulasByContrato).toHaveBeenCalledWith(0);
    });

    it('should handle aulas with complete data structure', async () => {
      const id = 202;
      const mockResponse = {
        data: [
          {
            id: 1,
            data: '2024-04-01',
            horaInicio: '09:00',
            horaFim: '10:00',
            status: 'realizada',
            observacoes: 'Aula normal',
            professorId: 5,
            alunoId: 10,
          },
        ],
      };
      contratoApi.getAulasByContrato.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(result).toEqual(mockResponse);
      expect(result.data[0]).toHaveProperty('professorId');
      expect(result.data[0]).toHaveProperty('alunoId');
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute', async () => {
      const id = 999;
      const mockResponse = {
        data: [{ id: 1, data: '2024-05-01', status: 'agendada' }],
      };
      ContratoApi.mockImplementation(() => ({
        getAulasByContrato: jest.fn().mockResolvedValue(mockResponse),
      }));

      const result = await GetAulasByContratoService.handle(id);

      expect(result).toEqual(mockResponse);
    });

    it('should create new ContratoApi instance', async () => {
      const id = 888;
      ContratoApi.mockImplementation(() => ({
        getAulasByContrato: jest.fn().mockResolvedValue({ data: [] }),
      }));

      const instancesCountBefore = ContratoApi.mock.instances.length;
      await GetAulasByContratoService.handle(id);

      expect(ContratoApi.mock.instances.length).toBeGreaterThan(
        instancesCountBefore
      );
    });

    it('should handle errors in static method', async () => {
      const id = 777;
      const error = new Error('Static method error');
      ContratoApi.mockImplementation(() => ({
        getAulasByContrato: jest.fn().mockRejectedValue(error),
      }));

      await expect(GetAulasByContratoService.handle(id)).rejects.toThrow(
        'Static method error'
      );
    });
  });
});
