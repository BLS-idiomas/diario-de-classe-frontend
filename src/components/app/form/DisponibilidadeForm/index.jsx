import { Form, FormError, DisponibilidadeCard } from '@/components/';

export const DisponibilidadeForm = ({
  handleSubmit,
  message,
  errors,
  formData,
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.keys(formData).map(dia => (
          <DisponibilidadeCard
            key={dia + '-edit'}
            formData={formData}
            dia={dia}
            handleChange={handleChange}
            isEdit={true}
          />
        ))}
      </div>

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
