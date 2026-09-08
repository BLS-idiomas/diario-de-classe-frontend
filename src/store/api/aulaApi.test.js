import { AulaApi } from './aulaApi';

describe('AulaApi', () => {
  let api;

  beforeEach(() => {
    api = new AulaApi();
  });

  it('should set baseEndpoint to /aulas', () => {
    expect(api.baseEndpoint).toBe('/aulas');
  });

  it('should call getAll with correct endpoint and params', async () => {
    const params = { foo: 'bar' };
    api.get = jest.fn();
    await api.getAll(params);
    expect(api.get).toHaveBeenCalledWith('/aulas', params);
  });

  it('should call getById with correct endpoint', async () => {
    api.get = jest.fn();
    await api.getById(123);
    expect(api.get).toHaveBeenCalledWith('/aulas/123', {});
  });

  it('should call create with correct endpoint and data', async () => {
    const data = { name: 'foo' };
    api.post = jest.fn();
    await api.create(data);
    expect(api.post).toHaveBeenCalledWith('/aulas', data);
  });

  it('should call update with correct endpoint and data', async () => {
    const data = { name: 'bar' };
    api.put = jest.fn();
    await api.update(456, data);
    expect(api.put).toHaveBeenCalledWith('/aulas/456', data);
  });

  it('should call delete with correct endpoint', async () => {
    api.destroy = jest.fn();
    await api.delete(789);
    expect(api.destroy).toHaveBeenCalledWith('/aulas/789');
  });

  it('should call updateAndamento with correct endpoint and data', async () => {
    const id = 101;
    const data = { andamento: 'em andamento' };
    api.put = jest.fn();
    await api.updateAndamento(id, data);
    expect(api.put).toHaveBeenCalledWith('/aulas/101/andamento', data);
  });

  describe('updateConteudo', () => {
    it('should call put with the conteudo endpoint wrapping the id', async () => {
      api.put = jest.fn();
      await api.updateConteudo('aula-1', 'conteudo-1');
      expect(api.put).toHaveBeenCalledWith('/aulas/aula-1/conteudo', {
        idConteudo: 'conteudo-1',
      });
    });

    it('should send null to hand the aula back to automatic sequencing', async () => {
      api.put = jest.fn();
      await api.updateConteudo('aula-1', null);
      expect(api.put).toHaveBeenCalledWith('/aulas/aula-1/conteudo', {
        idConteudo: null,
      });
    });
  });
});
