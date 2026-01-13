'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const backUrl = searchParams.get('backUrl');
  const { message, errors, isLoading, current, statusError, submit } =
    useEditarAula(params.id, backUrl);
  const { formData, handleChange, handleSubmit, setFormData } = useAulaForm({
    submit,
    isEdit: true,
    id: params.id,
    backUrl,
  });

  useEffect(() => {
    if (current) {
      setFormData({
        ...current,
        dataAula: current.dataAula.split('T')[0],
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
        <PageTitle>Editar Aula</PageTitle>

        <PageSubTitle>Atualize os dados da aula</PageSubTitle>
      </PageContent>
      <ButtonGroup>
        {/* `/aulas/${params.id}` */}
        <Link href={backUrl || `/aulas`} className="btn btn-secondary">
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
