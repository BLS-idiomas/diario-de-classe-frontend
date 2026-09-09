import { DeleteConteudoLivroService } from './deleteConteudoLivroService';

describe('DeleteConteudoLivroService', () => {
  const mockApi = { delete: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama delete repassando o argumento', async () => {
    const service = new DeleteConteudoLivroService(mockApi);
    mockApi.delete.mockResolvedValue('ok');

    const result = await service.execute('conteudo-1');

    expect(mockApi.delete).toHaveBeenCalledWith('conteudo-1');
    expect(result).toBe('ok');
  });

  it('propaga erro do api', async () => {
    const service = new DeleteConteudoLivroService(mockApi);
    mockApi.delete.mockRejectedValue(new Error('falhou'));

    await expect(service.execute('conteudo-1')).rejects.toThrow('falhou');
  });
});
