'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  PageContent,
  PageTitle,
  PageSubTitle,
  ButtonGroup,
  Loading,
  Section,
  SectionTitle,
  Badge,
  BadgeGroup,
  InfoCardGroup,
  InfoCard,
  Table,
} from '@/components';
import { IDIOMA_LABEL } from '@/constants';
import { useLivro } from '@/hooks/livros/useLivro';
import { useConteudosLivro } from '@/hooks/livros/useConteudosLivro';
import { useUploadConteudos } from '@/hooks/livros/useUploadConteudos';
import { useFormater } from '@/hooks/useFormater';
import { useUserAuth } from '@/providers/UserAuthProvider';

export default function Livro() {
  const { isAdmin } = useUserAuth();
  const params = useParams();
  const { livro, conteudos, isLoading, isNotFound } = useLivro(params.id);
  const { dataFormatter } = useFormater();
  const readOnly = !isAdmin();
  const { columns, data, handleNovoConteudo } = useConteudosLivro({
    idLivro: params.id,
    conteudos,
    readOnly,
  });
  const { isUploading, handleModalUpload } = useUploadConteudos(params.id);

  useEffect(() => {
    if (isNotFound) {
      return notFound();
    }
  }, [isNotFound]);

  if (isLoading || !livro) {
    return <Loading />;
  }

  return (
    <>
      <PageContent>
        <PageTitle>Detalhes do livro</PageTitle>
        <PageSubTitle>
          Sequência de conteúdos que o aluno percorre neste livro
        </PageSubTitle>
      </PageContent>

      <ButtonGroup>
        <Link href="/livros" className="btn btn-secondary">
          ← Voltar
        </Link>

        {!readOnly && (
          <Link
            href={`/livros/${params.id}/editar`}
            className="btn btn-primary"
          >
            Editar
          </Link>
        )}
      </ButtonGroup>

      <div className="mt-4 space-y-8">
        <Section>
          <SectionTitle>{livro.nome}</SectionTitle>

          <BadgeGroup>
            <Badge
              icon="star"
              color="blue"
              text={IDIOMA_LABEL[livro.idioma] || livro.idioma}
            />

            {Boolean(livro.nivel) && (
              <Badge icon="info" color="gray" text={`Nível ${livro.nivel}`} />
            )}

            <Badge
              icon={livro.ativo ? 'check' : 'alert'}
              color={livro.ativo ? 'green' : 'yellow'}
              text={livro.ativo ? 'Ativo' : 'Inativo'}
            />

            <Badge
              icon="calendar"
              color="gray"
              text={`${conteudos.length} conteúdo(s)`}
            />
          </BadgeGroup>

          <InfoCardGroup>
            <InfoCard
              columns={[
                { text: 'Datas', type: 'header' },
                { text: `Criado: ${dataFormatter(livro.dataCriacao)}` },
                {
                  text: `Atualizado: ${dataFormatter(livro.dataAtualizacao)}`,
                },
              ]}
            />
          </InfoCardGroup>
        </Section>

        <Section>
          <SectionTitle>Conteúdos</SectionTitle>

          {!readOnly && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                className="btn btn-primary"
                onClick={handleNovoConteudo}
                data-testid="livro-novo-conteudo"
              >
                Novo conteúdo
              </button>

              <button
                className="btn btn-secondary"
                onClick={handleModalUpload}
                disabled={isUploading}
                data-testid="livro-importar-conteudos"
              >
                {isUploading ? 'Importando...' : 'Importar planilha'}
              </button>
            </div>
          )}

          <Table
            columns={columns}
            data={data}
            isLoading={isLoading || isUploading}
            notFoundMessage="Nenhum conteúdo cadastrado neste livro."
            className="null"
          />
        </Section>
      </div>
    </>
  );
}
