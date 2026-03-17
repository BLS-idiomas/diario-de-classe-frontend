import { useState } from 'react';
import { IDIOMA, PERMISSAO } from '@/constants';

export function useProfessorForm({ id = null, isEdit = false, submit }) {
  const [isSenhaError, setIsSenhaError] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    senha: '',
    repetirSenha: '',
    idioma: IDIOMA.INGLES,
    idiomas: [IDIOMA.INGLES],
    permissao: PERMISSAO.MEMBER,
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

    // impedindo continuar caso as senhas não batam
    if (formData.senha !== formData.repetirSenha) {
      setIsSenhaError(true);
      return;
    }
    setIsSenhaError(false);
    const { repetirSenha, ...dataToSend } = formData;
    dataToSend.idiomas = [dataToSend.idioma];
    delete dataToSend.idioma;
    submit({ id, dataToSend });
  };

  return {
    isSenhaError,
    formData,
    handleSubmit,
    handleChange,
    setFormData,
  };
}
