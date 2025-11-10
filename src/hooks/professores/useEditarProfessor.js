import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/constants';
import { useToast } from '@/providers/ToastProvider';
import { updateProfessor, getProfessor } from '@/store/slices/professoresSlice';

export function useEditarProfessor(professorId) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors, current } = useSelector(
    state => state.professores
  );

  const initialFormData = useMemo(() => {
    if (current && current.id) {
      return {
        nome: current.nome || '',
        sobrenome: current.sobrenome || '',
        email: current.email || '',
        telefone: current.telefone || '',
        senha: '',
        repetirSenha: '',
        permissao: current.permissao || 'professor',
      };
    }
    return {
      nome: '',
      sobrenome: '',
      email: '',
      telefone: '',
      senha: '',
      repetirSenha: '',
      permissao: 'professor',
    };
  }, [current]);

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  useEffect(() => {
    if (professorId) {
      dispatch(getProfessor(professorId));
    }
  }, [dispatch, professorId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const { repetirSenha, ...dataToSend } = formData;

      const result = await dispatch(
        updateProfessor({ id: professorId, data: dataToSend })
      );

      if (updateProfessor.fulfilled.match(result)) {
        // Sucesso - redirecionar para lista
        success('Operação realizada com sucesso!');
        router.push('/professores');
      }
    } catch (error) {
      console.error('Erro ao editar professor:', error);
    }
  };

  // Estados computados para facilitar o uso
  const isLoading = status === STATUS.LOADING;
  const isSubmitting = status === STATUS.IDLE || status === STATUS.LOADING;

  return {
    formData,
    status,
    message,
    errors,
    current,
    isLoading,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
