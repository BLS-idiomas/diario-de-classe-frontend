import { render, screen } from '@testing-library/react';
import { FormError } from './index.jsx';

describe('FormError', () => {
  it('renders nothing if no title', () => {
    const { container } = render(<FormError errors={['Campo obrigatório']} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders title and errors list', () => {
    render(
      <FormError
        title="Erro"
        errors={['Campo obrigatório', 'Formato inválido']}
      />
    );
    expect(screen.getByText(/erro:/i)).toBeInTheDocument();
    expect(screen.getByText(/campo obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/formato inválido/i)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders empty list if errors is empty', () => {
    render(<FormError title="Erro" errors={[]} />);
    expect(screen.getByText(/erro:/i)).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeEmptyDOMElement();
  });
});
