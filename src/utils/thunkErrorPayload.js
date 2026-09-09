/**
 * Normaliza o erro de um asyncThunk para o formato que os slices guardam.
 *
 * Extraído porque estava duplicado literalmente em mais de um slice novo.
 *
 * @param {Error} error erro do axios
 * @param {string} fallback mensagem quando a API não manda uma
 * @returns {{ message: string, errors: Array, statusError: number|undefined }}
 */
export function thunkErrorPayload(error, fallback) {
  return {
    message: error.response?.data?.message || error.message || fallback,
    errors: error.response?.data?.errors || [],
    statusError: error.response?.status,
  };
}
