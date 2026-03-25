import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Filter } from '../filter';
import * as constants from '@/constants';

// Mock dos componentes importados
jest.mock('@/components', () => ({
  Form: ({ children, handleSubmit }) => (
    <form onSubmit={handleSubmit} data-testid="filter-form">
      {children}
    </form>
  ),
  FormGroup: ({ children, cols }) => (
    <div data-testid="form-group" data-cols={cols}>
      {children}
    </div>
  ),
  InputField: ({ htmlFor, label, type, onChange, value, required }) => (
    <div data-testid={`input-field-${htmlFor}`}>
      <label htmlFor={htmlFor}>{label}</label>
      <input
        id={htmlFor}
        type={type}
        onChange={onChange}
        value={value}
        required={required}
      />
    </div>
  ),
  SelectField: ({ htmlFor, label, placeholder, options, onChange, value }) => (
    <div data-testid={`select-field-${htmlFor}`}>
      <label htmlFor={htmlFor}>{label}</label>
      <select id={htmlFor} onChange={onChange} value={value}>
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

// Mock da função getEntityOptions
jest.mock('@/utils/getEntityOptions', () => ({
  getEntityOptions: entities =>
    entities.map(entity => ({
      label: `${entity.nome} ${entity.sobrenome}`,
      value: entity.id,
    })),
}));

describe('Filter Component', () => {
  const defaultProps = {
    handleSubmit: jest.fn(),
    handleChange: jest.fn(),
    formData: {
      dataInicio: '',
      dataTermino: '',
      tipo: '',
      status: '',
      idAluno: '',
      idProfessor: '',
    },
    alunos: [],
    professores: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the filter component', () => {
    render(<Filter {...defaultProps} />);

    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByTestId('filter-form')).toBeInTheDocument();
  });

  it('should render all required input fields', () => {
    render(<Filter {...defaultProps} />);

    expect(screen.getByText('Data de início')).toBeInTheDocument();
    expect(screen.getByText('Data de fim')).toBeInTheDocument();
  });

  it('should render all select fields', () => {
    render(<Filter {...defaultProps} />);

    expect(screen.getByText('Tipo da aula')).toBeInTheDocument();
    expect(screen.getByText('Status da aula')).toBeInTheDocument();
    expect(screen.getByText('Aluno')).toBeInTheDocument();
    expect(screen.getByText('Professor')).toBeInTheDocument();
  });

  it('should render date inputs with correct types', () => {
    render(<Filter {...defaultProps} />);

    const inicioInput = screen.getByLabelText('Data de início');
    const terminoInput = screen.getByLabelText('Data de fim');

    expect(inicioInput).toHaveAttribute('type', 'date');
    expect(terminoInput).toHaveAttribute('type', 'date');
  });

  it('should call handleChange when input value changes', () => {
    const handleChange = jest.fn();
    render(<Filter {...defaultProps} handleChange={handleChange} />);

    const inicioInput = screen.getByLabelText('Data de início');
    fireEvent.change(inicioInput, { target: { value: '2026-01-01' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('should call handleChange when select value changes', () => {
    const handleChange = jest.fn();
    render(<Filter {...defaultProps} handleChange={handleChange} />);

    const tipoSelect = screen.getByDisplayValue('Selecione o tipo da aula');
    fireEvent.change(tipoSelect, { target: { value: 'individual' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', () => {
    const handleSubmit = jest.fn();
    render(<Filter {...defaultProps} handleSubmit={handleSubmit} />);

    const form = screen.getByTestId('filter-form');
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('should display form data values', () => {
    const formData = {
      dataInicio: '2026-01-01',
      dataTermino: '2026-01-31',
      tipo: 'individual',
      status: 'realizada',
      idAluno: '1',
      idProfessor: '1',
    };

    render(<Filter {...defaultProps} formData={formData} />);

    expect(screen.getByDisplayValue('2026-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-01-31')).toBeInTheDocument();
  });

  it('should pass alunos to getEntityOptions', () => {
    const alunos = [
      { id: 1, nome: 'João', sobrenome: 'Silva', email: 'joao@example.com' },
      { id: 2, nome: 'Maria', sobrenome: 'Santos', email: 'maria@example.com' },
    ];

    render(<Filter {...defaultProps} alunos={alunos} />);

    // Verifica que o componente renderizou sem erros
    expect(screen.getByTestId('select-field-idAluno')).toBeInTheDocument();
  });

  it('should pass professores to getEntityOptions', () => {
    const professores = [
      {
        id: 1,
        nome: 'Pedro',
        sobrenome: 'Oliveira',
        email: 'pedro@example.com',
      },
      { id: 2, nome: 'Ana', sobrenome: 'Costa', email: 'ana@example.com' },
    ];

    render(<Filter {...defaultProps} professores={professores} />);

    // Verifica que o componente renderizou sem erros
    expect(screen.getByTestId('select-field-idProfessor')).toBeInTheDocument();
  });

  it('should render with empty alunos and professores arrays', () => {
    render(<Filter {...defaultProps} alunos={[]} professores={[]} />);

    expect(screen.getByTestId('filter-form')).toBeInTheDocument();
  });

  it('should render FormGroup with 2 columns', () => {
    render(<Filter {...defaultProps} />);

    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toHaveAttribute('data-cols', '2');
  });

  it('should pass placeholder correctly to select fields', () => {
    render(<Filter {...defaultProps} />);

    expect(
      screen.getByDisplayValue('Selecione o tipo da aula')
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('Selecione o status')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Selecione o aluno')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Selecione o professor')
    ).toBeInTheDocument();
  });
});
