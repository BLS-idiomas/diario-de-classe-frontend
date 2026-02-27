import { GenerateAulasService } from './generateAulasService';
import { ContratoApi } from '@/store/api/contratoApi';

jest.mock('@/store/api/contratoApi');

describe.skip('GenerateAulasService', () => {
  let contratoApi;
  let service;

  beforeEach(() => {
    contratoApi = new ContratoApi();
    service = new GenerateAulasService(contratoApi);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with contratoApi', () => {
      expect(service).toBeInstanceOf(GenerateAulasService);
      expect(service.contratoApi).toBe(contratoApi);
    });

    it('should store the contratoApi parameter', () => {
      const customApi = new ContratoApi();
      const customService = new GenerateAulasService(customApi);

      expect(customService.contratoApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should call contratoApi.generateAulas with correct id and data', async () => {
      const id = 123;
      const generateData = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };
      const mockResponse = {
        data: [
          { id: 1, data: '2024-01-15' },
          { id: 2, data: '2024-01-17' },
        ],
      };
      contratoApi.generateAulas.mockResolvedValue(mockResponse);

      await service.execute(id, generateData);

      expect(contratoApi.generateAulas).toHaveBeenCalledWith(id, generateData);
      expect(contratoApi.generateAulas).toHaveBeenCalledTimes(1);
    });

    it('should return the generated aulas from contratoApi.generateAulas', async () => {
      const id = 456;
      const generateData = {
        startDate: '2024-02-01',
        endDate: '2024-02-28',
      };
      const mockResponse = {
        data: [
          { id: 1, data: '2024-02-01' },
          { id: 2, data: '2024-02-05' },
        ],
      };
      contratoApi.generateAulas.mockResolvedValue(mockResponse);

      const result = await service.execute(id, generateData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty data object', async () => {
      const id = 789;
      const generateData = {};
      const mockResponse = { data: [] };
      contratoApi.generateAulas.mockResolvedValue(mockResponse);

      await service.execute(id, generateData);

      expect(contratoApi.generateAulas).toHaveBeenCalledWith(id, {});
    });

    it('should handle data with only startDate', async () => {
      const id = 101;
      const generateData = { startDate: '2024-03-01' };
      const mockResponse = { data: [] };
      contratoApi.generateAulas.mockResolvedValue(mockResponse);

      const result = await service.execute(id, generateData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle data with only endDate', async () => {
      const id = 202;
      const generateData = { endDate: '2024-03-31' };
      const mockResponse = { data: [] };
      contratoApi.generateAulas.mockResolvedValue(mockResponse);

      const result = await service.execute(id, generateData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle additional parameters in data', async () => {
      const id = 303;
      const generateData = {
        startDate: '2024-04-01',
        endDate: '2024-04-30',
        excludeHolidays: true,
        frequency: 'weekly',
      };
      const mockResponse = { data: [{ id: 1, data: '2024-04-01' }] };
      contratoApi.generateAulas.mockResolvedValue(mockResponse);

      const result = await service.execute(id, generateData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle error from contratoApi.generateAulas', async () => {
      const id = 404;
      const generateData = { startDate: '2024-05-01' };
      const error = new Error('Failed to generate aulas');
      contratoApi.generateAulas.mockRejectedValue(error);

      await expect(service.execute(id, generateData)).rejects.toThrow(
        'Failed to generate aulas'
      );
    });

    it('should handle string id', async () => {
      const id = 'abc123';
      const generateData = { startDate: '2024-06-01' };
      const mockResponse = { data: [] };
      contratoApi.generateAulas.mockResolvedValue(mockResponse);

      await service.execute(id, generateData);

      expect(contratoApi.generateAulas).toHaveBeenCalledWith(id, generateData);
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute', async () => {
      const id = 999;
      const generateData = {
        startDate: '2024-07-01',
        endDate: '2024-07-31',
      };
      const mockResponse = { data: [{ id: 1, data: '2024-07-01' }] };
      ContratoApi.mockImplementation(() => ({
        generateAulas: jest.fn().mockResolvedValue(mockResponse),
      }));

      const result = await GenerateAulasService.handle(id, generateData);

      expect(result).toEqual(mockResponse);
    });

    it('should create new ContratoApi instance', async () => {
      const id = 888;
      const generateData = {};
      ContratoApi.mockImplementation(() => ({
        generateAulas: jest.fn().mockResolvedValue({ data: [] }),
      }));

      const instancesCountBefore = ContratoApi.mock.instances.length;
      await GenerateAulasService.handle(id, generateData);

      expect(ContratoApi.mock.instances.length).toBeGreaterThan(
        instancesCountBefore
      );
    });

    it('should handle errors in static method', async () => {
      const id = 777;
      const generateData = { startDate: '2024-08-01' };
      const error = new Error('Static method error');
      ContratoApi.mockImplementation(() => ({
        generateAulas: jest.fn().mockRejectedValue(error),
      }));

      await expect(
        GenerateAulasService.handle(id, generateData)
      ).rejects.toThrow('Static method error');
    });
  });
});
