import { GetAulaByIdService } from './getAulaByIdService';

describe('GetAulaByIdService', () => {
  const mockAulaApi = { getById: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call aulaApi.getById with id', async () => {
    const service = new GetAulaByIdService(mockAulaApi);
    mockAulaApi.getById.mockResolvedValue('aula');
    const result = await service.execute(2);
    expect(mockAulaApi.getById).toHaveBeenCalledWith(2);
    expect(result).toBe('aula');
  });
});
