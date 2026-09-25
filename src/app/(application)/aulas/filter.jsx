import {
  Form,
  FormGroup,
  InputField,
  SelectField,
  SearchableSelectField,
  ClearFiltersButton,
} from '@/components';
import {
  STATUS_AULA,
  STATUS_AULA_LABEL,
  TIPO_AULA,
  TIPO_AULA_LABEL,
} from '@/constants';
import { getEntityOptions } from '@/utils/getEntityOptions';

export const Filter = ({
  handleSubmit,
  handleChange,
  handleClearFilter,
  formData,
  alunos,
  professores,
  isLoadingAlunos,
  erroAlunos,
  isLoadingProfessores,
  erroProfessores,
}) => {
  return (
    <Form handleSubmit={handleSubmit}>
      <FormGroup cols={2}>
        <InputField
          required
          htmlFor="dataInicio"
          label="Data de início"
          type="date"
          onChange={handleChange}
          value={formData.dataInicio}
        />
        <InputField
          required
          htmlFor="dataTermino"
          label="Data de fim"
          type="date"
          onChange={handleChange}
          value={formData.dataTermino}
        />
        <SelectField
          htmlFor="tipo"
          label="Tipo da aula"
          placeholder="Selecione o tipo da aula"
          options={TIPO_AULA.map(tipo => ({
            label: TIPO_AULA_LABEL[tipo],
            value: tipo,
          }))}
          onChange={handleChange}
          value={formData.tipo}
        />
        <SelectField
          htmlFor="status"
          label="Status da aula"
          placeholder="Selecione o status"
          options={STATUS_AULA.map(status => ({
            label: STATUS_AULA_LABEL[status],
            value: status,
          }))}
          onChange={handleChange}
          value={formData.status}
        />
        <SearchableSelectField
          htmlFor="idAluno"
          label="Aluno"
          placeholder="Selecione o aluno"
          options={getEntityOptions(alunos)}
          onChange={handleChange}
          value={formData.idAluno}
          isLoading={isLoadingAlunos}
          errorMessage={erroAlunos}
        />
        <SearchableSelectField
          htmlFor="idProfessor"
          label="Professor"
          placeholder="Selecione o professor"
          options={getEntityOptions(professores)}
          onChange={handleChange}
          value={formData.idProfessor}
          isLoading={isLoadingProfessores}
          errorMessage={erroProfessores}
        />
      </FormGroup>
      <ClearFiltersButton onClick={handleClearFilter} />
    </Form>
  );
};
