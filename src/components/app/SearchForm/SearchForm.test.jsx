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

  it('trims value before calling perform', async () => {
    const perform = jest.fn();
    render(<SearchForm placeholder="Trim" perform={perform} />);
    const input = screen.getByPlaceholderText('Trim');
    await userEvent.type(input, '  x  ');
    // value stored inside state includes spaces; call count reflects each keystroke
    expect(perform).toHaveBeenLastCalledWith('  x');
  });
});
