import { render, fireEvent, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from './index';
import { ThemeProvider } from '@/providers/ThemeProvider';
import '@testing-library/jest-dom';

jest.mock('next/image', () => {
  const MockImage = ({ alt, ...props }) => <img alt={alt} {...props} />;
  MockImage.displayName = 'MockNextImage';
  return MockImage;
});
jest.mock('@/hooks/auth/useLogout', () => ({ useLogout: jest.fn() }));
jest.mock('@/providers/UnsavedChangesGuardProvider', () => ({
  useUnsavedChangesGuard: jest.fn(),
}));

describe('Header Component', () => {
  let logoutUserMock;
  beforeEach(() => {
    logoutUserMock = jest.fn();
    require('@/hooks/auth/useLogout').useLogout.mockReturnValue({
      logoutUser: logoutUserMock,
    });
    // Default: sem guard registrado — regressão, navega/desloga direto.
    require('@/providers/UnsavedChangesGuardProvider').useUnsavedChangesGuard.mockReturnValue(
      { confirmNavigation: () => true }
    );
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
    // Sem escolha explícita ainda (sem cookie), o atributo começa em
    // 'system' — só o clique (escolha explícita) fixa 'light'/'dark'
    // (DEC-002-004).
    expect(document.documentElement.getAttribute('data-theme')).toBe('system');
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

  it('deve exibir a logo escura e o ícone de sol já na primeira renderização com initialTheme="dark"', () => {
    render(
      <ThemeProvider initialTheme="dark">
        <Header />
      </ThemeProvider>
    );
    const logo = screen.getByAltText('Logo da empresa BLS');
    expect(logo).toHaveAttribute('src', '/bls-dark.png');
    const [themeButton] = screen.getAllByRole('button');
    expect(themeButton.querySelector('svg')).toHaveClass('lucide-sun');
  });

  describe('AC-001-001/AC-001-004 (parte a11y): botão hambúrguer do drawer', () => {
    it('com isExpanded=false, renderiza o botão com aria-expanded="false", aria-controls do Sidebar e .tap-target', () => {
      const toggleSidebar = jest.fn();
      render(
        <ThemeProvider>
          <Header isExpanded={false} toggleSidebar={toggleSidebar} />
        </ThemeProvider>
      );
      const button = screen.getByRole('button', {
        name: /abrir navegação/i,
      });
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-controls', 'main-navigation');
      expect(button).toHaveClass('tap-target');
    });

    it('com isExpanded=true, o mesmo botão tem aria-expanded="true" e aria-label de fechar', () => {
      const toggleSidebar = jest.fn();
      render(
        <ThemeProvider>
          <Header isExpanded={true} toggleSidebar={toggleSidebar} />
        </ThemeProvider>
      );
      const button = screen.getByRole('button', {
        name: /fechar navegação/i,
      });
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('ativa toggleSidebar por teclado (Enter e Espaço)', async () => {
      const toggleSidebar = jest.fn();
      const user = userEvent.setup();
      render(
        <ThemeProvider>
          <Header isExpanded={false} toggleSidebar={toggleSidebar} />
        </ThemeProvider>
      );
      const button = screen.getByRole('button', {
        name: /abrir navegação/i,
      });

      await user.tab();
      expect(button).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(toggleSidebar).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(toggleSidebar).toHaveBeenCalledTimes(2);
    });
  });

  describe('AC-001-005: guard de alteração não salva no botão "Sair"', () => {
    it('sem guard registrado, desloga direto sem aguardar nada (regressão)', () => {
      render(
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      );
      fireEvent.click(screen.getByRole('button', { name: 'Sair' }));
      expect(logoutUserMock).toHaveBeenCalledTimes(1);
    });

    it('com guard e alteração pendente, aguarda a escolha do administrador antes de deslogar', async () => {
      let resolveConfirmacao;
      const confirmNavigation = jest.fn(
        () =>
          new Promise(resolve => {
            resolveConfirmacao = resolve;
          })
      );
      require('@/providers/UnsavedChangesGuardProvider').useUnsavedChangesGuard.mockReturnValue(
        { confirmNavigation }
      );

      render(
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      );
      fireEvent.click(screen.getByRole('button', { name: 'Sair' }));

      expect(confirmNavigation).toHaveBeenCalledWith({ liberarSeFalhar: true });
      expect(logoutUserMock).not.toHaveBeenCalled();

      await act(async () => {
        resolveConfirmacao(true);
        await Promise.resolve();
      });

      expect(logoutUserMock).toHaveBeenCalledTimes(1);
    });

    it('chama confirmNavigation com liberarSeFalhar — falha do diálogo desloga mesmo assim (sessão encerrada vence rascunho)', async () => {
      let resolveConfirmacao;
      const confirmNavigation = jest.fn(
        () =>
          new Promise(resolve => {
            resolveConfirmacao = resolve;
          })
      );
      require('@/providers/UnsavedChangesGuardProvider').useUnsavedChangesGuard.mockReturnValue(
        { confirmNavigation }
      );

      render(
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      );
      fireEvent.click(screen.getByRole('button', { name: 'Sair' }));

      expect(confirmNavigation).toHaveBeenCalledWith({ liberarSeFalhar: true });

      // O provider (`UnsavedChangesGuardProvider.test.jsx`) prova que, com
      // `liberarSeFalhar: true`, a rejeição do diálogo resolve `true`; aqui
      // simula esse resultado para provar que o Header desloga em cima dele.
      await act(async () => {
        resolveConfirmacao(true);
        await Promise.resolve();
      });

      expect(logoutUserMock).toHaveBeenCalledTimes(1);
    });

    it('com guard e alteração pendente, cancelar a confirmação mantém o administrador logado', async () => {
      let resolveConfirmacao;
      const confirmNavigation = jest.fn(
        () =>
          new Promise(resolve => {
            resolveConfirmacao = resolve;
          })
      );
      require('@/providers/UnsavedChangesGuardProvider').useUnsavedChangesGuard.mockReturnValue(
        { confirmNavigation }
      );

      render(
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      );
      fireEvent.click(screen.getByRole('button', { name: 'Sair' }));

      await act(async () => {
        resolveConfirmacao(false);
        await Promise.resolve();
      });

      expect(logoutUserMock).not.toHaveBeenCalled();
    });
  });
});
