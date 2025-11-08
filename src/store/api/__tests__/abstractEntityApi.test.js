import { AbstractEntityApi } from '../abstractEntityApi';

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock do axios
const mockAxiosInstance = {
  defaults: {
    headers: {
      common: {},
    },
  },
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// Mock do axios create
jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
}));

// Classe concreta para teste (implementa getEndpoint)
class TestEntityApi extends AbstractEntityApi {
  getEndpoint() {
    return '/test-entities';
  }
}

// Classe que não implementa getEndpoint para testar erro
class InvalidEntityApi extends AbstractEntityApi {
  // Não implementa getEndpoint
}

describe('AbstractEntityApi', () => {
  let testEntityApi;

  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('test-token');

    testEntityApi = new TestEntityApi();
  });

  describe('constructor', () => {
    it('should extend AuthenticatedApi and initialize correctly', () => {
      expect(testEntityApi).toBeInstanceOf(AbstractEntityApi);
      expect(testEntityApi.api).toBe(mockAxiosInstance);
    });

    it('should set baseEndpoint from getEndpoint() method', () => {
      expect(testEntityApi.baseEndpoint).toBe('/test-entities');
    });

    it('should call getEndpoint() during initialization', () => {
      const spy = jest.spyOn(TestEntityApi.prototype, 'getEndpoint');
      new TestEntityApi();
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    it('should throw error when getEndpoint() is not implemented', () => {
      expect(() => {
        new InvalidEntityApi();
      }).toThrow('getEndpoint() must be implemented in subclass');
    });
  });

  describe('getEndpoint', () => {
    it('should throw error when called directly on AbstractEntityApi', () => {
      const abstractApi = Object.create(AbstractEntityApi.prototype);
      expect(() => {
        abstractApi.getEndpoint();
      }).toThrow('getEndpoint() must be implemented in subclass');
    });

    it('should work correctly when implemented in subclass', () => {
      expect(testEntityApi.getEndpoint()).toBe('/test-entities');
    });
  });

  describe('getAll', () => {
    it('should call GET request to base endpoint', async () => {
      const mockResponse = {
        data: [
          { id: 1, name: 'Entity 1' },
          { id: 2, name: 'Entity 2' },
        ],
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await testEntityApi.getAll();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-entities', {
        params: {},
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(testEntityApi.getAll()).rejects.toThrow('Network error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-entities', {
        params: {},
      });
    });

    it('should handle empty response', async () => {
      const mockResponse = { data: [] };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await testEntityApi.getAll();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-entities', {
        params: {},
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('should call GET request to endpoint with ID', async () => {
      const mockId = 123;
      const mockResponse = {
        data: { id: mockId, name: 'Test Entity' },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await testEntityApi.getById(mockId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-entities/123', {
        params: {},
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle string IDs', async () => {
      const mockId = 'abc-123';
      const mockResponse = {
        data: { id: mockId, name: 'Test Entity' },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await testEntityApi.getById(mockId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/test-entities/abc-123',
        { params: {} }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle not found error', async () => {
      const mockError = new Error('Entity not found');
      mockError.status = 404;
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(testEntityApi.getById(999)).rejects.toThrow(
        'Entity not found'
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-entities/999', {
        params: {},
      });
    });

    it('should handle null or undefined ID', async () => {
      const mockResponse = { data: {} };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await testEntityApi.getById(null);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/test-entities/null',
        { params: {} }
      );

      await testEntityApi.getById(undefined);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/test-entities/undefined',
        { params: {} }
      );
    });
  });

  describe('create', () => {
    it('should call POST request to base endpoint with data', async () => {
      const mockData = { name: 'New Entity', description: 'Test description' };
      const mockResponse = {
        data: { id: 1, ...mockData },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await testEntityApi.create(mockData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/test-entities',
        mockData
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle validation errors', async () => {
      const mockData = { name: '' }; // Invalid data
      const mockError = new Error('Validation failed');
      mockError.status = 400;
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(testEntityApi.create(mockData)).rejects.toThrow(
        'Validation failed'
      );
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/test-entities',
        mockData
      );
    });

    it('should handle empty data object', async () => {
      const mockData = {};
      const mockResponse = { data: { id: 1 } };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await testEntityApi.create(mockData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/test-entities',
        mockData
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle null data', async () => {
      const mockResponse = { data: { id: 1 } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await testEntityApi.create(null);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/test-entities',
        null
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call PUT request to endpoint with ID and data', async () => {
      const mockId = 123;
      const mockData = {
        name: 'Updated Entity',
        description: 'Updated description',
      };
      const mockResponse = {
        data: { id: mockId, ...mockData },
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await testEntityApi.update(mockId, mockData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/test-entities/123',
        mockData
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle string IDs in update', async () => {
      const mockId = 'uuid-123';
      const mockData = { name: 'Updated Entity' };
      const mockResponse = { data: { id: mockId, ...mockData } };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await testEntityApi.update(mockId, mockData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/test-entities/uuid-123',
        mockData
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle not found error during update', async () => {
      const mockError = new Error('Entity not found for update');
      mockError.status = 404;
      mockAxiosInstance.put.mockRejectedValue(mockError);

      await expect(testEntityApi.update(999, { name: 'Test' })).rejects.toThrow(
        'Entity not found for update'
      );
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test-entities/999', {
        name: 'Test',
      });
    });

    it('should handle partial updates', async () => {
      const mockId = 1;
      const mockData = { name: 'New Name Only' }; // Partial update
      const mockResponse = {
        data: {
          id: mockId,
          name: 'New Name Only',
          description: 'Original Description',
        },
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await testEntityApi.update(mockId, mockData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/test-entities/1',
        mockData
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('remove', () => {
    it('should call DELETE request to endpoint with ID', async () => {
      const mockId = 123;
      const mockResponse = { data: { message: 'Entity deleted successfully' } };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await testEntityApi.remove(mockId);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/test-entities/123'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle string IDs in remove', async () => {
      const mockId = 'uuid-to-delete';
      const mockResponse = { data: { message: 'Deleted' } };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await testEntityApi.remove(mockId);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/test-entities/uuid-to-delete'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle not found error during remove', async () => {
      const mockError = new Error('Entity not found for deletion');
      mockError.status = 404;
      mockAxiosInstance.delete.mockRejectedValue(mockError);

      await expect(testEntityApi.remove(999)).rejects.toThrow(
        'Entity not found for deletion'
      );
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/test-entities/999'
      );
    });

    it('should handle already deleted entity', async () => {
      const mockError = new Error('Entity already deleted');
      mockError.status = 410;
      mockAxiosInstance.delete.mockRejectedValue(mockError);

      await expect(testEntityApi.remove(123)).rejects.toThrow(
        'Entity already deleted'
      );
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/test-entities/123'
      );
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete CRUD operations', async () => {
      const createData = {
        name: 'Test Entity',
        description: 'Test Description',
      };
      const updateData = {
        name: 'Updated Entity',
        description: 'Updated Description',
      };

      // Mock responses
      const createResponse = { data: { id: 1, ...createData } };
      const getResponse = { data: { id: 1, ...createData } };
      const updateResponse = { data: { id: 1, ...updateData } };
      const deleteResponse = { data: { message: 'Deleted' } };

      mockAxiosInstance.post.mockResolvedValueOnce(createResponse);
      mockAxiosInstance.get.mockResolvedValueOnce(getResponse);
      mockAxiosInstance.put.mockResolvedValueOnce(updateResponse);
      mockAxiosInstance.delete.mockResolvedValueOnce(deleteResponse);

      // Execute CRUD operations
      const created = await testEntityApi.create(createData);
      const retrieved = await testEntityApi.getById(1);
      const updated = await testEntityApi.update(1, updateData);
      const deleted = await testEntityApi.remove(1);

      // Verify all operations
      expect(created).toEqual(createResponse);
      expect(retrieved).toEqual(getResponse);
      expect(updated).toEqual(updateResponse);
      expect(deleted).toEqual(deleteResponse);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/test-entities',
        createData
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-entities/1', {
        params: {},
      });
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/test-entities/1',
        updateData
      );
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test-entities/1');
    });

    it('should work with different endpoint formats', () => {
      class CustomEntityApi extends AbstractEntityApi {
        getEndpoint() {
          return '/api/v1/custom-entities';
        }
      }

      const customApi = new CustomEntityApi();
      expect(customApi.baseEndpoint).toBe('/api/v1/custom-entities');
    });

    it('should maintain endpoint consistency across operations', async () => {
      // Mock all responses
      mockAxiosInstance.get.mockResolvedValue({ data: [] });
      mockAxiosInstance.post.mockResolvedValue({ data: { id: 1 } });
      mockAxiosInstance.put.mockResolvedValue({ data: { id: 1 } });
      mockAxiosInstance.delete.mockResolvedValue({ data: {} });

      // Execute all operations
      await testEntityApi.getAll();
      await testEntityApi.getById(1);
      await testEntityApi.create({});
      await testEntityApi.update(1, {});
      await testEntityApi.remove(1);

      // Verify all use the same base endpoint
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-entities', {
        params: {},
      });
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-entities/1', {
        params: {},
      });
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-entities', {});
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/test-entities/1',
        {}
      );
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test-entities/1');
    });
  });

  describe('edge cases', () => {
    it('should handle special characters in IDs', async () => {
      const specialId = 'test@example.com';
      mockAxiosInstance.get.mockResolvedValue({ data: {} });

      await testEntityApi.getById(specialId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/test-entities/test@example.com',
        { params: {} }
      );
    });

    it('should handle numeric zero as valid ID', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: { id: 0 } });

      await testEntityApi.getById(0);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-entities/0', {
        params: {},
      });
    });

    it('should handle boolean values as IDs', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: {} });

      await testEntityApi.getById(true);
      await testEntityApi.getById(false);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/test-entities/true',
        { params: {} }
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/test-entities/false',
        { params: {} }
      );
    });

    it('should handle complex nested data objects', async () => {
      const complexData = {
        name: 'Complex Entity',
        metadata: {
          tags: ['tag1', 'tag2'],
          settings: {
            enabled: true,
            priority: 1,
          },
        },
        items: [
          { id: 1, value: 'item1' },
          { id: 2, value: 'item2' },
        ],
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: { id: 1, ...complexData },
      });

      await testEntityApi.create(complexData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/test-entities',
        complexData
      );
    });
  });

  describe('error handling', () => {
    it('should propagate network errors', async () => {
      const networkError = new Error('Network Error');
      networkError.code = 'NETWORK_ERROR';
      mockAxiosInstance.get.mockRejectedValue(networkError);

      await expect(testEntityApi.getAll()).rejects.toThrow('Network Error');
    });

    it('should propagate authentication errors', async () => {
      const authError = new Error('Unauthorized');
      authError.status = 401;
      mockAxiosInstance.get.mockRejectedValue(authError);

      await expect(testEntityApi.getAll()).rejects.toThrow('Unauthorized');
    });

    it('should propagate server errors', async () => {
      const serverError = new Error('Internal Server Error');
      serverError.status = 500;
      mockAxiosInstance.post.mockRejectedValue(serverError);

      await expect(testEntityApi.create({})).rejects.toThrow(
        'Internal Server Error'
      );
    });
  });

  describe('inheritance and polymorphism', () => {
    it('should allow multiple subclasses with different endpoints', () => {
      class UsersApi extends AbstractEntityApi {
        getEndpoint() {
          return '/users';
        }
      }

      class ProductsApi extends AbstractEntityApi {
        getEndpoint() {
          return '/products';
        }
      }

      const usersApi = new UsersApi();
      const productsApi = new ProductsApi();

      expect(usersApi.baseEndpoint).toBe('/users');
      expect(productsApi.baseEndpoint).toBe('/products');
    });

    it('should allow method overriding in subclasses', () => {
      class CustomEntityApi extends AbstractEntityApi {
        getEndpoint() {
          return '/custom';
        }

        async getAll() {
          // Custom implementation
          return { custom: true };
        }
      }

      const customApi = new CustomEntityApi();
      expect(customApi.getAll()).resolves.toEqual({ custom: true });
    });
  });
});
