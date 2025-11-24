'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { useDeletarProfessor } from '@/hooks/professores/useDeletarProfessor';
import { useFormater } from '@/hooks/useFormater';
import { useProfessoresList } from '@/hooks/professores/useProfessoresList';
import { Table } from '@/components';

export default function Professores() {
  const { professores, isLoading } = useProfessores();
  const { handleDeleteProfessor } = useDeletarProfessor();
  const { telefoneFormatter, dataFormatter } = useFormater();
  const { columns, data } = useProfessoresList({
    professores,
    telefoneFormatter,
    dataFormatter,
    handleDeleteProfessor,
  });

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
