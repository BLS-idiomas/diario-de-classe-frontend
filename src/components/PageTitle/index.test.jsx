import React from 'react';
import { render } from '@testing-library/react';
import { PageTitle } from './index';

describe('PageTitle', () => {
  it('renders an h2 with children text and classes', () => {
    const { getByText, container } = render(<PageTitle>My Title</PageTitle>);

    const heading = getByText('My Title');
    expect(heading.tagName).toBe('H2');
    expect(container.firstChild).toHaveClass('text-xl', 'font-bold', 'mb-4');
  });
});
