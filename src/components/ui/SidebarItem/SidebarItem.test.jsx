import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { SidebarItem } from './index';

// Mock básico do componente
const defaultProps = {
  children: <span data-testid="icon">Icon</span>,
  label: 'Item',
  active: false,
  href: '/',
  sidebarExpanded: true,
  isMobile: false,
};

describe('SidebarItem', () => {
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
    expect(container.querySelector('span.text-blue-600')).toBeInTheDocument();
  });

  it('should not have active class when not active', () => {
    const { container } = render(
      <SidebarItem {...defaultProps} active={false} />
    );
    // O span do ícone não deve ter a classe de texto azul
    expect(
      container.querySelector('span.text-blue-600')
    ).not.toBeInTheDocument();
  });

  it('should render without icon', () => {
    const { getByText, queryByTestId } = render(
      <SidebarItem
        label="Item"
        active={false}
        href="/"
        sidebarExpanded={true}
        isMobile={false}
      ></SidebarItem>
    );
    expect(getByText('Item')).toBeInTheDocument();
    expect(queryByTestId('icon')).toBeNull();
  });

  it('should render with custom label', () => {
    const { getByText } = render(
      <SidebarItem {...defaultProps} label="Custom" isMobile={false} />
    );
    expect(getByText('Custom')).toBeInTheDocument();
  });
});
