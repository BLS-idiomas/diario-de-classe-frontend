import { render, screen, fireEvent } from '@testing-library/react';
import { ContratoForm } from '.';

// Mock dos componentes
jest.mock('@/components', () => ({
  Form: ({ children, handleSubmit }) => (
    <form data-testid="contrato-form" onSubmit={handleSubmit}>
      {children}
    </form>
  ),
  FormError: ({ title, errors }) => (
    <div data-testid="contrato-form-error">
      {title && <div data-testid="contrato-error-title">{title}</div>}
      {errors && (
        <div data-testid="contrato-errors">{JSON.stringify(errors)}</div>
      )}
    </div>
  ),
  FormGroup: ({ children }) => (
    <div data-testid="contrato-form-group">{children}</div>
  ),
  InputField: ({
    htmlFor,
    label,
    value,
    onChange,
    type,
    required,
    disabled,
  }) => (
    <div data-testid={`contrato-input-${htmlFor}`}>
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
        disabled={disabled}
      />
    </div>
  ),
  SelectField: ({
    htmlFor,
    label,
    value,
    onChange,
    required,
    options,
    disabled,
  }) => (
    <div data-testid={`contrato-select-${htmlFor}`}>
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
        disabled={disabled}
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
  CheckboxField: ({ htmlFor, label, checked, onChange }) => (
    <div data-testid={`contrato-checkbox-${htmlFor}`}>
      <input
        type="checkbox"
        id={htmlFor}
        name={htmlFor}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={htmlFor}>{label}</label>
    </div>
  ),
  Badge: ({ text }) => <div data-testid="contrato-badge">{text}</div>,
  Loading: () => <div data-testid="contrato-loading">Carregando...</div>,
  ButtonsFields: ({ isLoading, href, blocked }) => (
    <div data-testid="contrato-buttons-fields">
      <button type="submit" disabled={isLoading || blocked}>
        {isLoading ? 'Carregando...' : 'Salvar'}
      </button>
      <a href={href}>Cancelar</a>
    </div>
  ),
}));

describe('ContratoForm', () => {
  const mockAlunoOptions = [
    { value: 1, label: 'João Silva (joao@example.com)' },
    { value: 2, label: 'Maria Santos (maria@example.com)' },
  ];

  const mockProfessorOptions = [
    { value: 1, label: 'Prof. Carlos (carlos@example.com)' },
    { value: 2, label: 'Prof. Ana (ana@example.com)' },
  ];

  const mockFormData = {
    alunoId: 1,
    professorId: 1,
    dataInicio: '2024-03-01',
    dataTermino: '2024-12-31',
    diasAulas: [
      {
        diaSemana: 'SEGUNDA',
        ativo: true,
        quantidadeAulas: 1,
        horaInicial: '10:00',
        horaFinal: '10:40',
      },
      {
        diaSemana: 'QUARTA',
        ativo: true,
        quantidadeAulas: 1,
        horaInicial: '14:00',
        horaFinal: '14:40',
      },
    ],
    aulas: [
      {
        id: 1,
        dataAula: '2024-03-04',
        horaInicial: '10:00',
        horaFinal: '10:40',
        tipo: 'PADRAO',
        observacao: 'Test aula',
      },
    ],
  };

  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn(e => e.preventDefault());
  const mockHandleAlunoChange = jest.fn();
  const mockHandleProfessorChange = jest.fn();
  const mockHandleAtivoChange = jest.fn();
  const mockHandleHoraInicialChange = jest.fn();
  const mockHandleQuantidadeAulasChange = jest.fn();
  const mockHandleDeleteAula = jest.fn();
  const mockHandleEditAula = jest.fn();
  const mockHandleGenerateAulasByContrato = jest.fn();
  const mockCreateAula = jest.fn();
  const mockDataFormatter = jest.fn(date => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with data-testid on main form', () => {
    render(
      <ContratoForm
        alunoOptions={mockAlunoOptions}
        professorOptions={mockProfessorOptions}
        formData={mockFormData}
        isLoading={false}
        isSubmitting={false}
        errors={null}
        message=""
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        handleAlunoChange={mockHandleAlunoChange}
        handleProfessorChange={mockHandleProfessorChange}
        handleAtivoChange={mockHandleAtivoChange}
        handleHoraInicialChange={mockHandleHoraInicialChange}
        handleQuantidadeAulasChange={mockHandleQuantidadeAulasChange}
        handleDeleteAula={mockHandleDeleteAula}
        handleEditAula={mockHandleEditAula}
        handleGenerateAulasByContrato={mockHandleGenerateAulasByContrato}
        createAula={mockCreateAula}
        dataFormatter={mockDataFormatter}
      />
    );

    expect(screen.getByTestId('contrato-form')).toBeInTheDocument();
    expect(screen.getByTestId('contrato-form-error')).toBeInTheDocument();
  });

  it('should render step 1 fields (aluno and professor selection)', () => {
    render(
      <ContratoForm
        alunoOptions={mockAlunoOptions}
        professorOptions={mockProfessorOptions}
        formData={mockFormData}
        isLoading={false}
        isSubmitting={false}
        errors={null}
        message=""
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        handleAlunoChange={mockHandleAlunoChange}
        handleProfessorChange={mockHandleProfessorChange}
        handleAtivoChange={mockHandleAtivoChange}
        handleHoraInicialChange={mockHandleHoraInicialChange}
        handleQuantidadeAulasChange={mockHandleQuantidadeAulasChange}
        handleDeleteAula={mockHandleDeleteAula}
        handleEditAula={mockHandleEditAula}
        handleGenerateAulasByContrato={mockHandleGenerateAulasByContrato}
        createAula={mockCreateAula}
        dataFormatter={mockDataFormatter}
      />
    );

    expect(screen.getByTestId('contrato-select-alunoId')).toBeInTheDocument();
    expect(
      screen.getByTestId('contrato-select-professorId')
    ).toBeInTheDocument();
    expect(screen.getByTestId('contrato-input-dataInicio')).toBeInTheDocument();
    expect(
      screen.getByTestId('contrato-input-dataTermino')
    ).toBeInTheDocument();
  });

  it('should display error message when provided', () => {
    const errorMessage = 'Erro ao salvar contrato';
    render(
      <ContratoForm
        alunoOptions={mockAlunoOptions}
        professorOptions={mockProfessorOptions}
        formData={mockFormData}
        isLoading={false}
        isSubmitting={false}
        errors={['Erro 1', 'Erro 2']}
        message={errorMessage}
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        handleAlunoChange={mockHandleAlunoChange}
        handleProfessorChange={mockHandleProfessorChange}
        handleAtivoChange={mockHandleAtivoChange}
        handleHoraInicialChange={mockHandleHoraInicialChange}
        handleQuantidadeAulasChange={mockHandleQuantidadeAulasChange}
        handleDeleteAula={mockHandleDeleteAula}
        handleEditAula={mockHandleEditAula}
        handleGenerateAulasByContrato={mockHandleGenerateAulasByContrato}
        createAula={mockCreateAula}
        dataFormatter={mockDataFormatter}
      />
    );

    expect(screen.getByTestId('contrato-error-title')).toHaveTextContent(
      errorMessage
    );
  });

  it('should render form with initial values', () => {
    render(
      <ContratoForm
        alunoOptions={mockAlunoOptions}
        professorOptions={mockProfessorOptions}
        formData={mockFormData}
        isLoading={false}
        isSubmitting={false}
        errors={null}
        message=""
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        handleAlunoChange={mockHandleAlunoChange}
        handleProfessorChange={mockHandleProfessorChange}
        handleAtivoChange={mockHandleAtivoChange}
        handleHoraInicialChange={mockHandleHoraInicialChange}
        handleQuantidadeAulasChange={mockHandleQuantidadeAulasChange}
        handleDeleteAula={mockHandleDeleteAula}
        handleEditAula={mockHandleEditAula}
        handleGenerateAulasByContrato={mockHandleGenerateAulasByContrato}
        createAula={mockCreateAula}
        dataFormatter={mockDataFormatter}
      />
    );

    const dataInicioInput = screen
      .getByTestId('contrato-input-dataInicio')
      .querySelector('input');
    expect(dataInicioInput.value).toBe(mockFormData.dataInicio);
  });

  it('should call handleAlunoChange when aluno selection changes', () => {
    render(
      <ContratoForm
        alunoOptions={mockAlunoOptions}
        professorOptions={mockProfessorOptions}
        formData={mockFormData}
        isLoading={false}
        isSubmitting={false}
        errors={null}
        message=""
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        handleAlunoChange={mockHandleAlunoChange}
        handleProfessorChange={mockHandleProfessorChange}
        handleAtivoChange={mockHandleAtivoChange}
        handleHoraInicialChange={mockHandleHoraInicialChange}
        handleQuantidadeAulasChange={mockHandleQuantidadeAulasChange}
        handleDeleteAula={mockHandleDeleteAula}
        handleEditAula={mockHandleEditAula}
        handleGenerateAulasByContrato={mockHandleGenerateAulasByContrato}
        createAula={mockCreateAula}
        dataFormatter={mockDataFormatter}
      />
    );

    const alunoSelect = screen
      .getByTestId('contrato-select-alunoId')
      .querySelector('select');
    fireEvent.change(alunoSelect, { target: { value: '2' } });

    expect(mockHandleAlunoChange).toHaveBeenCalled();
  });

  it('should render buttons field component', () => {
    render(
      <ContratoForm
        alunoOptions={mockAlunoOptions}
        professorOptions={mockProfessorOptions}
        formData={mockFormData}
        isLoading={false}
        isSubmitting={false}
        errors={null}
        message=""
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        handleAlunoChange={mockHandleAlunoChange}
        handleProfessorChange={mockHandleProfessorChange}
        handleAtivoChange={mockHandleAtivoChange}
        handleHoraInicialChange={mockHandleHoraInicialChange}
        handleQuantidadeAulasChange={mockHandleQuantidadeAulasChange}
        handleDeleteAula={mockHandleDeleteAula}
        handleEditAula={mockHandleEditAula}
        handleGenerateAulasByContrato={mockHandleGenerateAulasByContrato}
        createAula={mockCreateAula}
        dataFormatter={mockDataFormatter}
      />
    );

    expect(screen.getByTestId('contrato-buttons-fields')).toBeInTheDocument();
  });

  it('should disable submit button when blocked is true', () => {
    const emptyFormData = {
      ...mockFormData,
      aulas: [],
    };

    render(
      <ContratoForm
        alunoOptions={mockAlunoOptions}
        professorOptions={mockProfessorOptions}
        formData={emptyFormData}
        isLoading={false}
        isSubmitting={false}
        errors={null}
        message=""
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        handleAlunoChange={mockHandleAlunoChange}
        handleProfessorChange={mockHandleProfessorChange}
        handleAtivoChange={mockHandleAtivoChange}
        handleHoraInicialChange={mockHandleHoraInicialChange}
        handleQuantidadeAulasChange={mockHandleQuantidadeAulasChange}
        handleDeleteAula={mockHandleDeleteAula}
        handleEditAula={mockHandleEditAula}
        handleGenerateAulasByContrato={mockHandleGenerateAulasByContrato}
        createAula={mockCreateAula}
        dataFormatter={mockDataFormatter}
      />
    );

    const submitButton = screen
      .getByTestId('contrato-buttons-fields')
      .querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
  });

  it('should disable submit button when isLoading is true', () => {
    render(
      <ContratoForm
        alunoOptions={mockAlunoOptions}
        professorOptions={mockProfessorOptions}
        formData={mockFormData}
        isLoading={true}
        isSubmitting={false}
        errors={null}
        message=""
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        handleAlunoChange={mockHandleAlunoChange}
        handleProfessorChange={mockHandleProfessorChange}
        handleAtivoChange={mockHandleAtivoChange}
        handleHoraInicialChange={mockHandleHoraInicialChange}
        handleQuantidadeAulasChange={mockHandleQuantidadeAulasChange}
        handleDeleteAula={mockHandleDeleteAula}
        handleEditAula={mockHandleEditAula}
        handleGenerateAulasByContrato={mockHandleGenerateAulasByContrato}
        createAula={mockCreateAula}
        dataFormatter={mockDataFormatter}
      />
    );

    const submitButton = screen
      .getByTestId('contrato-buttons-fields')
      .querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
  });

  it('should call handleSubmit when form is submitted', () => {
    render(
      <ContratoForm
        alunoOptions={mockAlunoOptions}
        professorOptions={mockProfessorOptions}
        formData={mockFormData}
        isLoading={false}
        isSubmitting={false}
        errors={null}
        message=""
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        handleAlunoChange={mockHandleAlunoChange}
        handleProfessorChange={mockHandleProfessorChange}
        handleAtivoChange={mockHandleAtivoChange}
        handleHoraInicialChange={mockHandleHoraInicialChange}
        handleQuantidadeAulasChange={mockHandleQuantidadeAulasChange}
        handleDeleteAula={mockHandleDeleteAula}
        handleEditAula={mockHandleEditAula}
        handleGenerateAulasByContrato={mockHandleGenerateAulasByContrato}
        createAula={mockCreateAula}
        dataFormatter={mockDataFormatter}
      />
    );

    const form = screen.getByTestId('contrato-form');
    fireEvent.submit(form);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('should display loading component when isSubmitting is true', () => {
    render(
      <ContratoForm
        alunoOptions={mockAlunoOptions}
        professorOptions={mockProfessorOptions}
        formData={mockFormData}
        isLoading={false}
        isSubmitting={true}
        errors={null}
        message=""
        handleSubmit={mockHandleSubmit}
        handleChange={mockHandleChange}
        handleAlunoChange={mockHandleAlunoChange}
        handleProfessorChange={mockHandleProfessorChange}
        handleAtivoChange={mockHandleAtivoChange}
        handleHoraInicialChange={mockHandleHoraInicialChange}
        handleQuantidadeAulasChange={mockHandleQuantidadeAulasChange}
        handleDeleteAula={mockHandleDeleteAula}
        handleEditAula={mockHandleEditAula}
        handleGenerateAulasByContrato={mockHandleGenerateAulasByContrato}
        createAula={mockCreateAula}
        dataFormatter={mockDataFormatter}
      />
    );

    expect(screen.getByTestId('contrato-loading')).toBeInTheDocument();
  });
});
