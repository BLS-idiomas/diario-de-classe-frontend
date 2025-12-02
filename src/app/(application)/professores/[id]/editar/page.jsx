'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEditarProfessor } from '@/hooks/professores/useEditarProfessor';
import {
  ButtonGroup,
  PageContent,
  PageSubTitle,
  PageTitle,
  ProfessorForm,
  Container,
} from '@/components';
import { useProfessorForm } from '@/hooks/professores/useProfessorForm';
import { useEffect } from 'react';

export default function EditarProfessor() {
  const params = useParams();
  const { message, errors, isLoading, current, submit } = useEditarProfessor(
    params.id
  );
  const { formData, isSenhaError, handleChange, handleSubmit, setFormData } =
    useProfessorForm({ submit, isEdit: true, id: params.id });

  useEffect(() => {
    if (current) {
      setFormData({
        ...current,
        senha: '',
        repetirSenha: '',
      });
    }
  }, [current, setFormData]);

  return (
    <Container>
      <PageContent>
        <PageTitle>Editar Professor</PageTitle>

        <PageSubTitle>Atualize os dados do professor</PageSubTitle>
      </PageContent>
      <ButtonGroup>
        <Link href={`/professores/${params.id}`} className="btn btn-secondary">
          ← Voltar
        </Link>
      </ButtonGroup>

      <ProfessorForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
        isSenhaError={isSenhaError}
        isLoading={isLoading}
        message={message}
        errors={errors}
        isEdit
      />
    </Container>
  );
}
