import { DeleteLivroService } from './deleteLivroService';

describe('DeleteLivroService', () => {
  const mockApi = { delete: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama delete repassando o argumento', async () => {
    const service = new DeleteLivroService(mockApi);
    mockApi.delete.mockResolvedValue('ok');

    const result = await service.execute('livro-1');

    expect(mockApi.delete).toHaveBeenCalledWith('livro-1');
    expect(result).toBe('ok');
  });

  it('propaga erro do api', async () => {
    const service = new DeleteLivroService(mockApi);
    mockApi.delete.mockRejectedValue(new Error('falhou'));

    await expect(service.execute('livro-1')).rejects.toThrow('falhou');
  });
});
