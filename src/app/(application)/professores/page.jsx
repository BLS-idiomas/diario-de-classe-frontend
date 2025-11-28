'use client';

import Link from 'next/link';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { useDeletarProfessor } from '@/hooks/professores/useDeletarProfessor';
import { useFormater } from '@/hooks/useFormater';
import { useProfessoresList } from '@/hooks/professores/useProfessoresList';
import { ButtonGroup, Container, PageTitle, Table } from '@/components';

export default function Professores() {
  const { professores, isLoading } = useProfessores();
  const { handleDeleteProfessor } = useDeletarProfessor();
  const { telefoneFormatter, dataFormatter } = useFormater();
  const { columns, data } = useProfessoresList({
    professores,
    telefoneFormatter,
    dataFormatter,
    handleDeleteProfessor,
  });

  return (
    <Container>
      <PageTitle>Lista de Professores</PageTitle>

      <ButtonGroup>
        <Link href="/professores/novo" className="btn btn-primary">
          Novo Professor
        </Link>
      </ButtonGroup>

      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        notFoundMessage="Nenhum professor encontrado."
      />
    </Container>
  );
}
