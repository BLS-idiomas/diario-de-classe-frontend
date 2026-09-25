import { render, screen } from '@testing-library/react';
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

  describe('hint', () => {
    it('renders the hint paragraph and links it via aria-describedby when hint is present', () => {
      render(
        <InputField
          htmlFor="telefone"
          label="Telefone"
          value=""
          onChange={jest.fn()}
          hint="Usado apenas para contato"
        />
      );
      const input = screen.getByLabelText('Telefone');
      const hint = screen.getByText('Usado apenas para contato');
      expect(hint).toHaveAttribute('id', 'telefone-hint');
      expect(input).toHaveAttribute('aria-describedby', 'telefone-hint');
    });

    it('renders no hint node and no aria-describedby when hint is absent (default preserved, molde AlunoForm)', () => {
      const { container } = render(
        <InputField
          required
          htmlFor="telefone"
          label="Telefone"
          placeholder="(11) 99999-9999"
          maxLength={11}
          onChange={jest.fn()}
          value=""
        />
      );
      const input = screen.getByLabelText(/telefone/i);
      expect(container.querySelector('#telefone-hint')).not.toBeInTheDocument();
      expect(input).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('error', () => {
    it('renders the error alert, sets aria-invalid and links it via aria-describedby when error is present', () => {
      render(
        <InputField
          htmlFor="email"
          label="Email"
          value=""
          onChange={jest.fn()}
          error="Email inválido"
        />
      );
      const input = screen.getByLabelText('Email');
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('Email inválido');
      expect(error).toHaveAttribute('id', 'email-error');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
    });

    it('renders no error node and no aria-invalid when error is absent (default preserved, molde AlunoForm)', () => {
      const { container } = render(
        <InputField
          required
          htmlFor="email"
          label="Email"
          placeholder="Digite o email"
          onChange={jest.fn()}
          value=""
        />
      );
      const input = screen.getByLabelText(/email/i);
      expect(container.querySelector('#email-error')).not.toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(input).not.toHaveAttribute('aria-invalid');
    });
  });

  it('references both hint and error ids in aria-describedby when both are present', () => {
    render(
      <InputField
        htmlFor="tolerancia"
        label="Tolerância"
        value=""
        onChange={jest.fn()}
        hint="Ainda sem efeito automático"
        error="Deve ser maior que zero"
      />
    );
    const input = screen.getByLabelText('Tolerância');
    expect(input).toHaveAttribute(
      'aria-describedby',
      'tolerancia-hint tolerancia-error'
    );
  });
});
