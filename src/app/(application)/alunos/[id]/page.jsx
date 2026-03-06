'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useFormater } from '@/hooks/useFormater';
import { useAluno } from '@/hooks/alunos/useAluno';
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

export default function Aluno() {
  const params = useParams();
  const { aluno, diasAulas, contrato, isLoading, isNotFound } = useAluno(
    params.id
  );
  const { telefoneFormatter, dataFormatter } = useFormater();

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
        <PageTitle>Detalhes do aluno</PageTitle>
        <PageSubTitle>Visualização dos dados do aluno</PageSubTitle>
      </PageContent>

      <ButtonGroup>
        <Link href="/alunos" className="btn btn-secondary">
          ← Voltar
        </Link>

        <Link href={`/alunos/${params.id}/editar`} className="btn btn-primary">
          Editar
        </Link>
      </ButtonGroup>

      <div className="mt-4 space-y-8">
        <Section>
          {/* Header: avatar + name/email */}
          <HeaderAvatar entity={aluno} />
          {/* Stats badges */}
          <BadgeGroup>
            <Badge
              icon="calendar"
              color="gray"
              text={`${diasAulas?.length || 0} aulas por semana`}
            />

            <Badge
              icon="lock"
              color="blue"
              text={
                contrato
                  ? `${contrato?.totalAulasFeitas} de ${contrato?.totalAulas}`
                  : 'Sem contrato'
              }
            />
          </BadgeGroup>

          <InfoCardGroup>
            {/* Contato */}
            <InfoCard
              columns={[
                { text: 'Contato', type: 'header' },
                { text: telefoneFormatter(aluno.telefone) },
                { text: aluno.email },
              ]}
            />

            {/* Acesso */}
            <InfoCard
              columns={[
                { text: 'Acesso', type: 'header' },
                {
                  text: `Situação: ${contrato ? contrato?.status : 'Sem contrato'}`,
                  type: 'bold',
                },
                ...[
                  contrato && {
                    text: `Vigência: de ${dataFormatter(contrato?.dataInicio)} até ${dataFormatter(contrato?.dataTermino)}`,
                  },
                ],
              ]}
            />

            {/* Datas */}
            <InfoCard
              columns={[
                { text: 'Datas', type: 'header' },
                { text: `Criado: ${dataFormatter(aluno.dataCriacao)}` },
                {
                  text: `Atualizado: ${dataFormatter(aluno.dataAtualizacao)}`,
                },
              ]}
            />
          </InfoCardGroup>

          <BlockQuoteInfo
            title="Material"
            noContent="Nenhum material disponível."
          >
            {aluno.material}
          </BlockQuoteInfo>
        </Section>
      </div>
    </>
  );
}
