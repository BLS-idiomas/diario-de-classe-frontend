import { LivroApi } from './livroApi';

describe('LivroApi', () => {
  let api;

  beforeEach(() => {
    api = new LivroApi();
  });

  describe('initialization', () => {
    it('should set baseEndpoint to /livros', () => {
      expect(api.baseEndpoint).toBe('/livros');
    });

    it('should extend AbstractEntityApi', () => {
      expect(api.getAll).toBeDefined();
      expect(api.getById).toBeDefined();
      expect(api.create).toBeDefined();
      expect(api.update).toBeDefined();
      expect(api.delete).toBeDefined();
    });
  });

  describe('CRUD', () => {
    it('should call get with correct endpoint on getAll', async () => {
      api.get = jest.fn();
      await api.getAll({ q: 'interchange' });
      expect(api.get).toHaveBeenCalledWith('/livros', { q: 'interchange' });
    });

    it('should call get with correct endpoint on getById', async () => {
      api.get = jest.fn();
      await api.getById('livro-1');
      expect(api.get).toHaveBeenCalledWith('/livros/livro-1', {});
    });

    it('should call post with correct endpoint on create', async () => {
      const data = { nome: 'New Interchange 1', idioma: 'INGLES' };
      api.post = jest.fn();
      await api.create(data);
      expect(api.post).toHaveBeenCalledWith('/livros', data);
    });

    it('should call put with correct endpoint on update', async () => {
      api.put = jest.fn();
      await api.update('livro-1', { nome: 'Outro' });
      expect(api.put).toHaveBeenCalledWith('/livros/livro-1', {
        nome: 'Outro',
      });
    });

    it('should call destroy with correct endpoint on delete', async () => {
      api.destroy = jest.fn();
      await api.delete('livro-1');
      expect(api.destroy).toHaveBeenCalledWith('/livros/livro-1');
    });
  });

  describe('createConteudo', () => {
    it('should call post with the nested conteudos endpoint', async () => {
      const data = { titulo: 'Unit 1' };
      api.post = jest.fn();
      await api.createConteudo('livro-1', data);
      expect(api.post).toHaveBeenCalledWith('/livros/livro-1/conteudos', data);
    });
  });

  describe('uploadConteudos', () => {
    it('should call post with the upload endpoint', async () => {
      const formData = new FormData();
      api.post = jest.fn();
      await api.uploadConteudos('livro-1', formData);
      expect(api.post).toHaveBeenCalledWith(
        '/livros/livro-1/conteudos/upload',
        formData
      );
    });

    it('should remove the JSON Content-Type so axios sets the multipart boundary', async () => {
      const formData = new FormData();
      let contentTypeDuranteEnvio = 'ainda-nao-chamado';

      api.post = jest.fn(() => {
        contentTypeDuranteEnvio = api.api.defaults.headers['Content-Type'];
        return Promise.resolve({ data: {} });
      });

      await api.uploadConteudos('livro-1', formData);

      expect(contentTypeDuranteEnvio).toBeUndefined();
    });

    it('should restore the original Content-Type even when the upload fails', async () => {
      const original = api.api.defaults.headers['Content-Type'];
      api.post = jest.fn(() => Promise.reject(new Error('falha')));

      await expect(
        api.uploadConteudos('livro-1', new FormData())
      ).rejects.toThrow('falha');

      expect(api.api.defaults.headers['Content-Type']).toBe(original);
    });
  });
});
