'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { STATUS_ERROR } from '@/constants';
import { useEditarAula } from '@/hooks/aulas/useEditarAula';
import { useAulaForm } from '@/hooks/aulas/useAulaForm';
import {
  ButtonGroup,
  PageContent,
  PageSubTitle,
  PageTitle,
  AulaForm,
  Container,
  Loading,
} from '@/components';

export default function EditarAula() {
  const params = useParams();
  const { message, errors, isLoading, current, statusError, submit } =
    useEditarAula(params.id);
  const { formData, handleChange, handleSubmit, setFormData } = useAulaForm({
    submit,
    isEdit: true,
    id: params.id,
  });

  useEffect(() => {
    if (current) {
      setFormData(current);
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
        <PageTitle>Editar Aula</PageTitle>

        <PageSubTitle>Atualize os dados da aula</PageSubTitle>
      </PageContent>
      <ButtonGroup>
        {/* `/aulas/${params.id}` */}
        <Link href={`/aulas`} className="btn btn-secondary">
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
        isEdit
      />
    </Container>
  );
}
