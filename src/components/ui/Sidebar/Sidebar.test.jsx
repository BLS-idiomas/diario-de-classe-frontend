import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './index';

// Mock providers and hooks used by Sidebar
jest.mock('@/providers/UserAuthProvider', () => ({
  useUserAuth: () => ({ isAdmin: () => true }),
}));

// Mock do useSidebar para controlar o retorno dos itens e funções
jest.mock('./useSidebar', () => ({
  useSidebar: () => ({
    strokeWidth: 1,
    sidebarItems: [
      {
        href: '/home',
        label: 'Home',
        icon: <span data-testid="icon-home">icon</span>,
        show: true,
      },
      {
        href: '/alunos',
        label: 'Alunos',
        icon: <span data-testid="icon-alunos">icon</span>,
        show: true,
      },
    ],
    isActive: href => href === '/home',
  }),
}));

describe('Sidebar', () => {
  it('renderiza os itens corretamente', () => {
    render(<Sidebar isExpanded={true} toggleSidebar={() => {}} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Alunos')).toBeInTheDocument();
    expect(screen.getByTestId('icon-home')).toBeInTheDocument();
    expect(screen.getByTestId('icon-alunos')).toBeInTheDocument();
  });

  it('marca o item ativo corretamente', () => {
    render(<Sidebar isExpanded={true} toggleSidebar={() => {}} />);
    const homeItem = screen.getByText('Home').closest('a');
    // O item ativo deve ter o texto azul
    expect(homeItem.querySelector('span')).toHaveClass('primary-color');
  });

  it('chama toggleSidebar ao clicar no botão', () => {
    const mockToggle = jest.fn();
    render(<Sidebar isExpanded={true} toggleSidebar={mockToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockToggle).toHaveBeenCalled();
  });

  it('ganha o id que o aria-controls do Header referencia', () => {
    render(<Sidebar isExpanded={true} toggleSidebar={() => {}} />);
    expect(screen.getByTestId('sidebar')).toHaveAttribute(
      'id',
      'main-navigation'
    );
  });

  it('com isExpanded=false, compõe -translate-x-full e md:translate-x-0, sem translate-x-0 não-prefixado', () => {
    render(<Sidebar isExpanded={false} toggleSidebar={() => {}} />);
    const classes = screen.getByTestId('sidebar').className.split(' ');
    expect(classes).toContain('-translate-x-full');
    expect(classes).toContain('md:translate-x-0');
    expect(classes).not.toContain('translate-x-0');
  });

  it('com isExpanded=true, translate-x-0 (não-prefixado) e md:translate-x-0 convivem', () => {
    render(<Sidebar isExpanded={true} toggleSidebar={() => {}} />);
    const classes = screen.getByTestId('sidebar').className.split(' ');
    expect(classes).toContain('translate-x-0');
    expect(classes).toContain('md:translate-x-0');
  });

  describe('visibilidade para teclado/leitor de tela nos 4 estados combinados (<md e ≥md × fechado/aberto)', () => {
    it('<md, fechado: invisible (fora do foco/leitor), sem md:invisible', () => {
      render(<Sidebar isExpanded={false} toggleSidebar={() => {}} />);
      const classes = screen.getByTestId('sidebar').className.split(' ');
      expect(classes).toContain('invisible');
      expect(classes).toContain('md:visible');
      expect(classes).not.toContain('visible');
    });

    it('<md, aberto: visible (focável/lido), sem invisible', () => {
      render(<Sidebar isExpanded={true} toggleSidebar={() => {}} />);
      const classes = screen.getByTestId('sidebar').className.split(' ');
      expect(classes).toContain('visible');
      expect(classes).toContain('md:visible');
      expect(classes).not.toContain('invisible');
    });

    it('≥md, colapsado (isExpanded=false): md:visible presente para vencer o invisible da faixa <md', () => {
      render(<Sidebar isExpanded={false} toggleSidebar={() => {}} />);
      const classes = screen.getByTestId('sidebar').className.split(' ');
      expect(classes).toContain('md:visible');
    });

    it('≥md, expandido (isExpanded=true): md:visible presente (redundante com visible incondicional, mas incondicional ao lado de md:translate-x-0)', () => {
      render(<Sidebar isExpanded={true} toggleSidebar={() => {}} />);
      const classes = screen.getByTestId('sidebar').className.split(' ');
      expect(classes).toContain('md:visible');
    });
  });
});
