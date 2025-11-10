import { UpdateProfessorService } from './updateProfessorService';
import { ProfessorApi } from '@/store/api/professorApi';

jest.mock('@/store/api/professorApi');

describe('UpdateProfessorService', () => {
  let mockApi;
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApi = { update: jest.fn() };
    ProfessorApi.mockImplementation(() => mockApi);
    service = new UpdateProfessorService(mockApi);
  });

  it('should call api.update with correct parameters', async () => {
    const mockResponse = { data: { id: 123, name: 'Test' } };
    mockApi.update.mockResolvedValue(mockResponse);

    const result = await service.execute(123, { name: 'Test' });

    expect(mockApi.update).toHaveBeenCalledWith(123, { name: 'Test' });
    expect(result).toEqual(mockResponse);
  });

  it('should handle static method', async () => {
    const mockResponse = { data: { id: 123 } };
    mockApi.update.mockResolvedValue(mockResponse);

    const result = await UpdateProfessorService.handle(123, {});
    expect(result).toEqual(mockResponse);
  });
});
