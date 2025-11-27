import { render } from '@testing-library/react';
import { TextAreaField } from './index';

describe('TextAreaField', () => {
  it('renders label and textarea with correct props', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
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
        props={{ 'data-testid': 'textarea-test' }}
      />
    );
    const textarea = getByTestId('textarea-test');
    expect(textarea).toHaveAttribute('id', 'descricao');
    expect(textarea).toHaveAttribute('name', 'descricao');
    expect(textarea).toHaveAttribute('required');
    expect(textarea).toHaveAttribute('placeholder', 'Digite aqui');
    expect(textarea).toHaveClass('custom-class');
    expect(textarea.value).toBe('texto');
  });
});
