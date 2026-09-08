/**
 * Data de hoje no fuso local, no formato YYYY-MM-DD.
 *
 * `<input type="date">` trabalha com data local. Usar
 * `new Date().toISOString().slice(0, 10)` para preencher o valor default erra o
 * dia: em UTC-3, das 21h em diante o instante já virou o dia seguinte em UTC e
 * o campo abre com amanhã.
 *
 * É o espelho de `startOfTodayUTC`: lá a comparação é contra data armazenada em
 * UTC, aqui o destino é um campo local.
 *
 * @param {Date} [data] instante de referência; por padrão agora
 * @returns {string}
 */
export function todayLocalDate(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}
