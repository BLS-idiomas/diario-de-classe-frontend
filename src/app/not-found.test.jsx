import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

// Mock next/link like other tests in the repo
jest.mock('next/link', () => {
  const MockLink = ({ children, ...props }) => {
    return <a {...props}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('NotFound page', () => {
  it('renders title, subtitles, icon and home link', () => {
    const { container } = render(<NotFound />);

    // Title
    expect(
      screen.getByRole('heading', { name: /página não encontrada/i })
    ).toBeInTheDocument();

    // Subtitles (check each paragraph separately to avoid ambiguous matches)
    expect(
      screen.getByText(
        /A página que você está tentando acessar não existe ou foi movida\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Verifique o endereço ou volte para a página inicial\./i)
    ).toBeInTheDocument();

    // Link back home
    const link = screen.getByRole('link', { name: /voltar para o início/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');

    // Icon svg exists
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
