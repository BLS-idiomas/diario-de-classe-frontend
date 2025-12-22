import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import {
  createManyDiasAulas,
  clearStatus,
  clearCurrent,
  clearExtra,
} from '@/store/slices/contratosSlice';

export function useStep2Form({
  successSubmit,
  errorSubmit,
  clearError,
  setFormData,
}) {
  const dispatch = useDispatch();
  const { status, message, errors, extra, action } = useSelector(
    state => state.contratos
  );

  const submitStep2 = formData => {
    const id = formData.contratoId;
    const dataToSend = {
      idAluno: formData.alunoId,
    };
    formData.diasAulas.forEach(diaAula => {
      dataToSend[diaAula.diaSemana] = {
        quantidadeAulas: diaAula.quantidadeAulas,
        horaInicial: diaAula.horaInicial,
        ativo: diaAula.ativo,
      };
    });
    clearError();
    dispatch(createManyDiasAulas({ id, data: dataToSend }));
  };

  useEffect(() => {
    dispatch(clearStatus());
    dispatch(clearCurrent());
    dispatch(clearExtra());
  }, [dispatch]);

  useEffect(() => {
    if (action === 'createManyDiasAulas') {
      if (status === STATUS.SUCCESS && extra) {
        setFormData(prev => ({
          ...prev,
          currentDiasAulas: extra,
        }));
        successSubmit();
      } else if (status === STATUS.FAILED) {
        errorSubmit({ message, errors });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, extra, action, message, errors]);

  return {
    submitStep2,
  };
}
