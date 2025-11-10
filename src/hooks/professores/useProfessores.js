import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import {
  getProfessores,
  deleteProfessor,
} from '@/store/slices/professoresSlice';

export function useProfessores() {
  const dispatch = useDispatch();
  const { list, status } = useSelector(state => state.professores);

  useEffect(() => {
    dispatch(getProfessores());
  }, [dispatch]);

  const handleDeleteProfessor = id => {
    dispatch(deleteProfessor(id));
  };

  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;
  const isSuccess = status === STATUS.SUCCESS;
  const isEmpty = isSuccess && list.length === 0;

  return {
    professores: list,
    status,
    isLoading,
    isSuccess,
    isEmpty,
    handleDeleteProfessor,
  };
}
