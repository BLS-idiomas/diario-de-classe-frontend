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

export default function Aulas() {
  const { currentUser } = useUserAuth();
  const {
    aulas,
    isLoading,
    searchParams,
    handleSubmit,
    handleChange,
    formData,
  } = useAulas();
  const { alunos } = useAlunos();
  const { professores } = useProfessores();
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
    <>
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
        }}
        columns={columns}
        data={data}
        isLoading={isLoading || isLoadingSubmit}
        notFoundMessage="Nenhuma aula encontrada."
        Filter={Filter}
        filterParams={{
          handleSubmit,
          handleChange,
          formData,
          alunos,
          professores,
        }}
      />
    </>
  );
}
