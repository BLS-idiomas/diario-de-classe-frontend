'use client';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { useFormater } from '@/hooks/useFormater';
import { useContratoForm } from '@/hooks/contratos/useContratoForm';
import { useGenerateAulasByContrato } from '@/hooks/contratos/useGenerateAulasByContrato';
import { useNovoContrato } from '@/hooks/contratos/useNovoContrato';
import { ContratoForm, FormPage } from '@/components';

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
  } = useContratoForm({ alunos, professores, submit });
  const { generateAulasByContrato, isSubmitting } = useGenerateAulasByContrato({
    setFormData,
  });
  const handleGenerateAulasByContrato = () => generateAulasByContrato(formData);

  return (
    <FormPage
      title="Novo Contrato"
      subTitle="Preencha os dados para criar um novo contrato"
      buttons={[
        {
          href: '/contratos',
          label: '← Voltar',
          type: 'secondary',
        },
      ]}
    >
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
    </FormPage>
  );
}
