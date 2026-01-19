import React from 'react';
import { render } from '@testing-library/react';
import { Footer } from './index';
import packageJson from '../../../../package.json';

describe('Footer', () => {
  it('renders current year and text', () => {
    const { getByText, container } = render(<Footer />);
    const ano = new Date().getFullYear();
    expect(getByText(new RegExp(`${ano}`))).toBeInTheDocument();
    expect(container.querySelector('footer')).toHaveClass('bg-gray-50');
  });

  it('displays version from package.json', () => {
    const { getByText } = render(<Footer />);
    expect(getByText(`v${packageJson.version}`)).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    const { getByText } = render(<Footer />);
    expect(getByText(/BLS Idiomas/i)).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('bg-gray-50');
    expect(footer).toHaveClass('border-t');
    expect(footer).toHaveClass('border-gray-200');
    expect(footer).toHaveClass('py-6');
  });
});
