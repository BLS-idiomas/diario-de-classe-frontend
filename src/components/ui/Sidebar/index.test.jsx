import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './index';

// Mock do useSidebar para controlar o retorno dos itens e funções
jest.mock('./useSidebar', () => ({
  useSidebar: () => ({
    strokeWidth: 1,
    sidebarItems: [
      {
        href: '/home',
        label: 'Home',
        icon: <span data-testid="icon-home">icon</span>,
      },
      {
        href: '/alunos',
        label: 'Alunos',
        icon: <span data-testid="icon-alunos">icon</span>,
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
      />
    );
    const homeItem = screen.getByText('Home').closest('a');
    expect(homeItem).toHaveClass('bg-blue-200'); // verifica a classe usada para ativo
  });

  it('chama toggleSidebar ao clicar no botão', () => {
    const mockToggle = jest.fn();
    render(
      <Sidebar
        sidebarExpanded={true}
        toggleSidebar={mockToggle}
        sidebarClass=""
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(mockToggle).toHaveBeenCalled();
  });
});
