import { GetAulaListService } from './getAulaListService';

describe('GetAulaListService', () => {
  const mockAulaApi = { getAll: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call aulaApi.getAll with searchParam', async () => {
    const service = new GetAulaListService(mockAulaApi);
    mockAulaApi.getAll.mockResolvedValue(['aula1', 'aula2']);
    const result = await service.execute('abc');
    expect(mockAulaApi.getAll).toHaveBeenCalledWith({ q: 'abc' });
    expect(result).toEqual(['aula1', 'aula2']);
  });
});
