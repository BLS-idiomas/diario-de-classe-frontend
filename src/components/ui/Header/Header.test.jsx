import { render, fireEvent, screen } from '@testing-library/react';
import { Header } from './index';
import { ThemeProvider } from '@/providers/ThemeProvider';
import '@testing-library/jest-dom';

jest.mock('next/image', () => {
  const MockImage = ({ alt, ...props }) => <img alt={alt} {...props} />;
  MockImage.displayName = 'MockNextImage';
  return MockImage;
});
jest.mock('@/hooks/auth/useLogout', () => ({ useLogout: jest.fn() }));

describe('Header Component', () => {
  let logoutUserMock;
  beforeEach(() => {
    logoutUserMock = jest.fn();
    require('@/hooks/auth/useLogout').useLogout.mockReturnValue({
      logoutUser: logoutUserMock,
    });
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o título corretamente', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    expect(screen.getByText('Diário de Classe')).toBeInTheDocument();
  });

  it('deve exibir o logotipo da empresa', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    const logo = screen.getByAltText('Logo da empresa BLS');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/bls.png');
  });

  it("deve conter o botão 'Sair' e o botão de tema", () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument();
    // O botão de tema não tem texto, mas tem um ícone
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('deve chamar logoutUser ao clicar no botão Sair', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    const button = screen.getByRole('button', { name: 'Sair' });
    fireEvent.click(button);
    expect(logoutUserMock).toHaveBeenCalled();
  });

  it('deve alternar o tema ao clicar no botão de tema', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    // O primeiro botão é o de tema
    const [themeButton] = screen.getAllByRole('button');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    fireEvent.click(themeButton);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    fireEvent.click(themeButton);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('deve possuir a classe fixa e estilização do header', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
    const header = screen.getByRole('banner');
    expect(header).toHaveClass(
      'fixed',
      'top-0',
      'left-0',
      'right-0',
      'h-16',
      'bg-main'
    );
  });
});
