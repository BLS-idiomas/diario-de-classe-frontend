import { IDIOMA_LABEL, STATUS_AULA_LABEL, TIPO_AULA_LABEL } from '@/constants';
import { buildQueryString } from '@/utils/bindUrlParams';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { withStickyColumns } from '@/utils/tableResponsivo';

export function useAulasList({
  aulas,
  dataFormatter,
  handleDeleteAula,
  readOnly = false,
  submit,
  isLoadingSubmit,
  backUrl = null,
}) {
  const backUrlParam = !backUrl ? '' : buildQueryString({ backUrl });
  const columns = [
    {
      name: '#',
      essential: true,
      selector: row => row.id,
      sortable: true,
      width: '75px',
    },
    {
      name: 'Aluno',
      essential: true,
      selector: row => row.aluno,
      sortable: true,
    },
    {
      name: 'Professor',
      essential: false,
      selector: row => row.professor,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Data',
      essential: true,
      selector: row => row.dataAula,
      sortable: true,
    },
    {
      name: 'Hora inicial',
      essential: true,
      selector: row => row.horaInicial,
      sortable: true,
    },
    {
      name: 'Hora final',
      essential: false,
      selector: row => row.horaFinal,
      sortable: true,
    },
    {
      name: 'Tipo',
      essential: false,
      selector: row => row.tipo,
      sortable: true,
    },
    {
      name: 'Status',
      essential: false,
      selector: row => row.status,
      sortable: true,
    },
    {
      name: 'Idioma',
      essential: false,
      selector: row => row.idioma,
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
    if (!aulas) return [];
    const iconParams = { strokeWidth: 1, size: 16, stroke: 'currentColor' };
    return aulas.map((aula, index) => ({
      id: index + 1,
      dataAula: dataFormatter(aula.dataAula),
      horaFinal: aula.horaFinal,
      horaInicial: aula.horaInicial,
      status: STATUS_AULA_LABEL[aula.status],
      idioma: IDIOMA_LABEL[aula.contrato?.idioma],
      tipo: TIPO_AULA_LABEL[aula.tipo],
      aluno: aula.aluno?.nome || '-',
      professor: aula.professor?.nome || '-',
      acoes: (
        <div className="flex gap-2">
          <Link
            href={`/aulas/${aula.id}${backUrlParam}`}
            className="btn-outline btn-outline-primary"
          >
            <Eye {...iconParams} />
          </Link>

          <Link
            href={`/aulas/${aula.id}/editar${backUrlParam}`}
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
  }, [
    aulas,
    dataFormatter,
    handleDeleteAula,
    submit,
    isLoadingSubmit,
    backUrlParam,
  ]);
  return { columns: stickyColumns, data };
}
