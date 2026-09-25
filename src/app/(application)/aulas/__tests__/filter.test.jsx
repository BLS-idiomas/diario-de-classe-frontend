import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Filter } from '../filter';

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
  // Estande equivalente ao SelectField acima (mesma superfície observável:
  // label, options, onChange no formato { target: { name, value } }), mas
  // sem <select>/<option> nativos — reflete o widget combobox real
  // (SearchableSelectField exibe o rótulo resolvido, não o id bruto).
  // Contrato espelhado do componente real: `onChange` só dispara ao
  // selecionar uma opção ou limpar — nunca ao digitar no campo de busca (o
  // componente real nunca chama `onChange` em `handleInputChange`); a
  // comparação `value`↔`option.value` usa igualdade estrita, sem coerção.
  SearchableSelectField: ({
    htmlFor,
    label,
    placeholder,
    options,
    onChange,
    value,
    selectedLabel,
    isLoading,
    errorMessage,
  }) => {
    const selectedOption = options.find(option => option.value === value);
    const displayValue = selectedOption
      ? selectedOption.label
      : value
        ? selectedLabel || String(value)
        : '';
    return (
      <div data-testid={`select-${htmlFor}`}>
        <label htmlFor={htmlFor}>{label}</label>
        <input
          id={htmlFor}
          name={htmlFor}
          role="combobox"
          aria-expanded="false"
          aria-controls={`${htmlFor}-listbox`}
          aria-busy={isLoading ? 'true' : undefined}
          placeholder={placeholder}
          value={displayValue}
          readOnly
          data-testid={`select-field-${htmlFor}`}
        />
        {isLoading && (
          <p data-testid={`select-field-${htmlFor}-loading`}>Carregando...</p>
        )}
        {errorMessage && (
          <p data-testid={`select-field-${htmlFor}-error`}>{errorMessage}</p>
        )}
        {value && (
          <button
            type="button"
            data-testid={`select-field-${htmlFor}-clear`}
            onClick={() => onChange({ target: { name: htmlFor, value: '' } })}
          >
            Limpar
          </button>
        )}
        <ul
          id={`${htmlFor}-listbox`}
          data-testid={`select-field-${htmlFor}-options`}
        >
          {options.map((option, idx) => (
            <li
              key={idx}
              role="option"
              aria-selected={option.value === value}
              data-testid={`select-field-${htmlFor}-option`}
              onClick={() =>
                onChange({ target: { name: htmlFor, value: option.value } })
              }
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    );
  },
  ClearFiltersButton: ({ onClick }) => (
    <button type="button" data-testid="clear-filters-button" onClick={onClick}>
      Limpar filtros
    </button>
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

  it('should render the filter form without an internal "Filtros" heading (owned by the collapsible panel wrapper)', () => {
    render(<Filter {...defaultProps} />);

    expect(screen.getByTestId('filter-form')).toBeInTheDocument();
    expect(screen.queryByText('Filtros')).not.toBeInTheDocument();
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

  it('should call handleClearFilter when clear button is clicked', () => {
    const handleClearFilter = jest.fn();
    render(<Filter {...defaultProps} handleClearFilter={handleClearFilter} />);

    fireEvent.click(screen.getByTestId('clear-filters-button'));

    expect(handleClearFilter).toHaveBeenCalled();
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
      {
        id: 'cuid-aluno-1',
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joao@example.com',
      },
      {
        id: 'cuid-aluno-2',
        nome: 'Maria',
        sobrenome: 'Santos',
        email: 'maria@example.com',
      },
    ];

    render(<Filter {...defaultProps} alunos={alunos} />);

    // Verifica que o componente renderizou sem erros
    expect(screen.getByTestId('select-field-idAluno')).toBeInTheDocument();
  });

  it('should pass professores to getEntityOptions', () => {
    const professores = [
      {
        id: 'cuid-professor-1',
        nome: 'Pedro',
        sobrenome: 'Oliveira',
        email: 'pedro@example.com',
      },
      {
        id: 'cuid-professor-2',
        nome: 'Ana',
        sobrenome: 'Costa',
        email: 'ana@example.com',
      },
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
    // Combobox pesquisável (idAluno/idProfessor): placeholder é atributo do
    // input, não uma option nativa — getByDisplayValue não se aplica mais a
    // eles.
    expect(
      screen.getByPlaceholderText('Selecione o aluno')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Selecione o professor')
    ).toBeInTheDocument();
  });

  describe('SearchableSelectField widget (AC-001-001, AC-001-008 — parte, wiring do filtro)', () => {
    it('should call handleChange when idAluno changes (seleção de opção — o combobox real nunca dispara onChange ao digitar)', () => {
      const handleChange = jest.fn();
      const alunos = [{ id: 'cuid-aluno-1', nome: 'João', sobrenome: 'Silva' }];

      render(
        <Filter {...defaultProps} handleChange={handleChange} alunos={alunos} />
      );

      const opcoes = screen.getAllByTestId('select-field-idAluno-option');
      fireEvent.click(opcoes[0]);

      expect(handleChange).toHaveBeenCalledWith({
        target: { name: 'idAluno', value: 'cuid-aluno-1' },
      });
    });

    it('should call handleChange when idProfessor changes (seleção de opção)', () => {
      const handleChange = jest.fn();
      const professores = [
        { id: 'cuid-professor-1', nome: 'Pedro', sobrenome: 'Oliveira' },
      ];

      render(
        <Filter
          {...defaultProps}
          handleChange={handleChange}
          professores={professores}
        />
      );

      const opcoes = screen.getAllByTestId('select-field-idProfessor-option');
      fireEvent.click(opcoes[0]);

      expect(handleChange).toHaveBeenCalledWith({
        target: { name: 'idProfessor', value: 'cuid-professor-1' },
      });
    });

    it('AC-001-008: com formData.idAluno/idProfessor apontando para um registro excluído (fora de `alunos`/`professores`), o filtro renderiza sem erro e sem descartar o valor em silêncio (fallback ao value bruto, sem `selectedLabel`)', () => {
      const formDataWithDeleted = {
        ...defaultProps.formData,
        idAluno: '999',
        idProfessor: '888',
      };

      render(<Filter {...defaultProps} formData={formDataWithDeleted} />);

      expect(screen.getByTestId('select-field-idAluno').value).toBe('999');
      expect(screen.getByTestId('select-field-idProfessor').value).toBe('888');
    });
  });

  describe('isLoading/errorMessage wiring (Aluno)', () => {
    it('com isLoadingAlunos=true, o SearchableSelectField de Aluno recebe isLoading (indicador de carregamento, não "nenhum resultado")', () => {
      render(<Filter {...defaultProps} isLoadingAlunos={true} />);

      expect(
        screen.getByTestId('select-field-idAluno-loading')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('select-field-idAluno-error')
      ).not.toBeInTheDocument();
    });

    it('com erroAlunos definido, o SearchableSelectField de Aluno recebe errorMessage com a frase fixa em pt-BR (nunca o `message` cru do slice)', () => {
      const mensagemFixa =
        'Não foi possível carregar os alunos. Tente novamente.';

      render(<Filter {...defaultProps} erroAlunos={mensagemFixa} />);

      expect(
        screen.getByTestId('select-field-idAluno-error')
      ).toHaveTextContent(mensagemFixa);
    });

    it('sem isLoadingAlunos/erroAlunos (default), nenhum indicador de carregamento nem erro aparece no campo de Aluno', () => {
      render(<Filter {...defaultProps} />);

      expect(
        screen.queryByTestId('select-field-idAluno-loading')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('select-field-idAluno-error')
      ).not.toBeInTheDocument();
    });
  });

  describe('isLoading/errorMessage wiring (Professor)', () => {
    it('com isLoadingProfessores=true, o SearchableSelectField de Professor recebe isLoading (indicador de carregamento, não "nenhum resultado")', () => {
      render(<Filter {...defaultProps} isLoadingProfessores={true} />);

      expect(
        screen.getByTestId('select-field-idProfessor-loading')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('select-field-idProfessor-error')
      ).not.toBeInTheDocument();
    });

    it('com erroProfessores definido, o SearchableSelectField de Professor recebe errorMessage com a frase fixa em pt-BR (nunca o `message` cru do slice)', () => {
      const mensagemFixa =
        'Não foi possível carregar os professores. Tente novamente.';

      render(<Filter {...defaultProps} erroProfessores={mensagemFixa} />);

      expect(
        screen.getByTestId('select-field-idProfessor-error')
      ).toHaveTextContent(mensagemFixa);
    });

    it('sem isLoadingProfessores/erroProfessores (default), nenhum indicador de carregamento nem erro aparece no campo de Professor', () => {
      render(<Filter {...defaultProps} />);

      expect(
        screen.queryByTestId('select-field-idProfessor-loading')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('select-field-idProfessor-error')
      ).not.toBeInTheDocument();
    });
  });
});
