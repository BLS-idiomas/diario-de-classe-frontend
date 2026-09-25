import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { SidebarItem } from './index';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/providers/UnsavedChangesGuardProvider', () => ({
  useUnsavedChangesGuard: jest.fn(),
}));

// Mock básico do componente
const defaultProps = {
  children: <span data-testid="icon">Icon</span>,
  label: 'Item',
  active: false,
  href: '/',
  sidebarExpanded: true,
};

describe('SidebarItem', () => {
  beforeEach(() => {
    require('next/navigation').useRouter.mockReturnValue({ push: jest.fn() });
    // Default: sem guard registrado — regressão, navega direto.
    require('@/providers/UnsavedChangesGuardProvider').useUnsavedChangesGuard.mockReturnValue(
      { confirmNavigation: () => true }
    );
  });

  it('should render label and icon', () => {
    const { getByText, getByTestId } = render(
      <SidebarItem {...defaultProps} />
    );
    expect(getByText('Item')).toBeInTheDocument();
    expect(getByTestId('icon')).toBeInTheDocument();
  });

  it('should have active class when active', () => {
    const { container } = render(
      <SidebarItem {...defaultProps} active={true} />
    );
    // O span do ícone deve ter a classe de texto azul
    expect(container.querySelector('span.primary-color')).toBeInTheDocument();
  });

  it('should not have active class when not active', () => {
    const { container } = render(
      <SidebarItem {...defaultProps} active={false} />
    );
    // O span do ícone não deve ter a classe de texto azul
    expect(
      container.querySelector('span.primary-color')
    ).not.toBeInTheDocument();
  });

  it('should render without icon', () => {
    const { getByText, queryByTestId } = render(
      <SidebarItem
        label="Item"
        active={false}
        href="/"
        sidebarExpanded={true}
      ></SidebarItem>
    );
    expect(getByText('Item')).toBeInTheDocument();
    expect(queryByTestId('icon')).toBeNull();
  });

  it('should render with custom label', () => {
    const { getByText } = render(
      <SidebarItem {...defaultProps} label="Custom" />
    );
    expect(getByText('Custom')).toBeInTheDocument();
  });

  it('mostra a tooltip de recolhido (group-hover) quando sidebarExpanded=false, sem depender de isMobile', () => {
    const { container } = render(
      <SidebarItem {...defaultProps} sidebarExpanded={false} />
    );
    expect(
      container.querySelector('span.group-hover\\:inline-block')
    ).toBeInTheDocument();
  });

  it('em largura abaixo do breakpoint, fecha o drawer (onNavigate) ao clicar no link', () => {
    window.matchMedia = jest.fn().mockReturnValue({ matches: true });
    const onNavigate = jest.fn();
    const { getByRole } = render(
      <SidebarItem {...defaultProps} onNavigate={onNavigate} />
    );
    fireEvent.click(getByRole('link'));
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    expect(onNavigate).toHaveBeenCalled();
  });

  it('em largura a partir do breakpoint, não fecha o drawer ao clicar no link', () => {
    window.matchMedia = jest.fn().mockReturnValue({ matches: false });
    const onNavigate = jest.fn();
    const { getByRole } = render(
      <SidebarItem {...defaultProps} onNavigate={onNavigate} />
    );
    fireEvent.click(getByRole('link'));
    expect(onNavigate).not.toHaveBeenCalled();
  });

  describe('AC-001-005: guard de alteração não salva na navegação', () => {
    it('sem guard registrado, navega direto sem interceptar o clique (regressão)', () => {
      const pushMock = jest.fn();
      require('next/navigation').useRouter.mockReturnValue({ push: pushMock });

      const { getByRole } = render(<SidebarItem {...defaultProps} />);
      const evento = fireEvent.click(getByRole('link'));

      // `fireEvent` devolve `false` quando algum handler chamou
      // `preventDefault` — sem guard, a navegação nativa do <Link> segue,
      // então o evento não é prevenido e a navegação programática não roda.
      expect(evento).toBe(true);
      expect(pushMock).not.toHaveBeenCalled();
    });

    it('com guard e alteração pendente, impede a navegação nativa e só navega programaticamente após confirmar', async () => {
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
      const pushMock = jest.fn();
      require('next/navigation').useRouter.mockReturnValue({ push: pushMock });

      const { getByRole } = render(
        <SidebarItem {...defaultProps} href="/alunos" />
      );
      const evento = fireEvent.click(getByRole('link'));

      expect(evento).toBe(false);
      expect(pushMock).not.toHaveBeenCalled();

      await act(async () => {
        resolveConfirmacao(true);
        await Promise.resolve();
      });

      expect(pushMock).toHaveBeenCalledWith('/alunos');
    });

    it('com guard e alteração pendente, cancelar a confirmação mantém o administrador na tela (sem navegar)', async () => {
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
      const pushMock = jest.fn();
      require('next/navigation').useRouter.mockReturnValue({ push: pushMock });

      const { getByRole } = render(
        <SidebarItem {...defaultProps} href="/alunos" />
      );
      fireEvent.click(getByRole('link'));

      await act(async () => {
        resolveConfirmacao(false);
        await Promise.resolve();
      });

      expect(pushMock).not.toHaveBeenCalled();
    });
  });

  describe('clique com modificador segue o <Link> nativo', () => {
    it.each([
      ['ctrlKey', { ctrlKey: true }],
      ['metaKey', { metaKey: true }],
      ['shiftKey', { shiftKey: true }],
      ['altKey', { altKey: true }],
      ['button diferente do esquerdo', { button: 1 }],
    ])(
      '%s com alteração pendente: não consulta o guard, nem previne o clique (abrir em nova aba não perde dados)',
      (_descricao, eventoInit) => {
        const confirmNavigation = jest.fn(() => new Promise(() => {}));
        require('@/providers/UnsavedChangesGuardProvider').useUnsavedChangesGuard.mockReturnValue(
          { confirmNavigation }
        );

        const { getByRole } = render(
          <SidebarItem {...defaultProps} href="/alunos" />
        );
        const evento = fireEvent.click(getByRole('link'), eventoInit);

        expect(confirmNavigation).not.toHaveBeenCalled();
        // `fireEvent` devolve `true` quando nenhum handler chamou
        // `preventDefault` — o <Link> nativo segue o clique.
        expect(evento).toBe(true);
      }
    );

    it('clique simples (sem modificador) com alteração pendente: consulta o guard normalmente (exibe o diálogo)', () => {
      const confirmNavigation = jest.fn(() => new Promise(() => {}));
      require('@/providers/UnsavedChangesGuardProvider').useUnsavedChangesGuard.mockReturnValue(
        { confirmNavigation }
      );

      const { getByRole } = render(
        <SidebarItem {...defaultProps} href="/alunos" />
      );
      fireEvent.click(getByRole('link'));

      expect(confirmNavigation).toHaveBeenCalledTimes(1);
      // Fail-closed: a chamada não carrega uma forma de liberar a navegação
      // sem resposta do administrador — `liberarSeFalhar` (ou equivalente)
      // truthy inverteria o padrão de negar por padrão.
      expect(confirmNavigation.mock.calls[0][0]?.liberarSeFalhar).toBeFalsy();
    });
  });
});
