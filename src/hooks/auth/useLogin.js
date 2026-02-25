import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/constants';
import { useToast } from '@/providers/ToastProvider';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { login, clearStatus } from '@/store/slices/authSlice';

export function useLogin() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { authenticate } = useUserAuth();
  const { success, error } = useToast();
  const { status, message, action, data } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const isLoading = status === STATUS.LOADING;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.email || !formData.senha) {
      error('Preencha o email e senha.');
      return;
    }

    dispatch(login(formData));
  };

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (action === 'login' && status === STATUS.FAILED && message) {
      error(message);
    }
  }, [status, action, message, error]);

  useEffect(() => {
    if (action === 'login' && status === STATUS.SUCCESS && data && data.user) {
      dispatch(clearStatus());
      success(`Bem-vindo, ${data.user.nome} ${data.user.sobrenome}!`);
      authenticate({
        currentUser: data.user,
        duracaoAula: data.configuracao.duracaoAula,
        tolerancia: data.configuracao.tolerancia,
        diasDeFuncionamento: data.configuracao.diasDeFuncionamento,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenType: data.tokenType,
        expiresIn: data.expiresIn,
      });
      router.push('/');
    }
  }, [status, router, success, data, action, authenticate, dispatch]);

  return {
    message,
    isLoading,
    formData,
    handleSubmit,
    handleChange,
  };
}
