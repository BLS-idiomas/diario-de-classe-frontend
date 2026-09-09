import { render, screen, fireEvent } from '@testing-library/react';
import { LivroForm } from '.';

// Mock dos componentes: o teste é do LivroForm, não das primitivas de campo.
jest.mock('@/components', () => ({
  Form: ({ children, handleSubmit }) => (
    <form data-testid="form" onSubmit={handleSubmit}>
      {children}
    </form>
  ),
  FormError: ({ title, errors }) => (
    <div data-testid="form-error">
      {title && <div data-testid="error-title">{title}</div>}
      {errors && <div data-testid="errors">{JSON.stringify(errors)}</div>}
    </div>
  ),
  FormGroup: ({ children }) => <div data-testid="form-group">{children}</div>,
  InputField: ({ htmlFor, label, value, onChange, required, type }) => (
    <div data-testid={`input-${htmlFor}`}>
      <label htmlFor={htmlFor}>
        {label}
        {required && ' *'}
      </label>
      <input
        id={htmlFor}
        name={htmlFor}
        type={type || 'text'}
        value={value ?? ''}
        onChange={onChange}
        required={required}
      />
    </div>
  ),
  SelectField: ({ htmlFor, label, value, onChange, options, required }) => (
    <div data-testid={`select-${htmlFor}`}>
      <label htmlFor={htmlFor}>{label}</label>
      <select
        id={htmlFor}
        name={htmlFor}
        value={value || ''}
        onChange={onChange}
        required={required}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
  CheckboxField: ({ htmlFor, label, checked, onChange }) => (
    <div data-testid={`checkbox-${htmlFor}`}>
      <label htmlFor={htmlFor}>{label}</label>
      <input
        id={htmlFor}
        name={htmlFor}
        type="checkbox"
        checked={checked || false}
        onChange={onChange}
      />
    </div>
  ),
  ButtonsFields: ({ isLoading, href }) => (
    <div data-testid="buttons-fields">
      <span data-testid="buttons-href">{href}</span>
      <button type="submit" disabled={isLoading}>
        Salvar
      </button>
    </div>
  ),
}));

describe('LivroForm', () => {
  const formData = {
    nome: 'New Interchange 1',
    idioma: 'INGLES',
    nivel: 1,
    ativo: true,
  };

  it('renderiza os campos do livro', () => {
    render(<LivroForm formData={formData} />);

    expect(screen.getByTestId('input-nome')).toBeInTheDocument();
    expect(screen.getByTestId('select-idioma')).toBeInTheDocument();
    expect(screen.getByTestId('input-nivel')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-ativo')).toBeInTheDocument();
  });

  it('preenche os campos com os dados recebidos', () => {
    render(<LivroForm formData={formData} />);

    expect(screen.getByLabelText(/Nome do livro/)).toHaveValue(
      'New Interchange 1'
    );
    expect(screen.getByLabelText('Idioma')).toHaveValue('INGLES');
    expect(screen.getByLabelText('Nível')).toHaveValue(1);
    expect(screen.getByLabelText(/Livro ativo/)).toBeChecked();
  });

  it('oferece apenas os idiomas suportados pela escola', () => {
    render(<LivroForm formData={formData} />);

    const select = screen.getByLabelText('Idioma');
    const labels = Array.from(select.options).map(option => option.textContent);

    expect(labels).toEqual(['Inglês', 'Espanhol', 'Francês']);
  });

  it('dispara handleChange ao digitar o nome', () => {
    const handleChange = jest.fn();
    render(<LivroForm formData={formData} handleChange={handleChange} />);

    fireEvent.change(screen.getByLabelText(/Nome do livro/), {
      target: { value: 'Outro livro' },
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it('dispara handleSubmit ao enviar o formulário', () => {
    const handleSubmit = jest.fn(e => e.preventDefault());
    render(<LivroForm formData={formData} handleSubmit={handleSubmit} />);

    fireEvent.submit(screen.getByTestId('form'));

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('mostra mensagem e erros de validação', () => {
    render(
      <LivroForm
        formData={formData}
        message="Erro de validação"
        errors={['nome: Campo obrigatório']}
      />
    );

    expect(screen.getByTestId('error-title')).toHaveTextContent(
      'Erro de validação'
    );
    expect(screen.getByTestId('errors')).toHaveTextContent(
      'nome: Campo obrigatório'
    );
  });

  it('volta para a lista de livros ao cancelar', () => {
    render(<LivroForm formData={formData} />);

    expect(screen.getByTestId('buttons-href')).toHaveTextContent('/livros');
  });

  it('desmarca o checkbox quando o livro está inativo', () => {
    render(<LivroForm formData={{ ...formData, ativo: false }} />);

    expect(screen.getByLabelText(/Livro ativo/)).not.toBeChecked();
  });
});
