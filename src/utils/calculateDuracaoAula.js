import { DURACAO_AULA_ARRAY } from '@/constants';

export function calculateDuracaoAula({ horaInicial, horaFinal }) {
  const [horasInicio, minutosInicio] = horaInicial.split(':').map(Number);
  const [horasFim, minutosFim] = horaFinal.split(':').map(Number);

  const inicioEmMinutos = horasInicio * 60 + minutosInicio;
  const fimEmMinutos = horasFim * 60 + minutosFim;
  const duracaoAula = fimEmMinutos - inicioEmMinutos;

  return DURACAO_AULA_ARRAY.includes(duracaoAula)
    ? parseInt(duracaoAula)
    : DURACAO_AULA_ARRAY[0];
}
