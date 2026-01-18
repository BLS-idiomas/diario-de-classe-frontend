import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getProfessores } from '@/store/slices/professoresSlice';

export function useProfessores() {
  const dispatch = useDispatch();
  const { list, status, action } = useSelector(state => state.professores);

  useEffect(() => {
    dispatch(getProfessores());
  }, [dispatch]);

  const isLoading =
    action === 'getProfessores' &&
    (status === STATUS.IDLE || status === STATUS.LOADING);

  return {
    professores: list,
    status,
    isLoading,
  };
}
