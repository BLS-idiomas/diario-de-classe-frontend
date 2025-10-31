import { render, screen } from '@testing-library/react';
import { Header } from './index';

describe('Header Component', () => {
  it('should render the header with correct title', () => {
    render(<Header />);

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Diário de Classe');
  });

  it('should render all navigation links', () => {
    render(<Header />);

    const navigationLinks = ['Início', 'Turmas', 'Relatórios', 'Configurações'];

    navigationLinks.forEach(linkText => {
      const link = screen.getByRole('link', { name: linkText });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '#');
    });
  });

  it('should have the correct CSS classes for styling', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass(
      'fixed',
      'top-0',
      'left-0',
      'right-0',
      'h-16',
      'bg-white',
      'border-b',
      'border-gray-200',
      'shadow-sm',
      'z-40'
    );
  });

  it('should render navigation with proper hover styles', () => {
    render(<Header />);

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveClass(
        'text-gray-600',
        'hover:text-gray-800',
        'transition-colors'
      );
    });
  });

  it('should have proper semantic structure', () => {
    render(<Header />);

    // Should have a header element
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    // Should have a navigation element
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Should have the main heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
