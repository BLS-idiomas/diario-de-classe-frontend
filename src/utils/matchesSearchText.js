// Normalização NFD + substring própria (não `localeCompare`, custo por chamada, nem
// `utils/searchFunction.js`, dispatcher de busca server-side, propósito distinto) —
// DEC-002-005.
const DIACRITICS_REGEX = /[\u0300-\u036f]/g;

export function normalizeSearchText(text) {
  return text.normalize('NFD').replace(DIACRITICS_REGEX, '').toLowerCase();
}

export function matchesSearchText(label, query) {
  const normalizedQuery = normalizeSearchText(query);

  if (normalizedQuery === '') {
    return true;
  }

  return normalizeSearchText(label).includes(normalizedQuery);
}
