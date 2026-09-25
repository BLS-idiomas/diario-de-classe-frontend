import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ApplicationLayout from './layout';

// Mocks
jest.mock('./useApplicationLayout', () => ({
  useApplicationLayout: () => ({
    isLoading: false,
    sidebarExpanded: {
      isExpanded: true,
    },
    toggleSidebar: jest.fn(),
  }),
}));

jest.mock('@/components', () => ({
  Header: ({ isExpanded, toggleSidebar }) => (
    <header
      data-testid="header"
      data-expanded={isExpanded}
      onClick={toggleSidebar}
    />
  ),
  Sidebar: ({ isExpanded, toggleSidebar }) => (
    <aside
      data-testid="sidebar"
      data-expanded={isExpanded}
      onClick={toggleSidebar}
    />
  ),
  Footer: () => <footer data-testid="footer" />,
  Loading: () => <div data-testid="loading" />,
  TransitionShell: ({ children, className }) => (
    <div data-testid="transition-shell" className={className}>
      {children}
    </div>
  ),
  InstallPrompt: () => <div data-testid="install-prompt-mock" />,
}));

// Sem este mock, `jest.resetModules()` (usado abaixo) força um segundo
// `require('react')` ao reexigir `./layout`, e o provider real (que usa
// hooks) acaba rodando sob uma instância de React diferente da já montada —
// "Invalid hook call". O provider em si é coberto por
// `UnsavedChangesGuardProvider.test.jsx`; aqui o mock é um marcador
// (`data-testid="guard-provider"`), para provar que o layout de fato monta
// o provider envolvendo Header, Sidebar e o conteúdo — não apenas repassa
// `children`.
jest.mock('@/providers/UnsavedChangesGuardProvider', () => ({
  UnsavedChangesGuardProvider: ({ children }) => (
    <div data-testid="guard-provider">{children}</div>
  ),
}));

describe('ApplicationLayout', () => {
  it('renderiza todos os componentes principais, todos dentro do UnsavedChangesGuardProvider', () => {
    render(
      <ApplicationLayout>
        {' '}
        <div data-testid="conteudo" />{' '}
      </ApplicationLayout>
    );
    const header = screen.getByTestId('header');
    const sidebar = screen.getByTestId('sidebar');
    const footer = screen.getByTestId('footer');
    const conteudo = screen.getByTestId('conteudo');
    expect(header).toBeInTheDocument();
    expect(sidebar).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
    expect(conteudo).toBeInTheDocument();
    // O convite de instalação monta dentro da árvore autenticada — nunca em
    // `(auth)/layout.jsx` (AC-001-018).
    expect(screen.getByTestId('install-prompt-mock')).toBeInTheDocument();

    const guardProvider = screen.getByTestId('guard-provider');
    expect(guardProvider).toContainElement(header);
    expect(guardProvider).toContainElement(sidebar);
    expect(guardProvider).toContainElement(conteudo);
  });

  it('mostra o loading quando isLoading é true', () => {
    jest.resetModules();
    jest.doMock('./useApplicationLayout', () => ({
      useApplicationLayout: () => ({
        isLoading: true,
        sidebarExpanded: {
          isExpanded: true,
        },
        toggleSidebar: jest.fn(),
      }),
    }));
    const { default: ApplicationLayoutReloaded } = require('./layout');
    render(
      <ApplicationLayoutReloaded>
        {' '}
        <div data-testid="conteudo" />{' '}
      </ApplicationLayoutReloaded>
    );
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('install-prompt-mock')).not.toBeInTheDocument();
  });

  it('não monta o convite de instalação enquanto isUnauthorized é true', () => {
    jest.resetModules();
    jest.doMock('./useApplicationLayout', () => ({
      useApplicationLayout: () => ({
        isLoading: false,
        isUnauthorized: true,
        sidebarExpanded: {
          isExpanded: true,
        },
        toggleSidebar: jest.fn(),
      }),
    }));
    const { default: ApplicationLayoutReloaded } = require('./layout');
    render(
      <ApplicationLayoutReloaded>
        {' '}
        <div data-testid="conteudo" />{' '}
      </ApplicationLayoutReloaded>
    );
    expect(screen.queryByTestId('install-prompt-mock')).not.toBeInTheDocument();
  });

  it('passa isExpanded/toggleSidebar corretos para Sidebar e Header, e permite toggle', async () => {
    const toggleSidebar = jest.fn();
    jest.resetModules();
    jest.doMock('./useApplicationLayout', () => ({
      useApplicationLayout: () => ({
        isLoading: false,
        sidebarExpanded: {
          isExpanded: false,
        },
        toggleSidebar,
      }),
    }));
    const { default: ApplicationLayoutReloaded } = require('./layout');
    render(
      <ApplicationLayoutReloaded>
        {' '}
        <div data-testid="conteudo" />{' '}
      </ApplicationLayoutReloaded>
    );
    const sidebar = screen.getByTestId('sidebar');
    const header = screen.getByTestId('header');
    expect(sidebar).toHaveAttribute('data-expanded', 'false');
    expect(header).toHaveAttribute('data-expanded', 'false');
    fireEvent.click(sidebar);
    await waitFor(() => expect(toggleSidebar).toHaveBeenCalled());
  });

  it('main tem min-w-0, para não crescer pelo conteúdo mínimo de um filho flex quando o conteúdo é mais largo que a viewport', () => {
    render(
      <ApplicationLayout>
        {' '}
        <div data-testid="conteudo" />{' '}
      </ApplicationLayout>
    );
    const classes = screen.getByRole('main').className.split(' ');
    expect(classes).toContain('min-w-0');
    expect(classes).toContain('flex-1');
  });
});
