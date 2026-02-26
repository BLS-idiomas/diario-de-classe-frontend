import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import {
  createContrato,
  clearStatus,
  clearCurrent,
} from '@/store/slices/contratosSlice';

export function useNovoContrato({ successSubmit, errorSubmit, clearError }) {
  const dispatch = useDispatch();
  const { status, message, errors, current, action } = useSelector(
    state => state.contratos
  );

  const submit = formData => {
    const dataToSend = {
      idAluno: formData.alunoId,
      idProfessor: formData.professorId,
      dataInicio: formData.dataInicio,
      dataTermino: formData.dataTermino,
      diasAulas: formData.diasAulas,
      aulas: formData.aulas,
    };

    formData.diasAulas.forEach(diaAula => {
      dataToSend[diaAula.diaSemana] = {
        quantidadeAulas: diaAula.quantidadeAulas,
        horaInicial: diaAula.horaInicial,
        ativo: diaAula.ativo,
      };
    });

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
        successSubmit(current.id);
      } else if (status === STATUS.FAILED) {
        errorSubmit({ message, errors });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, current, action, message, errors]);

  return {
    submit,
  };
}
