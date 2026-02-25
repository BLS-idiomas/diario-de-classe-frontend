'use client';

import Link from 'next/link';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useFormater } from '@/hooks/useFormater';
import { ButtonGroup, PageTitle, Table } from '@/components';
import { useContratos } from '@/hooks/contratos/useContratos';
import { useDeletarContrato } from '@/hooks/contratos/useDeletarContrato';
import { useContratosList } from '@/hooks/contratos/useContratosList';

export default function Contratos() {
  const { currentUser, isAdmin } = useUserAuth();
  const { contratos, isLoading } = useContratos();
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
    <>
      <PageTitle>Lista de Contratos</PageTitle>

      {isAdmin() && (
        <ButtonGroup>
          <Link href="/contratos/formulario" className="btn btn-primary">
            Novo contrato
          </Link>
        </ButtonGroup>
      )}

      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        notFoundMessage="Nenhum contrato encontrado."
      />
    </>
  );
}
