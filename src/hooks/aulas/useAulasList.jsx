import { AndamentoAulaButton } from '@/components';
import { STATUS_AULA_LABEL, TIPO_AULA } from '@/constants';
import { Pencil, Trash2 } from 'lucide-react';
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
      name: 'Data',
      selector: row => row.dataCriacao,
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
    const iconParams = { strokeWidth: 1, size: 16 };
    return aulas.map((aula, index) => ({
      id: index + 1,
      dataCriacao: dataFormatter(aula.dataCriacao),
      horaFinal: aula.horaFinal,
      horaInicial: aula.horaInicial,
      status: STATUS_AULA_LABEL[aula.status],
      tipo: TIPO_AULA[aula.tipo],
      acoes: (
        <div className="flex gap-2">
          {/* <Link
            href={`/aulas/${aula.id}`}
            className="btn-outline btn-outline-primary"
          >
            <Eye {...iconParams} stroke="blue" />
          </Link> */}

          {submit && (
            <>
              {aula.status === 'AGENDADA' && (
                <AndamentoAulaButton
                  id={aula.id}
                  nextStatus={'EM_ANDAMENTO'}
                  submit={submit}
                  isLoading={isLoadingSubmit}
                />
              )}
              {aula.status === 'EM_ANDAMENTO' && (
                <>
                  <AndamentoAulaButton
                    id={aula.id}
                    nextStatus={'CONCLUIDA'}
                    submit={submit}
                    isLoading={isLoadingSubmit}
                  />
                  <AndamentoAulaButton
                    id={aula.id}
                    nextStatus={'CANCELADA'}
                    submit={submit}
                    isLoading={isLoadingSubmit}
                  />
                </>
              )}
            </>
          )}

          <Link
            href={`/aulas/${aula.id}/editar`}
            className="btn-outline btn-outline-secondary"
          >
            <Pencil {...iconParams} stroke="gray" />
          </Link>

          <button
            onClick={() => handleDeleteAula(aula.id)}
            className="btn-outline btn-outline-danger"
          >
            <Trash2 {...iconParams} stroke="red" />
          </button>
        </div>
      ),
    }));
  }, [aulas, dataFormatter, handleDeleteAula, submit, isLoadingSubmit]);
  return { columns, data };
}
