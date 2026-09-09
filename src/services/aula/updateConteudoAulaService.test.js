import { UpdateConteudoAulaService } from './updateConteudoAulaService';

describe('UpdateConteudoAulaService', () => {
  const mockApi = { updateConteudo: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama updateConteudo repassando os argumentos', async () => {
    const service = new UpdateConteudoAulaService(mockApi);
    mockApi.updateConteudo.mockResolvedValue('ok');

    const result = await service.execute('aula-1', 'conteudo-1');

    expect(mockApi.updateConteudo).toHaveBeenCalledWith('aula-1', 'conteudo-1');
    expect(result).toBe('ok');
  });

  it('repassa null para devolver a aula ao controle automático', async () => {
    const service = new UpdateConteudoAulaService(mockApi);
    mockApi.updateConteudo.mockResolvedValue('ok');

    await service.execute('aula-1', null);

    expect(mockApi.updateConteudo).toHaveBeenCalledWith('aula-1', null);
  });

  it('propaga erro do api', async () => {
    const service = new UpdateConteudoAulaService(mockApi);
    mockApi.updateConteudo.mockRejectedValue(new Error('falhou'));

    await expect(service.execute('aula-1', 'conteudo-1')).rejects.toThrow(
      'falhou'
    );
  });
});
