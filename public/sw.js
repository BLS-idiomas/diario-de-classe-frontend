// Service worker escrito à mão (DEC-002-001, COMP-002-002) — sem Workbox/Serwist/next-pwa.
// Cobre só o mínimo: cache-first para assets estáticos e ícones, network-only
// para navegação e API, com fallback de navegação offline e ciclo de
// atualização sem `skipWaiting()`/`clients.claim()` (DEC-002-004).
//
// `?v=` na URL de registro (ver `ServiceWorkerRegister`) muda a versão do
// cache: troca de URL no mesmo scope dispara instalação/ativação do
// navegador, e o `activate` abaixo purga o cache da versão anterior.
const CACHE_VERSION = new URL(self.location).searchParams.get('v') || 'v1';
const CACHE_PREFIX = 'bls-diario-static-';
const STATIC_CACHE = `${CACHE_PREFIX}${CACHE_VERSION}`;

// Conjunto fixo, conhecido em tempo de escrita — os únicos arquivos que este
// SW consegue pré-cachear sem um manifesto de build (não há Workbox
// `GenerateSW` aqui, DEC-002-001).
const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = [
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable.png',
  OFFLINE_URL,
];

// `/_next/static/*` tem nome de arquivo com hash de conteúdo definido só no
// build — não há como listar os arquivos reais no install sem um manifesto
// próprio (que seria reintroduzir a complexidade que DEC-002-001 evitou).
// Por isso a estratégia cache-first para essa rota entra em cache no
// primeiro `fetch` real (populate-on-miss), nunca por precache no install.
function isCacheableStaticAsset(url) {
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith('/_next/static/')) return true;
  return PRECACHE_URLS.includes(url.pathname);
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    // Falha de quota/gravação no `put` não deve derrubar a resposta já
    // obtida da rede — o pior caso é só não cachear desta vez.
    cache.put(request, response.clone()).catch(() => {});
  }
  return response;
}

async function navigateOrOfflineFallback(request) {
  try {
    return await fetch(request);
  } catch {
    const cache = await caches.open(STATIC_CACHE);
    const offline = await cache.match(OFFLINE_URL);
    return offline || Response.error();
  }
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names
          .filter(name => name.startsWith(CACHE_PREFIX))
          .filter(name => name !== STATIC_CACHE)
          .map(name => caches.delete(name))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // Nunca intercepta requisição que muta estado (POST/PUT/DELETE) — cache-first
  // só faz sentido para GET, e Cache Storage nem suporta chave não-GET.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (isCacheableStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(navigateOrOfflineFallback(request));
    return;
  }

  // Nenhum handler para o resto (chamada de API, recurso cross-origin, etc.)
  // — ausência de `respondWith` é network-only por definição da spec de
  // Service Worker (DEC-002-002, NFR-001-001): nunca cacheia resposta de
  // rede autenticada nem HTML de rota.
});
