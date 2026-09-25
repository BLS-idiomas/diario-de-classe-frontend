import {
  Form,
  FormGroup,
  InputField,
  SelectField,
  SearchableSelectField,
  ClearFiltersButton,
} from '@/components';
import { IDIOMA_ARRAY, IDIOMA_LABEL } from '@/constants';
import { getEntityOptions } from '@/utils/getEntityOptions';

export const Filter = ({
  handleSubmit,
  handleChange,
  handleClearFilter,
  formData,
  alunos,
  isLoadingAlunos,
  erroAlunos,
}) => {
  return (
    <Form handleSubmit={handleSubmit}>
      <FormGroup cols={2}>
        <InputField
          htmlFor="dataInicio"
          label="Data de início"
          type="date"
          onChange={handleChange}
          value={formData.dataInicio}
        />
        <InputField
          htmlFor="dataTermino"
          label="Data de fim"
          type="date"
          onChange={handleChange}
          value={formData.dataTermino}
        />
        <SelectField
          htmlFor="idioma"
          label="Idioma"
          placeholder="Selecione o idioma"
          options={IDIOMA_ARRAY.map(idioma => ({
            label: IDIOMA_LABEL[idioma],
            value: idioma,
          }))}
          onChange={handleChange}
          value={formData.idioma}
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
      </FormGroup>
      <ClearFiltersButton onClick={handleClearFilter} />
    </Form>
  );
};
