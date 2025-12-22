import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import {
  createContrato,
  clearStatus,
  clearCurrent,
} from '@/store/slices/contratosSlice';

export function useStep1Form({
  successSubmit,
  errorSubmit,
  clearError,
  setFormData,
}) {
  const dispatch = useDispatch();
  const { status, message, errors, current, action } = useSelector(
    state => state.contratos
  );

  const submitStep1 = formData => {
    const dataToSend = {
      idAluno: formData.alunoId,
    };
    clearError();
    dispatch(createContrato(dataToSend));
  };

  useEffect(() => {
    dispatch(clearStatus());
    dispatch(clearCurrent());
  }, [dispatch]);

  useEffect(() => {
    if (action === 'createContrato') {
      if (status === STATUS.SUCCESS && current) {
        setFormData(prev => ({
          ...prev,
          contratoId: current.id,
          contrato: current,
        }));
        successSubmit();
      } else if (status === STATUS.FAILED) {
        errorSubmit({ message, errors });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, current, action, message, errors]);

  return {
    submitStep1,
  };
}
