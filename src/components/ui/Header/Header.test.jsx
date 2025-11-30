import { render, fireEvent, screen } from '@testing-library/react';
import { Header } from './index';
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o título corretamente', () => {
    render(<Header />);
    expect(screen.getByText('Diário de Classe')).toBeInTheDocument();
  });

  it('deve exibir o logotipo da empresa', () => {
    render(<Header />);
    const logo = screen.getByAltText('Logo da empresa BLS');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/bls.png');
  });

  it("deve conter o botão 'Sair'", () => {
    render(<Header />);
    const button = screen.getByRole('button', { name: 'Sair' });
    expect(button).toBeInTheDocument();
  });

  it('deve chamar logoutUser ao clicar no botão Sair', () => {
    render(<Header />);
    const button = screen.getByRole('button', { name: 'Sair' });
    fireEvent.click(button);
    expect(logoutUserMock).toHaveBeenCalled();
  });

  it('deve possuir a classe fixa e estilização do header', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass(
      'fixed',
      'top-0',
      'left-0',
      'right-0',
      'h-16',
      'bg-white'
    );
  });
});
