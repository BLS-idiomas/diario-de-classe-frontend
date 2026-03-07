'use client';
import { useNovaAula } from '@/hooks/aulas/useNovaAula';
import { useAulaForm } from '@/hooks/aulas/useAulaForm';
import { AulaForm, FormPage } from '@/components';

export default function NovoAula() {
  const { message, errors, isLoading, submit } = useNovaAula();
  const { formData, handleChange, handleSubmit } = useAulaForm({
    submit,
  });

  return (
    <FormPage
      title="Nova aula"
      subTitle="Preencha os dados para criar uma nova aula"
      buttons={[
        {
          href: '/aulas',
          label: '← Voltar',
          type: 'secondary',
        },
      ]}
    >
      <AulaForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
        isLoading={isLoading}
        message={message}
        errors={errors}
      />
    </FormPage>
  );
}
