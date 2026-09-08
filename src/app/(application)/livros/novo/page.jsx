'use client';
import { useNovoLivro } from '@/hooks/livros/useNovoLivro';
import { useLivros } from '@/hooks/livros/useLivros';
import { useLivroForm } from '@/hooks/livros/useLivroForm';
import { LivroForm, FormPage, Loading } from '@/components';

/**
 * Só é montado depois que o catálogo carregou, para o useLivroForm poder
 * calcular o próximo nível como estado inicial em vez de sincronizar por efeito.
 */
const NovoLivroForm = ({ livros, submit, isLoading, message, errors }) => {
  const { formData, handleChange, handleSubmit } = useLivroForm({
    submit,
    livros,
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

export default function NovoLivro() {
  const { message, errors, isLoading, submit } = useNovoLivro();
  // O catálogo alimenta a sugestão de nível. O fetch do useLivros no mount vem
  // sem filtro de busca, então o máximo por idioma é calculado sobre a lista
  // completa.
  const { livros, isLoading: isLoadingLivros } = useLivros();

  return (
    <FormPage
      title="Novo Livro"
      subTitle="Cadastre o livro e depois monte a sequência de conteúdos"
      buttons={[
        {
          href: '/livros',
          label: '← Voltar',
          type: 'secondary',
        },
      ]}
    >
      {isLoadingLivros ? (
        <Loading />
      ) : (
        <NovoLivroForm
          livros={livros}
          submit={submit}
          isLoading={isLoading}
          message={message}
          errors={errors}
        />
      )}
    </FormPage>
  );
}
