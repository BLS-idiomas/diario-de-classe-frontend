import { todayLocalDate } from '@/utils/todayLocalDate';

/**
 * Datas padrão de um período começando hoje (fuso local) e terminando
 * `meses` à frente — usado pelos filtros de data que nascem com uma janela
 * pronta (aulas: 3 meses; dashboard/relatórios: 6 meses). Delega a
 * `todayLocalDate` (nunca `toISOString().split('T')[0]`, que erra o dia
 * local à noite em UTC-3 — ver JSDoc de `todayLocalDate`).
 *
 * @param {number} meses quantidade de meses somados à data de término
 * @returns {{ dataInicioFormatada: string, dataTerminoFormatada: string }}
 */
export function getDatasPadrao(meses) {
  const dataInicioFormatada = todayLocalDate();
  const dataFim = new Date();
  dataFim.setMonth(dataFim.getMonth() + meses);
  const dataTerminoFormatada = todayLocalDate(dataFim);
  return { dataInicioFormatada, dataTerminoFormatada };
}
