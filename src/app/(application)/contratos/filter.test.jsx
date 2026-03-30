import { render, screen, fireEvent } from '@testing-library/react';
import { Filter } from './filter';
import { IDIOMA_ARRAY, IDIOMA_LABEL } from '@/constants';

// Mock do getEntityOptions
jest.mock('@/utils/getEntityOptions', () => ({
  getEntityOptions: jest.fn(entities =>
    entities.map(entity => ({
      label: `${entity.nome} - ${entity.email}`,
      value: entity.id,
    }))
  ),
}));

// Mock dos componentes
jest.mock('@/components', () => ({
  Form: ({ children, handleSubmit }) => (
    <form onSubmit={handleSubmit} data-testid="filter-form">
      {children}
    </form>
  ),
  FormGroup: ({ children }) => <div data-testid="form-group">{children}</div>,
  InputField: ({ htmlFor, label, type, onChange, value, required }) => (
    <div data-testid={`input-${htmlFor}`}>
      <label htmlFor={htmlFor}>{label}</label>
      <input
        id={htmlFor}
        name={htmlFor}
        type={type}
        onChange={onChange}
        value={value}
        required={required}
        data-testid={`input-field-${htmlFor}`}
      />
    </div>
  ),
  SelectField: ({ htmlFor, label, placeholder, options, onChange, value }) => (
    <div data-testid={`select-${htmlFor}`}>
      <label htmlFor={htmlFor}>{label}</label>
      <select
        id={htmlFor}
        name={htmlFor}
        onChange={onChange}
        value={value}
        data-testid={`select-field-${htmlFor}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option, idx) => (
          <option key={idx} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

describe('Filter Component', () => {
  const mockHandleSubmit = jest.fn(e => e?.preventDefault?.());
  const mockHandleChange = jest.fn();
  const mockFormData = {
    dataInicio: '2024-01-01',
    dataTermino: '2024-12-31',
    idioma: '',
    idAluno: '',
  };
  const mockAlunos = [
    { id: 1, nome: 'João Silva', email: 'joao@email.com' },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render filter form with title', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      expect(screen.getByText('Filtros')).toBeInTheDocument();
      expect(screen.getByTestId('filter-form')).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      expect(screen.getByTestId('input-dataInicio')).toBeInTheDocument();
      expect(screen.getByTestId('input-dataTermino')).toBeInTheDocument();
      expect(screen.getByTestId('select-idioma')).toBeInTheDocument();
      expect(screen.getByTestId('select-idAluno')).toBeInTheDocument();
    });

    it('should render date fields with correct labels', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      expect(screen.getByText('Data de início')).toBeInTheDocument();
      expect(screen.getByText('Data de fim')).toBeInTheDocument();
    });

    it('should render select fields with correct labels', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      expect(screen.getByText('Idioma')).toBeInTheDocument();
      expect(screen.getByText('Aluno')).toBeInTheDocument();
    });

    it('should render idioma options based on IDIOMA_ARRAY', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      const idiomaSelect = screen.getByTestId('select-field-idioma');
      const options = idiomaSelect.querySelectorAll('option');

      // +1 for placeholder option
      expect(options.length).toBe(IDIOMA_ARRAY.length + 1);
    });

    it('should render aluno options from provided alunos list', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      const alunoSelect = screen.getByTestId('select-field-idAluno');
      const options = alunoSelect.querySelectorAll('option');

      // +1 for placeholder option
      expect(options.length).toBe(mockAlunos.length + 1);
    });
  });

  describe('Form Data Binding', () => {
    it('should display dataInicio value from formData', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      const dataInicioInput = screen.getByTestId('input-field-dataInicio');
      expect(dataInicioInput.value).toBe('2024-01-01');
    });

    it('should display dataTermino value from formData', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      const dataTerminoInput = screen.getByTestId('input-field-dataTermino');
      expect(dataTerminoInput.value).toBe('2024-12-31');
    });

    it('should display idioma value from formData', () => {
      const formDataWithIdioma = { ...mockFormData, idioma: 'INGLES' };

      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={formDataWithIdioma}
          alunos={mockAlunos}
        />
      );

      const idiomaSelect = screen.getByTestId('select-field-idioma');
      expect(idiomaSelect.value).toBe('INGLES');
    });

    it('should display idAluno value from formData', () => {
      const formDataWithAluno = { ...mockFormData, idAluno: '1' };

      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={formDataWithAluno}
          alunos={mockAlunos}
        />
      );

      const alunoSelect = screen.getByTestId('select-field-idAluno');
      expect(alunoSelect.value).toBe('1');
    });
  });

  describe('User Interactions', () => {
    it('should call handleChange when dataInicio changes', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      const dataInicioInput = screen.getByTestId('input-field-dataInicio');
      fireEvent.change(dataInicioInput, { target: { value: '2024-02-01' } });

      expect(mockHandleChange).toHaveBeenCalled();
    });

    it('should call handleChange when dataTermino changes', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      const dataTerminoInput = screen.getByTestId('input-field-dataTermino');
      fireEvent.change(dataTerminoInput, { target: { value: '2025-01-01' } });

      expect(mockHandleChange).toHaveBeenCalled();
    });

    it('should call handleChange when idioma changes', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      const idiomaSelect = screen.getByTestId('select-field-idioma');
      fireEvent.change(idiomaSelect, { target: { value: 'INGLES' } });

      expect(mockHandleChange).toHaveBeenCalled();
    });

    it('should call handleChange when idAluno changes', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      const alunoSelect = screen.getByTestId('select-field-idAluno');
      fireEvent.change(alunoSelect, { target: { value: '1' } });

      expect(mockHandleChange).toHaveBeenCalled();
    });

    it('should call handleSubmit when form is submitted', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      const form = screen.getByTestId('filter-form');
      fireEvent.submit(form);

      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should render with empty alunos array', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={[]}
        />
      );

      const alunoSelect = screen.getByTestId('select-field-idAluno');
      const options = alunoSelect.querySelectorAll('option');

      // Only placeholder option
      expect(options.length).toBe(1);
    });

    it('should render with empty formData values', () => {
      const emptyFormData = {
        dataInicio: '',
        dataTermino: '',
        idioma: '',
        idAluno: '',
      };

      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={emptyFormData}
          alunos={mockAlunos}
        />
      );

      expect(screen.getByTestId('input-field-dataInicio').value).toBe('');
      expect(screen.getByTestId('input-field-dataTermino').value).toBe('');
      expect(screen.getByTestId('select-field-idioma').value).toBe('');
      expect(screen.getByTestId('select-field-idAluno').value).toBe('');
    });

    it('should render date fields as optional', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      const dataInicioInput = screen.getByTestId('input-field-dataInicio');
      const dataTerminoInput = screen.getByTestId('input-field-dataTermino');

      expect(dataInicioInput).not.toHaveAttribute('required');
      expect(dataTerminoInput).not.toHaveAttribute('required');
    });
  });

  describe('Integration with getEntityOptions', () => {
    it('should call getEntityOptions with alunos', () => {
      const { getEntityOptions } = require('@/utils/getEntityOptions');

      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      expect(getEntityOptions).toHaveBeenCalledWith(mockAlunos);
    });
  });
});
