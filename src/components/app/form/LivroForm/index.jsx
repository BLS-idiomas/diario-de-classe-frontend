import {
  ButtonsFields,
  CheckboxField,
  Form,
  FormError,
  FormGroup,
  InputField,
  SelectField,
} from '@/components';
import { IDIOMA_ARRAY, IDIOMA_LABEL } from '@/constants';

export const LivroForm = ({
  handleSubmit = () => {},
  handleChange = () => {},
  formData = {},
  message,
  errors,
  isLoading = false,
}) => {
  const idiomaOptions = IDIOMA_ARRAY.map(idioma => ({
    value: idioma,
    label: IDIOMA_LABEL[idioma],
  }));

  return (
    <Form handleSubmit={handleSubmit} props={{ 'data-testid': 'livro-form' }}>
      <FormError
        title={message}
        errors={errors}
        dataTestId="livro-form-error"
      />

      <div className="grid gap-6">
        <FormGroup dataTestId="livro-form-group">
          {/* Nome */}
          <InputField
            required
            htmlFor="nome"
            label="Nome do livro"
            placeholder="Ex.: New Interchange 1"
            maxLength={255}
            minLength={2}
            onChange={handleChange}
            value={formData.nome}
          />

          {/* Idioma */}
          {/* Sem placeholder: o idioma vem preenchido com inglês por padrão,
              e uma opção vazia selecionável reabriria o "sem idioma". */}
          <SelectField
            required
            htmlFor="idioma"
            label="Idioma"
            options={idiomaOptions}
            onChange={handleChange}
            value={formData.idioma}
          />

          {/* Nível */}
          <InputField
            type="number"
            htmlFor="nivel"
            label="Nível"
            placeholder="Ordem do livro na trilha do idioma"
            min={1}
            onChange={handleChange}
            value={formData.nivel}
          />
        </FormGroup>

        <CheckboxField
          htmlFor="ativo"
          label="Livro ativo (disponível para novos cronogramas)"
          checked={formData.ativo}
          onChange={handleChange}
        />
      </div>

      {/* Botões */}
      <ButtonsFields isLoading={isLoading} href="/livros" />
    </Form>
  );
};
