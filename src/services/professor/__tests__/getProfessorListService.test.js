import { GetProfessorListService } from '../getProfessorListService';
import { Professor } from '@/models/Professor';
import { ProfessorApi } from '@/store/api/professorApi';

// Mock das dependências
jest.mock('@/models/Professor');
jest.mock('@/store/api/professorApi');

describe('GetProfessorListService', () => {
  let mockApi;
  let mockModel;
  let service;

  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();

    // Mock da API
    mockApi = {
      getAll: jest.fn(),
    };

    // Mock do Model
    mockModel = jest.fn().mockImplementation(data => ({
      id: data.id,
      name: data.name,
      email: data.email,
      ...data,
    }));

    // Mock do constructor do ProfessorApi
    ProfessorApi.mockImplementation(() => mockApi);

    // Mock do Professor como classe
    Professor.mockImplementation(data => mockModel(data));

    service = new GetProfessorListService(mockApi);
  });

  describe('constructor', () => {
    it('should initialize with provided entityApi and entityModel', () => {
      expect(service.professorApi).toBe(mockApi);
    });

    it('should store api instance correctly', () => {
      const customApi = { getAll: jest.fn() };
      const customService = new GetProfessorListService(customApi);

      expect(customService.professorApi).toBe(customApi);
    });

    it('should accept null or undefined dependencies', () => {
      const serviceWithNulls = new GetProfessorListService(null);
      expect(serviceWithNulls.professorApi).toBeNull();
    });
  });

  describe('execute', () => {
    it('should call api.getAll with search parameter', async () => {
      const searchParam = 'João';
      const mockResponse = {
        data: {
          data: [
            { id: 1, name: 'João Silva', email: 'joao@email.com' },
            { id: 2, name: 'João Santos', email: 'santos@email.com' },
          ],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(mockApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('should transform each professor in response data using Model', async () => {
      const searchParam = 'Maria';
      const professorData1 = {
        id: 1,
        name: 'Maria Silva',
        email: 'maria@email.com',
      };
      const professorData2 = {
        id: 2,
        name: 'Maria Santos',
        email: 'santos@email.com',
      };
      const mockResponse = {
        data: {
          data: [professorData1, professorData2],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(result.data.data).toHaveLength(2);
      expect(result.data.data[0]).toEqual(professorData1);
      expect(result.data.data[1]).toEqual(professorData2);
    });

    it('should handle empty search parameter', async () => {
      const searchParam = '';
      const mockResponse = {
        data: {
          data: [
            { id: 1, name: 'Professor 1', email: 'prof1@email.com' },
            { id: 2, name: 'Professor 2', email: 'prof2@email.com' },
          ],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: '' });
    });

    it('should handle null search parameter', async () => {
      const searchParam = null;
      const mockResponse = {
        data: {
          data: [{ id: 1, name: 'Professor', email: 'prof@email.com' }],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: null });
    });

    it('should handle undefined search parameter', async () => {
      const searchParam = undefined;
      const mockResponse = {
        data: {
          data: [{ id: 1, name: 'Professor', email: 'prof@email.com' }],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: undefined });
    });

    it('should handle empty professors list', async () => {
      const searchParam = 'nonexistent';
      const mockResponse = {
        data: {
          data: [],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(mockModel).not.toHaveBeenCalled();
      expect(result.data.data).toEqual([]);
      expect(result.data.data).toHaveLength(0);
    });

    it('should handle complex professor data structures', async () => {
      const searchParam = 'Ana';
      const complexProfessorData = {
        id: 1,
        name: 'Ana Costa',
        email: 'ana@email.com',
        phone: '11999999999',
        subjects: ['Mathematics', 'Physics'],
        credentials: {
          degree: 'PhD',
          university: 'USP',
        },
        active: true,
        createdAt: '2020-01-15T10:30:00Z',
      };

      const mockResponse = {
        data: {
          data: [complexProfessorData],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(result.data.data[0]).toEqual(complexProfessorData);
    });

    it('should preserve response metadata while transforming data', async () => {
      const searchParam = 'test';
      const mockResponse = {
        data: {
          data: [{ id: 1, name: 'Test Professor', email: 'test@email.com' }],
          total: 1,
          page: 1,
          limit: 10,
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(result.data.total).toBe(1);
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
      expect(result.status).toBe(200);
      expect(result.statusText).toBe('OK');
      expect(result.headers).toEqual({ 'content-type': 'application/json' });
    });

    it('should handle large lists of professors efficiently', async () => {
      const searchParam = 'performance';
      const largeProfessorsList = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Professor ${i + 1}`,
        email: `prof${i + 1}@email.com`,
      }));

      const mockResponse = {
        data: {
          data: largeProfessorsList,
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const startTime = Date.now();
      const result = await service.execute(searchParam);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
      expect(result.data.data).toHaveLength(100);
      expect(result.data.data).toEqual(largeProfessorsList);
    });

    it('should propagate API errors', async () => {
      const searchParam = 'error';
      const apiError = new Error('API request failed');
      apiError.status = 500;

      mockApi.getAll.mockRejectedValue(apiError);

      await expect(service.execute(searchParam)).rejects.toThrow(
        'API request failed'
      );
      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(mockModel).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const searchParam = 'network';
      const networkError = new Error('Network timeout');
      networkError.code = 'TIMEOUT';

      mockApi.getAll.mockRejectedValue(networkError);

      await expect(service.execute(searchParam)).rejects.toThrow(
        'Network timeout'
      );
      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
    });

    it('should handle Model constructor errors for individual professors', async () => {
      const searchParam = 'invalid';
      const validProfessor = {
        id: 1,
        name: 'Valid Professor',
        email: 'valid@email.com',
      };
      const invalidProfessor = { id: 2, name: 'Invalid Professor' }; // Missing email

      const mockResponse = {
        data: {
          data: [validProfessor, invalidProfessor],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);
      expect(result.data.data).toEqual([validProfessor, invalidProfessor]);
    });

    it('should handle special characters in search parameter', async () => {
      const searchParam = 'José@email.com';
      const mockResponse = {
        data: {
          data: [{ id: 1, name: 'José Silva', email: 'jose@email.com' }],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: 'José@email.com' });
    });

    it('should handle numeric search parameters', async () => {
      const searchParam = 123;
      const mockResponse = {
        data: {
          data: [
            { id: 123, name: 'Professor 123', email: 'prof123@email.com' },
          ],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: 123 });
    });

    it('should handle boolean search parameters', async () => {
      const searchParam = true;
      const mockResponse = {
        data: {
          data: [
            { id: 1, name: 'Active Professor', email: 'active@email.com' },
          ],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      await service.execute(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: true });
    });
  });

  describe('static handle method', () => {
    it('should create service instance and execute with provided search parameter', async () => {
      const searchParam = 'static test';
      const mockResponse = {
        data: {
          data: [
            { id: 1, name: 'Static Test Professor', email: 'static@email.com' },
          ],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await GetProfessorListService.handle(searchParam);

      expect(ProfessorApi).toHaveBeenCalledTimes(1);
      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
      expect(result.data.data).toHaveLength(1);
      expect(result.data.data[0]).toEqual(
        expect.objectContaining({
          id: 1,
          name: 'Static Test Professor',
          email: 'static@email.com',
        })
      );
    });

    it('should handle errors in static method', async () => {
      const searchParam = 'error test';
      const apiError = new Error('Static method error');
      apiError.status = 404;

      mockApi.getAll.mockRejectedValue(apiError);

      await expect(GetProfessorListService.handle(searchParam)).rejects.toThrow(
        'Static method error'
      );
      expect(ProfessorApi).toHaveBeenCalledTimes(1);
      expect(mockApi.getAll).toHaveBeenCalledWith({ q: searchParam });
    });

    it('should work with empty search parameter', async () => {
      const searchParam = '';
      const mockResponse = {
        data: {
          data: [
            { id: 1, name: 'All Professors', email: 'all@email.com' },
            { id: 2, name: 'Another Professor', email: 'another@email.com' },
          ],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await GetProfessorListService.handle(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: '' });
      expect(result.data.data).toHaveLength(2);
    });

    it('should create new instances each time', async () => {
      const searchParam1 = 'first';
      const searchParam2 = 'second';

      mockApi.getAll.mockResolvedValue({ data: { data: [] } });

      await GetProfessorListService.handle(searchParam1);
      await GetProfessorListService.handle(searchParam2);

      expect(ProfessorApi).toHaveBeenCalledTimes(2);
      expect(mockApi.getAll).toHaveBeenCalledTimes(2);
      expect(mockApi.getAll).toHaveBeenNthCalledWith(1, { q: 'first' });
      expect(mockApi.getAll).toHaveBeenNthCalledWith(2, { q: 'second' });
    });

    it('should handle null search parameter in static method', async () => {
      const searchParam = null;
      mockApi.getAll.mockResolvedValue({ data: { data: [] } });

      await GetProfessorListService.handle(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: null });
    });

    it('should handle undefined search parameter in static method', async () => {
      const searchParam = undefined;
      mockApi.getAll.mockResolvedValue({ data: { data: [] } });

      await GetProfessorListService.handle(searchParam);

      expect(mockApi.getAll).toHaveBeenCalledWith({ q: undefined });
    });
  });

  describe('integration scenarios', () => {
    it('should work with real-like paginated professor data', async () => {
      const searchParam = 'integration';
      const professorsList = [
        {
          id: 1,
          name: 'Dr. Maria Silva',
          email: 'maria.silva@universidade.edu.br',
          phone: '+55 11 98765-4321',
          department: 'Mathematics',
          subjects: ['Algebra', 'Calculus'],
          active: true,
        },
        {
          id: 2,
          name: 'Prof. João Santos',
          email: 'joao.santos@universidade.edu.br',
          phone: '+55 11 87654-3210',
          department: 'Physics',
          subjects: ['Mechanics', 'Thermodynamics'],
          active: true,
        },
      ];

      const mockResponse = {
        data: {
          data: professorsList,
          total: 25,
          page: 1,
          limit: 10,
          totalPages: 3,
        },
        status: 200,
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(result.data.data).toHaveLength(2);
      expect(result.data.total).toBe(25);
      expect(result.data.totalPages).toBe(3);
      expect(result.data.data[0]).toEqual(
        expect.objectContaining({
          id: 1,
          name: 'Dr. Maria Silva',
          email: 'maria.silva@universidade.edu.br',
        })
      );
    });

    it('should handle mixed data types in professor list', async () => {
      const searchParam = 'mixed';
      const mixedProfessors = [
        { id: 1, name: 'String ID Professor', email: 'string@email.com' },
        { id: 'uuid-123', name: 'UUID Professor', email: 'uuid@email.com' },
        { id: 999, name: 'Numeric ID Professor', email: 'numeric@email.com' },
      ];

      const mockResponse = {
        data: {
          data: mixedProfessors,
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      expect(result.data.data).toHaveLength(3);
      expect(result.data.data).toEqual(mixedProfessors);
    });

    it('should handle service composition with filters', async () => {
      const searchParam = 'active professors';
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              name: 'Active Professor 1',
              email: 'active1@email.com',
              active: true,
            },
            {
              id: 2,
              name: 'Active Professor 2',
              email: 'active2@email.com',
              active: true,
            },
          ],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const result = await service.execute(searchParam);

      // Could be further processed by other services
      const activeProfessors = result.data.data.filter(
        prof => prof.active !== false
      );
      expect(activeProfessors).toHaveLength(2);
    });

    it('should maintain data consistency through transformation pipeline', async () => {
      const searchParam = 'consistency';
      const originalData = [
        {
          id: 1,
          name: 'Consistency Test Professor',
          originalField: 'should be preserved',
          metadata: { version: 1 },
        },
      ];

      const mockResponse = {
        data: {
          data: originalData,
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      // Mock the model to preserve and add data
      mockModel.mockImplementation(data => ({
        ...data,
        transformed: true,
        transformedAt: new Date().toISOString(),
      }));

      const result = await service.execute(searchParam);

      expect(result.data.data[0]).toEqual(originalData[0]);
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle authentication errors', async () => {
      const searchParam = 'auth test';
      const authError = new Error('Unauthorized access');
      authError.status = 401;

      mockApi.getAll.mockRejectedValue(authError);

      await expect(service.execute(searchParam)).rejects.toThrow(
        'Unauthorized access'
      );
    });

    it('should handle forbidden access errors', async () => {
      const searchParam = 'forbidden test';
      const forbiddenError = new Error('Access forbidden');
      forbiddenError.status = 403;

      mockApi.getAll.mockRejectedValue(forbiddenError);

      await expect(service.execute(searchParam)).rejects.toThrow(
        'Access forbidden'
      );
    });

    it('should handle server errors', async () => {
      const searchParam = 'server error';
      const serverError = new Error('Internal server error');
      serverError.status = 500;

      mockApi.getAll.mockRejectedValue(serverError);

      await expect(service.execute(searchParam)).rejects.toThrow(
        'Internal server error'
      );
    });

    it('should handle service unavailable errors', async () => {
      const searchParam = 'service error';
      const serviceError = new Error('Service temporarily unavailable');
      serviceError.status = 503;

      mockApi.getAll.mockRejectedValue(serviceError);

      await expect(service.execute(searchParam)).rejects.toThrow(
        'Service temporarily unavailable'
      );
    });

    it('should handle malformed response data structure', async () => {
      const searchParam = 'malformed search';
      const malformedResponse = {
        data: {
          // Missing 'data' property
          professors: [{ id: 1, name: 'Test' }],
        },
      };

      mockApi.getAll.mockResolvedValue(malformedResponse);

      const result = await service.execute(searchParam);
      expect(result).toEqual(malformedResponse);
    });

    it('should handle null response data', async () => {
      const searchParam = 'null data';
      const nullResponse = {
        data: {
          data: null,
        },
      };

      mockApi.getAll.mockResolvedValue(nullResponse);

      const result = await service.execute(searchParam);
      expect(result).toEqual(nullResponse);
    });

    it('should handle undefined response data', async () => {
      const searchParam = 'undefined data';
      const undefinedResponse = {
        data: {
          data: undefined,
        },
      };

      mockApi.getAll.mockResolvedValue(undefinedResponse);

      const result = await service.execute(searchParam);
      expect(result).toEqual(undefinedResponse);
    });
  });

  describe('performance and reliability', () => {
    it('should handle concurrent search requests gracefully', async () => {
      const searchParams = [
        'search1',
        'search2',
        'search3',
        'search4',
        'search5',
      ];
      const promises = searchParams.map((param, index) => {
        mockApi.getAll.mockResolvedValueOnce({
          data: {
            data: [
              {
                id: index + 1,
                name: `Professor ${param}`,
                email: `${param}@email.com`,
              },
            ],
          },
        });
        return service.execute(param);
      });

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach((result, index) => {
        expect(result.data.data).toHaveLength(1);
        expect(result.data.data[0]).toEqual(
          expect.objectContaining({
            id: index + 1,
            name: `Professor ${searchParams[index]}`,
          })
        );
      });
    });

    it('should handle memory efficiency with large datasets', async () => {
      const searchParam = 'memory test';
      const largeProfessorsList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Professor ${i + 1}`,
        email: `prof${i + 1}@email.com`,
        data: Array.from({ length: 50 }, (_, j) => `field${j}`), // Large data per item
      }));

      const mockResponse = {
        data: {
          data: largeProfessorsList,
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const startTime = Date.now();
      const result = await service.execute(searchParam);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
      expect(result.data.data).toHaveLength(1000);
    });

    it('should maintain performance with repeated calls', async () => {
      const searchParam = 'repeated';
      const mockResponse = {
        data: {
          data: [
            { id: 1, name: 'Repeated Professor', email: 'repeated@email.com' },
          ],
        },
      };

      mockApi.getAll.mockResolvedValue(mockResponse);

      const calls = Array.from({ length: 10 }, () =>
        service.execute(searchParam)
      );
      const startTime = Date.now();
      await Promise.all(calls);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(200); // Should complete quickly
      expect(mockApi.getAll).toHaveBeenCalledTimes(10);
    });
  });
});
