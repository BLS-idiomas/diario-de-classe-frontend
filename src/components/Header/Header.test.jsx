import { render, screen } from '@testing-library/react';
import { Header } from './index';
import '@testing-library/jest-dom';
import Link from 'next/link';
import Image from 'next/image';

// Mock dos componentes do Next.js
jest.mock('next/link', () => {
  const MockLink = ({ children, href }) => <a href={href}>{children}</a>;
  MockLink.displayName = 'NextLink';
  return MockLink;
});
jest.mock('next/image', () => {
  const MockImage = props => <img {...props} alt={props.alt} />;
  MockImage.displayName = 'NextImage';
  return MockImage;
});

describe('Header Component', () => {
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

  it("deve conter o link 'Sair'", () => {
    render(<Header />);
    const link = screen.getByRole('link', { name: 'Sair' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#');
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
