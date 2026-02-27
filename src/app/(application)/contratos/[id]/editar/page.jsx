'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { useFormater } from '@/hooks/useFormater';
import { useContratoForm } from '@/hooks/contratos/useContratoForm';
import { useGenerateAulasByContrato } from '@/hooks/contratos/useGenerateAulasByContrato';
import { useEditarContrato } from '@/hooks/contratos/useEditarContrato';
import {
  ButtonGroup,
  PageContent,
  PageSubTitle,
  PageTitle,
  ContratoForm,
  Loading,
} from '@/components';

export default function EditarContrato() {
  const params = useParams();
  const { alunos, alunoOptions } = useAlunos();
  const { professores, professorOptions } = useProfessores();
  const { dataFormatter, formatForInput } = useFormater();
  const { message, errors, isLoading, current, isNotFound, submit } =
    useEditarContrato(params.id);
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
    setInitialDiasAulas,
  } = useContratoForm({ alunos, professores, submit });
  const { generateAulasByContrato, isSubmitting } = useGenerateAulasByContrato({
    setFormData,
  });
  const handleGenerateAulasByContrato = () => generateAulasByContrato(formData);

  useEffect(() => {
    if (current) {
      const idProfessor =
        current.aulas.length > 0
          ? current.aulas[current.aulas.length - 1].idProfessor
          : null;
      const data = {
        alunoId: current.idAluno,
        aluno: alunos.find(aluno => aluno.id === current.idAluno) || null,
        dataInicio: formatForInput(current.dataInicio),
        dataTermino: formatForInput(current.dataTermino),
        status: current.status,
        contratoId: current.id,
        contrato: current,
        professorId: idProfessor,
        professor:
          professores.find(professor => professor.id === idProfessor) || null,
        diasAulas: [],
        currentDiasAulas: [],
        aulas: current.aulas,
      };
      setFormData(data);
      setInitialDiasAulas(current.diaAulas);
    }
  }, [current]);

  useEffect(() => {
    if (isNotFound) {
      return notFound();
    }
  }, [isNotFound]);

  if (isLoading && !current) {
    return <Loading />;
  }

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
