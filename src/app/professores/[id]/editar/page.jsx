'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEditarProfessor } from '@/hooks/professores/useEditarProfessor';
import {
  ButtonGroup,
  Container,
  PageContent,
  PageSubTitle,
  PageTitle,
  ProfessorForm,
} from '@/components';
import { useProfessorForm } from '@/hooks/professores/useProfessorForm';
import { isAdmin } from '@/utils/isAdmin';

export default function EditarProfessor() {
  const params = useParams();

  const { message, errors, isLoading, isSubmitting, submit, current } =
    useEditarProfessor(params.id);
  const { formData, isSenhaError, handleChange, handleSubmit } =
    useProfessorForm({ submit, professor: current, id: params.id });

  return (
    <Container>
      <PageContent>
        <PageTitle>Editar Professor</PageTitle>

        <PageSubTitle>Atualize os dados do professor</PageSubTitle>
      </PageContent>

      <ButtonGroup>
        <Link href="/professores" className="btn btn-secondary">
          ← Voltar para lista
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
