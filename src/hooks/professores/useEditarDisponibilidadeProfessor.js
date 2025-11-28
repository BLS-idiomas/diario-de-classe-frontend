import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/constants';
import { useToast } from '@/providers/ToastProvider';
import { updateDisponibilidadeProfessor } from '@/store/slices/professoresSlice';
import { clearStatus, clearCurrent } from '@/store/slices/professoresSlice';

export function useEditarDisponibilidadeProfessor(professorId) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors, action } = useSelector(
    state => state.professores
  );

  useEffect(() => {
    if (
      status === STATUS.SUCCESS &&
      action === 'updateDisponibilidadeProfessor'
    ) {
      dispatch(clearCurrent());
      dispatch(clearStatus());
      success('Operação realizada com sucesso!');
      router.push(`/professores/${professorId}`);
    }
  }, [status, router, success, action, professorId, dispatch]);

  const submit = ({ id, dataToSend }) => {
    dispatch(updateDisponibilidadeProfessor({ id: id, data: dataToSend }));
  };

  // Estados computados para facilitar o uso
  const isLoading = status === STATUS.LOADING;
  const isSubmitting = status === STATUS.IDLE || status === STATUS.LOADING;

  return {
    message,
    errors,
    isLoading,
    isSubmitting,
    submit,
  };
}
