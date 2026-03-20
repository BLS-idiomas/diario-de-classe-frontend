import { render, screen, fireEvent } from '@testing-library/react';
import { AulaForm } from '.';

// Mock dos componentes
jest.mock('@/components', () => ({
  Form: ({ children, handleSubmit }) => (
    <form data-testid="aula-form" onSubmit={handleSubmit}>
      {children}
    </form>
  ),
  FormError: ({ title, errors }) => (
    <div data-testid="aula-form-error">
      {title && <div data-testid="aula-error-title">{title}</div>}
      {errors && <div data-testid="aula-errors">{JSON.stringify(errors)}</div>}
    </div>
  ),
  FormGroup: ({ children }) => (
    <div data-testid="aula-form-group">{children}</div>
  ),
  InputField: ({ htmlFor, label, value, onChange, type, required }) => (
    <div data-testid={`aula-input-${htmlFor}`}>
      <label htmlFor={htmlFor}>
        {label}
        {required && ' *'}
      </label>
      <input
        id={htmlFor}
        name={htmlFor}
        value={value || ''}
        onChange={onChange}
        type={type || 'text'}
        required={required}
      />
    </div>
  ),
  SelectField: ({ htmlFor, label, value, onChange, required, options }) => (
    <div data-testid={`aula-select-${htmlFor}`}>
      <label htmlFor={htmlFor}>
        {label}
        {required && ' *'}
      </label>
      <select
        id={htmlFor}
        name={htmlFor}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Selecione...</option>
        {options?.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
  TextAreaField: ({
    htmlFor,
    label,
    value,
    onChange,
    required,
    placeholder,
  }) => (
    <div data-testid={`aula-textarea-${htmlFor}`}>
      <label htmlFor={htmlFor}>
        {label}
        {required && ' *'}
      </label>
      <textarea
        id={htmlFor}
        name={htmlFor}
        value={value || ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  ),
  ButtonsFields: ({ isLoading, href }) => (
    <div data-testid="aula-buttons-fields">
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Carregando...' : 'Salvar'}
      </button>
      <a href={href}>Cancelar</a>
    </div>
  ),
}));

// Mock dos hooks
jest.mock('@/hooks/alunos/useAlunos', () => ({
  useAlunos: () => ({
    alunos: [
      { id: 1, nome: 'João', sobrenome: 'Silva', email: 'joao@example.com' },
    ],
  }),
}));

jest.mock('@/hooks/contratos/useContratos', () => ({
  useContratos: () => ({
    contratos: [
      {
        id: 1,
        idAluno: 1,
        status: 'ATIVO',
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
      },
    ],
  }),
}));

jest.mock('@/hooks/professores/useProfessores', () => ({
  useProfessores: () => ({
    professores: [
      { id: 1, nome: 'Maria', sobrenome: 'Santos', email: 'maria@example.com' },
    ],
  }),
}));

jest.mock('@/hooks/useFormater', () => ({
  useFormater: () => ({
    dataFormatter: date => {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('pt-BR');
    },
  }),
}));

jest.mock('@/utils/makeEmailLabel', () => ({
  makeEmailLabel: entity =>
    `${entity.nome} ${entity.sobrenome} (${entity.email})`,
}));

describe('AulaForm', () => {
  const mockFormData = {
    idAluno: 1,
    idProfessor: 1,
    idContrato: 1,
    tipo: 'PADRAO',
    dataAula: '2024-03-11',
    horaInicial: '10:00',
    horaFinal: '11:00',
    observacao: 'Test observation',
    status: 'REALIZADA',
  };

  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn(e => e.preventDefault());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with data-testid', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    expect(screen.getByTestId('aula-form')).toBeInTheDocument();
    expect(screen.getByTestId('aula-form-error')).toBeInTheDocument();
    expect(screen.getAllByTestId('aula-form-group').length).toBeGreaterThan(0);
  });

  it('should render all input fields', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    expect(screen.getByTestId('aula-select-idAluno')).toBeInTheDocument();
    expect(screen.getByTestId('aula-select-idProfessor')).toBeInTheDocument();
    expect(screen.getByTestId('aula-select-idContrato')).toBeInTheDocument();
    expect(screen.getByTestId('aula-select-tipo')).toBeInTheDocument();
    expect(screen.getByTestId('aula-input-dataAula')).toBeInTheDocument();
    expect(screen.getByTestId('aula-input-horaInicial')).toBeInTheDocument();
    expect(screen.getByTestId('aula-input-horaFinal')).toBeInTheDocument();
    expect(screen.getByTestId('aula-textarea-observacao')).toBeInTheDocument();
  });

  it('should render status field when isEdit is true', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={true}
      />
    );

    expect(screen.getByTestId('aula-select-status')).toBeInTheDocument();
  });

  it('should not render status field when isEdit is false', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    expect(screen.queryByTestId('aula-select-status')).not.toBeInTheDocument();
  });

  it('should display error message when provided', () => {
    const errorMessage = 'Erro ao salvar aula';
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message={errorMessage}
        errors={['Erro 1', 'Erro 2']}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    expect(screen.getByTestId('aula-error-title')).toHaveTextContent(
      errorMessage
    );
  });

  it('should call handleChange when input values change', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    const dataAulaInput = screen
      .getByTestId('aula-input-dataAula')
      .querySelector('input');
    fireEvent.change(dataAulaInput, { target: { value: '2024-03-12' } });

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('should render form with correct initial values', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    const dataAulaInput = screen
      .getByTestId('aula-input-dataAula')
      .querySelector('input');
    expect(dataAulaInput.value).toBe(mockFormData.dataAula);
  });

  it('should render buttons field component', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    expect(screen.getByTestId('aula-buttons-fields')).toBeInTheDocument();
  });

  it('should disable submit button when isLoading is true', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={true}
        isEdit={false}
      />
    );

    const submitButton = screen
      .getByTestId('aula-buttons-fields')
      .querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
  });

  it('should call handleSubmit when form is submitted', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    const form = screen.getByTestId('aula-form');
    fireEvent.submit(form);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('should display all form fields in create mode', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    // Verify all main fields are rendered
    expect(screen.getByTestId('aula-select-idAluno')).toBeInTheDocument();
    expect(screen.getByTestId('aula-select-idProfessor')).toBeInTheDocument();
    expect(screen.getByTestId('aula-select-idContrato')).toBeInTheDocument();
    expect(screen.getByTestId('aula-select-tipo')).toBeInTheDocument();
    expect(screen.getByTestId('aula-input-dataAula')).toBeInTheDocument();
    expect(screen.getByTestId('aula-input-horaInicial')).toBeInTheDocument();
    expect(screen.getByTestId('aula-input-horaFinal')).toBeInTheDocument();
    expect(screen.getByTestId('aula-textarea-observacao')).toBeInTheDocument();
  });

  it('should display all form fields in edit mode', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={true}
      />
    );

    // Verify all main fields plus status field in edit mode
    expect(screen.getByTestId('aula-select-idAluno')).toBeInTheDocument();
    expect(screen.getByTestId('aula-input-dataAula')).toBeInTheDocument();
    expect(screen.getByTestId('aula-select-status')).toBeInTheDocument();
  });

  it('should handle form data with special characters in observacao', () => {
    const specialCharFormData = {
      ...mockFormData,
      observacao: 'Test with special chars: !@#$%^&*()_+-=[]{}|;:",.<>?/\\',
    };

    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={specialCharFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    const observacaoField = screen
      .getByTestId('aula-textarea-observacao')
      .querySelector('textarea');
    expect(observacaoField.value).toBe(specialCharFormData.observacao);
  });

  it('should handle empty observacao field gracefully', () => {
    const emptyObservacaoData = {
      ...mockFormData,
      observacao: '',
    };

    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={emptyObservacaoData}
        isLoading={false}
        isEdit={false}
      />
    );

    const observacaoField = screen
      .getByTestId('aula-textarea-observacao')
      .querySelector('textarea');
    expect(observacaoField.value).toBe('');
  });

  it('should handle null observacao', () => {
    const nullObservacaoData = {
      ...mockFormData,
      observacao: null,
    };

    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={nullObservacaoData}
        isLoading={false}
        isEdit={false}
      />
    );

    const observacaoField = screen
      .getByTestId('aula-textarea-observacao')
      .querySelector('textarea');
    expect(observacaoField.value).toBe('');
  });
});

