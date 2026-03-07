'use client';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useDeletarAluno } from '@/hooks/alunos/useDeletarAluno';
import { useFormater } from '@/hooks/useFormater';
import { useAlunosList } from '@/hooks/alunos/useAlunosList';
import { useUploadAlunos } from '@/hooks/alunos/useUploadAlunos';
import { ListPage } from '@/components';

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
    <ListPage
      title="Lista de alunos"
      buttons={[
        {
          href: '/alunos/novo',
          label: 'Novo aluno',
          type: 'primary',
        },
      ]}
      extraButton={
        <button
          className="btn btn-secondary"
          onClick={handleModalUpload}
          hidden={!isAdmin}
        >
          Baixar lista de alunos
        </button>
      }
      search={{
        title: 'Buscar pelo nome, sobrenome, email ou telefone...',
        searchParams: searchParams,
      }}
      columns={columns}
      data={data}
      isLoading={isLoading || isUploading}
      notFoundMessage="Nenhum aluno encontrado."
    />
  );
}
