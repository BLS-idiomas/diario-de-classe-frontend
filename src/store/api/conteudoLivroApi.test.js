import { ConteudoLivroApi } from './conteudoLivroApi';

describe('ConteudoLivroApi', () => {
  let api;

  beforeEach(() => {
    api = new ConteudoLivroApi();
  });

  it('should set baseEndpoint to /conteudos', () => {
    expect(api.baseEndpoint).toBe('/conteudos');
  });

  it('should call put with correct endpoint on update', async () => {
    api.put = jest.fn();
    await api.update('conteudo-1', { titulo: 'Unit 2' });
    expect(api.put).toHaveBeenCalledWith('/conteudos/conteudo-1', {
      titulo: 'Unit 2',
    });
  });

  it('should call destroy with correct endpoint on delete', async () => {
    api.destroy = jest.fn();
    await api.delete('conteudo-1');
    expect(api.destroy).toHaveBeenCalledWith('/conteudos/conteudo-1');
  });
});
