import { DIAS_LABEL } from '@/constants';
import {
  CheckboxField,
  Form,
  FormError,
  FormGroup,
  InputField,
} from '@/components/ui';

export const DisponibilidadeForm = ({
  handleSubmit,
  message,
  errors,
  formData,
  handleCheckboxChange,
  handleChange,
  isLoading,
  setEditMode,
}) => {
  return (
    <Form
      handleSubmit={handleSubmit}
      props={{ 'data-testid': 'disponibilidade-form' }}
    >
      <FormError title={message} errors={errors} />
      {Object.keys(formData).map(diaSemana => (
        <div key={diaSemana} className="mb-4">
          <div className="flex gap-5">
            <h4 className="text-xl font-semibold mb-2">
              {DIAS_LABEL[diaSemana]}
            </h4>
            <CheckboxField
              htmlFor={`${diaSemana}.ativo`}
              label="Ativo"
              checked={formData[diaSemana]?.ativo || false}
              onChange={handleCheckboxChange}
            />
          </div>
          <FormGroup cols={2}>
            <InputField
              disabled={!formData[diaSemana]?.ativo}
              htmlFor={`${diaSemana}.horaInicial`}
              label="Hora inicial"
              type="time"
              onChange={handleChange}
              value={formData[diaSemana]?.horaInicial}
            />

            <InputField
              disabled={!formData[diaSemana]?.ativo}
              htmlFor={`${diaSemana}.horaFinal`}
              label="Hora final"
              type="time"
              onChange={handleChange}
              value={formData[diaSemana]?.horaFinal}
            />
          </FormGroup>
        </div>
      ))}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => setEditMode(false)}
          className="btn btn-secondary"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className={`btn btn-primary ${isLoading && 'blocked'}`}
        >
          {isLoading ? 'Editando...' : 'Salvar'}
        </button>
      </div>
    </Form>
  );
};
