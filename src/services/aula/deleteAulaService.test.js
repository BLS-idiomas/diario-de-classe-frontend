import { DeleteAulaService } from './deleteAulaService';

describe('DeleteAulaService', () => {
  const mockAulaApi = { delete: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call aulaApi.delete with id', async () => {
    const service = new DeleteAulaService(mockAulaApi);
    mockAulaApi.delete.mockResolvedValue('deleted');
    const result = await service.execute(1);
    expect(mockAulaApi.delete).toHaveBeenCalledWith(1);
    expect(result).toBe('deleted');
  });
});
