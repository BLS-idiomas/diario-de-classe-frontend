import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getProfessores } from '@/store/slices/professoresSlice';

export function useProfessores() {
  const dispatch = useDispatch();
  const { list, status } = useSelector(state => state.professores);

  useEffect(() => {
    dispatch(getProfessores());
  }, [dispatch]);

  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;
  const isSuccess = status === STATUS.SUCCESS;
  const isEmpty = isSuccess && list && list.length === 0;
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

  return {
    professores: list,
    status,
    isLoading,
    isSuccess,
    isEmpty,
    columns,
  };
}
