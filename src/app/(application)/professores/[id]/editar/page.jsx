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
  Loading,
  FormPage,
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
    <FormPage
      title="Editar Professor"
      subTitle="Atualize os dados do professor"
      buttons={[
        {
          href: `/professores/${params.id}`,
          label: '← Voltar',
          type: 'secondary',
        },
      ]}
    >
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
    </FormPage>
  );
}
