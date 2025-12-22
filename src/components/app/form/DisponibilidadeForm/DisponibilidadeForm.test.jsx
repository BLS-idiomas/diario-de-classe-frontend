import { render, screen, fireEvent } from '@testing-library/react';
import { DisponibilidadeForm } from './index';

// Mock dos componentes UI
jest.mock('@/components/ui', () => ({
  Form: ({ children, handleSubmit }) => (
    <form onSubmit={handleSubmit}>{children}</form>
  ),
  FormError: ({ title, errors }) => (
    <div data-testid="form-error">
      {title && <span>{title}</span>}
      {errors?.length > 0 && errors.map((err, i) => <span key={i}>{err}</span>)}
    </div>
  ),
  FormGroup: ({ children, cols }) => (
    <div data-testid="form-group" data-cols={cols}>
      {children}
    </div>
  ),
  InputField: ({ htmlFor, label, type, value, onChange, disabled }) => (
    <div data-testid={`input-${htmlFor}`}>
      <label htmlFor={htmlFor}>{label}</label>
      <input
        id={htmlFor}
        name={htmlFor}
        type={type}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  ),
  CheckboxField: ({ htmlFor, label, checked, onChange }) => (
    <div data-testid={`checkbox-${htmlFor}`}>
      <input
        type="checkbox"
        id={htmlFor}
        name={htmlFor}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={htmlFor}>{label}</label>
    </div>
  ),
}));

jest.mock('@/constants', () => ({
  DIAS_LABEL: {
    SEGUNDA: 'Segunda-feira',
    TERCA: 'Terça-feira',
    QUARTA: 'Quarta-feira',
    QUINTA: 'Quinta-feira',
    SEXTA: 'Sexta-feira',
    SABADO: 'Sábado',
    DOMINGO: 'Domingo',
  },
}));

