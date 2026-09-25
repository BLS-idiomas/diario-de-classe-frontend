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
  // Estande equivalente ao SelectField acima (mesma superfície observável:
  // label, options, onChange no formato { target: { name, value } }), mas
  // sem <select>/<option> nativos — reflete o widget combobox real
  // (SearchableSelectField exibe o rótulo resolvido, não o id bruto).
  // Contrato espelhado do componente real: `onChange` só dispara ao
  // selecionar uma opção ou ao limpar — nunca ao digitar no campo de busca
  // (o input de busca do componente real só atualiza `query`, estado
  // interno, em `handleInputChange`) — e a comparação `value`↔`option.value` usa
  // igualdade estrita, sem coerção (`Aluno.id` é `String @default(cuid())`
  // no schema Prisma: o domínio já entrega string dos dois lados).
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

describe('Filter Component', () => {
  const mockHandleSubmit = jest.fn(e => e?.preventDefault?.());
  const mockHandleChange = jest.fn();
  const mockFormData = {
    dataInicio: '2024-01-01',
    dataTermino: '2024-12-31',
    idioma: '',
    idAluno: '',
  };
  // Aluno.id é String @default(cuid()) — fixture usa o tipo real
  const mockAlunos = [
    { id: 'cuid-aluno-1', nome: 'João Silva', email: 'joao@email.com' },
    { id: 'cuid-aluno-2', nome: 'Maria Santos', email: 'maria@email.com' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the filter form without an internal "Filtros" heading (owned by the collapsible panel wrapper)', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      expect(screen.getByTestId('filter-form')).toBeInTheDocument();
      expect(screen.queryByText('Filtros')).not.toBeInTheDocument();
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

      const alunoOptionsList = screen.getByTestId(
        'select-field-idAluno-options'
      );
      const options = alunoOptionsList.querySelectorAll(
        '[data-testid="select-field-idAluno-option"]'
      );

      // Combobox pesquisável não tem opção de placeholder nativa (sem +1).
      expect(options.length).toBe(mockAlunos.length);
    });
  });

  describe('Clear Filters', () => {
    it('should render clear filters button and call handleClearFilter on click', () => {
      const handleClearFilter = jest.fn();
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          handleClearFilter={handleClearFilter}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      fireEvent.click(screen.getByTestId('clear-filters-button'));
      expect(handleClearFilter).toHaveBeenCalled();
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
      const formDataWithAluno = { ...mockFormData, idAluno: 'cuid-aluno-1' };

      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={formDataWithAluno}
          alunos={mockAlunos}
        />
      );

      // O combobox pesquisável exibe o rótulo resolvido (per getEntityOptions
      // mockado), não o id bruto — diferente do <select> nativo anterior.
      const alunoSelect = screen.getByTestId('select-field-idAluno');
      expect(alunoSelect.value).toBe('João Silva - joao@email.com');
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

    it('should call handleChange when idAluno changes (seleção de opção — o combobox real nunca dispara onChange ao digitar)', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      const opcoes = screen.getAllByTestId('select-field-idAluno-option');
      fireEvent.click(opcoes[0]);

      expect(mockHandleChange).toHaveBeenCalledWith({
        target: { name: 'idAluno', value: 'cuid-aluno-1' },
      });
    });

    it('digitar no campo de busca NUNCA chama handleChange — só a seleção de uma opção ou o botão de limpar disparam', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      const alunoInput = screen.getByTestId('select-field-idAluno');
      fireEvent.change(alunoInput, { target: { value: 'joão' } });

      expect(mockHandleChange).not.toHaveBeenCalled();
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

      const alunoOptionsList = screen.getByTestId(
        'select-field-idAluno-options'
      );
      const options = alunoOptionsList.querySelectorAll(
        '[data-testid="select-field-idAluno-option"]'
      );

      // Sem placeholder nativo no combobox: lista vazia é zero opções.
      expect(options.length).toBe(0);
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

  describe('SearchableSelectField widget (AC-001-011, AC-001-008 — parte, wiring do filtro)', () => {
    it('AC-001-011: com formData.idAluno vazio (estado pós-handleClearFilter), o campo renderiza sem seleção', () => {
      const clearedFormData = { ...mockFormData, idAluno: '' };

      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={clearedFormData}
          alunos={mockAlunos}
        />
      );

      expect(screen.getByTestId('select-field-idAluno').value).toBe('');
    });

    it('AC-001-008: com formData.idAluno apontando para um Aluno excluído (fora de `alunos`), o filtro renderiza sem erro e sem descartar o valor em silêncio (fallback ao value bruto, sem `selectedLabel`)', () => {
      const formDataWithDeletedAluno = { ...mockFormData, idAluno: '999' };

      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={formDataWithDeletedAluno}
          alunos={mockAlunos}
        />
      );

      // Nenhum option de `alunos` corresponde a '999' (Aluno deletado, hard
      // delete). Sem `selectedLabel` passado por este ponto de consumo, o
      // fallback é o próprio value bruto — nunca vazio/silencioso.
      expect(screen.getByTestId('select-field-idAluno').value).toBe('999');
    });
  });

  describe('isLoading/errorMessage wiring', () => {
    it('com isLoadingAlunos=true, o SearchableSelectField recebe isLoading (indicador de carregamento, não "nenhum resultado")', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
          isLoadingAlunos={true}
        />
      );

      expect(
        screen.getByTestId('select-field-idAluno-loading')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('select-field-idAluno-error')
      ).not.toBeInTheDocument();
    });

    it('com erroAlunos definido, o SearchableSelectField recebe errorMessage com a frase fixa em pt-BR (nunca o `message` cru do slice)', () => {
      const mensagemFixa =
        'Não foi possível carregar os alunos. Tente novamente.';

      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
          erroAlunos={mensagemFixa}
        />
      );

      expect(
        screen.getByTestId('select-field-idAluno-error')
      ).toHaveTextContent(mensagemFixa);
    });

    it('sem isLoadingAlunos/erroAlunos (default), nenhum indicador de carregamento nem erro aparece', () => {
      render(
        <Filter
          handleSubmit={mockHandleSubmit}
          handleChange={mockHandleChange}
          formData={mockFormData}
          alunos={mockAlunos}
        />
      );

      expect(
        screen.queryByTestId('select-field-idAluno-loading')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('select-field-idAluno-error')
      ).not.toBeInTheDocument();
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
