import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Section } from './index';

describe('Section component', () => {
  it('renders children correctly', () => {
    render(
      <Section>
        <div>Conteúdo de teste</div>
      </Section>
    );

    expect(screen.getByText('Conteúdo de teste')).toBeInTheDocument();
  });

  it('applies the expected base classes', () => {
    const { container } = render(<Section>child</Section>);
    const section = container.querySelector('section');

    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('bg-white');
    expect(section).toHaveClass('rounded-md');
    expect(section).toHaveClass('p-4');
    expect(section).toHaveClass('shadow-sm');
  });
});
