'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useUserAuth } from '@/providers/UserAuthProvider';
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
  const { currentUser } = useUserAuth();
  const { message, errors, isLoading, current, statusError, submit } =
    useEditarProfessor(currentUser.id);
  const { formData, isSenhaError, handleChange, handleSubmit, setFormData } =
    useProfessorForm({ submit, isEdit: true, id: currentUser.id });

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
        <Link href={'/meu-perfil'} className="btn btn-secondary">
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
