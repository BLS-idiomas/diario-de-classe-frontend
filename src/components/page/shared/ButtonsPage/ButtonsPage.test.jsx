import { render, screen } from '@testing-library/react';
import { ButtonsPage } from './index';

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockedLink = ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockedLink.displayName = 'Link';
  return MockedLink;
});

describe('ButtonsPage', () => {
  it('should render with data-testid when buttons are provided', () => {
    const buttons = [
      { href: '/back', label: 'Voltar', type: 'secondary' },
      { href: '/new', label: 'Novo', type: 'primary' },
    ];

    render(<ButtonsPage buttons={buttons} extraButton={null} />);

    expect(screen.getByTestId('buttons-page')).toBeInTheDocument();
  });

  it('should render individual button links with data-testid', () => {
    const buttons = [
      { href: '/back', label: 'Voltar', type: 'secondary' },
      { href: '/new', label: 'Novo', type: 'primary' },
    ];

    render(<ButtonsPage buttons={buttons} extraButton={null} />);

    expect(
      screen.getByTestId('buttons-page-link-secondary')
    ).toBeInTheDocument();
    expect(screen.getByTestId('buttons-page-link-primary')).toBeInTheDocument();
  });

  it('should render button labels correctly', () => {
    const buttons = [
      { href: '/back', label: 'Voltar', type: 'secondary' },
      { href: '/new', label: 'Novo', type: 'primary' },
    ];

    render(<ButtonsPage buttons={buttons} extraButton={null} />);

    expect(screen.getByText('Voltar')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should apply correct href to links', () => {
    const buttons = [
      { href: '/alunos', label: 'Voltar', type: 'secondary' },
      { href: '/alunos/novo', label: 'Novo', type: 'primary' },
    ];

    render(<ButtonsPage buttons={buttons} extraButton={null} />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/alunos');
    expect(links[1]).toHaveAttribute('href', '/alunos/novo');
  });

  it('should apply correct button type classes', () => {
    const buttons = [
      { href: '/back', label: 'Voltar', type: 'secondary' },
      { href: '/new', label: 'Novo', type: 'danger' },
    ];

    render(<ButtonsPage buttons={buttons} extraButton={null} />);

    const secondaryBtn = screen.getByTestId('buttons-page-link-secondary');
    expect(secondaryBtn).toHaveClass('btn', 'btn-secondary');

    const dangerBtn = screen.getByTestId('buttons-page-link-danger');
    expect(dangerBtn).toHaveClass('btn', 'btn-danger');
  });

  it('should render extraButton when provided', () => {
    const buttons = [{ href: '/back', label: 'Voltar', type: 'secondary' }];
    const extraButton = <button data-testid="extra-action">More</button>;

    render(<ButtonsPage buttons={buttons} extraButton={extraButton} />);

    expect(screen.getByTestId('extra-action')).toBeInTheDocument();
  });

  it('should return null when no buttons and no extraButton', () => {
    const { container } = render(
      <ButtonsPage buttons={[]} extraButton={null} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render when only extraButton is provided', () => {
    const extraButton = <button data-testid="extra-btn">Action</button>;

    render(<ButtonsPage buttons={[]} extraButton={extraButton} />);

    expect(screen.getByTestId('buttons-page')).toBeInTheDocument();
    expect(screen.getByTestId('extra-btn')).toBeInTheDocument();
  });

  it('should render multiple buttons with correct data-testids', () => {
    const buttons = [
      { href: '/1', label: 'Button 1', type: 'primary' },
      { href: '/2', label: 'Button 2', type: 'secondary' },
      { href: '/3', label: 'Button 3', type: 'danger' },
    ];

    render(<ButtonsPage buttons={buttons} extraButton={null} />);

    expect(screen.getByTestId('buttons-page-link-primary')).toBeInTheDocument();
    expect(
      screen.getByTestId('buttons-page-link-secondary')
    ).toBeInTheDocument();
    expect(screen.getByTestId('buttons-page-link-danger')).toBeInTheDocument();
  });

  it('should render button-group container with correct class', () => {
    const buttons = [{ href: '/back', label: 'Voltar', type: 'secondary' }];

    const { container } = render(
      <ButtonsPage buttons={buttons} extraButton={null} />
    );

    const buttonGroup = container.querySelector('[data-testid="buttons-page"]');
    expect(buttonGroup).toHaveClass('button-group');
  });

  it('should render with both buttons and extraButton', () => {
    const buttons = [
      { href: '/back', label: 'Voltar', type: 'secondary' },
      { href: '/new', label: 'Novo', type: 'primary' },
    ];
    const extraButton = <button data-testid="export-btn">Exportar</button>;

    render(<ButtonsPage buttons={buttons} extraButton={extraButton} />);

    expect(
      screen.getByTestId('buttons-page-link-secondary')
    ).toBeInTheDocument();
    expect(screen.getByTestId('buttons-page-link-primary')).toBeInTheDocument();
    expect(screen.getByTestId('export-btn')).toBeInTheDocument();
  });

  it('should handle buttons with different routes', () => {
    const buttons = [
      { href: '/dashboard', label: 'Dashboard', type: 'primary' },
      { href: '/settings', label: 'Configure', type: 'secondary' },
      { href: '/logout', label: 'Sair', type: 'danger' },
    ];

    render(<ButtonsPage buttons={buttons} extraButton={null} />);

    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(screen.getByText('Dashboard')).toHaveAttribute('href', '/dashboard');
    expect(screen.getByText('Configure')).toHaveAttribute('href', '/settings');
    expect(screen.getByText('Sair')).toHaveAttribute('href', '/logout');
  });
});
