import { DeleteProfessorService } from './deleteProfessorService';
import { ProfessorApi } from '@/store/api/professorApi';

// Mock da ProfessorApi
jest.mock('@/store/api/professorApi');

describe('DeleteProfessorService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      delete: jest.fn(),
    };

    service = new DeleteProfessorService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided api', () => {
      expect(service.professorApi).toBe(mockApi);
    });

    it('should store api reference correctly', () => {
      const customApi = { delete: jest.fn() };
      const customService = new DeleteProfessorService(customApi);

      expect(customService.professorApi).toBe(customApi);
    });
  });

  describe('execute', () => {
    it('should call api.delete with correct ID', async () => {
      const id = 123;
      const mockResponse = { success: true };
      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await service.execute(id);

      expect(mockApi.delete).toHaveBeenCalledWith(id);
      expect(result).toBe(mockResponse);
    });

    it('should handle API errors', async () => {
      const id = 123;
      const error = new Error('API Error');
      mockApi.delete.mockRejectedValue(error);

      await expect(service.execute(id)).rejects.toThrow('API Error');
    });

    it('should work with different ID types', async () => {
      const stringId = '456';
      const mockResponse = { success: true };
      mockApi.delete.mockResolvedValue(mockResponse);

      await service.execute(stringId);

      expect(mockApi.delete).toHaveBeenCalledWith(stringId);
    });
  });

  describe('static handle method', () => {
    beforeEach(() => {
      // Mock dos módulos para static methods
      ProfessorApi.mockImplementation(() => mockApi);
    });

    it('should create service instance and execute', async () => {
      const id = 789;
      const mockResponse = { success: true };
      mockApi.delete.mockResolvedValue(mockResponse);

      const result = await DeleteProfessorService.handle(id);

      expect(result).toBe(mockResponse);
      expect(mockApi.delete).toHaveBeenCalledWith(id);
    });

    it('should handle errors in static method', async () => {
      const id = 123;
      const error = new Error('Static method error');
      mockApi.delete.mockRejectedValue(error);

      await expect(DeleteProfessorService.handle(id)).rejects.toThrow(
        'Static method error'
      );
    });
  });
});
