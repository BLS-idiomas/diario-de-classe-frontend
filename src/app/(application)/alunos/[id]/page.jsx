'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { STATUS_ERROR } from '@/constants/statusError';
import { useFormater } from '@/hooks/useFormater';
import { useAluno } from '@/hooks/alunos/useAluno';
import {
  Container,
  PageContent,
  PageTitle,
  PageSubTitle,
  ButtonGroup,
  Loading,
  Section,
  Table,
} from '@/components';

export default function Aluno() {
  const params = useParams();
  const { aluno, aulas, diasAulas, contrato, isLoading, statusError } =
    useAluno(params.id);
  const { telefoneFormatter, dataFormatter } = useFormater();

  useEffect(() => {
    if (
      statusError === STATUS_ERROR.BAD_REQUEST ||
      statusError === STATUS_ERROR.NOT_FOUND
    ) {
      return notFound();
    }
  }, [statusError]);

  if (isLoading || !aluno) {
    return <Loading />;
  }

  return <h1>Aluno Page</h1>;
}
