/**
 * Ponto único de purga do Cache Storage do aplicativo (COMP-002-004). Fail
 * secure fora do ambiente que expõe `caches`, e preserva o cache estático do
 * service worker (DEC-002-006) — sem ele, o fallback offline fica sem o
 * pré-cache até o próximo deploy.
 */
// Mesmo prefixo de `CACHE_PREFIX`/`STATIC_CACHE` em `public/sw.js` — os dois
// arquivos não compartilham módulo (o SW roda como script clássico, fora do
// bundler), então o literal é replicado aqui e precisa ficar em sincronia.
const SW_STATIC_CACHE_PREFIX = 'bls-diario-static-';

export async function clearAppCache() {
  if (typeof caches === 'undefined') {
    return;
  }
  try {
    const cacheNames = await caches.keys();
    const purgeableNames = cacheNames.filter(
      name => !name.startsWith(SW_STATIC_CACHE_PREFIX)
    );
    await Promise.allSettled(purgeableNames.map(name => caches.delete(name)));
  } catch {
    // fail secure: falha de Cache Storage (quota, ambiente instável) nunca
    // deve virar rejeição solta para os call sites de fim de sessão.
  }
}
