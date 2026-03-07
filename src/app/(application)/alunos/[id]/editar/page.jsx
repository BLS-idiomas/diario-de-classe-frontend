'use client';
import { useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useEditarAluno } from '@/hooks/alunos/useEditarAluno';
import { useAlunoForm } from '@/hooks/alunos/useAlunoForm';
import { AlunoForm, Loading, FormPage } from '@/components';

export default function EditarAluno() {
  const params = useParams();
  const { currentUser } = useUserAuth();
  const { message, errors, isLoading, current, isNotFound, submit } =
    useEditarAluno(params.id);
  const { formData, isSenhaError, handleChange, handleSubmit, setFormData } =
    useAlunoForm({
      submit,
      isEdit: true,
      id: params.id,
      criador: currentUser?.id,
    });
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
    <FormPage
      title="Editar Aluno"
      subTitle="Atualize os dados do aluno"
      buttons={[
        {
          href: `/alunos/${params.id}`,
          label: '← Voltar',
          type: 'secondary',
        },
      ]}
    >
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
    </FormPage>
  );
}
