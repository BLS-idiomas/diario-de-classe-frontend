import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getAulas } from '@/store/slices/aulasSlice';

export function useAulas() {
  const dispatch = useDispatch();
  const { list, status, action } = useSelector(state => state.aulas);
  const searchAulas = query => dispatch(getAulas({ q: query }));

  useEffect(() => {
    dispatch(getAulas());
  }, [dispatch]);

  const isLoading =
    action === 'getAulas' &&
    (status === STATUS.IDLE || status === STATUS.LOADING);

  return {
    aulas: list,
    status,
    isLoading,
    searchAulas,
  };
}
