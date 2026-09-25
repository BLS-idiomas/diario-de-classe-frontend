'use client';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useFormater } from '@/hooks/useFormater';
import { useContratos } from '@/hooks/contratos/useContratos';
import { useDeletarContrato } from '@/hooks/contratos/useDeletarContrato';
import { useContratosList } from '@/hooks/contratos/useContratosList';
import { Filter } from './filter';
import { ListPage } from '@/components';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { FILTER_PANEL_STORAGE_KEYS, STATUS } from '@/constants';

// Mensagem fixa em pt-BR (nunca o `message` cru do slice):
// `alunosSlice.status` é compartilhado entre ações (getAlunos, getAluno,
// createAluno, ...) — por isso o erro só é afirmado quando a ação em curso
// é realmente `getAlunos`.
const ERRO_CARREGAR_ALUNOS =
  'Não foi possível carregar os alunos. Tente novamente.';

export default function Contratos() {
  const { currentUser, isAdmin } = useUserAuth();
  const {
    contratos,
    isLoading,
    searchParams,
    handleSubmit,
    handleChange,
    handleClearFilter,
    formData,
    appliedCount,
  } = useContratos();
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
  const { handleDeleteContrato } = useDeletarContrato();
  const { dataFormatter } = useFormater();
  const { columns, data } = useContratosList({
    isAdmin: isAdmin(),
    currentUser,
    contratos,
    readOnly: false,
    dataFormatter,
    handleDeleteContrato,
  });

  return (
    <ListPage
      title="Lista de Contratos"
      buttons={
        isAdmin() && [
          {
            href: '/contratos/novo',
            label: 'Novo contrato',
            type: 'primary',
          },
        ]
      }
      search={{
        title: 'Buscar pelo nome do aluno...',
        searchParams: searchParams,
        initialValue: formData?.q,
      }}
      Filter={Filter}
      filterStorageKey={FILTER_PANEL_STORAGE_KEYS.contratos}
      filterParams={{
        handleSubmit,
        handleChange,
        handleClearFilter,
        formData,
        alunos,
        appliedCount,
        isLoadingAlunos,
        erroAlunos,
      }}
      columns={columns}
      data={data}
      isLoading={isLoading}
      notFoundMessage="Nenhum contrato encontrado."
    />
  );
}
