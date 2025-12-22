import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ApplicationLayout from './layout';

// Mocks
jest.mock('./useApplicationLayout', () => ({
  useApplicationLayout: () => ({
    isLoading: false,
    sidebarExpanded: {
      isExpanded: true,
      sidebarClass: 'sidebar-expanded',
      mainClass: 'main-expanded',
    },
    toggleSidebar: jest.fn(),
  }),
}));

jest.mock('@/components', () => ({
  Header: () => <header data-testid="header" />,
  Sidebar: ({ sidebarExpanded, sidebarClass, toggleSidebar }) => (
    <aside
      data-testid="sidebar"
      data-expanded={sidebarExpanded}
      data-class={sidebarClass}
      onClick={toggleSidebar}
    />
  ),
  Footer: () => <footer data-testid="footer" />,
  Loading: () => <div data-testid="loading" />,
}));

describe('ApplicationLayout', () => {
  it('renderiza todos os componentes principais', () => {
    render(
      <ApplicationLayout>
        {' '}
        <div data-testid="conteudo" />{' '}
      </ApplicationLayout>
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('conteudo')).toBeInTheDocument();
  });

  it('mostra o loading quando isLoading é true', () => {
    jest.resetModules();
    jest.doMock('./useApplicationLayout', () => ({
      useApplicationLayout: () => ({
        isLoading: true,
        sidebarExpanded: {
          isExpanded: true,
          sidebarClass: 'sidebar-expanded',
          mainClass: 'main-expanded',
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
  });

  it('passa props corretos para Sidebar e permite toggle', async () => {
    const toggleSidebar = jest.fn();
    jest.resetModules();
    jest.doMock('./useApplicationLayout', () => ({
      useApplicationLayout: () => ({
        isLoading: false,
        sidebarExpanded: {
          isExpanded: false,
          sidebarClass: 'sidebar-collapsed',
          mainClass: 'main-collapsed',
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
    expect(sidebar).toHaveAttribute('data-expanded', 'false');
    expect(sidebar).toHaveAttribute('data-class', 'sidebar-collapsed');
    fireEvent.click(sidebar);
    await waitFor(() => expect(toggleSidebar).toHaveBeenCalled());
  });
});
