import { FILTER_STORAGE_KEYS } from '@/constants';

/**
 * Lê os filtros salvos no localStorage e mescla sobre os padrões.
 * SSR-safe: fora do browser (ou em caso de erro) retorna os padrões.
 */
export function loadFilters(key, defaults = {}) {
  if (typeof window === 'undefined') {
    return defaults;
  }
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return defaults;
    }
    return { ...defaults, ...JSON.parse(stored) };
  } catch {
    return defaults;
  }
}

/**
 * Persiste os filtros usados no localStorage.
 */
export function saveFilters(key, filters) {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(key, JSON.stringify(filters));
}

/**
 * Remove os filtros de uma página específica.
 */
export function clearFilters(key) {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(key);
}

/**
 * Remove todos os filtros persistidos (usado no logout).
 */
export function clearAllFilters() {
  if (typeof window === 'undefined') {
    return;
  }
  Object.values(FILTER_STORAGE_KEYS).forEach(key =>
    localStorage.removeItem(key)
  );
}
