'use client';

import Link from 'next/link';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { useDeletarProfessor } from '@/hooks/professores/useDeletarProfessor';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useFormater } from '@/hooks/professores/useFormater';
import Table from '@/components/Table';

export default function Professores() {
  const { professores, isLoading, isSuccess, isEmpty, columns } =
    useProfessores();
  const { handleDeleteProfessor } = useDeletarProfessor();
  const { telefoneFormatter, dataFormatter } = useFormater();
  const strokeWidth = 1;
  const size = 16;
  const px = 2;

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
          className={`px-${px} py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer`}
        >
          <Eye strokeWidth={strokeWidth} size={size} />
        </Link>

        <Link
          href={`/professores/${professor.id}/editar`}
          className={`px-${px} py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors cursor-pointer`}
        >
          <Pencil strokeWidth={strokeWidth} size={size} />
        </Link>

        <button
          onClick={() => handleDeleteProfessor(professor.id)}
          className={`px-${px} py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer`}
        >
          <Trash2 strokeWidth={strokeWidth} size={size} />
        </button>
      </div>
    ),
  }));

  return (
    <div className="p-6 mx-auto bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Lista de Professores</h2>

      <div className="pb-3">
        <Link
          href="/professores/novo"
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Novo Professor
        </Link>
      </div>

      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        notFoundMessage="Nenhum professor encontrado."
      />
    </div>
  );
}
