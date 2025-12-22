import { render } from '@testing-library/react';
import { PageContent } from './index';

describe('PageContent', () => {
  it('renders children inside a div with mb-6 class', () => {
    const { getByText, container } = render(
      <PageContent>
        <span>Conteúdo</span>
      </PageContent>
    );
    expect(getByText('Conteúdo')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('mb-6');
  });
});
