'use client';

import Link from 'next/link';
import { useNovaAula } from '@/hooks/aulas/useNovaAula';
import { useAulaForm } from '@/hooks/aulas/useAulaForm';
import {
  ButtonGroup,
  PageContent,
  PageSubTitle,
  PageTitle,
  AulaForm,
} from '@/components';

export default function NovoAula() {
  const { message, errors, isLoading, submit } = useNovaAula();
  const { formData, handleChange, handleSubmit } = useAulaForm({
    submit,
  });

  return (
    <>
      <PageContent>
        <PageTitle>Nova aula</PageTitle>

        <PageSubTitle>Preencha os dados para criar uma nova aula</PageSubTitle>
      </PageContent>

      <ButtonGroup>
        <Link href="/aulas" className="btn btn-secondary">
          ← Voltar
        </Link>
      </ButtonGroup>

      <AulaForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
        isLoading={isLoading}
        message={message}
        errors={errors}
      />
    </>
  );
}
