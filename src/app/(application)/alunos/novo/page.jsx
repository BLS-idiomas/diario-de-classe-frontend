'use client';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useNovoAluno } from '@/hooks/alunos/useNovoAluno';
import { useAlunoForm } from '@/hooks/alunos/useAlunoForm';
import { AlunoForm, FormPage } from '@/components';

export default function NovoAluno() {
  const { currentUser } = useUserAuth();
  const { message, errors, isLoading, isSubmitting, submit } = useNovoAluno();
  const { formData, isSenhaError, handleChange, handleSubmit } = useAlunoForm({
    submit,
    criador: currentUser?.id,
  });

  return (
    <FormPage
      title="Novo Aluno"
      subTitle="Preencha os dados para criar um novo aluno"
      buttons={[
        {
          href: '/alunos',
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
        isSubmitting={isSubmitting}
        isLoading={isLoading}
        message={message}
        errors={errors}
      />
    </FormPage>
  );
}
