'use client';
import { useEffect } from 'react';
import { useParams, useSearchParams, notFound } from 'next/navigation';
import { STATUS_ERROR } from '@/constants';
import { useEditarAula } from '@/hooks/aulas/useEditarAula';
import { useAulaForm } from '@/hooks/aulas/useAulaForm';
import { AulaForm, Loading, FormPage } from '@/components';
import { calculateDuracaoAula } from '@/utils/calculateDuracaoAula';

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
        duracaoAula: current.duracaoAula
          ? current.duracaoAula
          : calculateDuracaoAula(current),
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
      title="Editar Aula"
      subTitle="Atualize os dados da aula"
      buttons={[
        {
          href: backUrl || `/aulas/${params.id}`,
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
        isEdit
      />
    </FormPage>
  );
}
