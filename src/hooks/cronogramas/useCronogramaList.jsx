import { useMemo } from 'react';
import { Pencil } from 'lucide-react';
import { STATUS_AULA_LABEL, TIPO_AULA_LABEL } from '@/constants';

export function useCronogramaList({
  linhas,
  dataFormatter,
  handleLancarConteudo,
  readOnly = false,
}) {
  const columns = [
    {
      name: 'Ordem',
      selector: row => row.ordem,
      sortable: true,
      width: '90px',
    },
    {
      name: 'Conteúdo',
      selector: row => row.titulo,
      sortable: true,
    },
    {
      name: 'Descrição / tarefa',
      selector: row => row.descricao,
      sortable: false,
    },
    {
      name: 'Data',
      selector: row => row.dataAula,
      sortable: true,
    },
    {
      name: 'Hora',
      selector: row => row.hora,
      sortable: false,
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
    if (!linhas) return [];
    const iconParams = { strokeWidth: 1, size: 16, stroke: 'currentColor' };

    return linhas.map(linha => ({
      ordem: linha.ordem ?? '-',
      // Aula cancelada, falta ou do tipo OUTRA não carrega conteúdo: o texto
      // explica a lacuna em vez de deixar a célula vazia.
      titulo: linha.titulo || '— sem conteúdo —',
      descricao: linha.descricao || '-',
      dataAula: dataFormatter(linha.dataAula),
      hora: `${linha.horaInicial} - ${linha.horaFinal}`,
      tipo: TIPO_AULA_LABEL[linha.tipo] || linha.tipo,
      status: linha.conteudoManual
        ? `${STATUS_AULA_LABEL[linha.status] || linha.status} (manual)`
        : STATUS_AULA_LABEL[linha.status] || linha.status,
      acoes: (
        <div className="flex gap-2">
          <button
            onClick={() => handleLancarConteudo(linha)}
            className="btn-outline btn-outline-secondary"
            title="Lançar conteúdo desta aula"
          >
            <Pencil {...iconParams} />
          </button>
        </div>
      ),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linhas, dataFormatter]);

  return { columns, data };
}
