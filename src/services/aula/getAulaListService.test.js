import { GetAulaListService } from './getAulaListService';
import { AulaApi } from '@/store/api/aulaApi';

jest.mock('@/store/api/aulaApi');

describe('GetAulaListService', () => {
  let mockAulaApi;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAulaApi = { getAll: jest.fn() };
    service = new GetAulaListService(mockAulaApi);
  });

  describe('execute', () => {
    it('should call aulaApi.getAll with provided params', async () => {
      const mockParams = {
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
      };
      mockAulaApi.getAll.mockResolvedValue(['aula1', 'aula2']);

      const result = await service.execute(mockParams);

      expect(mockAulaApi.getAll).toHaveBeenCalledWith(mockParams);
      expect(result).toEqual(['aula1', 'aula2']);
    });

    it('should return empty array when no aulas found', async () => {
      mockAulaApi.getAll.mockResolvedValue([]);

      const result = await service.execute({});

      expect(result).toEqual([]);
    });

    it('should propagate errors from aulaApi.getAll', async () => {
      const mockError = new Error('API Error');
      mockAulaApi.getAll.mockRejectedValue(mockError);

      await expect(service.execute({})).rejects.toThrow('API Error');
    });

    it('should handle complex filter params', async () => {
      const mockParams = {
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        idProfessor: '123',
        idAluno: '456',
      };
      mockAulaApi.getAll.mockResolvedValue(['aula1']);

      await service.execute(mockParams);

      expect(mockAulaApi.getAll).toHaveBeenCalledWith(mockParams);
    });
  });

  describe('static handle method', () => {
    it('should create service instance and execute with params', async () => {
      const mockParams = { dataInicio: '2024-01-01' };
      AulaApi.mockImplementation(() => mockAulaApi);
      mockAulaApi.getAll.mockResolvedValue(['aula1']);

      const result = await GetAulaListService.handle(mockParams);

      expect(result).toEqual(['aula1']);
    });

    it('should create new AulaApi instance', async () => {
      AulaApi.mockImplementation(() => mockAulaApi);
      mockAulaApi.getAll.mockResolvedValue([]);

      await GetAulaListService.handle({});

      expect(AulaApi).toHaveBeenCalled();
    });
  });
});
