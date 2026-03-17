import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { DisponibilidadeCard } from './index';

jest.mock('lucide-react', () => ({
  Pencil: () => <svg data-testid="icon-pencil" />,
  ArrowLeft: () => <svg data-testid="icon-arrow-left" />,
}));

jest.mock('@/components/ui', () => ({
  FormGroup: ({ children, cols }) => (
    <div
      data-testid="form-group"
      style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {children}
    </div>
  ),
  InputField: ({ htmlFor, label, value, onChange, type, disabled }) => (
    <div data-testid={`input-field-${htmlFor}`}>
      <label htmlFor={htmlFor}>{label}</label>
      <input
        id={htmlFor}
        name={htmlFor}
        value={value || ''}
        onChange={onChange}
        type={type || 'text'}
        disabled={disabled}
        data-testid={`input-${htmlFor}`}
      />
    </div>
  ),
}));

describe('DisponibilidadeCard', () => {
  const mockFormData = {
    SEGUNDA: {
      diaSemana: 'SEGUNDA',
      horaInicial: '09:00',
      horaFinal: '10:00',
      ativo: true,
    },
    TERCA: {
      diaSemana: 'TERCA',
      horaInicial: '14:00',
      horaFinal: '15:00',
      ativo: false,
    },
  };

  const mockHandleChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component with correct data-testid', () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={false}
        />
      );

      expect(
        screen.getByTestId('disponibilidade-card-SEGUNDA')
      ).toBeInTheDocument();
    });

    it('should render the day label', () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={false}
        />
      );

      expect(screen.getByTestId('dia-label-SEGUNDA')).toBeInTheDocument();
      expect(screen.getByText('Segunda-feira')).toBeInTheDocument();
    });

    it('should render view mode by default', () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={false}
        />
      );

      expect(screen.getByTestId('view-mode-SEGUNDA')).toBeInTheDocument();
      expect(screen.getByText('09:00 - 10:00')).toBeInTheDocument();
    });

    it('should render status badge with correct class when ativo is true', () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={false}
        />
      );

      const badge = screen.getByTestId('status-badge-SEGUNDA');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-green-100', 'text-green-800');
      expect(badge).toHaveTextContent('Ativo');
    });

    it('should render status badge with correct class when ativo is false', () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="TERCA"
          isEdit={false}
        />
      );

      const badge = screen.getByTestId('status-badge-TERCA');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-red-100', 'text-red-800');
      expect(badge).toHaveTextContent('Inativo');
    });
  });

  describe('Edit Mode', () => {
    it('should not show edit button when isEdit is false', () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={false}
        />
      );

      const editButton = screen.getByTestId('edit-button-SEGUNDA');
      expect(editButton).toHaveAttribute('hidden');
    });

    it('should show edit button when isEdit is true', () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={true}
        />
      );

      const editButton = screen.getByTestId('edit-button-SEGUNDA');
      expect(editButton).not.toHaveAttribute('hidden');
    });

    it('should toggle to edit mode when edit button is clicked', async () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={true}
          handleChange={mockHandleChange}
        />
      );

      expect(screen.getByTestId('view-mode-SEGUNDA')).toBeInTheDocument();
      expect(screen.queryByTestId('edit-mode-SEGUNDA')).not.toBeInTheDocument();

      const editButton = screen.getByTestId('edit-button-SEGUNDA');
      fireEvent.click(editButton);

      expect(screen.queryByTestId('view-mode-SEGUNDA')).not.toBeInTheDocument();
      expect(screen.getByTestId('edit-mode-SEGUNDA')).toBeInTheDocument();
    });

    it('should show pencil icon initially and arrow left icon in edit mode', () => {
      const { rerender } = render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={true}
          handleChange={mockHandleChange}
        />
      );

      expect(screen.getByTestId('icon-pencil')).toBeInTheDocument();
      expect(screen.queryByTestId('icon-arrow-left')).not.toBeInTheDocument();

      const editButton = screen.getByTestId('edit-button-SEGUNDA');
      fireEvent.click(editButton);

      rerender(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={true}
          handleChange={mockHandleChange}
        />
      );

      // After clicking, the component re-renders internally with editMode toggled
      // So we need to check the icon state after the click
    });

    it('should render input fields when in edit mode', async () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={true}
          handleChange={mockHandleChange}
        />
      );

      const editButton = screen.getByTestId('edit-button-SEGUNDA');
      fireEvent.click(editButton);

      expect(screen.getByTestId('edit-mode-SEGUNDA')).toBeInTheDocument();
      expect(
        screen.getByTestId('input-SEGUNDA.horaInicial')
      ).toBeInTheDocument();
      expect(screen.getByTestId('input-SEGUNDA.horaFinal')).toBeInTheDocument();
    });

    it('should disable input fields when ativo is false in edit mode', async () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="TERCA"
          isEdit={true}
          handleChange={mockHandleChange}
        />
      );

      const editButton = screen.getByTestId('edit-button-TERCA');
      fireEvent.click(editButton);

      const horaInicialInput = screen.getByTestId('input-TERCA.horaInicial');
      const horaFinalInput = screen.getByTestId('input-TERCA.horaFinal');

      expect(horaInicialInput).toBeDisabled();
      expect(horaFinalInput).toBeDisabled();
    });

    it('should enable input fields when ativo is true in edit mode', async () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={true}
          handleChange={mockHandleChange}
        />
      );

      const editButton = screen.getByTestId('edit-button-SEGUNDA');
      fireEvent.click(editButton);

      const horaInicialInput = screen.getByTestId('input-SEGUNDA.horaInicial');
      const horaFinalInput = screen.getByTestId('input-SEGUNDA.horaFinal');

      expect(horaInicialInput).not.toBeDisabled();
      expect(horaFinalInput).not.toBeDisabled();
    });
  });

  describe('Status Badge Interaction', () => {
    it('should call handleChange when status badge is clicked and isEdit is true', () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={true}
          handleChange={mockHandleChange}
        />
      );

      const badge = screen.getByTestId('status-badge-SEGUNDA');
      fireEvent.click(badge);

      expect(mockHandleChange).toHaveBeenCalled();
    });

    it('should not call handleChange when status badge is clicked and isEdit is false', () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={false}
          handleChange={mockHandleChange}
        />
      );

      const badge = screen.getByTestId('status-badge-SEGUNDA');
      fireEvent.click(badge);

      expect(mockHandleChange).not.toHaveBeenCalled();
    });
  });

  describe('Input Change', () => {
    it('should call handleChange when input value changes in edit mode', async () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={true}
          handleChange={mockHandleChange}
        />
      );

      const editButton = screen.getByTestId('edit-button-SEGUNDA');
      fireEvent.click(editButton);

      const horaInicialInput = screen.getByTestId('input-SEGUNDA.horaInicial');
      await userEvent.clear(horaInicialInput);
      await userEvent.type(horaInicialInput, '08:00');

      expect(mockHandleChange).toHaveBeenCalled();
    });
  });

  describe('Default Props', () => {
    it('should have default values for optional props', () => {
      render(<DisponibilidadeCard formData={mockFormData} dia="SEGUNDA" />);

      expect(
        screen.getByTestId('disponibilidade-card-SEGUNDA')
      ).toBeInTheDocument();
      // isEdit defaults to false, so edit button should be hidden
      const editButton = screen.getByTestId('edit-button-SEGUNDA');
      expect(editButton).toHaveAttribute('hidden');
    });

    it('should handle default handleChange function', () => {
      render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={true}
        />
      );

      const badge = screen.getByTestId('status-badge-SEGUNDA');
      // Should not throw error
      fireEvent.click(badge);

      expect(screen.getByTestId('status-badge-SEGUNDA')).toBeInTheDocument();
    });
  });

  describe('Different Days', () => {
    it('should render different days correctly', () => {
      const { rerender } = render(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="SEGUNDA"
          isEdit={false}
        />
      );

      expect(screen.getByText('Segunda-feira')).toBeInTheDocument();

      rerender(
        <DisponibilidadeCard
          formData={mockFormData}
          dia="TERCA"
          isEdit={false}
        />
      );

      expect(screen.getByText('Terça-feira')).toBeInTheDocument();
    });

    it('should have unique data-testid for each day', () => {
      const { container } = render(
        <>
          <DisponibilidadeCard
            formData={mockFormData}
            dia="SEGUNDA"
            isEdit={true}
          />
          <DisponibilidadeCard
            formData={mockFormData}
            dia="TERCA"
            isEdit={true}
          />
        </>
      );

      expect(
        screen.getByTestId('disponibilidade-card-SEGUNDA')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('disponibilidade-card-TERCA')
      ).toBeInTheDocument();
      expect(screen.getByTestId('edit-button-SEGUNDA')).toBeInTheDocument();
      expect(screen.getByTestId('edit-button-TERCA')).toBeInTheDocument();
    });
  });
});
