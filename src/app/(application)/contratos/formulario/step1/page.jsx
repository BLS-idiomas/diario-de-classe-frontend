'use client';

import { useContratoForm } from '@/providers/ContratoFormProvider';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { SelectField, FormGroup } from '@/components';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { makeEmailLabel } from '@/utils/makeEmailLabel';

export default function ContratoStep1() {
  const { setProfessor, setAluno, formData, handleChange } = useContratoForm();
  const { alunos } = useAlunos();
  const { professores } = useProfessores();

  // TODO não mostrar alunos com contratos ativos
  const alunoOptions =
    alunos && alunos.length > 0
      ? alunos.map(aluno => ({
          label: makeEmailLabel(aluno),
          value: aluno.id,
        }))
      : [];
  const professorOptions =
    professores && professores.length > 0
      ? professores.map(professor => ({
          label: makeEmailLabel(professor),
          value: professor.id,
        }))
      : [];
  const handleAlunoChange = e => {
    const { value } = e.target;
    handleChange(e);
    setAluno(
      alunos.find(aluno => aluno.id.toString() === value.toString()) || null
    );
  };
  const handleProfessorChange = e => {
    const { value } = e.target;
    handleChange(e);
    setProfessor(
      professores.find(
        professor => professor.id.toString() === value.toString()
      ) || null
    );
  };

  return (
    <FormGroup col={2}>
      <SelectField
        required
        htmlFor="alunoId"
        label="Aluno"
        placeholder="Selecione o aluno"
        onChange={handleAlunoChange}
        value={formData.alunoId}
        options={alunoOptions}
      />
      <SelectField
        required
        htmlFor="professorId"
        label="Professor"
        placeholder="Selecione o professor"
        onChange={handleProfessorChange}
        value={formData.professorId}
        options={professorOptions}
      />
    </FormGroup>
  );
}
