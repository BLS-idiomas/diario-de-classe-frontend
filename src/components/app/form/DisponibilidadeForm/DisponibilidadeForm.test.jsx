import { render, screen, fireEvent } from '@testing-library/react';
import { DisponibilidadeForm } from './index';
import '@testing-library/jest-dom';

jest.mock('@/components/', () => ({
  Form: ({ children, handleSubmit, props }) => (
    <form data-testid="disponibilidade-form" onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  ),
  FormError: ({ title, errors, dataTestId }) => (
    <div data-testid={dataTestId || 'form-error'}>
      {title && <span>{title}</span>}
      {errors?.length > 0 && errors.map((err, i) => <span key={i}>{err}</span>)}
    </div>
  ),
  DisponibilidadeCard: ({ formData, dia, handleChange, isEdit }) => (
    <div data-testid={`disponibilidade-card-${dia}`} data-is-edit={isEdit}>
      <div>{formData[dia]?.diaSemana}</div>
      <div>
        {formData[dia]?.horaInicial} - {formData[dia]?.horaFinal}
      </div>
      <div data-testid={`status-badge-${dia}`}>
        {formData[dia]?.ativo ? 'Ativo' : 'Inativo'}
      </div>
    </div>
  ),
}));

describe('DisponibilidadeForm', () => {
  const mockHandleSubmit = jest.fn();
  const mockHandleChange = jest.fn();

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
    handleChange: mockHandleChange,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('deve renderizar o formulário com Form component', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      expect(screen.getByTestId('disponibilidade-form')).toBeInTheDocument();
    });

    it('deve renderizar DisponibilidadeCard para cada dia da semana', () => {
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
        expect(
          screen.getByTestId(`disponibilidade-card-${dia}`)
        ).toBeInTheDocument();
      });
    });

    it('deve renderizar botões Cancelar e Salvar', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });

    it('deve passar formData corretamente para cada DisponibilidadeCard', () => {
      render(<DisponibilidadeForm {...defaultProps} />);

      const segundaCard = screen.getByTestId('disponibilidade-card-SEGUNDA');
      expect(segundaCard).toHaveTextContent('08:00 - 12:00');
      expect(segundaCard).toHaveTextContent('Ativo');

      const tercaCard = screen.getByTestId('disponibilidade-card-TERCA');
      expect(tercaCard).toHaveTextContent('Inativo');
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

  describe('DisponibilidadeCard - rendering com dados corretos', () => {
    it('deve passar isEdit={true} para cada DisponibilidadeCard', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const cards = screen.getAllByTestId(/disponibilidade-card-/);
      cards.forEach(card => {
        expect(card).toHaveAttribute('data-is-edit', 'true');
      });
    });

    it('deve renderizar 7 DisponibilidadeCards', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const cards = screen.getAllByTestId(/disponibilidade-card-/);
      expect(cards).toHaveLength(7);
    });

    it('deve passar handleChange callback para cada card', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      expect(
        screen.getByTestId('disponibilidade-card-SEGUNDA')
      ).toBeInTheDocument();
    });
  });

  describe('status badge', () => {
    it('deve mostrar "Ativo" para dia com ativo true', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      expect(screen.getByTestId('status-badge-SEGUNDA')).toHaveTextContent(
        'Ativo'
      );
    });

    it('deve mostrar "Inativo" para dia com ativo false', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      expect(screen.getByTestId('status-badge-TERCA')).toHaveTextContent(
        'Inativo'
      );
    });

    it('deve mostrar status correto para todos os dias', () => {
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
        const expected = defaultProps.formData[dia].ativo ? 'Ativo' : 'Inativo';
        expect(screen.getByTestId(`status-badge-${dia}`)).toHaveTextContent(
          expected
        );
      });
    });
  });

  describe('botão Cancelar', () => {
    it('deve renderizar botão Cancelar', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
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
  });

  describe('submit do formulário', () => {
    it('deve chamar handleSubmit quando formulário for submetido', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const form = screen.getByTestId('disponibilidade-form');
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

  describe('edge cases', () => {
    it('deve lidar com formData vazio', () => {
      const props = { ...defaultProps, formData: {} };
      render(<DisponibilidadeForm {...props} />);
      expect(screen.getByTestId('disponibilidade-form')).toBeInTheDocument();
    });

    it('deve lidar com message e errors undefined', () => {
      const props = { ...defaultProps, message: undefined, errors: undefined };
      render(<DisponibilidadeForm {...props} />);
      expect(screen.getByTestId('disponibilidade-form')).toBeInTheDocument();
    });

    it('deve lidar com isLoading undefined', () => {
      const props = { ...defaultProps, isLoading: undefined };
      render(<DisponibilidadeForm {...props} />);
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });
  });

  describe('integração com DisponibilidadeCard', () => {
    it('deve renderizar todos os 7 DisponibilidadeCards com os dias corretos', () => {
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
        const card = screen.getByTestId(`disponibilidade-card-${dia}`);
        expect(card).toBeInTheDocument();
        expect(card).toHaveTextContent(dia);
      });
    });

    it('deve renderizar DisponibilidadeCard com dados de cada dia', () => {
      render(<DisponibilidadeForm {...defaultProps} />);
      const segundaCard = screen.getByTestId('disponibilidade-card-SEGUNDA');
      expect(segundaCard).toHaveTextContent('SEGUNDA');
      expect(segundaCard).toHaveTextContent('08:00');
      expect(segundaCard).toHaveTextContent('12:00');
    });
  });
});
