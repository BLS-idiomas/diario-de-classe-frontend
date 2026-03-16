import { GenerateAulasService } from './generateAulasService';
import { ContratoApi } from '@/store/api/contratoApi';

jest.mock('@/store/api/contratoApi');

describe('GenerateAulasService', () => {
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
    it('should call contratoApi.generateAulas with correct data', async () => {
      const generateData = {
        contratoId: 123,
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

      await service.execute(generateData);

      expect(contratoApi.generateAulas).toHaveBeenCalledWith(generateData);
      expect(contratoApi.generateAulas).toHaveBeenCalledTimes(1);
    });

    it('should return the generated aulas from contratoApi.generateAulas', async () => {
      const generateData = {
        contratoId: 456,
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

      const result = await service.execute(generateData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty data object', async () => {
      const generateData = {};
      const mockResponse = { data: [] };
      contratoApi.generateAulas.mockResolvedValue(mockResponse);

      await service.execute(generateData);

      expect(contratoApi.generateAulas).toHaveBeenCalledWith({});
    });

    it('should handle data with only startDate', async () => {
      const generateData = { contratoId: 101, startDate: '2024-03-01' };
      const mockResponse = { data: [] };
      contratoApi.generateAulas.mockResolvedValue(mockResponse);

      const result = await service.execute(generateData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle data with only endDate', async () => {
      const generateData = { contratoId: 202, endDate: '2024-03-31' };
      const mockResponse = { data: [] };
      contratoApi.generateAulas.mockResolvedValue(mockResponse);

      const result = await service.execute(generateData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle additional parameters in data', async () => {
      const generateData = {
        contratoId: 303,
        startDate: '2024-04-01',
        endDate: '2024-04-30',
        excludeHolidays: true,
        frequency: 'weekly',
      };
      const mockResponse = { data: [{ id: 1, data: '2024-04-01' }] };
      contratoApi.generateAulas.mockResolvedValue(mockResponse);

      const result = await service.execute(generateData);

      expect(result).toEqual(mockResponse);
    });

    it('should handle error from contratoApi.generateAulas', async () => {
      const generateData = { contratoId: 404, startDate: '2024-05-01' };
      const error = new Error('Failed to generate aulas');
      contratoApi.generateAulas.mockRejectedValue(error);

      await expect(service.execute(generateData)).rejects.toThrow(
        'Failed to generate aulas'
      );
    });

    it('should handle string id', async () => {
      const generateData = { contratoId: 'abc123', startDate: '2024-06-01' };
      const mockResponse = { data: [] };
      contratoApi.generateAulas.mockResolvedValue(mockResponse);

      await service.execute(generateData);

      expect(contratoApi.generateAulas).toHaveBeenCalledWith(generateData);
    });
  });

  describe('handle (static method)', () => {
    it('should create service instance and execute', async () => {
      const generateData = {
        contratoId: 999,
        startDate: '2024-07-01',
        endDate: '2024-07-31',
      };
      const mockResponse = { data: [{ id: 1, data: '2024-07-01' }] };
      ContratoApi.mockImplementation(() => ({
        generateAulas: jest.fn().mockResolvedValue(mockResponse),
      }));

      const result = await GenerateAulasService.handle({ data: generateData });

      expect(result).toEqual(mockResponse);
    });

    it('should create new ContratoApi instance', async () => {
      const generateData = { contratoId: 888 };
      ContratoApi.mockImplementation(() => ({
        generateAulas: jest.fn().mockResolvedValue({ data: [] }),
      }));

      const instancesCountBefore = ContratoApi.mock.instances.length;
      await GenerateAulasService.handle({ data: generateData });

      expect(ContratoApi.mock.instances.length).toBeGreaterThan(
        instancesCountBefore
      );
    });

    it('should handle errors in static method', async () => {
      const generateData = { contratoId: 777, startDate: '2024-08-01' };
      const error = new Error('Static method error');
      ContratoApi.mockImplementation(() => ({
        generateAulas: jest.fn().mockRejectedValue(error),
      }));

      await expect(
        GenerateAulasService.handle({ data: generateData })
      ).rejects.toThrow('Static method error');
    });
  });
});
