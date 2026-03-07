'use client';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { useDeletarProfessor } from '@/hooks/professores/useDeletarProfessor';
import { useFormater } from '@/hooks/useFormater';
import { useProfessoresList } from '@/hooks/professores/useProfessoresList';
import { ListPage } from '@/components';

export default function Professores() {
  const { currentUser } = useUserAuth();
  const { professores, isLoading, searchParams } = useProfessores();
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
    <ListPage
      title="Lista de Professores"
      buttons={[
        {
          href: '/professores/novo',
          label: 'Novo Professor',
          type: 'primary',
        },
      ]}
      search={{
        title: 'Buscar pelo nome, sobrenome, email ou telefone...',
        searchParams: searchParams,
      }}
      columns={columns}
      data={data}
      isLoading={isLoading}
      notFoundMessage="Nenhum professor encontrado."
    />
  );
}
