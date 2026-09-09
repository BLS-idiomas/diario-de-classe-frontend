'use client';

import Link from 'next/link';
import { Badge, BadgeGroup, Section, SectionTitle, Table } from '@/components';
import { useCronograma } from '@/hooks/cronogramas/useCronograma';
import { useCronogramaList } from '@/hooks/cronogramas/useCronogramaList';
import { useLancarConteudo } from '@/hooks/cronogramas/useLancarConteudo';
import { useMatricularLivro } from '@/hooks/cronogramas/useMatricularLivro';
import { useDownloadCronograma } from '@/hooks/cronogramas/useDownloadCronograma';
import { useFormater } from '@/hooks/useFormater';
import { IDIOMA_LABEL } from '@/constants';

/**
 * O cronograma do aluno dentro do próprio perfil dele: a grade de aulas do
 * contrato em curso com o conteúdo do livro em cada uma, como uma planilha.
 */
export const CronogramaSection = ({ aluno, contratos = [] }) => {
  const idAluno = aluno?.id;
  const { dataFormatter } = useFormater();
  const {
    livro,
    linhas,
    conteudosNaoAgendados,
    conteudoOptions,
    resumo,
    isLoading,
    hasCronograma,
    recarregar,
  } = useCronograma(idAluno);
  const { handleMatricular } = useMatricularLivro({
    idAluno,
    contratos,
    onSuccess: recarregar,
  });
  const { handleLancarConteudo } = useLancarConteudo({
    conteudoOptions,
    onSuccess: recarregar,
  });
  const { isDownloading, handleDownload } = useDownloadCronograma(idAluno);
  const { columns, data } = useCronogramaList({
    linhas,
    dataFormatter,
    handleLancarConteudo,
  });

  const nomeArquivo = `Cronograma - ${aluno?.nomeCompleto || aluno?.nome || 'aluno'}`;

  return (
    <Section>
      <SectionTitle>Cronograma</SectionTitle>

      {!hasCronograma && !isLoading && (
        <div data-testid="cronograma-vazio">
          <p className="text-muted mb-4">
            Este aluno ainda não foi matriculado em um livro.
          </p>

          <button
            className="btn btn-primary"
            onClick={handleMatricular}
            data-testid="cronograma-matricular"
          >
            Matricular em um livro
          </button>
        </div>
      )}

      {hasCronograma && (
        <>
          <BadgeGroup>
            <Badge
              icon="star"
              color="blue"
              text={`${livro?.nome || 'Livro'}${
                livro?.idioma ? ` — ${IDIOMA_LABEL[livro.idioma]}` : ''
              }`}
            />

            <Badge
              icon="check"
              color="green"
              text={`${resumo?.conteudosVinculados || 0} de ${
                resumo?.totalConteudos || 0
              } conteúdos agendados`}
            />

            {/* O livro não termina dentro do contrato atual. */}
            {Boolean(resumo?.conteudosRestantes) && (
              <Badge
                icon="alert"
                color="yellow"
                text={`${resumo.conteudosRestantes} conteúdo(s) sem aula`}
              />
            )}

            {/* O livro acabou antes do contrato. */}
            {Boolean(resumo?.aulasSemConteudo) && (
              <Badge
                icon="alert"
                color="yellow"
                text={`${resumo.aulasSemConteudo} aula(s) sem conteúdo`}
              />
            )}
          </BadgeGroup>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              className="btn btn-secondary"
              onClick={() => handleDownload(nomeArquivo)}
              disabled={isDownloading}
              data-testid="cronograma-download"
            >
              {isDownloading ? 'Gerando...' : 'Baixar planilha'}
            </button>

            <button
              className="btn btn-primary"
              onClick={handleMatricular}
              data-testid="cronograma-trocar-livro"
            >
              Trocar de livro
            </button>

            {livro?.id && (
              <Link
                href={`/livros/${livro.id}`}
                className="btn btn-secondary"
                data-testid="cronograma-ver-livro"
              >
                Ver livro
              </Link>
            )}
          </div>

          <Table
            columns={columns}
            data={data}
            isLoading={isLoading}
            notFoundMessage="Nenhuma aula no cronograma."
            className="null"
          />

          {conteudosNaoAgendados.length > 0 && (
            <div className="mt-6" data-testid="cronograma-nao-agendados">
              <SectionTitle>Conteúdos sem aula</SectionTitle>
              <p className="text-muted mb-3">
                O livro não termina dentro das aulas restantes do contrato.
              </p>
              <ul className="list-disc pl-5 text-main">
                {conteudosNaoAgendados.map(conteudo => (
                  <li key={conteudo.id}>
                    {conteudo.ordem}. {conteudo.titulo}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Section>
  );
};
