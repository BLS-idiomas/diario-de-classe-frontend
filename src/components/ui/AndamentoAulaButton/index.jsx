import { Loading } from '@/components';
import { CalendarPlus, Play, CheckCircle2, XCircle } from 'lucide-react';

export const AndamentoAulaButton = ({ id, nextStatus, submit, isLoading }) => {
  const handleSubmit = () => {
    if (isLoading) return;
    submit({ id, dataToSend: { status: nextStatus } });
  };

  const stroke = {
    AGENDADA: 'gray',
    EM_ANDAMENTO: 'blue',
    CONCLUIDA: 'green',
    CANCELADA: 'red',
    CANCELADA_POR_FALTA: 'red',
  };

  const buttonType = {
    AGENDADA: 'secondary',
    EM_ANDAMENTO: 'primary',
    CONCLUIDA: 'success',
    CANCELADA: 'danger',
    CANCELADA_POR_FALTA: 'danger',
  };

  const icon = {
    AGENDADA: CalendarPlus,
    EM_ANDAMENTO: Play,
    CONCLUIDA: CheckCircle2,
    CANCELADA: XCircle,
    CANCELADA_POR_FALTA: XCircle,
  };

  const Icon = icon[nextStatus];

  return (
    <button
      onClick={handleSubmit}
      className={`btn-outline btn-outline-${buttonType[nextStatus]}`}
    >
      {isLoading ? (
        <Loading size={4} border={1} />
      ) : (
        <Icon strokeWidth={1} size={16} stroke={stroke[nextStatus]} />
      )}
    </button>
  );
};