describe('AulaForm Edge Cases', () => {
  const mockFormData = {
    idAluno: 1,
    idProfessor: 1,
    idContrato: 1,
    tipo: 'PADRAO',
    dataAula: '2024-03-11',
    horaInicial: '10:00',
    horaFinal: '11:00',
    observacao: 'Test observation',
    status: 'REALIZADA',
  };

  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn(e => e.preventDefault());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle form with all null values', () => {
    const nullFormData = {
      idAluno: null,
      idProfessor: null,
      idContrato: null,
      tipo: null,
      dataAula: null,
      horaInicial: null,
      horaFinal: null,
      observacao: null,
      status: null,
    };

    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={nullFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    expect(screen.getByTestId('aula-form')).toBeInTheDocument();
  });

  it('should handle form with empty string values', () => {
    const emptyFormData = {
      idAluno: '',
      idProfessor: '',
      idContrato: '',
      tipo: '',
      dataAula: '',
      horaInicial: '',
      horaFinal: '',
      observacao: '',
      status: '',
    };

    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={emptyFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    expect(screen.getByTestId('aula-form')).toBeInTheDocument();
  });

  it('should display multiple errors when provided', () => {
    const errors = ['Campo obrigatório', 'Horário inválido', 'Data no passado'];
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message="Erro ao salvar"
        errors={errors}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    expect(screen.getByTestId('aula-form-error')).toBeInTheDocument();
  });

  it('should handle error message without errors array', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message="Erro desconhecido"
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    expect(screen.getByTestId('aula-error-title')).toHaveTextContent(
      'Erro desconhecido'
    );
  });

  it('should handle very long observacao text', () => {
    const longObservacao = 'x'.repeat(2000);
    const longObservacaoData = {
      ...mockFormData,
      observacao: longObservacao,
    };

    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={longObservacaoData}
        isLoading={false}
        isEdit={false}
      />
    );

    const observacaoField = screen
      .getByTestId('aula-textarea-observacao')
      .querySelector('textarea');
    expect(observacaoField.value).toBe(longObservacao);
  });

  it('should maintain field values when error message changes', () => {
    const { rerender } = render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    let dataAulaInput = screen
      .getByTestId('aula-input-dataAula')
      .querySelector('input');
    expect(dataAulaInput.value).toBe(mockFormData.dataAula);

    rerender(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message="Erro ao salvar"
        errors={['Erro']}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    dataAulaInput = screen
      .getByTestId('aula-input-dataAula')
      .querySelector('input');
    expect(dataAulaInput.value).toBe(mockFormData.dataAula);
  });

  it('should handle form rerender with different formData', () => {
    const firstFormData = {
      ...mockFormData,
      horaInicial: '09:00',
    };

    const secondFormData = {
      ...mockFormData,
      horaInicial: '14:00',
    };

    const { rerender } = render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={firstFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    let horaInicialInput = screen
      .getByTestId('aula-input-horaInicial')
      .querySelector('input');
    expect(horaInicialInput.value).toBe('09:00');

    rerender(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={secondFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    horaInicialInput = screen
      .getByTestId('aula-input-horaInicial')
      .querySelector('input');
    expect(horaInicialInput.value).toBe('14:00');
  });

  it('should disable form submission when isLoading is true', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={true}
        isEdit={false}
      />
    );

    const submitButton = screen
      .getByTestId('aula-buttons-fields')
      .querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
  });

  it('should enable form submission when isLoading is false', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    const submitButton = screen
      .getByTestId('aula-buttons-fields')
      .querySelector('button[type="submit"]');
    expect(submitButton).not.toBeDisabled();
  });

  it('should handle rapid isLoading state changes', () => {
    const { rerender } = render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    rerender(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={true}
        isEdit={false}
      />
    );

    let submitButton = screen
      .getByTestId('aula-buttons-fields')
      .querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();

    rerender(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    submitButton = screen
      .getByTestId('aula-buttons-fields')
      .querySelector('button[type="submit"]');
    expect(submitButton).not.toBeDisabled();
  });
});