describe('DisponibilidadeForm', () => {
  const mockHandleSubmit = jest.fn();
  const mockHandleChange = jest.fn();
  const mockHandleCheckboxChange = jest.fn();
  const mockSetEditMode = jest.fn();

  const defaultProps = {
    handleSubmit: mockHandleSubmit,
    message: '',
    errors: [],
    formData: {
      SEGUNDA: {
        id: 1,
        diaSemana: 'SEGUNDA',
        horaInicial: '08:00',
        horaFinal: '12:00',
        ativo: true,
      },
      TERCA: {
        id: null,
        diaSemana: 'TERCA',
        horaInicial: null,
        horaFinal: null,
        ativo: false,
      },
      QUARTA: {
        id: null,
        diaSemana: 'QUARTA',
        horaInicial: null,
        horaFinal: null,
        ativo: false,
      },
      QUINTA: {
        id: null,
        diaSemana: 'QUINTA',
        horaInicial: null,
        horaFinal: null,
        ativo: false,
      },
      SEXTA: {
        id: null,
        diaSemana: 'SEXTA',
        horaInicial: null,
        horaFinal: null,
        ativo: false,
      },
      SABADO: {
        id: null,
        diaSemana: 'SABADO',
        horaInicial: null,
        horaFinal: null,
        ativo: false,
      },
      DOMINGO: {
        id: null,
        diaSemana: 'DOMINGO',
        horaInicial: null,
        horaFinal: null,
        ativo: false,
      },
    },
    handleCheckboxChange: mockHandleCheckboxChange,
    handleChange: mockHandleChange,
    isLoading: false,
    setEditMode: mockSetEditMode,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('deve renderizar o formulário completo', () => {
      const { container } = render(<DisponibilidadeForm {...defaultProps} />);
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('deve renderizar todos os 7 dias da semana', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      expect(screen.getByText('Segunda-feira')).toBeInTheDocument();
      expect(screen.getByText('Terça-feira')).toBeInTheDocument();
      expect(screen.getByText('Quarta-feira')).toBeInTheDocument();
      expect(screen.getByText('Quinta-feira')).toBeInTheDocument();
      expect(screen.getByText('Sexta-feira')).toBeInTheDocument();
      expect(screen.getByText('Sábado')).toBeInTheDocument();
      expect(screen.getByText('Domingo')).toBeInTheDocument();
    });

    it('deve renderizar checkbox "Ativo" para cada dia', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(7);
    });

    it('deve renderizar campos de hora inicial e final para cada dia', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      expect(
        screen.getByTestId('input-SEGUNDA.horaInicial')
      ).toBeInTheDocument();
      expect(screen.getByTestId('input-SEGUNDA.horaFinal')).toBeInTheDocument();
      expect(screen.getByTestId('input-TERCA.horaInicial')).toBeInTheDocument();
      expect(screen.getByTestId('input-TERCA.horaFinal')).toBeInTheDocument();
    });

    it('deve renderizar FormGroup com cols=2 para cada dia', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const formGroups = screen.getAllByTestId('form-group');
      expect(formGroups).toHaveLength(7);
      formGroups.forEach(group => {
        expect(group).toHaveAttribute('data-cols', '2');
      });
    });

    it('deve renderizar botões Cancelar e Salvar', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });
  });

  describe('FormError', () => {
    it('deve renderizar mensagem de erro quando fornecida', () => {
      const props = { ...defaultProps, message: 'Erro ao salvar' };
      render(<DisponibilidadeForm {...props} />);
      expect(screen.getByText('Erro ao salvar')).toBeInTheDocument();
    });

    it('deve renderizar lista de erros quando fornecida', () => {
      const props = {
        ...defaultProps,
        errors: ['Erro 1', 'Erro 2', 'Erro 3'],
      };
      render(<DisponibilidadeForm {...props} />);
      expect(screen.getByText('Erro 1')).toBeInTheDocument();
      expect(screen.getByText('Erro 2')).toBeInTheDocument();
      expect(screen.getByText('Erro 3')).toBeInTheDocument();
    });

    it('não deve renderizar erros quando lista estiver vazia', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const formError = screen.getByTestId('form-error');
      expect(formError.textContent).toBe('');
    });
  });

  describe('checkbox ativo', () => {
    it('deve renderizar checkbox marcado quando ativo for true', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const checkboxSegunda = screen
        .getByTestId('checkbox-SEGUNDA.ativo')
        .querySelector('input');
      expect(checkboxSegunda).toBeChecked();
    });

    it('deve renderizar checkbox desmarcado quando ativo for false', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const checkboxTerca = screen
        .getByTestId('checkbox-TERCA.ativo')
        .querySelector('input');
      expect(checkboxTerca).not.toBeChecked();
    });

    it('deve chamar handleCheckboxChange quando checkbox for clicado', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const checkboxTerca = screen
        .getByTestId('checkbox-TERCA.ativo')
        .querySelector('input');
      fireEvent.click(checkboxTerca);
      expect(mockHandleCheckboxChange).toHaveBeenCalled();
    });

    it('deve usar valor false quando ativo for null ou undefined', () => {
      const props = {
        ...defaultProps,
        formData: {
          ...defaultProps.formData,
          SEGUNDA: { ...defaultProps.formData.SEGUNDA, ativo: null },
        },
      };
      render(<DisponibilidadeForm {...props} />);
      const checkbox = screen
        .getByTestId('checkbox-SEGUNDA.ativo')
        .querySelector('input');
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('campos de horário', () => {
    it('deve renderizar valores de horaInicial e horaFinal', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const inputInicial = screen
        .getByTestId('input-SEGUNDA.horaInicial')
        .querySelector('input');
      const inputFinal = screen
        .getByTestId('input-SEGUNDA.horaFinal')
        .querySelector('input');
      expect(inputInicial.value).toBe('08:00');
      expect(inputFinal.value).toBe('12:00');
    });

    it('deve desabilitar campos quando ativo for false', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const inputInicial = screen
        .getByTestId('input-TERCA.horaInicial')
        .querySelector('input');
      const inputFinal = screen
        .getByTestId('input-TERCA.horaFinal')
        .querySelector('input');
      expect(inputInicial).toBeDisabled();
      expect(inputFinal).toBeDisabled();
    });

    it('deve habilitar campos quando ativo for true', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const inputInicial = screen
        .getByTestId('input-SEGUNDA.horaInicial')
        .querySelector('input');
      const inputFinal = screen
        .getByTestId('input-SEGUNDA.horaFinal')
        .querySelector('input');
      expect(inputInicial).not.toBeDisabled();
      expect(inputFinal).not.toBeDisabled();
    });

    it('deve chamar handleChange quando hora inicial for alterada', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const input = screen
        .getByTestId('input-SEGUNDA.horaInicial')
        .querySelector('input');
      fireEvent.change(input, { target: { value: '09:00' } });
      expect(mockHandleChange).toHaveBeenCalled();
    });

    it('deve chamar handleChange quando hora final for alterada', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const input = screen
        .getByTestId('input-SEGUNDA.horaFinal')
        .querySelector('input');
      fireEvent.change(input, { target: { value: '18:00' } });
      expect(mockHandleChange).toHaveBeenCalled();
    });

    it('deve renderizar campos vazios quando valores forem null', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const inputInicial = screen
        .getByTestId('input-TERCA.horaInicial')
        .querySelector('input');
      const inputFinal = screen
        .getByTestId('input-TERCA.horaFinal')
        .querySelector('input');
      expect(inputInicial.value).toBe('');
      expect(inputFinal.value).toBe('');
    });

    it('deve ter type="time" em todos os campos de horário', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const inputInicial = screen
        .getByTestId('input-SEGUNDA.horaInicial')
        .querySelector('input');
      const inputFinal = screen
        .getByTestId('input-SEGUNDA.horaFinal')
        .querySelector('input');
      expect(inputInicial).toHaveAttribute('type', 'time');
      expect(inputFinal).toHaveAttribute('type', 'time');
    });
  });

  describe('botão Cancelar', () => {
    it('deve chamar setEditMode(false) quando clicado', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const btnCancelar = screen.getByText('Cancelar');
      fireEvent.click(btnCancelar);
      expect(mockSetEditMode).toHaveBeenCalledWith(false);
    });

    it('deve ter classe btn-secondary', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const btnCancelar = screen.getByText('Cancelar');
      expect(btnCancelar).toHaveClass('btn', 'btn-secondary');
    });
  });

  describe('botão Salvar', () => {
    it('deve ter type="submit"', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const btnSalvar = screen.getByText('Salvar');
      expect(btnSalvar).toHaveAttribute('type', 'submit');
    });

    it('deve mostrar "Editando..." quando isLoading for true', () => {
      const props = { ...defaultProps, isLoading: true };
      render(<DisponibilidadeForm {...props} />);
      expect(screen.getByText('Editando...')).toBeInTheDocument();
      expect(screen.queryByText('Salvar')).not.toBeInTheDocument();
    });

    it('deve mostrar "Salvar" quando isLoading for false', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      expect(screen.getByText('Salvar')).toBeInTheDocument();
      expect(screen.queryByText('Editando...')).not.toBeInTheDocument();
    });

    it('deve estar desabilitado quando isLoading for true', () => {
      const props = { ...defaultProps, isLoading: true };
      render(<DisponibilidadeForm {...props} />);
      const btnSalvar = screen.getByText('Editando...');
      expect(btnSalvar).toBeDisabled();
    });

    it('deve estar habilitado quando isLoading for false', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const btnSalvar = screen.getByText('Salvar');
      expect(btnSalvar).not.toBeDisabled();
    });

    it('deve ter classe "blocked" quando isLoading for true', () => {
      const props = { ...defaultProps, isLoading: true };
      render(<DisponibilidadeForm {...props} />);
      const btnSalvar = screen.getByText('Editando...');
      expect(btnSalvar).toHaveClass('btn', 'btn-primary', 'blocked');
    });

    it('não deve ter classe "blocked" quando isLoading for false', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const btnSalvar = screen.getByText('Salvar');
      expect(btnSalvar).toHaveClass('btn', 'btn-primary');
      expect(btnSalvar).not.toHaveClass('blocked');
    });
  });

  describe('submit do formulário', () => {
    it('deve chamar handleSubmit quando formulário for submetido', () => {
      const { container } = render(<DisponibilidadeForm {...defaultProps} />);
      const form = container.querySelector('form');
      fireEvent.submit(form);
      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('deve chamar handleSubmit quando botão Salvar for clicado', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const btnSalvar = screen.getByText('Salvar');
      fireEvent.click(btnSalvar);
      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  describe('estrutura e layout', () => {
    it('deve renderizar cada dia em um container com mb-4', () => {
      const { container } = render(<DisponibilidadeForm {...defaultProps} />);
      const dayContainers = container.querySelectorAll('.mb-4');
      expect(dayContainers.length).toBeGreaterThanOrEqual(7);
    });

    it('deve renderizar header do dia com gap-5', () => {
      const { container } = render(<DisponibilidadeForm {...defaultProps} />);
      const headers = container.querySelectorAll('.flex.gap-5');
      expect(headers.length).toBeGreaterThanOrEqual(7);
    });

    it('deve renderizar título do dia com classes corretas', () => {
      const { container } = render(<DisponibilidadeForm {...defaultProps} />);
      const title = container.querySelector('h4');
      expect(title).toHaveClass('text-xl', 'font-semibold', 'mb-2');
    });

    it('deve renderizar botões com justify-end e gap-4', () => {
      const { container } = render(<DisponibilidadeForm {...defaultProps} />);
      const buttonContainer = container.querySelector(
        '.flex.justify-end.gap-4'
      );
      expect(buttonContainer).toBeInTheDocument();
      expect(buttonContainer).toHaveClass('mt-8');
    });
  });

  describe('edge cases', () => {
    it('deve lidar com formData vazio', () => {
      const props = { ...defaultProps, formData: {} };
      const { container } = render(<DisponibilidadeForm {...props} />);
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('deve lidar com dia sem dados', () => {
      const props = {
        ...defaultProps,
        formData: {
          SEGUNDA: undefined,
          TERCA: null,
        },
      };
      const { container } = render(<DisponibilidadeForm {...props} />);
      // Não deve quebrar, deve renderizar com valores padrão
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('deve lidar com todas as props undefined', () => {
      const props = {
        handleSubmit: mockHandleSubmit,
        message: undefined,
        errors: undefined,
        formData: {},
        handleCheckboxChange: mockHandleCheckboxChange,
        handleChange: mockHandleChange,
        isLoading: undefined,
        setEditMode: mockSetEditMode,
      };
      const { container } = render(<DisponibilidadeForm {...props} />);
      expect(container.querySelector('form')).toBeInTheDocument();
    });
  });

  describe('interações múltiplas', () => {
    it('deve permitir alterar múltiplos campos', () => {
      render(<DisponibilidadeForm {...defaultProps} />);

      const inputInicial = screen
        .getByTestId('input-SEGUNDA.horaInicial')
        .querySelector('input');
      const inputFinal = screen
        .getByTestId('input-SEGUNDA.horaFinal')
        .querySelector('input');
      const checkbox = screen
        .getByTestId('checkbox-TERCA.ativo')
        .querySelector('input');

      fireEvent.change(inputInicial, { target: { value: '10:00' } });
      fireEvent.change(inputFinal, { target: { value: '14:00' } });
      fireEvent.click(checkbox);

      expect(mockHandleChange).toHaveBeenCalledTimes(2);
      expect(mockHandleCheckboxChange).toHaveBeenCalledTimes(1);
    });

    it('deve permitir cancelar após fazer alterações', () => {
      render(<DisponibilidadeForm {...defaultProps} />);

      const input = screen
        .getByTestId('input-SEGUNDA.horaInicial')
        .querySelector('input');
      fireEvent.change(input, { target: { value: '10:00' } });

      const btnCancelar = screen.getByText('Cancelar');
      fireEvent.click(btnCancelar);

      expect(mockSetEditMode).toHaveBeenCalledWith(false);
    });
  });

  describe('integração com todos os dias', () => {
    it('deve renderizar campos para cada dia com IDs únicos', () => {
      render(<DisponibilidadeForm {...defaultProps} />);

      const dias = [
        'SEGUNDA',
        'TERCA',
        'QUARTA',
        'QUINTA',
        'SEXTA',
        'SABADO',
        'DOMINGO',
      ];
      dias.forEach(dia => {
        expect(screen.getByTestId(`checkbox-${dia}.ativo`)).toBeInTheDocument();
        expect(
          screen.getByTestId(`input-${dia}.horaInicial`)
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`input-${dia}.horaFinal`)
        ).toBeInTheDocument();
      });
    });

    it('deve manter estado independente para cada dia', () => {
      render(<DisponibilidadeForm {...defaultProps} />);

      const checkboxSegunda = screen
        .getByTestId('checkbox-SEGUNDA.ativo')
        .querySelector('input');
      const checkboxTerca = screen
        .getByTestId('checkbox-TERCA.ativo')
        .querySelector('input');

      expect(checkboxSegunda.checked).toBe(true);
      expect(checkboxTerca.checked).toBe(false);
    });
  });
});
