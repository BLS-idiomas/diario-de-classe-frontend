import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfessor } from '@/store/slices/professoresSlice';
import { STATUS } from '@/constants';

export function useProfessor(id) {
  const dispatch = useDispatch();
  const { current, message, status } = useSelector(state => state.professores);

  useEffect(() => {
    if (id) {
      dispatch(getProfessor(id));
    }
  }, [dispatch, id]);

  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;
  const isSuccess = status === STATUS.SUCCESS;
  const isFailed = status === STATUS.FAILED;

  return {
    professor: current,
    message,
    isLoading,
    isSuccess,
    isFailed,
  };
}
