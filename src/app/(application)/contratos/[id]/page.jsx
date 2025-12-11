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
} from '@/components';
import { useContrato } from '@/hooks/contratos/useContrato';

export default function Contrato() {
  const params = useParams();
  const { contrato, isLoading, isNotFound } = useContrato(params.id);
  const { telefoneFormatter, dataFormatter } = useFormater();

  useEffect(() => {
    if (isNotFound) {
      return notFound();
    }
  }, [isNotFound]);

  if (isLoading || !contrato) {
    return <Loading />;
  }

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
    </Container>
  );
}