describe('AulaForm Mode Switching', () => {
  const mockFormData = {
    idAluno: 1,
    idProfessor: 1,
    idContrato: 1,
    tipo: 'PADRAO',
    dataAula: '2024-03-11',
    horaInicial: '10:00',
    horaFinal: '11:00',
    observacao: 'Test observation',
    status: 'REALIZADA',
  };

  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn(e => e.preventDefault());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should transition from create mode to edit mode', () => {
    const { rerender } = render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    expect(screen.queryByTestId('aula-select-status')).not.toBeInTheDocument();

    rerender(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={true}
      />
    );

    expect(screen.getByTestId('aula-select-status')).toBeInTheDocument();
  });

  it('should transition from edit mode to create mode', () => {
    const { rerender } = render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={true}
      />
    );

    expect(screen.getByTestId('aula-select-status')).toBeInTheDocument();

    rerender(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    expect(screen.queryByTestId('aula-select-status')).not.toBeInTheDocument();
  });

  it('should display correct status in edit mode with REALIZADA status', () => {
    const editModeData = {
      ...mockFormData,
      status: 'REALIZADA',
    };

    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={editModeData}
        isLoading={false}
        isEdit={true}
      />
    );

    // Verify status field is rendered
    expect(screen.getByTestId('aula-select-status')).toBeInTheDocument();
  });

  it('should preserve form data when switching modes', () => {
    const { rerender } = render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    let horaInicialInput = screen
      .getByTestId('aula-input-horaInicial')
      .querySelector('input');
    expect(horaInicialInput.value).toBe(mockFormData.horaInicial);

    rerender(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={true}
      />
    );

    horaInicialInput = screen
      .getByTestId('aula-input-horaInicial')
      .querySelector('input');
    expect(horaInicialInput.value).toBe(mockFormData.horaInicial);
  });
});

