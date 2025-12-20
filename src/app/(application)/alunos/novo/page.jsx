'use client';

import Link from 'next/link';
import { useNovoAluno } from '@/hooks/alunos/useNovoAluno';
import { useAlunoForm } from '@/hooks/alunos/useAlunoForm';
import {
  ButtonGroup,
  Container,
  PageContent,
  PageSubTitle,
  PageTitle,
  AlunoForm,
} from '@/components';

export default function NovoAluno() {
  const { message, errors, isLoading, isSubmitting, submit } = useNovoAluno();
  const { formData, isSenhaError, handleChange, handleSubmit } = useAlunoForm({
    submit,
  });

  return (
    <Container>
      <PageContent>
        <PageTitle>Novo aluno</PageTitle>

        <PageSubTitle>Preencha os dados para criar um novo aluno</PageSubTitle>
      </PageContent>

      <ButtonGroup>
        <Link href="/alunos" className="btn btn-secondary">
          ← Voltar
        </Link>
      </ButtonGroup>

      <AlunoForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
        isSenhaError={isSenhaError}
        isSubmitting={isSubmitting}
        isLoading={isLoading}
        message={message}
        errors={errors}
      />
    </Container>
  );
}
