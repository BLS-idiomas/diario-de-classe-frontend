import { Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

export function useContratosList({
  contratos,
  dataFormatter,
  handleDeleteContrato,
  readOnly = false,
}) {
  const columns = [
    {
      name: '#',
      selector: row => row.id,
      sortable: true,
      width: '75px',
    },
    {
      name: 'Data início',
      selector: row => row.dataInicio,
      sortable: true,
    },
    {
      name: 'Data fim',
      selector: row => row.dataTermino,
      sortable: true,
    },
    {
      name: 'Total de aulas',
      selector: row => row.totalAulas,
      sortable: true,
    },
    {
      name: 'Aulas',
      selector: row => row.totalAulasFeitas,
      sortable: true,
    },
    {
      name: 'Reposições',
      selector: row => row.totalReposicoes,
      sortable: true,
    },
    {
      name: 'Faltas',
      selector: row => row.totalFaltas,
      sortable: true,
    },
    {
      name: 'Canceladas',
      selector: row => row.totalAulasCanceladas,
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
    if (!contratos) return [];

    const iconParams = { strokeWidth: 1, size: 16 };
    return contratos.map((contrato, index) => ({
      id: parseInt(index) + 1,
      dataInicio: dataFormatter(contrato.dataInicio),
      dataTermino: dataFormatter(contrato.dataTermino),
      totalAulas: contrato.totalAulas,
      totalAulasFeitas: contrato.totalAulasFeitas,
      totalReposicoes: contrato.totalReposicoes,
      totalFaltas: contrato.totalFaltas,
      totalAulasCanceladas: contrato.totalAulasCanceladas,
      acoes: (
        <div className="flex gap-2">
          <Link
            href={`/contratos/${contrato.id}`}
            className="btn-outline btn-outline-primary"
          >
            <Eye {...iconParams} stroke="blue" />
          </Link>

          <Link
            href={`/contratos/formulario?id=${contrato.id}&mode=edit`}
            className="btn-outline btn-outline-secondary"
          >
            <Pencil {...iconParams} stroke="gray" />
          </Link>

          <button
            onClick={() => handleDeleteContrato(contrato.id)}
            className="btn-outline btn-outline-danger"
          >
            <Trash2 {...iconParams} stroke="red" />
          </button>
        </div>
      ),
    }));
  }, [contratos, dataFormatter, handleDeleteContrato]);
  return { columns, data };
}
