'use client';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useFormater } from '@/hooks/useFormater';
import { useContratos } from '@/hooks/contratos/useContratos';
import { useDeletarContrato } from '@/hooks/contratos/useDeletarContrato';
import { useContratosList } from '@/hooks/contratos/useContratosList';
import { Filter } from './filter';
import { ListPage } from '@/components';
import { useAlunos } from '@/hooks/alunos/useAlunos';

export default function Contratos() {
  const { currentUser, isAdmin } = useUserAuth();
  const {
    contratos,
    isLoading,
    searchParams,
    handleSubmit,
    handleChange,
    formData,
  } = useContratos();
  const { alunos } = useAlunos();
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
      }}
      Filter={Filter}
      filterParams={{
        handleSubmit,
        handleChange,
        formData,
        alunos,
      }}
      columns={columns}
      data={data}
      isLoading={isLoading}
      notFoundMessage="Nenhum contrato encontrado."
    />
  );
}
