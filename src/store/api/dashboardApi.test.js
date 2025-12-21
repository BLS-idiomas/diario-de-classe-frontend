import { DashboardApi } from './dashboardApi';

// Mock AuthenticatedApi
jest.mock('./authenticatedApi', () => {
  return {
    AuthenticatedApi: class {
      get = jest.fn();
    },
  };
});

describe('DashboardApi', () => {
  let api;

  beforeEach(() => {
    api = new DashboardApi();
  });

  it('should set baseEndpoint to /dashboard', () => {
    expect(api.baseEndpoint).toBe('/dashboard');
  });

  it('should call get with correct endpoint and params in getAll', async () => {
    const params = { q: 'search' };
    const expectedResponse = { data: 'dashboard' };
    api.get.mockResolvedValue(expectedResponse);

    const result = await api.getAll(params);

    expect(api.get).toHaveBeenCalledWith('/dashboard', params);
    expect(result).toBe(expectedResponse);
  });

  it('should call get with empty params if none provided', async () => {
    api.get.mockResolvedValue('empty');
    await api.getAll();
    expect(api.get).toHaveBeenCalledWith('/dashboard', {});
  });
});
