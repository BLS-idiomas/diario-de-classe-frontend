import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getContratos } from '@/store/slices/contratosSlice';

export function useContratos() {
  const dispatch = useDispatch();
  const { list, status } = useSelector(state => state.contratos);

  useEffect(() => {
    dispatch(getContratos());
  }, [dispatch]);

  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;

  return {
    contratos: list,
    status,
    isLoading,
  };
}
