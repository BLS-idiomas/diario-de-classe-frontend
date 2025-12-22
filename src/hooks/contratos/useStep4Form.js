import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import {
  createManyAulas,
  clearStatus,
  clearCurrent,
  clearExtra,
} from '@/store/slices/contratosSlice';

export function useStep4Form({
  successSubmit,
  errorSubmit,
  clearError,
  setFormData,
}) {
  const dispatch = useDispatch();
  const { status, message, errors, extra, action } = useSelector(
    state => state.contratos
  );

  const submitStep4 = formData => {
    const id = formData.contratoId;
    const dataToSend = {
      idAluno: formData.alunoId,
      idProfessor: formData.professorId,
      aulas: formData.aulas,
    };
    clearError();
    dispatch(createManyAulas({ id, data: dataToSend }));
  };

  useEffect(() => {
    dispatch(clearStatus());
    dispatch(clearCurrent());
    dispatch(clearExtra());
  }, [dispatch]);

  useEffect(() => {
    if (action === 'createManyAulas') {
      if (status === STATUS.SUCCESS && extra) {
        const aulas = extra.aulas;
        setFormData(prev => ({
          ...prev,
          aulas,
        }));
        successSubmit();
      } else if (status === STATUS.FAILED) {
        errorSubmit({ message, errors });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, extra, action, message, errors]);

  return {
    submitStep4,
  };
}
