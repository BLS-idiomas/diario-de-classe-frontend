import { GetDashboardService } from './getDashboardService';

// Mock DashboardApi
class MockDashboardApi {
  constructor() {
    this.getAll = jest.fn();
  }
}

describe('GetDashboardService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    mockApi = new MockDashboardApi();
    service = new GetDashboardService(mockApi);
  });

  it('should call dashboardApi.getAll with searchParam', async () => {
    const searchParam = 'test';
    const expectedResponse = { data: 'dashboard data' };
    mockApi.getAll.mockResolvedValue(expectedResponse);

    const result = await service.execute(searchParam);

    expect(mockApi.getAll).toHaveBeenCalledWith(searchParam);
    expect(result).toBe(expectedResponse);
  });

  it('static handle should instantiate service and call execute', async () => {
    // Spy on execute
    const executeSpy = jest
      .spyOn(GetDashboardService.prototype, 'execute')
      .mockResolvedValue('static result');
    const result = await GetDashboardService.handle('param');
    expect(executeSpy).toHaveBeenCalledWith('param');
    expect(result).toBe('static result');
    executeSpy.mockRestore();
  });
});
