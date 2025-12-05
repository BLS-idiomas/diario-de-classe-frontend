'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useEditarAluno } from '@/hooks/alunos/useEditarAluno';
import { useAlunoForm } from '@/hooks/alunos/useAlunoForm';
import { STATUS_ERROR } from '@/constants/statusError';
import {
  ButtonGroup,
  PageContent,
  PageSubTitle,
  PageTitle,
  AlunoForm,
  Container,
  Loading,
} from '@/components';

export default function EditarAluno() {
  const params = useParams();
  const { message, errors, isLoading, current, statusError, submit } =
    useEditarAluno(params.id);
  const { formData, isSenhaError, handleChange, handleSubmit, setFormData } =
    useAlunoForm({ submit, isEdit: true, id: params.id });

  useEffect(() => {
    if (current) {
      setFormData({
        ...current,
        senha: '',
        repetirSenha: '',
      });
    }
  }, [current, setFormData]);

  useEffect(() => {
    if (
      statusError === STATUS_ERROR.BAD_REQUEST ||
      statusError === STATUS_ERROR.NOT_FOUND
    ) {
      return notFound();
    }
  }, [statusError]);

  if (isLoading && !current) {
    return <Loading />;
  }

  return <h1>Editar aluno page</h1>;
}
