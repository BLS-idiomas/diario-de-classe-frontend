'use client';

import Link from 'next/link';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useDeletarAluno } from '@/hooks/alunos/useDeletarAluno';
import { useFormater } from '@/hooks/useFormater';
import { useAlunosList } from '@/hooks/alunos/useAlunosList';
import { useUploadAlunos } from '@/hooks/alunos/useUploadAlunos';
import { ButtonGroup, PageTitle, SearchForm, Table } from '@/components';

export default function Alunos() {
  const { currentUser, isAdmin } = useUserAuth();
  const { alunos, isLoading, searchParams } = useAlunos();
  const { handleDeleteAluno } = useDeletarAluno();
  const { telefoneFormatter, dataFormatter } = useFormater();
  const { handleModalUpload, isUploading } = useUploadAlunos();
  const { columns, data } = useAlunosList({
    currentUser,
    alunos,
    readOnly: false,
    telefoneFormatter,
    dataFormatter,
    handleDeleteAluno,
  });

  return (
    <>
      <PageTitle>Lista de alunos</PageTitle>

      <div className="lg:grid lg:grid-cols-2 gap-4">
        <ButtonGroup>
          <Link href="/alunos/novo" className="btn btn-primary">
            Novo aluno
          </Link>

          <button
            className="btn btn-secondary"
            onClick={handleModalUpload}
            hidden={!isAdmin}
          >
            Baixar lista de alunos
          </button>
        </ButtonGroup>

        <SearchForm
          placeholder="Buscar pelo nome, sobrenome, email ou telefone..."
          perform={searchParams}
        />
      </div>

      <Table
        columns={columns}
        data={data}
        isLoading={isLoading || isUploading}
        notFoundMessage="Nenhum aluno encontrado."
      />
    </>
  );
}
