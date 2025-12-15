import { AlunoApi } from './diaAulaApi';

describe('DiaAulaApi', () => {
  let api;

  beforeEach(() => {
    api = new AlunoApi();
  });

  describe('initialization', () => {
    it('should set baseEndpoint to /dias-aulas', () => {
      expect(api.baseEndpoint).toBe('/dias-aulas');
    });

    it('should extend AbstractEntityApi', () => {
      expect(api.getAll).toBeDefined();
      expect(api.getById).toBeDefined();
      expect(api.create).toBeDefined();
      expect(api.update).toBeDefined();
      expect(api.delete).toBeDefined();
    });
  });

  describe('getAll', () => {
    it('should call get with correct endpoint', async () => {
      api.get = jest.fn();
      await api.getAll();
      expect(api.get).toHaveBeenCalledWith('/dias-aulas', {});
    });

    it('should call get with correct endpoint and params', async () => {
      const params = { foo: 'bar', page: 1 };
      api.get = jest.fn();
      await api.getAll(params);
      expect(api.get).toHaveBeenCalledWith('/dias-aulas', params);
    });

    it('should handle empty params', async () => {
      api.get = jest.fn();
      await api.getAll({});
      expect(api.get).toHaveBeenCalledWith('/dias-aulas', {});
    });
  });

  describe('getById', () => {
    it('should call get with correct endpoint and id', async () => {
      api.get = jest.fn();
      await api.getById(123);
      expect(api.get).toHaveBeenCalledWith('/dias-aulas/123');
    });

    it('should handle string id', async () => {
      api.get = jest.fn();
      await api.getById('456');
      expect(api.get).toHaveBeenCalledWith('/dias-aulas/456');
    });

    it('should handle numeric id', async () => {
      api.get = jest.fn();
      await api.getById(789);
      expect(api.get).toHaveBeenCalledWith('/dias-aulas/789');
    });
  });

  describe('create', () => {
    it('should call post with correct endpoint and data', async () => {
      const data = { data: '2024-01-15', horario: '10:00' };
      api.post = jest.fn();
      await api.create(data);
      expect(api.post).toHaveBeenCalledWith('/dias-aulas', data);
    });

    it('should handle empty data object', async () => {
      api.post = jest.fn();
      await api.create({});
      expect(api.post).toHaveBeenCalledWith('/dias-aulas', {});
    });

    it('should handle complex data structure', async () => {
      const data = {
        data: '2024-01-15',
        horario: '10:00',
        aulas: [{ id: 1 }, { id: 2 }],
        metadata: { created: true },
      };
      api.post = jest.fn();
      await api.create(data);
      expect(api.post).toHaveBeenCalledWith('/dias-aulas', data);
    });
  });

  describe('update', () => {
    it('should call put with correct endpoint, id and data', async () => {
      const data = { data: '2024-01-16', horario: '11:00' };
      api.put = jest.fn();
      await api.update(456, data);
      expect(api.put).toHaveBeenCalledWith('/dias-aulas/456', data);
    });

    it('should handle string id', async () => {
      const data = { data: '2024-01-17' };
      api.put = jest.fn();
      await api.update('789', data);
      expect(api.put).toHaveBeenCalledWith('/dias-aulas/789', data);
    });

    it('should handle numeric id', async () => {
      const data = { horario: '12:00' };
      api.put = jest.fn();
      await api.update(101, data);
      expect(api.put).toHaveBeenCalledWith('/dias-aulas/101', data);
    });

    it('should handle empty data object', async () => {
      api.put = jest.fn();
      await api.update(202, {});
      expect(api.put).toHaveBeenCalledWith('/dias-aulas/202', {});
    });
  });

  describe('delete', () => {
    it('should call destroy with correct endpoint and id', async () => {
      api.destroy = jest.fn();
      await api.delete(789);
      expect(api.destroy).toHaveBeenCalledWith('/dias-aulas/789');
    });

    it('should handle string id', async () => {
      api.destroy = jest.fn();
      await api.delete('999');
      expect(api.destroy).toHaveBeenCalledWith('/dias-aulas/999');
    });

    it('should handle numeric id', async () => {
      api.destroy = jest.fn();
      await api.delete(111);
      expect(api.destroy).toHaveBeenCalledWith('/dias-aulas/111');
    });
  });

  describe('edge cases', () => {
    it('should handle null params in getAll', async () => {
      api.get = jest.fn();
      await api.getAll(null);
      expect(api.get).toHaveBeenCalledWith('/dias-aulas', null);
    });

    it('should handle undefined params in getAll', async () => {
      api.get = jest.fn();
      await api.getAll(undefined);
      expect(api.get).toHaveBeenCalledWith('/dias-aulas', {});
    });

    it('should handle id as 0', async () => {
      api.get = jest.fn();
      await api.getById(0);
      expect(api.get).toHaveBeenCalledWith('/dias-aulas/0');
    });

    it('should handle negative id', async () => {
      api.get = jest.fn();
      await api.getById(-1);
      expect(api.get).toHaveBeenCalledWith('/dias-aulas/-1');
    });
  });

  describe('method chaining', () => {
    it('should allow consecutive calls to getAll', async () => {
      api.get = jest.fn();
      await api.getAll({ page: 1 });
      await api.getAll({ page: 2 });
      expect(api.get).toHaveBeenCalledTimes(2);
      expect(api.get).toHaveBeenNthCalledWith(1, '/dias-aulas', { page: 1 });
      expect(api.get).toHaveBeenNthCalledWith(2, '/dias-aulas', { page: 2 });
    });

    it('should allow different method calls in sequence', async () => {
      api.get = jest.fn();
      api.post = jest.fn();
      api.put = jest.fn();
      api.destroy = jest.fn();

      await api.getAll();
      await api.create({ data: '2024-01-15' });
      await api.update(1, { data: '2024-01-16' });
      await api.delete(1);

      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.put).toHaveBeenCalledTimes(1);
      expect(api.destroy).toHaveBeenCalledTimes(1);
    });
  });
});
