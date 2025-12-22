import { useMemo } from 'react';
import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export function useProfessoresList({
  currentUser,
  professores,
  telefoneFormatter,
  dataFormatter,
  handleDeleteProfessor,
}) {
  const columns = [
    {
      name: '#',
      selector: row => row.id,
      sortable: true,
      width: '75px',
    },
    {
      name: 'Nome',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Sobrenome',
      selector: row => row.sobrenome,
      sortable: true,
    },
    {
      name: 'Telefone',
      selector: row => row.telefone,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Permissão',
      selector: row => row.role,
      sortable: true,
    },
    {
      name: 'Data de criação',
      selector: row => row.dataCriacao,
      sortable: true,
    },
    {
      name: 'Ações',
      selector: row => row.acoes,
      sortable: false,
      width: 'auto',
    },
  ];

  const data = useMemo(() => {
    if (!professores) return [];

    const iconParams = { strokeWidth: 1, size: 16 };
    return professores.map((prof, index) => ({
      id: parseInt(index) + 1,
      name: prof.nome,
      sobrenome: prof.sobrenome,
      telefone: telefoneFormatter(prof.telefone),
      email: prof.email,
      role: prof.permissao,
      dataCriacao: dataFormatter(prof.dataCriacao),
      acoes: (
        <div className="flex gap-2">
          <Link
            href={`/professores/${prof.id}`}
            className="btn-outline btn-outline-primary"
          >
            <Eye {...iconParams} stroke="blue" />
          </Link>

          <Link
            href={`/professores/${prof.id}/editar`}
            className="btn-outline btn-outline-secondary"
          >
            <Pencil {...iconParams} stroke="gray" />
          </Link>

          {currentUser?.id !== prof.id && (
            <button
              onClick={() => handleDeleteProfessor(prof.id)}
              className="btn-outline btn-outline-danger"
            >
              <Trash2 {...iconParams} stroke="red" />
            </button>
          )}
        </div>
      ),
    }));
  }, [
    currentUser,
    professores,
    telefoneFormatter,
    dataFormatter,
    handleDeleteProfessor,
  ]);

  return {
    columns,
    data,
  };
}
