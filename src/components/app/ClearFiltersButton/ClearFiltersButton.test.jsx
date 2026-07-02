import { render, screen, fireEvent } from '@testing-library/react';
import { ClearFiltersButton } from './index';

describe('ClearFiltersButton', () => {
  it('renders with the expected label and testid', () => {
    render(<ClearFiltersButton onClick={() => {}} />);
    const button = screen.getByTestId('clear-filters-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Limpar filtros');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<ClearFiltersButton onClick={onClick} />);
    fireEvent.click(screen.getByTestId('clear-filters-button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not throw when clicked without onClick', () => {
    render(<ClearFiltersButton />);
    expect(() =>
      fireEvent.click(screen.getByTestId('clear-filters-button'))
    ).not.toThrow();
  });
});
