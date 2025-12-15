'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useFormater } from '@/hooks/useFormater';
import {
  Container,
  PageContent,
  PageTitle,
  PageSubTitle,
  ButtonGroup,
  Loading,
  Section,
  InfoCardGroup,
  InfoCard,
  HeaderAvatar,
  BadgeGroup,
  Badge,
} from '@/components';
import { useContrato } from '@/hooks/contratos/useContrato';

export default function Contrato() {
  const params = useParams();
  const { aluno, contrato, isLoading, isNotFound } = useContrato(params.id);
  const { dataFormatter } = useFormater();

  useEffect(() => {
    if (isNotFound) {
      return notFound();
    }
  }, [isNotFound]);

  if (isLoading || !contrato) {
    return <Loading />;
  }

  console.log(contrato);

  return (
    <Container>
      <PageContent>
        <PageTitle>Detalhes do contrato</PageTitle>
        <PageSubTitle>Visualização dos dados do contrato</PageSubTitle>
      </PageContent>

      <ButtonGroup>
        <Link href="/contratos" className="btn btn-secondary">
          ← Voltar
        </Link>

        <Link
          href={`/contratos/${params.id}/editar`}
          className="btn btn-primary"
        >
          Editar
        </Link>
      </ButtonGroup>

      <div className="mt-4 space-y-8">
        <Section>
          {/* Header: avatar + name/email */}
          {aluno && <HeaderAvatar entity={aluno} />}
          <BadgeGroup>
            <Badge
              icon="calendar"
              color="gray"
              text={`Total de aulas ${contrato.totalAulas}`}
            />
            <Badge
              icon={contrato.status === 'ATIVO' ? 'check' : 'alert'}
              color="gray"
              text={`Situação ${contrato.status}`}
            />
          </BadgeGroup>
          <InfoCardGroup>
            {/* Datas */}
            <InfoCard
              columns={[
                { text: 'Vigência do contrato', type: 'header' },
                { text: dataFormatter(contrato.dataInicio) },
                { text: dataFormatter(contrato.dataTermino) },
              ]}
            />
            {/* Aulas realizadas */}
            <InfoCard
              columns={[
                { text: 'Aulas realizadas', type: 'header' },
                { text: `Aulas comum ${contrato.totalAulasFeitas}` },
                { text: `Aulas de reposição ${contrato.totalReposicoes}` },
              ]}
            />
            {/* Aulas não realizadas */}
            <InfoCard
              columns={[
                { text: 'Aulas não realizadas', type: 'header' },
                { text: `Aulas canceladas ${contrato.totalAulasCanceladas}` },
                { text: `Faltas ${contrato.totalFaltas}` },
              ]}
            />
          </InfoCardGroup>
        </Section>
      </div>
    </Container>
  );
}
