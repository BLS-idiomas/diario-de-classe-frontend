import { AbstractEntityApi } from './abstractEntityApi';

describe('AbstractEntityApi', () => {
  class TestEntityApi extends AbstractEntityApi {
    getEndpoint() {
      return 'test-entity';
    }
  }

  let api;

  beforeEach(() => {
    api = new TestEntityApi();
  });

  it('should set baseEndpoint from getEndpoint', () => {
    expect(api.baseEndpoint).toBe('test-entity');
  });

  it('should throw error if getEndpoint is not implemented', () => {
    class NoEndpointApi extends AbstractEntityApi {}
    expect(() => new NoEndpointApi()).toThrow(
      'getEndpoint() must be implemented in subclass'
    );
  });

  it('should call getAll with correct endpoint and params', async () => {
    const params = { foo: 'bar' };
    api.get = jest.fn();
    await api.getAll(params);
    expect(api.get).toHaveBeenCalledWith('test-entity', params);
  });

  it('should call getById with correct endpoint and default params', async () => {
    api.get = jest.fn();
    await api.getById(123);
    expect(api.get).toHaveBeenCalledWith('test-entity/123', {});
  });

  it('should call getById with correct endpoint and custom params', async () => {
    api.get = jest.fn();
    const params = { foo: 'bar' };
    await api.getById(123, params);
    expect(api.get).toHaveBeenCalledWith('test-entity/123', params);
  });

  it('should call create with correct endpoint and data', async () => {
    const data = { name: 'foo' };
    api.post = jest.fn();
    await api.create(data);
    expect(api.post).toHaveBeenCalledWith('test-entity', data);
  });

  it('should call update with correct endpoint and data', async () => {
    const data = { name: 'bar' };
    api.put = jest.fn();
    await api.update(456, data);
    expect(api.put).toHaveBeenCalledWith('test-entity/456', data);
  });

  it('should call delete with correct endpoint', async () => {
    api.destroy = jest.fn();
    await api.delete(789);
    expect(api.destroy).toHaveBeenCalledWith('test-entity/789');
  });
});
