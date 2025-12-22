import React from 'react';
import { render } from '@testing-library/react';
import { Footer } from './index';

describe('Footer', () => {
  it('renders current year and text', () => {
    const { getByText, container } = render(<Footer />);
    const ano = new Date().getFullYear();
    expect(getByText(new RegExp(`${ano}`))).toBeInTheDocument();
    expect(container.querySelector('footer')).toHaveClass('bg-gray-50');
  });
});
