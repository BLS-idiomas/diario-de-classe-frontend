import { render } from '@testing-library/react';
import { SelectField } from './SelectField';

describe('SelectField', () => {
  it('renders label and select with options and placeholder', () => {
    const handleChange = jest.fn();
    const options = [
      { value: 'a', label: 'Opção A' },
      { value: 'b', label: 'Opção B' },
    ];
    const { getByLabelText, getByText } = render(
      <SelectField
        htmlFor="tipo"
        label="Tipo"
        value="b"
        onChange={handleChange}
        required
        placeholder="Selecione..."
        inputGroupClass="group-class"
        labelClass="label-class"
        className="custom-class"
        options={options}
      />
    );
    const select = getByLabelText(/tipo/i);
    expect(select).toHaveAttribute('id', 'tipo');
    expect(select).toHaveAttribute('name', 'tipo');
    expect(select).toHaveAttribute('required');
    expect(select).toHaveClass('custom-class');
    expect(getByText('Selecione...')).toBeInTheDocument();
    expect(getByText('Opção A')).toBeInTheDocument();
    expect(getByText('Opção B')).toBeInTheDocument();
    expect(select.value).toBe('b');
  });

  it('applies disabled styles when disabled prop is true', () => {
    const handleChange = jest.fn();
    const options = [
      { value: 'a', label: 'Opção A' },
      { value: 'b', label: 'Opção B' },
    ];
    const { getByLabelText } = render(
      <SelectField
        htmlFor="tipo"
        label="Tipo"
        value="a"
        onChange={handleChange}
        options={options}
        disabled
      />
    );
    const select = getByLabelText(/tipo/i);
    expect(select).toBeDisabled();
    expect(select).toHaveClass('disabled:bg-gray-100');
    expect(select).toHaveClass('disabled:text-gray-500');
    expect(select).toHaveClass('disabled:cursor-not-allowed');
    expect(select).toHaveClass('disabled:opacity-60');
  });

  it('renders without placeholder when not provided', () => {
    const handleChange = jest.fn();
    const options = [
      { value: 'a', label: 'Opção A' },
      { value: 'b', label: 'Opção B' },
    ];
    const { getByLabelText, queryByText } = render(
      <SelectField
        htmlFor="tipo"
        label="Tipo"
        value="a"
        onChange={handleChange}
        options={options}
      />
    );
    const select = getByLabelText(/tipo/i);
    expect(select).toBeInTheDocument();
    expect(queryByText('Selecione...')).not.toBeInTheDocument();
  });

  it('renders select as enabled by default', () => {
    const handleChange = jest.fn();
    const options = [{ value: 'a', label: 'Opção A' }];
    const { getByLabelText } = render(
      <SelectField
        htmlFor="tipo"
        label="Tipo"
        value="a"
        onChange={handleChange}
        options={options}
      />
    );
    const select = getByLabelText(/tipo/i);
    expect(select).not.toBeDisabled();
  });
});
