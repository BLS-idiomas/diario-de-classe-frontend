import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import {
  clearStatus,
  clearCurrent,
  clearExtra,
  generateAulas,
} from '@/store/slices/contratosSlice';

export function useGenerateAulasByContrato({
  errorSubmit,
  clearError,
  setFormData,
}) {
  const dispatch = useDispatch();
  const { status, message, errors, extra, action } = useSelector(
    state => state.contratos
  );

  const generateAulasByContrato = formData => {
    const id = formData.contratoId;
    const dataToSend = {
      dataInicio: formData.contrato?.dataInicio,
      dataFim: formData.contrato?.dataTermino,
      diasAulas: formData.currentDiasAulas,
    };
    clearError();
    dispatch(generateAulas({ id, data: dataToSend }));
  };

  useEffect(() => {
    dispatch(clearStatus());
    dispatch(clearCurrent());
    dispatch(clearExtra());
  }, [dispatch]);

  useEffect(() => {
    if (action === 'generateAulas') {
      if (status === STATUS.SUCCESS && extra) {
        const aulas = (extra.aulas || []).map((aula, index) => ({
          id: aula.id || index + 1,
          ...aula,
        }));
        setFormData(prev => ({
          ...prev,
          aulas,
        }));
      } else if (status === STATUS.FAILED) {
        errorSubmit({ message, errors });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, extra, action, message, errors]);

  return {
    generateAulasByContrato,
  };
}
