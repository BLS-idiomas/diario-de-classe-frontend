import { CreateCronogramaService } from './createCronogramaService';

describe('CreateCronogramaService', () => {
  const mockApi = { createCronogramaByAluno: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama createCronogramaByAluno repassando os argumentos', async () => {
    const service = new CreateCronogramaService(mockApi);
    mockApi.createCronogramaByAluno.mockResolvedValue('ok');

    const result = await service.execute('aluno-1', { idLivro: 'livro-1' });

    expect(mockApi.createCronogramaByAluno).toHaveBeenCalledWith('aluno-1', {
      idLivro: 'livro-1',
    });
    expect(result).toBe('ok');
  });

  it('propaga erro do api', async () => {
    const service = new CreateCronogramaService(mockApi);
    mockApi.createCronogramaByAluno.mockRejectedValue(new Error('falhou'));

    await expect(
      service.execute('aluno-1', { idLivro: 'livro-1' })
    ).rejects.toThrow('falhou');
  });
});
