import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getAulasProfessor } from '@/store/slices/professoresSlice';

export function useAulaProfessores(id) {
  const dispatch = useDispatch();
  const { aulas, status, action } = useSelector(state => state.professores);
  const isAction = action === 'getAulasProfessor';
  const isLoading =
    isAction && (status === STATUS.IDLE || status === STATUS.LOADING);
  const isSuccess = isAction && status === STATUS.SUCCESS;
  const isFailed = isAction && status === STATUS.FAILED;

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
