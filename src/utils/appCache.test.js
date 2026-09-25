import { clearAppCache } from './appCache';

describe('clearAppCache', () => {
  const originalCaches = global.caches;

  afterEach(() => {
    if (originalCaches === undefined) {
      delete global.caches;
    } else {
      global.caches = originalCaches;
    }
  });

  it('deve purgar todos os caches que não sejam o estático do service worker (controle positivo)', async () => {
    global.caches = {
      keys: jest
        .fn()
        .mockResolvedValue([
          'bls-diario-static-v1',
          'workbox-precache-v2',
          'outro-cache-qualquer',
        ]),
      delete: jest.fn().mockResolvedValue(true),
    };

    await clearAppCache();

    expect(global.caches.delete).toHaveBeenCalledTimes(2);
    expect(global.caches.delete).toHaveBeenCalledWith('workbox-precache-v2');
    expect(global.caches.delete).toHaveBeenCalledWith('outro-cache-qualquer');
    expect(global.caches.delete).not.toHaveBeenCalledWith(
      'bls-diario-static-v1'
    );
  });

  it('não deve apagar o cache estático versionado do service worker (DEC-002-006)', async () => {
    global.caches = {
      keys: jest.fn().mockResolvedValue(['bls-diario-static-v1']),
      delete: jest.fn().mockResolvedValue(true),
    };

    await clearAppCache();

    expect(global.caches.delete).not.toHaveBeenCalled();
  });

  it('deve retornar sem lançar quando o ambiente não expõe Cache Storage (controle negativo)', async () => {
    delete global.caches;

    await expect(clearAppCache()).resolves.toBeUndefined();
  });

  it('deve resolver sem lançar quando caches.keys() rejeita', async () => {
    global.caches = {
      keys: jest.fn().mockRejectedValue(new Error('quota excedida')),
      delete: jest.fn().mockResolvedValue(true),
    };

    await expect(clearAppCache()).resolves.toBeUndefined();
    expect(global.caches.delete).not.toHaveBeenCalled();
  });

  it('deve tentar apagar os demais caches mesmo que um caches.delete() rejeite', async () => {
    global.caches = {
      keys: jest
        .fn()
        .mockResolvedValue([
          'bls-diario-static-v1',
          'cache-que-falha',
          'cache-que-funciona',
        ]),
      delete: jest.fn(name =>
        name === 'cache-que-falha'
          ? Promise.reject(new Error('falha ao apagar'))
          : Promise.resolve(true)
      ),
    };

    await expect(clearAppCache()).resolves.toBeUndefined();
    expect(global.caches.delete).toHaveBeenCalledTimes(2);
    expect(global.caches.delete).toHaveBeenCalledWith('cache-que-falha');
    expect(global.caches.delete).toHaveBeenCalledWith('cache-que-funciona');
  });
});
