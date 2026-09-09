import { UploadConteudosLivroService } from './uploadConteudosLivroService';

describe('UploadConteudosLivroService', () => {
  const mockApi = { uploadConteudos: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama uploadConteudos repassando os argumentos', async () => {
    const service = new UploadConteudosLivroService(mockApi);
    mockApi.uploadConteudos.mockResolvedValue('ok');

    const result = await service.execute('livro-1', 'form-data');

    expect(mockApi.uploadConteudos).toHaveBeenCalledWith(
      'livro-1',
      'form-data'
    );
    expect(result).toBe('ok');
  });

  it('propaga erro do api', async () => {
    const service = new UploadConteudosLivroService(mockApi);
    mockApi.uploadConteudos.mockRejectedValue(new Error('falhou'));

    await expect(service.execute('livro-1', 'form-data')).rejects.toThrow(
      'falhou'
    );
  });
});
