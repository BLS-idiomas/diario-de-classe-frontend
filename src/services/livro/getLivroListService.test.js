import { GetLivroListService } from './getLivroListService';

describe('GetLivroListService', () => {
  const mockApi = { getAll: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama getAll repassando o argumento', async () => {
    const service = new GetLivroListService(mockApi);
    mockApi.getAll.mockResolvedValue('ok');

    const result = await service.execute('interchange');

    expect(mockApi.getAll).toHaveBeenCalledWith({ q: 'interchange' });
    expect(result).toBe('ok');
  });

  it('propaga erro do api', async () => {
    const service = new GetLivroListService(mockApi);
    mockApi.getAll.mockRejectedValue(new Error('falhou'));

    await expect(service.execute('interchange')).rejects.toThrow('falhou');
  });
});
