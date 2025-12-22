import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getAlunosProfessor } from '@/store/slices/professoresSlice';

export function useAlunosProfessores(id) {
  const dispatch = useDispatch();
  const { alunos, status } = useSelector(state => state.professores);
  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;
  const isSuccess = status === STATUS.SUCCESS;
  const isFailed = status === STATUS.FAILED;

  useEffect(() => {
    if (id) dispatch(getAlunosProfessor(id));
  }, [dispatch, id]);

  return {
    alunos,
    isLoading,
    isSuccess,
    isFailed,
  };
}
