import { render } from '@testing-library/react';
import { SelectField } from './index';

describe('SelectField', () => {
  it('renders label and select with options and placeholder', () => {
    const handleChange = jest.fn();
    const options = [
      { value: 'a', label: 'Opção A' },
      { value: 'b', label: 'Opção B' },
    ];
    const { getByTestId, getByText } = render(
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
        props={{ 'data-testid': 'select-test' }}
      />
    );
    const select = getByTestId('select-test');
    expect(select).toHaveAttribute('id', 'tipo');
    expect(select).toHaveAttribute('name', 'tipo');
    expect(select).toHaveAttribute('required');
    expect(select).toHaveClass('custom-class');
    expect(getByText('Selecione...')).toBeInTheDocument();
    expect(getByText('Opção A')).toBeInTheDocument();
    expect(getByText('Opção B')).toBeInTheDocument();
    expect(select.value).toBe('b');
  });
});
