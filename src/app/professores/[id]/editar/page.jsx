'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { useEditarProfessor } from '@/hooks/professores/useEditarProfessor';
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

export default function EditarProfessor() {
  const params = useParams();
  const { message, errors, isLoading, isSubmitting, submit, current } =
    useEditarProfessor(params.id);
  const { formData, isSenhaError, handleChange, handleSubmit, setFormData } =
    useProfessorForm({ submit, professor: current, id: params.id });

  useEffect(() => {
    if (current) {
      setFormData(current);
    }
  }, [current, setFormData]);
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
        isUpdate
      />
    </Container>
  );
}
