'use client';

import Link from 'next/link';
import { useNovoProfessor } from '@/hooks/professores/useNovoProfessor';
import { useProfessorForm } from '@/hooks/professores/useProfessorForm';
import { isAdmin } from '@/utils/isAdmin';
import {
  ButtonGroup,
  Container,
  PageContent,
  PageSubTitle,
  PageTitle,
  ProfessorForm,
} from '@/components';

export default function NovoProfessor() {
  const { message, errors, isLoading, isSubmitting, submit } =
    useNovoProfessor();
  const { formData, isSenhaError, handleChange, handleSubmit } =
    useProfessorForm({ submit });

  return (
    <Container>
      <PageContent>
        <PageTitle>Novo Professor</PageTitle>

        <PageSubTitle>
          Preencha os dados para criar um novo professor
        </PageSubTitle>
      </PageContent>

      <ButtonGroup>
        <Link href="/professores" className="btn btn-secondary">
          ← Voltar
        </Link>
      </ButtonGroup>

      <ProfessorForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        isAdmin={isAdmin}
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
