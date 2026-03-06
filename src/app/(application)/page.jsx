'use client';

import {
  STATUS_AULA,
  STATUS_AULA_LABEL,
  TIPO_AULA,
  TIPO_AULA_LABEL,
} from '@/constants';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useDashboard } from '@/hooks/dashboard/useDashboard';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { makeEmailLabel } from '@/utils/makeEmailLabel';
import { makeFullNameLabel } from '@/utils/makeFullNameLabel';
import {
  Avatar,
  Form,
  FormGroup,
  InputField,
  SelectField,
  CheckboxField,
  Loading,
} from '@/components';

// TODO passas os componetes para arquivos separados
const HomeCard = ({ title, value, color, isLoading }) => {
  const colorClasses = {
    blue: 'primary-color',
    green: 'text-green-600',
    purple: 'text-purple-600',
  };
  const textColorClass = colorClasses[color] || 'text-main';
  return (
    <div className="bg-main p-6 rounded-lg shadow-md border border-main ">
      <h3 className="text-lg font-semibold text-main mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${textColorClass}`}>
        {isLoading ? '...' : value || 0}
      </p>
    </div>
  );
};

const HomeInfoCard = ({
  id,
  name,
  status,
  tipo,
  dataAula,
  horaInicial,
  horaFinal,
  professorName,
  handleClick,
  canEdit,
}) => {
  const getActionText = (status, tipo) => {
    if (status === 'AGENDADA') {
      return `agendou uma aula ${TIPO_AULA_LABEL[tipo].toLowerCase()}`;
    }
    if (status === 'EM_ANDAMENTO') {
      return `está em uma aula ${TIPO_AULA_LABEL[tipo].toLowerCase()}`;
    }

    return 'dss';
  };

  const getTimeText = (dataAula, horaInicial, horaFinal) => {
    const now = new Date();
    const aulaDate = new Date(dataAula);
    const startTime = new Date(horaInicial);
    const endTime = new Date(horaFinal);
    const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const aulaDay = new Date(
      aulaDate.getFullYear(),
      aulaDate.getMonth(),
      aulaDate.getDate()
    );

    const msPerDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.floor((aulaDay - nowDay) / msPerDay);
    const diffMs = startTime - now;
    const diffAbsMs = Math.abs(diffMs);
    const diffHours = Math.floor(diffAbsMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(
      (diffAbsMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    // Evento já acabou
    if (now > endTime) {
      // Se foi hoje
      if (diffDays === 0) {
        const hoursAgo = Math.floor((now - startTime) / (1000 * 60 * 60));
        const minutesAgo = Math.floor(
          ((now - startTime) % (1000 * 60 * 60)) / (1000 * 60)
        );
        if (hoursAgo > 0) return `Há ${hoursAgo} hora(s)`;
        if (minutesAgo > 0) return `Há ${minutesAgo} minuto(s)`;
        return 'Concluída';
      }
      // Se foi ontem
      if (diffDays === -1) return 'Ontem';
      // Se foi há mais dias
      if (diffDays < -1) return `Há ${Math.abs(diffDays)} dias`;
    }

    // Evento em andamento
    if (now >= startTime && now <= endTime) {
      return 'Em andamento';
    }

    // Evento futuro
    if (diffDays === 0) {
      // Hoje
      if (diffMs > 0) {
        if (diffHours > 0) return `Em ${diffHours} hora(s)`;
        if (diffMinutes > 0) return `Em ${diffMinutes} minuto(s)`;
        return 'Agora';
      }
    }
    if (diffDays === 1) return 'Amanhã';
    if (diffDays > 1) return `Em ${diffDays} dias`;
    return `Há ${Math.abs(diffDays)} dias`;
  };

  const action = getActionText(status, tipo);
  const time = getTimeText(dataAula, horaInicial, horaFinal);
  const onClick = () => {
    handleClick(id);
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-5 p-4 bg-secondary rounded-lg transition-transform duration-200 ${canEdit ? 'cursor-pointer bg-sidebar hover:scale-105' : ''}  `}
    >
      <Avatar text={name} className="w-10 h-10" />
      <div>
        <p className="font-medium text-main">
          <b>{name}</b> {action}
        </p>

        <p className="text-sm text-muted">{professorName}</p>
        <p className="text-sm text-muted">{time}</p>
      </div>
    </div>
  );
};

export default function Home() {
  const { isAdmin, currentUser } = useUserAuth();
  const { professorOptions } = useProfessores(currentUser);
  const { alunoOptions } = useAlunos();
  const {
    aulas,
    isLoading,
    formData,
    homeCardValues,
    handleSubmit,
    handleChange,
    handleClick,
  } = useDashboard();

  return (
    <>
      <h2 className="text-3xl font-bold text-main mb-8">Diário de Classe</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {homeCardValues.map(row => (
          <HomeCard
            key={row.title}
            title={row.title}
            value={row.value}
            color={row.color}
            isLoading={isLoading}
          />
        ))}
      </div>

      <div className="mb-8">
        <Form handleSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold text-main mb-4">Filtros</h3>
          <FormGroup cols={2}>
            <InputField
              required
              htmlFor="dataInicio"
              label="Data de inicio do contrato"
              type="date"
              onChange={handleChange}
              value={formData.dataInicio}
            />
            <InputField
              required
              htmlFor="dataTermino"
              label="Data de término do contrato"
              type="date"
              onChange={handleChange}
              value={formData.dataTermino}
            />
            <SelectField
              required
              htmlFor="tipo"
              label="Tipo da aula"
              options={TIPO_AULA.map(tipo => ({
                label: TIPO_AULA_LABEL[tipo],
                value: tipo,
              }))}
              onChange={handleChange}
              value={formData.tipo}
            />
            <SelectField
              required
              htmlFor="status"
              label="Status da aula"
              options={STATUS_AULA.map(status => ({
                label: STATUS_AULA_LABEL[status],
                value: status,
              }))}
              onChange={handleChange}
              value={formData.status}
            />
            <SelectField
              htmlFor="alunoId"
              label="Aluno"
              placeholder="Selecione o aluno"
              onChange={handleChange}
              value={formData.alunoId}
              options={alunoOptions}
            />
            {isAdmin() && !formData.minhasAulas && (
              <SelectField
                required
                htmlFor="professorId"
                label="Professor"
                placeholder="Selecione o professor"
                onChange={handleChange}
                value={formData.professorId}
                options={professorOptions}
              />
            )}
          </FormGroup>

          {isAdmin() && (
            <FormGroup cols={1} className=" mt-6">
              <CheckboxField
                htmlFor={'minhasAulas'}
                label="Somente minhas Aulas"
                checked={formData.minhasAulas}
                onChange={handleChange}
              />
            </FormGroup>
          )}
        </Form>
      </div>

      <section className="bg-main p-8 rounded-lg shadow-md border border-main mb-8">
        <h3 className="text-xl font-semibold text-main mb-4">
          {formData.minhasAulas ? 'Minhas Aulas' : 'Todas as Aulas'}
        </h3>

        <div className="space-y-4">
          {isLoading && <Loading />}
          {!isLoading && aulas && aulas.length > 0 ? (
            aulas.map(aula => (
              <HomeInfoCard
                key={aula.id}
                id={aula.id}
                name={makeFullNameLabel(aula.aluno)}
                tipo={aula.tipo}
                status={aula.status}
                dataAula={aula.dataAula}
                horaInicial={aula.horaInicial}
                horaFinal={aula.horaFinal}
                handleClick={handleClick}
                canEdit={true}
                professorName={
                  !formData.minhasAulas
                    ? makeEmailLabel(aula.professor)
                    : undefined
                }
              />
            ))
          ) : (
            <p className="text-main">Nenhuma aula encontrada</p>
          )}
        </div>
      </section>
    </>
  );
}
