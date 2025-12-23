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
    render(
      <Sidebar
        sidebarExpanded={true}
        toggleSidebar={() => {}}
        sidebarClass=""
        isMobile={false}
      />
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Alunos')).toBeInTheDocument();
    expect(screen.getByTestId('icon-home')).toBeInTheDocument();
    expect(screen.getByTestId('icon-alunos')).toBeInTheDocument();
  });

  it('marca o item ativo corretamente', () => {
    render(
      <Sidebar
        sidebarExpanded={true}
        toggleSidebar={() => {}}
        sidebarClass=""
        isMobile={false}
      />
    );
    const homeItem = screen.getByText('Home').closest('a');
    // O item ativo deve ter o texto azul
    expect(homeItem.querySelector('span')).toHaveClass('text-blue-600');
  });

  it('chama toggleSidebar ao clicar no botão', () => {
    const mockToggle = jest.fn();
    render(
      <Sidebar
        sidebarExpanded={true}
        toggleSidebar={mockToggle}
        sidebarClass=""
        isMobile={false}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(mockToggle).toHaveBeenCalled();
  });
});
