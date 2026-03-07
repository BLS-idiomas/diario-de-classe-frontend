'use client';
import { useNovoProfessor } from '@/hooks/professores/useNovoProfessor';
import { useProfessorForm } from '@/hooks/professores/useProfessorForm';
import { FormPage, ProfessorForm } from '@/components';

export default function NovoProfessor() {
  const { message, errors, isLoading, isSubmitting, submit } =
    useNovoProfessor();
  const { formData, isSenhaError, handleChange, handleSubmit } =
    useProfessorForm({ submit });

  return (
    <FormPage
      title="Novo Professor"
      subTitle="Preencha os dados para criar um novo professor"
      buttons={[
        {
          href: '/professores',
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
        isSubmitting={isSubmitting}
        isLoading={isLoading}
        message={message}
        errors={errors}
      />
    </FormPage>
  );
}
