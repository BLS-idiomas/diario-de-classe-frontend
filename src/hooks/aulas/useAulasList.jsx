import { useMemo } from 'react';

export function useAulasList({ aulas, dataFormatter }) {
  const columns = [
    {
      name: '#',
      selector: row => row.id,
      sortable: true,
      width: '75px',
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
      name: 'Data de criação',
      selector: row => row.dataCriacao,
      sortable: true,
    },
  ];
  const data = useMemo(() => {
    if (!aulas) return [];
    return aulas.map(aula => ({
      dataCriacao: dataFormatter(aula.dataCriacao),
      horaFinal: aula.horaFinal,
      horaInicial: aula.horaInicial,
      id: dataFormatter(aula.dataAula),
      status: aula.status,
      tipo: aula.tipo,
    }));
  }, [aulas, dataFormatter]);
  return { columns, data };
}
