import { render } from '@testing-library/react';
import { PageSubTitle } from './index';

describe('PageSubTitle', () => {
  it('renders children inside a p with text-gray-600 class', () => {
    const { getByText, container } = render(
      <PageSubTitle>
        <span>Subtítulo</span>
      </PageSubTitle>
    );
    expect(getByText('Subtítulo')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('text-gray-600');
    expect(container.firstChild.tagName).toBe('P');
  });
});
