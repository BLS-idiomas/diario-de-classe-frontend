import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchForm } from './index';

describe('SearchForm component', () => {
  it('renders input with provided placeholder', () => {
    const perform = jest.fn();
    render(<SearchForm placeholder="Buscar..." perform={perform} />);
    const input = screen.getByPlaceholderText('Buscar...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('maxLength', '200');
    expect(input).toHaveAttribute('minLength', '3');
  });

  it('calls perform with value on change and updates input value', async () => {
    const perform = jest.fn();
    render(<SearchForm placeholder="Pesquisar" perform={perform} />);
    const input = screen.getByPlaceholderText('Pesquisar');
    await userEvent.type(input, 'abc');
    // each keystroke triggers perform
    expect(perform).toHaveBeenCalledTimes(3);
    expect(perform).toHaveBeenCalledWith('a');
    expect(perform).toHaveBeenCalledWith('ab');
    expect(perform).toHaveBeenCalledWith('abc');
    expect(input.value).toBe('abc');
  });

  it('calls perform with raw value including spaces', async () => {
    const perform = jest.fn();
    render(<SearchForm placeholder="Search" perform={perform} />);
    const input = screen.getByPlaceholderText('Search');
    await userEvent.type(input, '  x  ');
    // value includes spaces and each keystroke triggers perform
    expect(perform).toHaveBeenLastCalledWith('  x  ');
    expect(input.value).toBe('  x  ');
  });
});
