import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/constants';
import { createProfessor } from '@/store/slices/professoresSlice';
import { useToast } from '@/providers/ToastProvider';

export function useNovoProfessor() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors } = useSelector(state => state.professores);

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    senha: '',
    repetirSenha: '',
    permissao: 'professor',
  });

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

      const result = await dispatch(createProfessor(dataToSend));

      if (createProfessor.fulfilled.match(result)) {
        // Sucesso - redirecionar para lista
        success('Operação realizada com sucesso!');
        router.push('/professores');
      }
    } catch (error) {
      console.error('Erro ao criar professor:', error);
    }
  };

  // Estados computados para facilitar o uso
  const isLoading = status === STATUS.LOADING;
  const isSubmitting = status === STATUS.IDLE || status === STATUS.LOADING;

  return {
    formData,
    message,
    errors,
    isLoading,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
