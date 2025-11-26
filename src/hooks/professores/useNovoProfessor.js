import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/constants';
import { createProfessor } from '@/store/slices/professoresSlice';
import { useToast } from '@/providers/ToastProvider';
import { isAdmin } from '@/utils/isAdmin';

export function useNovoProfessor() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors } = useSelector(state => state.professores);

  const [isSenhaError, setIsSenhaError] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    senha: '',
    repetirSenha: '',
    permissao: 'professor',
  });

  // Compute isError directly without setState in effect
  const isError = (errors && errors.length > 0) || !!message || isSenhaError;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // impedindo continuar caso as senhas não batam
    if (formData.senha !== formData.repetirSenha) {
      setErroSenha(true);
      return;
    }

    try {
      const { repetirSenha, ...dataToSend } = formData;

      const result = await dispatch(createProfessor(dataToSend));

      if (createProfessor.fulfilled.match(result)) {
        success('Operação realizada com sucesso!');
        router.push('/professores');
      }
    } catch (error) {
      console.error('Erro ao criar professor:', error);
    }
  };

  // Estados computados para facilitar o uso
  const isLoading = status === STATUS.LOADING;
  const isSubmitting = status === STATUS.LOADING;

  return {
    formData,
    message,
    errors,
    isLoading,
    isSubmitting,
    isSenhaError,
    isError,
    isAdmin,
    handleChange,
    handleSubmit,
  };
}
