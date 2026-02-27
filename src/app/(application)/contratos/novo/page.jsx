'use client';

import Link from 'next/link';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { useFormater } from '@/hooks/useFormater';
import { useNovoContratoForm } from '@/hooks/contratos/useNovoContratoForm';
import { useGenerateAulasByContrato } from '@/hooks/contratos/useGenerateAulasByContrato';
import { useNovoContrato } from '@/hooks/contratos/useNovoContrato';
import {
  ButtonGroup,
  PageContent,
  PageSubTitle,
  PageTitle,
  ContratoForm,
} from '@/components';

export default function NovoContrato() {
  const { alunos, alunoOptions } = useAlunos();
  const { professores, professorOptions } = useProfessores();
  const { dataFormatter } = useFormater();
  const { message, errors, isLoading, submit } = useNovoContrato();
  const {
    formData,
    handleSubmit,
    handleChange,
    handleAlunoChange,
    handleProfessorChange,
    handleAtivoChange,
    handleHoraInicialChange,
    handleQuantidadeAulasChange,
    handleDeleteAula,
    handleEditAula,
    createAula,
    setFormData,
  } = useNovoContratoForm({ alunos, professores, submit });
  const { generateAulasByContrato, isSubmitting } = useGenerateAulasByContrato({
    setFormData,
  });
  const handleGenerateAulasByContrato = () => generateAulasByContrato(formData);

  return (
    <>
      <PageContent>
        <PageTitle>Novo Contrato</PageTitle>

        <PageSubTitle>
          Preencha os dados para criar um novo contrato
        </PageSubTitle>
      </PageContent>

      <ButtonGroup>
        <Link href="/contratos" className="btn btn-secondary">
          ← Voltar
        </Link>
      </ButtonGroup>

      <ContratoForm
        alunoOptions={alunoOptions}
        professorOptions={professorOptions}
        formData={formData}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        errors={errors}
        message={message}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleAlunoChange={handleAlunoChange}
        handleProfessorChange={handleProfessorChange}
        handleAtivoChange={handleAtivoChange}
        handleHoraInicialChange={handleHoraInicialChange}
        handleQuantidadeAulasChange={handleQuantidadeAulasChange}
        handleDeleteAula={handleDeleteAula}
        handleEditAula={handleEditAula}
        handleGenerateAulasByContrato={handleGenerateAulasByContrato}
        createAula={createAula}
        dataFormatter={dataFormatter}
      />
    </>
  );
}
