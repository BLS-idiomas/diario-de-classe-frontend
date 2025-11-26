import React from 'react';
import { render } from '@testing-library/react';
import { Container } from './index';

describe('Container', () => {
  it('renders children and has expected classes', () => {
    const { getByText, container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );

    expect(getByText('Content')).toBeInTheDocument();
    const el = container.firstChild;
    expect(el).toHaveClass(
      'p-6',
      'mx-auto',
      'bg-white',
      'shadow',
      'rounded-lg'
    );
  });
});
