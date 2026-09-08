import { GetLivroByIdService } from './getLivroByIdService';

describe('GetLivroByIdService', () => {
  const mockApi = { getById: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama getById repassando o argumento', async () => {
    const service = new GetLivroByIdService(mockApi);
    mockApi.getById.mockResolvedValue('ok');

    const result = await service.execute('livro-1');

    expect(mockApi.getById).toHaveBeenCalledWith('livro-1');
    expect(result).toBe('ok');
  });

  it('propaga erro do api', async () => {
    const service = new GetLivroByIdService(mockApi);
    mockApi.getById.mockRejectedValue(new Error('falhou'));

    await expect(service.execute('livro-1')).rejects.toThrow('falhou');
  });
});
