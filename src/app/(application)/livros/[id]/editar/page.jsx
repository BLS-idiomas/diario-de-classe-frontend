'use client';
import { useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useEditarLivro } from '@/hooks/livros/useEditarLivro';
import { useLivroForm } from '@/hooks/livros/useLivroForm';
import { LivroForm, Loading, FormPage } from '@/components';

/**
 * Só é montado quando o livro já veio do servidor, para o useLivroForm poder
 * usar os valores como estado inicial em vez de sincronizar por efeito.
 */
const EditarLivroForm = ({ id, livro, submit, isLoading, message, errors }) => {
  const { formData, handleChange, handleSubmit } = useLivroForm({
    submit,
    id,
    livro,
  });

  return (
    <LivroForm
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      formData={formData}
      isLoading={isLoading}
      message={message}
      errors={errors}
    />
  );
};

export default function EditarLivro() {
  const params = useParams();
  const { message, errors, isLoading, current, isNotFound, submit } =
    useEditarLivro(params.id);

  useEffect(() => {
    if (isNotFound) {
      return notFound();
    }
  }, [isNotFound]);

  if (!current) {
    return <Loading />;
  }

  return (
    <FormPage
      title="Editar Livro"
      subTitle="Atualize os dados do livro"
      buttons={[
        {
          href: `/livros/${params.id}`,
          label: '← Voltar',
          type: 'secondary',
        },
      ]}
    >
      <EditarLivroForm
        id={params.id}
        livro={current}
        submit={submit}
        isLoading={isLoading}
        message={message}
        errors={errors}
      />
    </FormPage>
  );
}
