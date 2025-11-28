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
    expect(api.get).toHaveBeenCalledWith('/aulas/123');
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
});
