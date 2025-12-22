import { render } from '@testing-library/react';
import { TextAreaField } from './TextAreaField';

describe('TextAreaField', () => {
  it('renders label and textarea with correct props', () => {
    const handleChange = jest.fn();
    const { getByLabelText } = render(
      <TextAreaField
        htmlFor="descricao"
        label="Descrição"
        value="texto"
        onChange={handleChange}
        required
        placeholder="Digite aqui"
        inputGroupClass="group-class"
        labelClass="label-class"
        className="custom-class"
        props={{}}
      />
    );
    const textarea = getByLabelText(/descrição/i);
    expect(textarea).toHaveAttribute('id', 'descricao');
    expect(textarea).toHaveAttribute('name', 'descricao');
    expect(textarea).toHaveAttribute('required');
    expect(textarea).toHaveAttribute('placeholder', 'Digite aqui');
    expect(textarea).toHaveClass('custom-class');
    expect(textarea.value).toBe('texto');
  });
});
