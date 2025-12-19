import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import {
  clearStatus,
  clearCurrent,
  validateContrato,
} from '@/store/slices/contratosSlice';

export function useStep5Form({
  successSubmit,
  errorSubmit,
  clearError,
  setFormData,
}) {
  const dispatch = useDispatch();
  const { status, message, errors, current, action } = useSelector(
    state => state.contratos
  );

  const submitStep5 = formData => {
    const id = formData.contratoId;
    clearError();
    dispatch(validateContrato(id));
  };

  useEffect(() => {
    dispatch(clearStatus());
    dispatch(clearCurrent());
  }, [dispatch]);

  useEffect(() => {
    if (action === 'validateContrato') {
      if (status === STATUS.SUCCESS && current) {
        setFormData(prev => ({
          ...prev,
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
    submitStep5,
  };
}
