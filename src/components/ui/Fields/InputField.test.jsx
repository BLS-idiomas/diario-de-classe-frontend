import { render } from '@testing-library/react';
import { InputField } from './InputField';

describe('InputField', () => {
  it('renders label and input with correct props', () => {
    const handleChange = jest.fn();
    const { getByLabelText } = render(
      <InputField
        htmlFor="nome"
        label="Nome"
        value="abc"
        onChange={handleChange}
        required
        placeholder="Digite o nome"
        inputGroupClass="group-class"
        labelClass="label-class"
        className="custom-class"
        props={{ type: 'text' }}
      />
    );
    const input = getByLabelText(/nome/i);
    expect(input).toHaveAttribute('id', 'nome');
    expect(input).toHaveAttribute('name', 'nome');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('placeholder', 'Digite o nome');
    expect(input).toHaveClass('custom-class');
    expect(input.value).toBe('abc');
  });
});
