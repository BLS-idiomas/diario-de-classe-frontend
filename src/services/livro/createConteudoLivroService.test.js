import { CreateConteudoLivroService } from './createConteudoLivroService';

describe('CreateConteudoLivroService', () => {
  const mockApi = { createConteudo: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama createConteudo repassando os argumentos', async () => {
    const service = new CreateConteudoLivroService(mockApi);
    mockApi.createConteudo.mockResolvedValue('ok');

    const result = await service.execute('livro-1', { titulo: 'Unit 1' });

    expect(mockApi.createConteudo).toHaveBeenCalledWith('livro-1', {
      titulo: 'Unit 1',
    });
    expect(result).toBe('ok');
  });

  it('propaga erro do api', async () => {
    const service = new CreateConteudoLivroService(mockApi);
    mockApi.createConteudo.mockRejectedValue(new Error('falhou'));

    await expect(
      service.execute('livro-1', { titulo: 'Unit 1' })
    ).rejects.toThrow('falhou');
  });
});
