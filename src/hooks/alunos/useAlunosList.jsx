import { Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { withStickyColumns } from '@/utils/tableResponsivo';

export function useAlunosList({
  alunos,
  telefoneFormatter,
  dataFormatter,
  handleDeleteAluno,
  readOnly = false,
}) {
  const columns = [
    {
      name: '#',
      essential: true,
      selector: row => row.id,
      sortable: true,
      width: '75px',
    },
    {
      name: 'Nome',
      essential: true,
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Sobrenome',
      essential: true,
      selector: row => row.sobrenome,
      sortable: true,
    },
    {
      name: 'Telefone',
      essential: false,
      selector: row => row.telefone,
      sortable: true,
    },
    {
      name: 'Email',
      essential: false,
      selector: row => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Data de criação',
      essential: false,
      selector: row => row.dataCriacao,
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
    if (!alunos) return [];

    const iconParams = { strokeWidth: 1, size: 16 };
    return alunos.map((aluno, index) => ({
      id: parseInt(index) + 1,
      name: aluno.nome,
      sobrenome: aluno.sobrenome,
      telefone: telefoneFormatter(aluno.telefone),
      email: aluno.email,
      dataCriacao: dataFormatter(aluno.dataCriacao),
      acoes: (
        <div className="flex gap-2">
          <Link
            href={`/alunos/${aluno.id}`}
            className="btn-outline btn-outline-primary"
          >
            <Eye {...iconParams} stroke="currentColor" />
          </Link>

          <Link
            href={`/alunos/${aluno.id}/editar`}
            className="btn-outline btn-outline-secondary"
          >
            <Pencil {...iconParams} stroke="currentColor" />
          </Link>

          <button
            onClick={() => handleDeleteAluno(aluno.id)}
            className="btn-outline btn-outline-danger"
          >
            <Trash2 {...iconParams} stroke="currentColor" />
          </button>
        </div>
      ),
    }));
  }, [alunos, telefoneFormatter, dataFormatter, handleDeleteAluno]);
  return { columns: stickyColumns, data };
}
