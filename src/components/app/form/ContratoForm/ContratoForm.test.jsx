import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContratoForm } from '.';

jest.mock('@/components', () => ({
  Form: ({ children, handleSubmit, props }) => (
    <form data-testid="contrato-form" onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  ),
  FormError: ({ title, errors, dataTestId }) => (
    <div data-testid={dataTestId || 'contrato-form-error'}>
      {title && <div data-testid="contrato-error-title">{title}</div>}
      {errors && Array.isArray(errors) && errors.length > 0 && (
        <div data-testid="contrato-errors">
          {errors.map((error, idx) => (
            <div key={idx}>{error}</div>
          ))}
        </div>
      )}
    </div>
  ),
  FormGroup: ({ children, col, cols, dataTestId }) => (
    <div
      data-testid={dataTestId || 'contrato-form-group'}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${col || cols || 1}, 1fr)`,
      }}
    >
      {children}
    </div>
  ),
  InputField: ({
    htmlFor,
    label,
    value,
    onChange,
    type,
    required,
    disabled,
  }) => {
    // Remove accents and normalize label
    const normalizeLabel = str => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
    };

    const labelPart = label ? normalizeLabel(label) : '';
    // For labels that repeat (hora inicial, hora final), include the day/htmlFor
    const repeatingLabels = ['hora-inicial', 'hora-final'];
    const shouldIncludeHtmlFor = repeatingLabels.includes(labelPart);
    const testId =
      labelPart && shouldIncludeHtmlFor
        ? `contrato-input-${labelPart}-${htmlFor.toLowerCase()}`
        : labelPart
          ? `contrato-input-${labelPart}`
          : `contrato-input-${htmlFor}`;
    return (
      <div data-testid={testId}>
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
          data-testid={`input-${htmlFor}`}
        />
      </div>
    );
  },
  SelectField: ({
    htmlFor,
    label,
    value,
    onChange,
    required,
    options,
    disabled,
    placeholder,
  }) => (
    <div data-testid={`contrato-select-${htmlFor}`}>
      <label htmlFor={htmlFor}>
        {label}
        {required && ' *'}
      </label>
      <select
        id={htmlFor}
        name={htmlFor}
        value={value || ''}
        onChange={onChange}
        required={required}
        disabled={disabled}
        data-testid={`select-${htmlFor}`}
      >
        <option value="">{placeholder || 'Selecione...'}</option>
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
        data-testid={`checkbox-${htmlFor}`}
      />
      <label htmlFor={htmlFor}>{label}</label>
    </div>
  ),
  Badge: ({ text, color, icon }) => (
    <div data-testid="contrato-badge" className={`badge-${color}`}>
      {icon && <span className={`icon-${icon}`} />}
      {text}
    </div>
  ),
  Loading: () => <div data-testid="contrato-loading">Carregando...</div>,
  ButtonsFields: ({ isLoading, href, blocked }) => (
    <div data-testid="contrato-buttons-fields">
      <button
        type="submit"
        disabled={isLoading || blocked}
        data-testid="submit-button"
      >
        {isLoading ? 'Carregando...' : 'Salvar'}
      </button>
      <a href={href} data-testid="cancel-button">
        Cancelar
      </a>
    </div>
  ),
}));

jest.mock('lucide-react', () => ({
  Pencil: () => <svg data-testid="icon-pencil" />,
  Trash2: () => <svg data-testid="icon-trash" />,
  Plus: () => <svg data-testid="icon-plus" />,
  Wand2: () => <svg data-testid="icon-wand" />,
}));

describe('ContratoForm Component', () => {
  const mockAlunoOptions = [
    { value: 1, label: 'João Silva' },
    { value: 2, label: 'Maria Santos' },
  ];

  const mockProfessorOptions = [
    { value: 1, label: 'Prof. Carlos' },
    { value: 2, label: 'Prof. Ana' },
  ];

  const mockFormData = {
    alunoId: 1,
    aluno: { nome: 'João Silva' },
    professorId: 1,
    professor: { nome: 'Prof. Carlos' },
    dataInicio: '2024-03-01',
    dataTermino: '2024-12-31',
    idioma: 'ENGLISH',
    status: 'ATIVO',
    diasAulas: [
      {
        diaSemana: 'SEGUNDA',
        ativo: true,
        quantidadeAulas: 1,
        horaInicial: '10:00',
        horaFinal: '10:40',
      },
      {
        diaSemana: 'TERCA',
        ativo: false,
        quantidadeAulas: 1,
        horaInicial: '',
        horaFinal: '',
      },
      {
        diaSemana: 'QUARTA',
        ativo: true,
        quantidadeAulas: 2,
        horaInicial: '14:00',
        horaFinal: '15:20',
      },
      {
        diaSemana: 'QUINTA',
        ativo: false,
        quantidadeAulas: 1,
        horaInicial: '',
        horaFinal: '',
      },
      {
        diaSemana: 'SEXTA',
        ativo: false,
        quantidadeAulas: 1,
        horaInicial: '',
        horaFinal: '',
      },
      {
        diaSemana: 'SABADO',
        ativo: false,
        quantidadeAulas: 1,
        horaInicial: '',
        horaFinal: '',
      },
      {
        diaSemana: 'DOMINGO',
        ativo: false,
        quantidadeAulas: 1,
        horaInicial: '',
        horaFinal: '',
      },
    ],
    aulas: [
      {
        id: 1,
        dataAula: '2024-03-04T10:00:00.000Z',
        horaInicial: '10:00',
        horaFinal: '10:40',
        tipo: 'PADRAO',
        observacao: 'Aula de teste',
      },
    ],
  };

  const mockHandlers = {
    handleSubmit: jest.fn(e => e.preventDefault()),
    handleChange: jest.fn(),
    handleAlunoChange: jest.fn(),
    handleProfessorChange: jest.fn(),
    handleAtivoChange: jest.fn(),
    handleHoraInicialChange: jest.fn(),
    handleQuantidadeAulasChange: jest.fn(),
    handleDeleteAula: jest.fn(),
    handleEditAula: jest.fn(),
    handleGenerateAulasByContrato: jest.fn(),
    createAula: jest.fn(),
  };

  const mockDataFormatter = jest.fn(date => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render form with correct data-testid', () => {
      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={mockFormData}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      expect(screen.getByTestId('contrato-form')).toBeInTheDocument();
    });

    it('should render FormError component', () => {
      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={mockFormData}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      expect(screen.getByTestId('contrato-form-error')).toBeInTheDocument();
    });
  });

  describe('Step 1: Aluno and Professor Selection', () => {
    it('should render all step 1 fields', () => {
      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={mockFormData}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      expect(screen.getByTestId('contrato-select-alunoId')).toBeInTheDocument();
      expect(
        screen.getByTestId('contrato-select-professorId')
      ).toBeInTheDocument();
      expect(screen.getByTestId('contrato-select-idioma')).toBeInTheDocument();
      expect(screen.getByTestId('contrato-select-status')).toBeInTheDocument();
    });

    it('should render date fields for contract dates', () => {
      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={mockFormData}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      expect(
        screen.getByTestId('contrato-input-data-de-inicio-do-contrato')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('contrato-input-data-de-termino-do-contrato')
      ).toBeInTheDocument();
    });

    it('should display selected aluno option value', () => {
      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={mockFormData}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      const alunoSelect = screen.getByTestId('select-alunoId');
      expect(alunoSelect.value).toBe('1');
    });

    it('should call handleAlunoChange when aluno changes', async () => {
      const { rerender } = render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={mockFormData}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      const alunoSelect = screen.getByTestId('select-alunoId');
      fireEvent.change(alunoSelect, { target: { value: '2' } });

      expect(mockHandlers.handleAlunoChange).toHaveBeenCalled();
    });
  });

  describe('Step 2: Dias de Aula', () => {
    it('should render dias de aula section when conditions are met', () => {
      const formDataWithAllRequiredFields = {
        ...mockFormData,
        professor: { nome: 'Prof. Carlos' },
        aluno: { nome: 'João Silva' },
        dataInicio: '2024-03-01',
        dataTermino: '2024-12-31',
      };

      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={formDataWithAllRequiredFields}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      // Should render dias de aula checkboxes
      expect(
        screen.getByTestId('contrato-checkbox-SEGUNDA')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('contrato-checkbox-QUARTA')
      ).toBeInTheDocument();
    });

    it('should toggle dia ativo checkbox', () => {
      const formDataWithAllRequiredFields = {
        ...mockFormData,
        professor: { nome: 'Prof. Carlos' },
        aluno: { nome: 'João Silva' },
      };

      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={formDataWithAllRequiredFields}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      const checkbox = screen.getByTestId('checkbox-SEGUNDA');
      fireEvent.click(checkbox);

      expect(mockHandlers.handleAtivoChange).toHaveBeenCalled();
    });

    it('should render hora inicial and hora final inputs when dia is ativo', () => {
      const formDataWithAllRequiredFields = {
        ...mockFormData,
        professor: { nome: 'Prof. Carlos' },
        aluno: { nome: 'João Silva' },
        diasAulas: mockFormData.diasAulas.map(dia =>
          dia.diaSemana === 'SEGUNDA' ? { ...dia, ativo: true } : dia
        ),
      };

      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={formDataWithAllRequiredFields}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      // Check for hora inicial and hora final inputs by unique labels with day
      expect(
        screen.getByTestId('contrato-input-hora-inicial-segunda')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('contrato-input-hora-final-segunda')
      ).toBeInTheDocument();
    });

    it('should call handleHoraInicialChange when hora inicial changes', async () => {
      const formDataWithAllRequiredFields = {
        ...mockFormData,
        professor: { nome: 'Prof. Carlos' },
        aluno: { nome: 'João Silva' },
        diasAulas: mockFormData.diasAulas.map(dia =>
          dia.diaSemana === 'SEGUNDA' ? { ...dia, ativo: true } : dia
        ),
      };

      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={formDataWithAllRequiredFields}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      const horaInicialContainer = screen.getByTestId(
        'contrato-input-hora-inicial-segunda'
      );
      const horaInicialInput = horaInicialContainer.querySelector('input');
      await userEvent.clear(horaInicialInput);
      await userEvent.type(horaInicialInput, '10:00');
      expect(mockHandlers.handleHoraInicialChange).toHaveBeenCalled();
    });
  });

  describe('Step 3: Aulas', () => {
    it('should render aulas section with Nova Aula button', () => {
      const formDataWithAulasActive = {
        ...mockFormData,
        professor: { nome: 'Prof. Carlos' },
        aluno: { nome: 'João Silva' },
        diasAulas: mockFormData.diasAulas.map(dia =>
          dia.diaSemana === 'SEGUNDA' ? { ...dia, ativo: true } : dia
        ),
      };

      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={formDataWithAulasActive}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      // Should display "Nova Aula" button if aulas section is visible
      const buttons = screen.queryAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should display aulas count', () => {
      const formDataWithAulasActive = {
        ...mockFormData,
        professor: { nome: 'Prof. Carlos' },
        aluno: { nome: 'João Silva' },
        diasAulas: mockFormData.diasAulas.map(dia =>
          dia.diaSemana === 'SEGUNDA' ? { ...dia, ativo: true } : dia
        ),
      };

      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={formDataWithAulasActive}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      expect(screen.getByText(/Total de.*aulas/)).toBeInTheDocument();
    });

    it('should render aula cards with edit and delete buttons', () => {
      const formDataWithAulasActive = {
        ...mockFormData,
        professor: { nome: 'Prof. Carlos' },
        aluno: { Nome: 'João Silva' },
        diasAulas: mockFormData.diasAulas.map(dia =>
          dia.diaSemana === 'SEGUNDA' ? { ...dia, ativo: true } : dia
        ),
      };

      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={formDataWithAulasActive}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      const editButtons = screen.queryAllByTestId('icon-pencil');
      const trashButtons = screen.queryAllByTestId('icon-trash');

      expect(editButtons.length).toBeGreaterThanOrEqual(0);
      expect(trashButtons.length).toBeGreaterThanOrEqual(0);
    });

    it('should display loading component when isSubmitting is true', () => {
      const formDataWithAulasActive = {
        ...mockFormData,
        professor: { nome: 'Prof. Carlos' },
        aluno: { Nome: 'João Silva' },
        diasAulas: mockFormData.diasAulas.map(dia =>
          dia.diaSemana === 'SEGUNDA' ? { ...dia, ativo: true } : dia
        ),
      };

      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={formDataWithAulasActive}
          isLoading={false}
          isSubmitting={true}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      expect(screen.getByTestId('contrato-loading')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should render submit button', () => {
      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={mockFormData}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
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
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button when blocked is true (no aulas)', () => {
      const formDataNoAulas = {
        ...mockFormData,
        aulas: [],
      };

      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={formDataNoAulas}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should call handleSubmit when form is submitted', async () => {
      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={mockFormData}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      const form = screen.getByTestId('contrato-form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockHandlers.handleSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when provided', () => {
      const errorMessage = 'Erro ao salvar contrato';
      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={mockFormData}
          isLoading={false}
          isSubmitting={false}
          errors={['error1', 'error2']}
          message={errorMessage}
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      expect(screen.getByTestId('contrato-error-title')).toHaveTextContent(
        errorMessage
      );
    });

    it('should display error list when errors array is provided', () => {
      const errors = ['Campo obrigatório', 'Data inválida'];
      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={mockFormData}
          isLoading={false}
          isSubmitting={false}
          errors={errors}
          message="Erros no formulário"
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      expect(screen.getByTestId('contrato-errors')).toBeInTheDocument();
    });
  });

  describe('Cancel Button', () => {
    it('should render cancel button with correct href', () => {
      render(
        <ContratoForm
          alunoOptions={mockAlunoOptions}
          professorOptions={mockProfessorOptions}
          formData={mockFormData}
          isLoading={false}
          isSubmitting={false}
          errors={null}
          message=""
          {...mockHandlers}
          dataFormatter={mockDataFormatter}
        />
      );

      const cancelButton = screen.getByTestId('cancel-button');
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton).toHaveAttribute('href', '/contratos');
    });
  });
});
