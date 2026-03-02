'use client';

import Link from 'next/link';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useFormater } from '@/hooks/useFormater';
import { ButtonGroup, PageTitle, SearchForm, Table } from '@/components';
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
    contratos,
    readOnly: false,
    dataFormatter,
    handleDeleteContrato,
  });

  return (
    <>
      <PageTitle>Lista de Contratos</PageTitle>

      <div className="lg:grid lg:grid-cols-2 gap-4">
        {isAdmin() && (
          <ButtonGroup>
            <Link href="/contratos/novo" className="btn btn-primary">
              Novo contrato
            </Link>
          </ButtonGroup>
        )}

        <SearchForm
          placeholder="Buscar pelo nome do aluno..."
          perform={searchParams}
        />
      </div>

      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        notFoundMessage="Nenhum contrato encontrado."
      />
    </>
  );
}
