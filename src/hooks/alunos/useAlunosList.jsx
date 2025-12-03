import { useMemo } from 'react';

export function useAlunosList({
  alunos,
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
      name: 'Data de criação',
      selector: row => row.dataCriacao,
      sortable: true,
    },
  ];
  const data = useMemo(() => {
    if (!alunos) return [];
    return alunos.map((aluno, index) => ({
      id: parseInt(index) + 1,
      name: aluno.nome,
      sobrenome: aluno.sobrenome,
      telefone: telefoneFormatter(aluno.telefone),
      email: aluno.email,
      dataCriacao: dataFormatter(aluno.dataCriacao),
    }));
  }, [alunos, telefoneFormatter, dataFormatter]);
  return { columns, data };
}
