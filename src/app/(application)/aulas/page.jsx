'use client';

import Link from 'next/link';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useAulas } from '@/hooks/aulas/useAulas';
import { useDeletarAula } from '@/hooks/aulas/useDeletarAula';
import { useFormater } from '@/hooks/useFormater';
import { useAulasList } from '@/hooks/aulas/useAulasList';
import { ButtonGroup, Container, PageTitle, Table } from '@/components';
import { useEditarAndamentoAula } from '@/hooks/aulas/useEditarAndamentoAula';

export default function Aulas() {
  const { currentUser } = useUserAuth();
  const { aulas, isLoading } = useAulas();
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
    <Container>
      <PageTitle>Lista de aulas</PageTitle>

      <ButtonGroup>
        <Link href="/aulas/novo" className="btn btn-primary">
          Nova aula
        </Link>
      </ButtonGroup>

      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        notFoundMessage="Nenhum aula encontrado."
      />
    </Container>
  );
}
