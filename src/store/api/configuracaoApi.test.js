import { ConfiguracaoApi } from '@/store/api/configuracaoApi';

describe('ConfiguracaoApi', () => {
  let api;
  beforeEach(() => {
    api = new ConfiguracaoApi();
  });

  it('should return the correct endpoint', () => {
    expect(api.getEndpoint()).toBe('/configuracao');
  });

  it('should call put on update', async () => {
    api.put = jest.fn().mockResolvedValue('updated');
    const data = { foo: 'bar' };
    const result = await api.update(data);
    expect(api.put).toHaveBeenCalledWith('/configuracao', data);
    expect(result).toBe('updated');
  });

  it('should throw on getById', async () => {
    await expect(api.getById(1)).rejects.toThrow(
      'Operação de getById não é permitida para Configuração'
    );
  });

  it('should throw on create', async () => {
    await expect(api.create({})).rejects.toThrow(
      'Operação de create não é permitida para Configuração'
    );
  });

  it('should throw on delete', async () => {
    await expect(api.delete(1)).rejects.toThrow(
      'Operação de delete não é permitida para Configuração'
    );
  });
});
