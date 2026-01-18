'use client';

import Link from 'next/link';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { useDeletarProfessor } from '@/hooks/professores/useDeletarProfessor';
import { useFormater } from '@/hooks/useFormater';
import { useProfessoresList } from '@/hooks/professores/useProfessoresList';
import { ButtonGroup, PageTitle, Table } from '@/components';

export default function Professores() {
  const { currentUser } = useUserAuth();
  const { professores, isLoading } = useProfessores();
  const { handleDeleteProfessor } = useDeletarProfessor();
  const { telefoneFormatter, dataFormatter } = useFormater();
  const { columns, data } = useProfessoresList({
    currentUser,
    professores,
    telefoneFormatter,
    dataFormatter,
    handleDeleteProfessor,
  });

  return (
    <>
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
    </>
  );
}
