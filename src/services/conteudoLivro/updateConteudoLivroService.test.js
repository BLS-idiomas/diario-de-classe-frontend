import { UpdateConteudoLivroService } from './updateConteudoLivroService';

describe('UpdateConteudoLivroService', () => {
  const mockApi = { update: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama update repassando os argumentos', async () => {
    const service = new UpdateConteudoLivroService(mockApi);
    mockApi.update.mockResolvedValue('ok');

    const result = await service.execute('conteudo-1', { titulo: 'Unit 2' });

    expect(mockApi.update).toHaveBeenCalledWith('conteudo-1', {
      titulo: 'Unit 2',
    });
    expect(result).toBe('ok');
  });

  it('propaga erro do api', async () => {
    const service = new UpdateConteudoLivroService(mockApi);
    mockApi.update.mockRejectedValue(new Error('falhou'));

    await expect(
      service.execute('conteudo-1', { titulo: 'Unit 2' })
    ).rejects.toThrow('falhou');
  });
});
