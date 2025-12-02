'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useEditarProfessor } from '@/hooks/professores/useEditarProfessor';
import { useProfessorForm } from '@/hooks/professores/useProfessorForm';
import { STATUS_ERROR } from '@/constants/statusError';
import {
  ButtonGroup,
  PageContent,
  PageSubTitle,
  PageTitle,
  ProfessorForm,
  Container,
  Loading,
} from '@/components';

export default function EditarProfessor() {
  const params = useParams();
  const { message, errors, isLoading, current, statusError, submit } =
    useEditarProfessor(params.id);
  const { formData, isSenhaError, handleChange, handleSubmit, setFormData } =
    useProfessorForm({ submit, isEdit: true, id: params.id });

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

  return (
    <Container>
      <PageContent>
        <PageTitle>Editar Professor</PageTitle>

        <PageSubTitle>Atualize os dados do professor</PageSubTitle>
      </PageContent>
      <ButtonGroup>
        <Link href={`/professores/${params.id}`} className="btn btn-secondary">
          ← Voltar
        </Link>
      </ButtonGroup>

      <ProfessorForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
        isSenhaError={isSenhaError}
        isLoading={isLoading}
        message={message}
        errors={errors}
        isEdit
      />
    </Container>
  );
}
