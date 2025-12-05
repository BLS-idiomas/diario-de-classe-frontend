import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getAlunos } from '@/store/slices/alunosSlice';

export function useAlunos() {
  const dispatch = useDispatch();
  const { list, status } = useSelector(state => state.alunos);

  useEffect(() => {
    dispatch(getAlunos());
  }, [dispatch]);

  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;

  return {
    alunos: list,
    status,
    isLoading,
  };
}
