'use client';

import Link from 'next/link';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useAulas } from '@/hooks/aulas/useAulas';
import { useDeletarAula } from '@/hooks/aulas/useDeletarAula';
import { useFormater } from '@/hooks/useFormater';
import { useAulasList } from '@/hooks/aulas/useAulasList';
import { ButtonGroup, PageTitle, SearchForm, Table } from '@/components';
import { useEditarAndamentoAula } from '@/hooks/aulas/useEditarAndamentoAula';

export default function Aulas() {
  const { currentUser } = useUserAuth();
  const { aulas, isLoading, searchParams } = useAulas();
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
      <PageTitle>Lista de aulas</PageTitle>

      {/* <div className="lg:grid lg:grid-cols-2 gap-4"> */}
      <ButtonGroup>
        <Link href="/aulas/novo" className="btn btn-primary">
          Nova aula
        </Link>
      </ButtonGroup>

      {/* <SearchForm
          placeholder="Buscar pelo nome do aluno ou professor..."
          perform={searchParams}
        /> */}
      {/* </div> */}

      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        notFoundMessage="Nenhum aula encontrado."
      />
    </>
  );
}
