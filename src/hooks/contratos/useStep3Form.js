import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import {
  clearStatus,
  clearCurrent,
  updateContrato,
} from '@/store/slices/contratosSlice';

export function useStep3Form({
  successSubmit,
  errorSubmit,
  clearError,
  setFormData,
}) {
  const dispatch = useDispatch();
  const { status, message, errors, current, action } = useSelector(
    state => state.contratos
  );

  const submitStep3 = formData => {
    const id = formData.contratoId;
    const dataToSend = {
      dataInicio: formData.dataInicio,
      dataTermino: formData.dataTermino,
    };
    clearError();
    dispatch(updateContrato({ id, data: dataToSend }));
  };

  useEffect(() => {
    dispatch(clearStatus());
    dispatch(clearCurrent());
  }, [dispatch]);

  useEffect(() => {
    if (action === 'updateContrato') {
      if (status === STATUS.SUCCESS && current) {
        setFormData(prev => ({
          ...prev,
          currentDiasAulas: current,
        }));
        successSubmit();
      } else if (status === STATUS.FAILED) {
        errorSubmit({ message, errors });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, current, action, message, errors]);

  return {
    submitStep3,
  };
}
