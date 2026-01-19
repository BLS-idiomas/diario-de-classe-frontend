'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useEditarAluno } from '@/hooks/alunos/useEditarAluno';
import { useAlunoForm } from '@/hooks/alunos/useAlunoForm';
import {
  ButtonGroup,
  PageContent,
  PageSubTitle,
  PageTitle,
  AlunoForm,
  Loading,
} from '@/components';

export default function EditarAluno() {
  const params = useParams();
  const { message, errors, isLoading, current, isNotFound, submit } =
    useEditarAluno(params.id);
  const { formData, isSenhaError, handleChange, handleSubmit, setFormData } =
    useAlunoForm({ submit, isEdit: true, id: params.id });

  useEffect(() => {
    if (current) {
      setFormData(current);
    }
  }, [current, setFormData]);

  useEffect(() => {
    if (isNotFound) {
      return notFound();
    }
  }, [isNotFound]);

  if (isLoading && !current) {
    return <Loading />;
  }

  return (
    <>
      <PageContent>
        <PageTitle>Editar Aluno</PageTitle>

        <PageSubTitle>Atualize os dados do aluno</PageSubTitle>
      </PageContent>
      <ButtonGroup>
        <Link href={`/alunos/${params.id}`} className="btn btn-secondary">
          ← Voltar
        </Link>
      </ButtonGroup>

      <AlunoForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
        isSenhaError={isSenhaError}
        isLoading={isLoading}
        message={message}
        errors={errors}
        isEdit
      />
    </>
  );
}
