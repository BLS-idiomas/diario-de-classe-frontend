import { UpdateLivroService } from './updateLivroService';

describe('UpdateLivroService', () => {
  const mockApi = { update: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama update repassando os argumentos', async () => {
    const service = new UpdateLivroService(mockApi);
    mockApi.update.mockResolvedValue('ok');

    const result = await service.execute('livro-1', { nome: 'Y' });

    expect(mockApi.update).toHaveBeenCalledWith('livro-1', { nome: 'Y' });
    expect(result).toBe('ok');
  });

  it('propaga erro do api', async () => {
    const service = new UpdateLivroService(mockApi);
    mockApi.update.mockRejectedValue(new Error('falhou'));

    await expect(service.execute('livro-1', { nome: 'Y' })).rejects.toThrow(
      'falhou'
    );
  });
});
