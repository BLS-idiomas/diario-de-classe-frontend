import { render, screen, fireEvent } from '@testing-library/react';
import { CheckboxField } from './CheckboxField';

describe('CheckboxField', () => {
  describe('basic rendering', () => {
    it('should render label and checkbox with correct props', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="termos"
          label="Aceito os termos"
          checked={false}
          onChange={handleChange}
        />
      );
      const checkbox = screen.getByLabelText('Aceito os termos');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('id', 'termos');
      expect(checkbox).toHaveAttribute('name', 'termos');
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('should render with required indicator', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="aceitar"
          label="Aceitar"
          checked={false}
          onChange={handleChange}
          required
        />
      );
      const label = screen.getByText('Aceitar *');
      expect(label).toBeInTheDocument();
    });

    it('should render without required indicator', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="opcional"
          label="Opcional"
          checked={false}
          onChange={handleChange}
        />
      );
      const label = screen.getByText('Opcional');
      expect(label).toBeInTheDocument();
      expect(screen.queryByText('Opcional *')).not.toBeInTheDocument();
    });
  });

  describe('checked state', () => {
    it('should render as unchecked when checked is false', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={false}
          onChange={handleChange}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should render as checked when checked is true', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={true}
          onChange={handleChange}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should default to unchecked when checked prop is not provided', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField htmlFor="test" label="Test" onChange={handleChange} />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should handle null checked value', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={null}
          onChange={handleChange}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should handle undefined checked value', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={undefined}
          onChange={handleChange}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('onChange handler', () => {
    it('should call onChange when clicked', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={false}
          onChange={handleChange}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should call onChange with event object', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={false}
          onChange={handleChange}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should not call onChange when disabled', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={false}
          onChange={handleChange}
          disabled
        />
      );
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('should render as disabled when disabled prop is true', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={false}
          onChange={handleChange}
          disabled
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('should render as enabled when disabled prop is false', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={false}
          onChange={handleChange}
          disabled={false}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeDisabled();
    });

    it('should render as enabled when disabled prop is not provided', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField htmlFor="test" label="Test" onChange={handleChange} />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeDisabled();
    });
  });

  describe('required attribute', () => {
    it('should have required attribute when required prop is true', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={false}
          onChange={handleChange}
          required
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('required');
    });

    it('should not have required attribute when required prop is false', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={false}
          onChange={handleChange}
          required={false}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toHaveAttribute('required');
    });

    it('should not have required attribute when required prop is not provided', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField htmlFor="test" label="Test" onChange={handleChange} />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toHaveAttribute('required');
    });
  });

  describe('custom styling', () => {
    it('should apply custom className to checkbox', () => {
      const handleChange = jest.fn();
      const customClass = 'custom-checkbox-class';
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={false}
          onChange={handleChange}
          className={customClass}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass(customClass);
    });

    it('should apply default classes when className is not provided', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField htmlFor="test" label="Test" onChange={handleChange} />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('h-4');
      expect(checkbox).toHaveClass('w-4');
      expect(checkbox).toHaveClass('text-blue-600');
    });

    it('should apply custom inputGroupClass', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={false}
          onChange={handleChange}
          inputGroupClass="custom-group-class"
        />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-group-class');
    });

    it('should apply custom labelClass', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={false}
          onChange={handleChange}
          labelClass="custom-label-class"
        />
      );
      const label = screen.getByText('Test');
      expect(label).toHaveClass('custom-label-class');
    });

    it('should apply default container classes when inputGroupClass is not provided', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <CheckboxField htmlFor="test" label="Test" onChange={handleChange} />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('flex');
      expect(wrapper).toHaveClass('items-center');
    });

    it('should apply default label classes when labelClass is not provided', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField htmlFor="test" label="Test" onChange={handleChange} />
      );
      const label = screen.getByText('Test');
      expect(label).toHaveClass('ml-2');
      expect(label).toHaveClass('block');
      expect(label).toHaveClass('text-sm');
    });
  });

  describe('additional props', () => {
    it('should pass additional props to checkbox input', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={false}
          onChange={handleChange}
          data-testid="custom-checkbox"
          aria-label="Custom Aria Label"
        />
      );
      const checkbox = screen.getByTestId('custom-checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('aria-label', 'Custom Aria Label');
    });

    it('should handle multiple additional props', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={false}
          onChange={handleChange}
          data-test="test-value"
          aria-describedby="description"
          tabIndex={0}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-test', 'test-value');
      expect(checkbox).toHaveAttribute('aria-describedby', 'description');
      expect(checkbox).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('label interaction', () => {
    it('should toggle checkbox when label is clicked', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Click Label"
          checked={false}
          onChange={handleChange}
        />
      );
      const label = screen.getByText('Click Label');
      fireEvent.click(label);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should have correct htmlFor attribute on label', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="myCheckbox"
          label="My Label"
          onChange={handleChange}
        />
      );
      const label = screen.getByText('My Label');
      expect(label).toHaveAttribute('for', 'myCheckbox');
    });
  });

  describe('edge cases', () => {
    it('should handle empty label', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <CheckboxField htmlFor="test" label="" onChange={handleChange} />
      );
      const label = container.querySelector('label');
      expect(label).toBeEmptyDOMElement();
    });

    it('should handle long label text', () => {
      const handleChange = jest.fn();
      const longLabel =
        'This is a very long label text that should still render correctly without breaking the layout';
      render(
        <CheckboxField
          htmlFor="test"
          label={longLabel}
          onChange={handleChange}
        />
      );
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('should handle special characters in label', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Label & <Special> Characters"
          onChange={handleChange}
        />
      );
      expect(
        screen.getByText('Label & <Special> Characters')
      ).toBeInTheDocument();
    });

    it('should handle multiple clicks', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          checked={false}
          onChange={handleChange}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('accessibility', () => {
    it('should have checkbox role', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField htmlFor="test" label="Test" onChange={handleChange} />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should be accessible by label text', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="accessible"
          label="Accessible Checkbox"
          onChange={handleChange}
        />
      );
      const checkbox = screen.getByLabelText('Accessible Checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should support aria attributes', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="test"
          label="Test"
          onChange={handleChange}
          aria-invalid="true"
          aria-describedby="error-message"
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
      expect(checkbox).toHaveAttribute('aria-describedby', 'error-message');
    });
  });

  describe('real-world usage', () => {
    it('should work as terms acceptance checkbox', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="terms"
          label="Aceito os termos e condições"
          checked={false}
          onChange={handleChange}
          required
        />
      );
      const checkbox = screen.getByLabelText('Aceito os termos e condições *');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('required');
    });

    it('should work as newsletter subscription checkbox', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="newsletter"
          label="Quero receber novidades por email"
          checked={true}
          onChange={handleChange}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should work as feature toggle', () => {
      const handleChange = jest.fn();
      render(
        <CheckboxField
          htmlFor="notifications"
          label="Ativar notificações"
          checked={false}
          onChange={handleChange}
        />
      );
      const checkbox = screen.getByLabelText('Ativar notificações');
      expect(checkbox).not.toBeChecked();
    });
  });
});
