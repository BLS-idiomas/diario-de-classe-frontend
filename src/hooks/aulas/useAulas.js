import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getAulas } from '@/store/slices/aulasSlice';

export function useAulas() {
  const dispatch = useDispatch();
  const { list, status } = useSelector(state => state.aulas);

  useEffect(() => {
    dispatch(getAulas());
  }, [dispatch]);

  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;

  return {
    aulas: list,
    status,
    isLoading,
  };
}
