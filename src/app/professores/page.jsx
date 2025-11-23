'use client';

import Link from 'next/link';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { useDeletarProfessor } from '@/hooks/professores/useDeletarProfessor';
import DataTable from 'react-data-table-component';

export default function Professores() {
  const { professores, isLoading, isSuccess, isEmpty } = useProfessores();
  const { handleDeleteProfessor } = useDeletarProfessor();

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

  const telefoneFormatter = telefone => {
    if (!telefone) return '-';

    telefone = telefone.replace(/\D/g, '');

    const ddd = `(${telefone.slice(0, 2)})`;
    const parte1 =
      telefone.length === 11 ? telefone.slice(2, 7) : telefone.slice(2, 6);

    const parte2 =
      telefone.length === 11 ? telefone.slice(7) : telefone.slice(6);

    return `${ddd} ${parte1}-${parte2}`;
  };

  const dataFormatter = dataCriacao => {
    if (!dataCriacao) return '-';
    const data = new Date(dataCriacao);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const data = professores.map((professor, index) => ({
    id: index + 1,
    name: professor.nome,
    sobrenome: professor.sobrenome,
    telefone: telefoneFormatter(professor.telefone),
    email: professor.email,
    role: professor.permissao,
    dataCriacao: dataFormatter(professor.dataCriacao),
    acoes: (
      <div className="flex gap-2">
        <Link
          href={`/professores/${professor.id}`}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          V
        </Link>
        <Link
          href={`/professores/${professor.id}/editar`}
          className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors cursor-pointer"
        >
          E
        </Link>
        <button
          onClick={() => handleDeleteProfessor(professor.id)}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
        >
          A
        </button>
      </div>
    ),
  }));

  return (
    <div className="p-6  mx-auto bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Lista de Professores</h2>
      <div className="pb-3">
        <Link
          href="/professores/novo"
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Novo Professor
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
}
