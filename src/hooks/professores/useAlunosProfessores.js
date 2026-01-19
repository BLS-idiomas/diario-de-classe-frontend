import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getAlunosProfessor } from '@/store/slices/professoresSlice';

export function useAlunosProfessores(id) {
  const dispatch = useDispatch();
  const { alunos, status, action } = useSelector(state => state.professores);
  const isAction = action === 'getAlunosProfessor';
  const isLoading =
    isAction && (status === STATUS.IDLE || status === STATUS.LOADING);
  const isSuccess = isAction && status === STATUS.SUCCESS;
  const isFailed = isAction && status === STATUS.FAILED;

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
