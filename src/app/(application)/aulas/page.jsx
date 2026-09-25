'use client';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useAulas } from '@/hooks/aulas/useAulas';
import { useDeletarAula } from '@/hooks/aulas/useDeletarAula';
import { useFormater } from '@/hooks/useFormater';
import { useAulasList } from '@/hooks/aulas/useAulasList';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useEditarAndamentoAula } from '@/hooks/aulas/useEditarAndamentoAula';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { Filter } from './filter';
import { ListPage } from '@/components';
import { FILTER_PANEL_STORAGE_KEYS, STATUS } from '@/constants';

// Mensagens fixas em pt-BR (nunca o `message` cru do slice): `status` é
// compartilhado entre ações do slice (getAlunos/getAluno/..., getProfessores/
// getProfessor/...), por isso o erro só é afirmado quando a ação em curso é
// realmente a de listagem consumida aqui.
const ERRO_CARREGAR_ALUNOS =
  'Não foi possível carregar os alunos. Tente novamente.';
const ERRO_CARREGAR_PROFESSORES =
  'Não foi possível carregar os professores. Tente novamente.';

export default function Aulas() {
  const { currentUser } = useUserAuth();
  const {
    aulas,
    isLoading,
    searchParams,
    handleSubmit,
    handleChange,
    handleClearFilter,
    formData,
    appliedCount,
  } = useAulas();
  const {
    alunos,
    isLoading: isLoadingAlunos,
    status: statusAlunos,
    action: actionAlunos,
  } = useAlunos();
  const erroAlunos =
    statusAlunos === STATUS.FAILED && actionAlunos === 'getAlunos'
      ? ERRO_CARREGAR_ALUNOS
      : undefined;
  const {
    professores,
    isLoading: isLoadingProfessores,
    status: statusProfessores,
    action: actionProfessores,
  } = useProfessores();
  const erroProfessores =
    statusProfessores === STATUS.FAILED &&
    actionProfessores === 'getProfessores'
      ? ERRO_CARREGAR_PROFESSORES
      : undefined;
  const { handleDeleteAula } = useDeletarAula();
  const { submit, isLoading: isLoadingSubmit } = useEditarAndamentoAula();
  const { telefoneFormatter, dataFormatter } = useFormater();
  const { columns, data } = useAulasList({
    currentUser,
    aulas,
    readOnly: false,
    telefoneFormatter,
    dataFormatter,
    handleDeleteAula,
    submit,
    isLoadingSubmit,
  });

  return (
    <ListPage
      title="Lista de aulas"
      buttons={[
        {
          href: '/aulas/novo',
          label: 'Nova aula',
          type: 'primary',
        },
      ]}
      search={{
        title: 'Buscar pelo nome do aluno ou professor...',
        searchParams: searchParams,
        initialValue: formData?.q,
      }}
      columns={columns}
      data={data}
      isLoading={isLoading || isLoadingSubmit}
      notFoundMessage="Nenhuma aula encontrada."
      Filter={Filter}
      filterStorageKey={FILTER_PANEL_STORAGE_KEYS.aulas}
      filterParams={{
        handleSubmit,
        handleChange,
        handleClearFilter,
        formData,
        alunos,
        professores,
        appliedCount,
        isLoadingAlunos,
        erroAlunos,
        isLoadingProfessores,
        erroProfessores,
      }}
    />
  );
}
