import { useMemo } from 'react';
import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export function useProfessoresList({
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
    const iconParams = { strokeWidth: 1, size: 16 };

    return professores.map((prof, index) => ({
      id: index,
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
            className="px-2 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <Eye {...iconParams} stroke="blue" />
          </Link>

          <Link
            href={`/professores/${prof.id}/editar`}
            className="px-2 py-1 text-sm border border-gray-500 text-gray-500 rounded hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Pencil {...iconParams} stroke="gray" />
          </Link>

          <button
            onClick={() => handleDeleteProfessor(prof.id)}
            className="px-2 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 {...iconParams} stroke="red" />
          </button>
        </div>
      ),
    }));
  }, [professores, telefoneFormatter, dataFormatter, handleDeleteProfessor]);

  return {
    columns,
    data,
  };
}
