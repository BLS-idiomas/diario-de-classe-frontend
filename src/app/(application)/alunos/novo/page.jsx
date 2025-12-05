'use client';

import Link from 'next/link';
import { useNovoAluno } from '@/hooks/alunos/useNovoAluno';
import { useAlunoForm } from '@/hooks/alunos/useAlunoForm';
import {
  ButtonGroup,
  Container,
  PageContent,
  PageSubTitle,
  PageTitle,
  AlunoForm,
} from '@/components';

export default function NovoAluno() {
  const { message, errors, isLoading, isSubmitting, submit } = useNovoAluno();
  const { formData, isSenhaError, handleChange, handleSubmit } = useAlunoForm({
    submit,
  });

  return <h1>Novo Aluno Page</h1>;
}
