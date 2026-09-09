import { CreateLivroService } from './createLivroService';

describe('CreateLivroService', () => {
  const mockApi = { create: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama create repassando o argumento', async () => {
    const service = new CreateLivroService(mockApi);
    mockApi.create.mockResolvedValue('ok');

    const result = await service.execute({ nome: 'X' });

    expect(mockApi.create).toHaveBeenCalledWith({ nome: 'X' });
    expect(result).toBe('ok');
  });

  it('propaga erro do api', async () => {
    const service = new CreateLivroService(mockApi);
    mockApi.create.mockRejectedValue(new Error('falhou'));

    await expect(service.execute({ nome: 'X' })).rejects.toThrow('falhou');
  });
});
