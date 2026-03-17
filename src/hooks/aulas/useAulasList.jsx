import { IDIOMA_LABEL, STATUS_AULA_LABEL, TIPO_AULA_LABEL } from '@/constants';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

export function useAulasList({
  aulas,
  dataFormatter,
  handleDeleteAula,
  readOnly = false,
  submit,
  isLoadingSubmit,
}) {
  const columns = [
    {
      name: '#',
      selector: row => row.id,
      sortable: true,
      width: '75px',
    },
    {
      name: 'Aluno',
      selector: row => row.aluno,
      sortable: true,
    },
    {
      name: 'Professor',
      selector: row => row.professor,
      sortable: true,
    },
    {
      name: 'Data',
      selector: row => row.dataAula,
      sortable: true,
    },
    {
      name: 'Hora inicial',
      selector: row => row.horaInicial,
      sortable: true,
    },
    {
      name: 'Hora final',
      selector: row => row.horaFinal,
      sortable: true,
    },
    {
      name: 'Tipo',
      selector: row => row.tipo,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    },
    {
      name: 'Idioma',
      selector: row => row.idioma,
      sortable: true,
    },
    {
      name: 'Ações',
      selector: row => row.acoes,
      sortable: false,
      width: 'auto',
    },
  ];

  if (readOnly) {
    columns.splice(columns.length - 1, 1);
  }

  const data = useMemo(() => {
    if (!aulas) return [];
    const iconParams = { strokeWidth: 1, size: 16, stroke: 'currentColor' };
    return aulas.map((aula, index) => ({
      id: index + 1,
      dataAula: dataFormatter(aula.dataAula),
      horaFinal: aula.horaFinal,
      horaInicial: aula.horaInicial,
      status: STATUS_AULA_LABEL[aula.status],
      idioma: IDIOMA_LABEL[aula.contrato.idioma],
      tipo: TIPO_AULA_LABEL[aula.tipo],
      aluno: aula.aluno?.nome || '-',
      professor: aula.professor?.nome || '-',
      acoes: (
        <div className="flex gap-2">
          <Link
            href={`/aulas/${aula.id}`}
            className="btn-outline btn-outline-primary"
          >
            <Eye {...iconParams} />
          </Link>

          <Link
            href={`/aulas/${aula.id}/editar`}
            className="btn-outline btn-outline-secondary"
          >
            <Pencil {...iconParams} />
          </Link>

          <button
            onClick={() => handleDeleteAula(aula.id)}
            className="btn-outline btn-outline-danger"
          >
            <Trash2 {...iconParams} />
          </button>
        </div>
      ),
    }));
  }, [aulas, dataFormatter, handleDeleteAula, submit, isLoadingSubmit]);
  return { columns, data };
}
