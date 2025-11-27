import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getAulasProfessor } from '@/store/slices/professoresSlice';

export function useAulaProfessores(id) {
  const dispatch = useDispatch();
  const { aulas, status } = useSelector(state => state.professores);
  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;
  const isSuccess = status === STATUS.SUCCESS;
  const isFailed = status === STATUS.FAILED;

  useEffect(() => {
    if (id) dispatch(getAulasProfessor(id));
  }, [dispatch, id]);

  return {
    aulas,
    isLoading,
    isSuccess,
    isFailed,
  };
}
