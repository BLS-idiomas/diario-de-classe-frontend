import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { useToast } from '@/providers/ToastProvider';
import { updateDisponibilidadeProfessor } from '@/store/slices/professoresSlice';
import { clearStatus } from '@/store/slices/professoresSlice';

export function useEditarDisponibilidadeProfessor(professor) {
  const dispatch = useDispatch();
  const { success } = useToast();
  const { status, message, errors, action } = useSelector(
    state => state.professores
  );
  const dias = [
    'SEGUNDA',
    'TERCA',
    'QUARTA',
    'QUINTA',
    'SEXTA',
    'SABADO',
    'DOMINGO',
  ];
  const isLoading =
    action === 'updateDisponibilidadeProfessor' && status === STATUS.LOADING;
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(() => {
    const disponibilidadesMap = {};
    dias.forEach(dia => {
      disponibilidadesMap[dia] = {
        id: null,
        diaSemana: dia,
        horaInicial: null,
        horaFinal: null,
        ativo: null,
        userId: null,
      };
    });
    return disponibilidadesMap;
  });

  const setDisponibilidadesHandle = disponibilidades => {
    const disponibilidadesMap = {};

    dias.forEach(dia => {
      const disponibilidade =
        disponibilidades.find(disp => disp.diaSemana === dia) || {};

      disponibilidadesMap[dia] = {
        id: disponibilidade.id,
        diaSemana: dia,
        horaInicial: disponibilidade.horaInicial,
        horaFinal: disponibilidade.horaFinal,
        ativo: disponibilidade.ativo,
        userId: disponibilidade.userId,
      };
    });

    setFormData(disponibilidadesMap);
  };

  const changeForm = (name, value) => {
    const array = name.split('.');
    setFormData(prev => ({
      ...prev,
      [array[0]]: {
        ...prev[array[0]],
        [array[1]]: value,
      },
    }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    changeForm(name, value);
  };

  const handleCheckboxChange = e => {
    const { name, checked } = e.target;
    changeForm(name, checked);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const id = professor.id;
    const dataToSend = Object.values(formData);
    dispatch(updateDisponibilidadeProfessor({ id: id, data: dataToSend }));
  };

  useEffect(() => {
    if (
      status === STATUS.SUCCESS &&
      action === 'updateDisponibilidadeProfessor'
    ) {
      dispatch(clearStatus());
      success('Operação realizada com sucesso!');
      queueMicrotask(() => {
        setEditMode(false);
      });
    }
  }, [status, success, action, dispatch]);

  return {
    message,
    errors,
    isLoading,
    editMode,
    formData,
    setDisponibilidadesHandle,
    setEditMode,
    setFormData,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
  };
}
