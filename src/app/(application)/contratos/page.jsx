'use client';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useFormater } from '@/hooks/useFormater';
import { ListPage } from '@/components';
import { useContratos } from '@/hooks/contratos/useContratos';
import { useDeletarContrato } from '@/hooks/contratos/useDeletarContrato';
import { useContratosList } from '@/hooks/contratos/useContratosList';

export default function Contratos() {
  const { currentUser, isAdmin } = useUserAuth();
  const { contratos, isLoading, searchParams } = useContratos();
  const { handleDeleteContrato } = useDeletarContrato();
  const { dataFormatter } = useFormater();
  const { columns, data } = useContratosList({
    isAdmin: isAdmin(),
    currentUser,
    contratos, //
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
      // search={{
      //   title: 'Buscar pelo nome do aluno...',
      //   searchParams: searchParams,
      // }}
      columns={columns}
      data={data}
      isLoading={isLoading}
      notFoundMessage="Nenhum contrato encontrado."
    />
  );
}
