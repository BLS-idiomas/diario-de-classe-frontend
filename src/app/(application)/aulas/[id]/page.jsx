'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  IDIOMA_LABEL,
  STATUS_AULA_LABEL,
  STATUS_CONTRATO_LABEL,
  TIPO_AULA_LABEL,
} from '@/constants';
import { useFormater } from '@/hooks/useFormater';
import { useAula } from '@/hooks/aulas/useAula';
import {
  PageContent,
  PageTitle,
  PageSubTitle,
  ButtonGroup,
  Loading,
  Section,
  HeaderAvatar,
  BadgeGroup,
  Badge,
  InfoCardGroup,
  InfoCard,
  BlockQuoteInfo,
} from '@/components';

export default function Aula() {
  const params = useParams();
  const { aula, aluno, professor, contrato, isLoading, isNotFound } = useAula(
    params.id
  );
  const { telefoneFormatter, dataFormatter } = useFormater();

  const getFullName = entity => {
    if (!entity) return '';
    return `${entity.nome} ${entity.sobrenome}`;
  };

  useEffect(() => {
    if (isNotFound) {
      return notFound();
    }
  }, [isNotFound]);

  if (isLoading || !aluno) {
    return <Loading />;
  }

  return (
    <>
      <PageContent>
        <PageTitle>Detalhes da aula</PageTitle>
        <PageSubTitle>Visualização dos dados da aula</PageSubTitle>
      </PageContent>

      <ButtonGroup>
        <Link href="/aulas" className="btn btn-secondary">
          ← Voltar
        </Link>

        <Link href={`/aulas/${params.id}/editar`} className="btn btn-primary">
          Editar
        </Link>
      </ButtonGroup>

      <div className="mt-4 space-y-8">
        <Section>
          <div
            className="flex items-center gap-4 mb-3"
            data-testid="header-avatar"
          >
            <div>
              <div className="text-xl text-main font-semibold">
                Data aula: {dataFormatter(aula.dataAula)}
              </div>
              <div className="text-sm text-muted">
                Das {aula.horaInicial} até {aula.horaFinal}
              </div>
            </div>
          </div>

          <BadgeGroup>
            <Badge
              icon="star"
              color="blue"
              text={IDIOMA_LABEL[contrato.idioma]}
            />
            <Badge icon="info" color="gray" text={TIPO_AULA_LABEL[aula.tipo]} />
            <Badge
              icon="info"
              color="gray"
              text={STATUS_AULA_LABEL[aula.status]}
            />
          </BadgeGroup>

          <InfoCardGroup>
            {/* Aluno */}
            <InfoCard
              columns={[
                { text: 'Aluno', type: 'header' },
                { text: getFullName(aluno) },
                ...(aluno.telefone
                  ? [{ text: telefoneFormatter(aluno.telefone) }]
                  : []),
                { text: aluno.email },
              ]}
            />

            {/* Professor */}
            <InfoCard
              columns={[
                { text: 'Professor', type: 'header' },
                { text: getFullName(professor) },
                ...(professor.telefone
                  ? [{ text: telefoneFormatter(professor.telefone) }]
                  : []),
                { text: professor.email },
              ]}
            />
            {/* Contrato */}
            <InfoCard
              columns={[
                { text: 'Vigência do contrato', type: 'header' },
                { text: 'Data inicio: ' + dataFormatter(contrato.dataInicio) },
                {
                  text: 'Data término: ' + dataFormatter(contrato.dataTermino),
                },
                { text: 'Situação: ' + STATUS_CONTRATO_LABEL[contrato.status] },
              ]}
            />
          </InfoCardGroup>

          <BlockQuoteInfo
            title="Conteúdo/Observaçãos da aula"
            noContent="Nenhum conteúdo encontrado."
          >
            {aula?.observacao}
          </BlockQuoteInfo>

          <BlockQuoteInfo
            title="Material do aluno"
            noContent="Nenhum material disponível."
          >
            {aluno.material}
          </BlockQuoteInfo>
        </Section>
      </div>
    </>
  );
}
