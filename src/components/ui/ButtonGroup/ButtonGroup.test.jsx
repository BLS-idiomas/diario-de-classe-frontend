import React from 'react';
import { render } from '@testing-library/react';
import { ButtonGroup } from './index';

describe('ButtonGroup', () => {
  it('renders children and has correct class', () => {
    const { getByText, container } = render(
      <ButtonGroup>
        <button>Click me</button>
      </ButtonGroup>
    );

    expect(getByText('Click me')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('flex flex-wrap gap-2 mb-3');
  });
});
