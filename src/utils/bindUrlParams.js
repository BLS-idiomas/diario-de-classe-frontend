/**
 * Converte um objeto em query string para URL
 * @param {Object} params - Objeto com os parâmetros
 * @returns {string} Query string formatada (ex: ?backUrl=alunos&teste=25)
 * @example
 * buildQueryString({ backUrl: 'alunos', teste: 25 })
 * // returns '?backUrl=alunos&teste=25'
 */
export function buildQueryString(params) {
  if (!params || typeof params !== 'object') {
    return '';
  }

  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');

  return queryParams ? `?${queryParams}` : '';
}
