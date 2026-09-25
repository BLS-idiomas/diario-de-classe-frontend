import { IDIOMA_LABEL } from '@/constants';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { withStickyColumns } from '@/utils/tableResponsivo';

export function useLivrosList({ livros, handleDeleteLivro, readOnly = false }) {
  const columns = [
    {
      name: '#',
      essential: true,
      selector: row => row.id,
      sortable: true,
      width: '75px',
    },
    {
      name: 'Livro',
      essential: true,
      selector: row => row.nome,
      sortable: true,
    },
    {
      name: 'Idioma',
      essential: true,
      selector: row => row.idioma,
      sortable: true,
    },
    {
      name: 'Nível',
      essential: false,
      selector: row => row.nivel,
      sortable: true,
    },
    {
      name: 'Situação',
      essential: false,
      selector: row => row.ativo,
      sortable: true,
    },
    {
      name: 'Ações',
      isAction: true,
      selector: row => row.acoes,
      sortable: false,
      width: 'auto',
    },
  ];

  if (readOnly) {
    columns.splice(columns.length - 1, 1);
  }

  const stickyColumns = withStickyColumns(columns);

  const data = useMemo(() => {
    if (!livros) return [];
    const iconParams = { strokeWidth: 1, size: 16, stroke: 'currentColor' };

    return livros.map((livro, index) => ({
      id: index + 1,
      nome: livro.nome,
      idioma: IDIOMA_LABEL[livro.idioma] || '-',
      nivel: livro.nivel ?? '-',
      ativo: livro.ativo ? 'Ativo' : 'Inativo',
      acoes: (
        <div className="flex gap-2">
          <Link
            href={`/livros/${livro.id}`}
            className="btn-outline btn-outline-primary"
          >
            <Eye {...iconParams} />
          </Link>

          <Link
            href={`/livros/${livro.id}/editar`}
            className="btn-outline btn-outline-secondary"
          >
            <Pencil {...iconParams} />
          </Link>

          <button
            onClick={() => handleDeleteLivro(livro.id)}
            className="btn-outline btn-outline-danger"
          >
            <Trash2 {...iconParams} />
          </button>
        </div>
      ),
    }));
  }, [livros, handleDeleteLivro]);

  return { columns: stickyColumns, data };
}
