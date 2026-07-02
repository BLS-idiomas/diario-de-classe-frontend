/**
 * Retorna o início do dia de hoje em UTC (00:00:00.000Z).
 *
 * As datas de aula são geradas/armazenadas em UTC (meia-noite). Comparar contra
 * `new Date()` (instante atual, com hora) fazia o corte "daqui pra frente"
 * escorregar de dia conforme a hora/fuso. Usar o início do dia em UTC deixa a
 * comparação por dia consistente.
 *
 * @returns {Date}
 */
export function startOfTodayUTC() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
}
