'use client';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useLivros } from '@/hooks/livros/useLivros';
import { useLivrosList } from '@/hooks/livros/useLivrosList';
import { useDeletarLivro } from '@/hooks/livros/useDeletarLivro';
import { ListPage } from '@/components';

export default function Livros() {
  const { isAdmin } = useUserAuth();
  const { livros, isLoading, searchParams } = useLivros();
  const { handleDeleteLivro } = useDeletarLivro();
  const { columns, data } = useLivrosList({
    livros,
    handleDeleteLivro,
    // Professor consulta o catálogo para lançar conteúdo, mas quem mantém os
    // livros é a secretaria; o backend também recusa a escrita.
    readOnly: !isAdmin(),
  });

  return (
    <ListPage
      title="Livros"
      buttons={
        isAdmin()
          ? [
              {
                href: '/livros/novo',
                label: 'Novo livro',
                type: 'primary',
              },
            ]
          : []
      }
      search={{
        title: 'Buscar pelo nome do livro...',
        searchParams: searchParams,
      }}
      columns={columns}
      data={data}
      isLoading={isLoading}
      notFoundMessage="Nenhum livro encontrado."
    />
  );
}
