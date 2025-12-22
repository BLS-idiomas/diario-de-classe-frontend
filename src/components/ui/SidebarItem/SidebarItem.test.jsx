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
    expect(container.firstChild).toHaveClass('bg-blue-200');
  });

  it('should not have active class when not active', () => {
    const { container } = render(
      <SidebarItem {...defaultProps} active={false} />
    );
    expect(container.firstChild).not.toHaveClass('bg-blue-200');
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
});
