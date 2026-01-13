'use client';

import { Avatar, Loading } from '@/components';
import { TIPO_AULA } from '@/constants';
import { useDashboard } from '@/hooks/dashboard/useDashboard';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { makeEmailLabel } from '@/utils/makeEmailLabel';
import { makeFullNameLabel } from '@/utils/makeFullNameLabel';
import { useRouter } from 'next/navigation';

// TODO passas os componetes para arquivos separados
const HomeCard = ({ title, value, color, isLoading }) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
  };
  const textColorClass = colorClasses[color] || 'text-gray-800';
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
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
  handleRedirect,
}) => {
  const getActionText = (status, tipo) => {
    if (status === 'AGENDADA') {
      return `agendou uma aula ${TIPO_AULA[tipo].toLowerCase()}`;
    }
    if (status === 'EM_ANDAMENTO') {
      return `está em uma aula ${TIPO_AULA[tipo].toLowerCase()}`;
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
    return '';
  };

  const action = getActionText(status, tipo);
  const time = getTimeText(dataAula, horaInicial, horaFinal);
  const onClick = () => {
    handleRedirect(id);
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-5 p-4 bg-gray-50 rounded-lg"
    >
      <Avatar text={name} className="w-10 h-10" />
      <div>
        <p className="font-medium text-gray-800">
          <b>{name}</b> {action}
        </p>

        <p className="text-sm text-gray-500">{professorName}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  );
};

const HomeSection = ({
  title,
  isLoading,
  data,
  hasProfessor,
  notFoundMessage,
  canEdit,
}) => {
  const router = useRouter();
  const handleRedirect = id => {
    if (!!canEdit) {
      router.push(`/aulas/${id}/editar?backUrl=/`);
    }
  };
  return (
    <section className="bg-white p-8 rounded-lg shadow-md border border-gray-200 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>

      <div className="space-y-4">
        {isLoading && <Loading />}
        {!isLoading && data && data.length > 0 ? (
          data.map(aula => (
            <HomeInfoCard
              key={aula.id}
              id={aula.id}
              name={makeFullNameLabel(aula.aluno)}
              tipo={aula.tipo}
              status={aula.status}
              dataAula={aula.dataAula}
              horaInicial={aula.horaInicial}
              horaFinal={aula.horaFinal}
              handleRedirect={handleRedirect}
              professorName={
                hasProfessor ? makeEmailLabel(aula.professor) : undefined
              }
            />
          ))
        ) : (
          <p>{notFoundMessage}</p>
        )}
      </div>
    </section>
  );
};

export default function Home() {
  const {
    totalAlunos,
    totalAulas,
    totalContratos,
    minhasAulas,
    todasAsAulas,
    status,
    isLoading,
  } = useDashboard();
  const { isAdmin } = useUserAuth();

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Bem-vindo ao Diário de Classe
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <HomeCard
            title="Total de Alunos"
            value={totalAlunos}
            color="blue"
            isLoading={isLoading}
          />
          <HomeCard
            title="Total de agendadas"
            value={totalAulas}
            color="green"
            isLoading={isLoading}
          />
          <HomeCard
            title="Contratos ativos"
            value={totalContratos}
            color="purple"
            isLoading={isLoading}
          />
        </div>

        <HomeSection
          title={'Minhas Aulas'}
          isLoading={isLoading}
          data={minhasAulas}
          canEdit
          notFoundMessage={'Nenhuma aula encontrada.'}
        />

        {isAdmin() && (
          <HomeSection
            title={'Atividades Recentes'}
            isLoading={isLoading}
            data={todasAsAulas}
            hasProfessor
            notFoundMessage={'Nenhuma atividade recente.'}
          />
        )}
      </div>
    </div>
  );
}