describe('AulaForm User Interactions', () => {
  const mockFormData = {
    idAluno: 1,
    idProfessor: 1,
    idContrato: 1,
    tipo: 'PADRAO',
    dataAula: '2024-03-11',
    horaInicial: '10:00',
    horaFinal: '11:00',
    observacao: 'Test observation',
    status: 'REALIZADA',
  };

  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn(e => e.preventDefault());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call handleChange when multiple fields change', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    const dataAulaInput = screen
      .getByTestId('aula-input-dataAula')
      .querySelector('input');
    fireEvent.change(dataAulaInput, { target: { value: '2024-03-12' } });

    const horaInicialInput = screen
      .getByTestId('aula-input-horaInicial')
      .querySelector('input');
    fireEvent.change(horaInicialInput, { target: { value: '11:00' } });

    expect(mockHandleChange).toHaveBeenCalledTimes(2);
  });

  it('should handle form submission with valid data', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    const form = screen.getByTestId('aula-form');
    fireEvent.submit(form);

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should display correct button label when loading', () => {
    const { rerender } = render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    let submitButton = screen
      .getByTestId('aula-buttons-fields')
      .querySelector('button[type="submit"]');
    expect(submitButton.textContent).toBe('Salvar');

    rerender(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={true}
        isEdit={false}
      />
    );

    submitButton = screen
      .getByTestId('aula-buttons-fields')
      .querySelector('button[type="submit"]');
    expect(submitButton.textContent).toBe('Carregando...');
  });

  it('should maintain cancel link in buttons fields', () => {
    render(
      <AulaForm
        handleSubmit={mockHandleSubmit}
        message=""
        errors={null}
        handleChange={mockHandleChange}
        formData={mockFormData}
        isLoading={false}
        isEdit={false}
      />
    );

    const cancelLink = screen
      .getByTestId('aula-buttons-fields')
      .querySelector('a');
    expect(cancelLink).toBeInTheDocument();
    expect(cancelLink.textContent).toBe('Cancelar');
  });
});
