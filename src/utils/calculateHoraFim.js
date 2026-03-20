export function calculateHoraFim({ horaInicial, quantidadeAulas, tempoAula }) {
  if (!horaInicial || !quantidadeAulas || quantidadeAulas <= 0 || !tempoAula)
    return '';

  const formatHora = hora => hora.toString().padStart(2, '0');

  const [hours, minutes] = horaInicial.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + quantidadeAulas * tempoAula;
  const finalHours = formatHora(Math.floor(totalMinutes / 60) % 24);
  const finalMinutes = formatHora(totalMinutes % 60);

  return `${finalHours}:${finalMinutes}`;
}

export function calculateHoraFimByDuracaoAula({ horaInicial, duracaoAula }) {
  const [horas, minutos] = horaInicial.split(':').map(Number);
  const horaInicialEmMinutos = horas * 60 + minutos;
  const horaFinalEmMinutos = horaInicialEmMinutos + Number(duracaoAula);
  const horaFinalHoras = Math.floor(horaFinalEmMinutos / 60) % 24;
  const horaFinalMinutos = horaFinalEmMinutos % 60;

  return `${String(horaFinalHoras).padStart(2, '0')}:${String(
    horaFinalMinutos
  ).padStart(2, '0')}`;
}
