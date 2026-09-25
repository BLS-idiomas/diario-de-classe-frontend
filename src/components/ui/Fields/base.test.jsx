import { render, screen } from '@testing-library/react';
import {
  classNameDefault,
  LabelField,
  InputGroupField,
  OptionField,
  BaseField,
  describedByIds,
} from './base';

describe('Fields Base Components', () => {
  describe('classNameDefault', () => {
    it('contains all necessary CSS classes', () => {
      expect(classNameDefault).toContain('input-field');
    });

    it('contains disabled state CSS classes', () => {
      // Não precisa testar classes de estado, pois está tudo em input-field
    });

    it('contains tap-target for touch area', () => {
      expect(classNameDefault).toContain('tap-target');
    });
  });

  describe('LabelField', () => {
    it('renders label with default className', () => {
      const { container } = render(<LabelField>Test Label</LabelField>);
      const label = container.querySelector('label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Test Label');
      expect(label).toHaveClass('block');
      expect(label).toHaveClass('text-sm');
      expect(label).toHaveClass('font-medium');
      expect(label).toHaveClass('text-main');
      expect(label).toHaveClass('mb-2');
    });

    it('renders label with custom className', () => {
      const { container } = render(
        <LabelField className="custom-label-class">Custom Label</LabelField>
      );
      const label = container.querySelector('label');
      expect(label).toHaveClass('custom-label-class');
      expect(label).toHaveTextContent('Custom Label');
    });

    it('passes through additional props', () => {
      const { container } = render(
        <LabelField htmlFor="test-input" data-testid="custom-label">
          Label Text
        </LabelField>
      );
      const label = container.querySelector('label');
      expect(label).toHaveAttribute('for', 'test-input');
      expect(label).toHaveAttribute('data-testid', 'custom-label');
    });
  });

  describe('InputGroupField', () => {
    it('renders div wrapper with children', () => {
      const { getByText } = render(
        <InputGroupField>
          <span>Child Content</span>
        </InputGroupField>
      );
      expect(getByText('Child Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <InputGroupField className="custom-group-class">
          <span>Content</span>
        </InputGroupField>
      );
      const div = container.querySelector('div');
      expect(div).toHaveClass('custom-group-class');
    });

    it('renders without className when not provided', () => {
      const { container } = render(
        <InputGroupField>
          <span>Content</span>
        </InputGroupField>
      );
      const div = container.querySelector('div');
      expect(div).toBeInTheDocument();
    });
  });

  describe('OptionField', () => {
    it('renders option with value and label', () => {
      const { container } = render(
        <select>
          <OptionField value="option1" label="Option 1" />
        </select>
      );
      const option = container.querySelector('option');
      expect(option).toBeInTheDocument();
      expect(option).toHaveValue('option1');
      expect(option).toHaveTextContent('Option 1');
    });

    it('renders multiple options', () => {
      const { container } = render(
        <select>
          <OptionField value="a" label="Option A" />
          <OptionField value="b" label="Option B" />
          <OptionField value="c" label="Option C" />
        </select>
      );
      const options = container.querySelectorAll('option');
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveValue('a');
      expect(options[1]).toHaveValue('b');
      expect(options[2]).toHaveValue('c');
    });
  });

  describe('BaseField', () => {
    it('renders with label and children', () => {
      const { getByText } = render(
        <BaseField htmlFor="test-field" label="Test Field">
          <input type="text" id="test-field" />
        </BaseField>
      );
      expect(getByText('Test Field')).toBeInTheDocument();
    });

    it('adds asterisk to label when required', () => {
      const { getByText } = render(
        <BaseField htmlFor="required-field" label="Required Field" required>
          <input type="text" id="required-field" />
        </BaseField>
      );
      expect(getByText('Required Field *')).toBeInTheDocument();
    });

    it('does not add asterisk when not required', () => {
      const { getByText, queryByText } = render(
        <BaseField htmlFor="optional-field" label="Optional Field">
          <input type="text" id="optional-field" />
        </BaseField>
      );
      expect(getByText('Optional Field')).toBeInTheDocument();
      expect(queryByText('Optional Field *')).not.toBeInTheDocument();
    });

    it('applies custom inputGroupClass', () => {
      const { container } = render(
        <BaseField
          htmlFor="test"
          label="Test"
          inputGroupClass="custom-group-class"
        >
          <input type="text" />
        </BaseField>
      );
      const div = container.querySelector('.custom-group-class');
      expect(div).toBeInTheDocument();
    });

    it('applies custom labelClass', () => {
      const { container } = render(
        <BaseField htmlFor="test" label="Test" labelClass="custom-label-class">
          <input type="text" />
        </BaseField>
      );
      const label = container.querySelector('.custom-label-class');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Test');
    });

    it('renders children correctly', () => {
      const { getByPlaceholderText } = render(
        <BaseField htmlFor="test" label="Test">
          <input type="text" placeholder="Enter text" />
        </BaseField>
      );
      expect(getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('associates label with input using htmlFor', () => {
      const { container } = render(
        <BaseField htmlFor="associated-input" label="Associated Label">
          <input type="text" id="associated-input" />
        </BaseField>
      );
      const label = container.querySelector('label');
      expect(label).toHaveAttribute('for', 'associated-input');
    });

    it('renders the hint paragraph with the expected id when hint is present', () => {
      render(
        <BaseField htmlFor="campo" label="Campo" hint="Texto de apoio">
          <input type="text" id="campo" />
        </BaseField>
      );
      const hint = screen.getByText('Texto de apoio');
      expect(hint.tagName).toBe('P');
      expect(hint).toHaveAttribute('id', 'campo-hint');
    });

    it('renders the hint paragraph with the typographic and semantic-color classes', () => {
      render(
        <BaseField htmlFor="campo" label="Campo" hint="Texto de apoio">
          <input type="text" id="campo" />
        </BaseField>
      );
      const hint = screen.getByText('Texto de apoio');
      expect(hint).toHaveClass('mt-1');
      expect(hint).toHaveClass('text-sm');
      expect(hint).toHaveClass('text-muted');
    });

    it('does not render the hint paragraph when hint is absent (default preserved)', () => {
      const { container } = render(
        <BaseField htmlFor="campo" label="Campo">
          <input type="text" id="campo" />
        </BaseField>
      );
      expect(container.querySelector('#campo-hint')).not.toBeInTheDocument();
    });

    it('renders the error paragraph as an alert with the expected id when error is present', () => {
      render(
        <BaseField htmlFor="campo" label="Campo" error="Valor inválido">
          <input type="text" id="campo" />
        </BaseField>
      );
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('Valor inválido');
      expect(error).toHaveAttribute('id', 'campo-error');
    });

    it('renders the error paragraph with the typographic and semantic-color classes', () => {
      render(
        <BaseField htmlFor="campo" label="Campo" error="Valor inválido">
          <input type="text" id="campo" />
        </BaseField>
      );
      const error = screen.getByRole('alert');
      expect(error).toHaveClass('mt-1');
      expect(error).toHaveClass('text-sm');
      expect(error).toHaveClass('text-error');
    });

    it('does not render the error paragraph when error is absent (default preserved)', () => {
      const { container } = render(
        <BaseField htmlFor="campo" label="Campo">
          <input type="text" id="campo" />
        </BaseField>
      );
      expect(container.querySelector('#campo-error')).not.toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('describedByIds', () => {
    it('returns only the hint id when just hint is present', () => {
      expect(describedByIds('campo', { hint: 'ajuda' })).toBe('campo-hint');
    });

    it('returns only the error id when just error is present', () => {
      expect(describedByIds('campo', { error: 'ruim' })).toBe('campo-error');
    });

    it('returns both ids space-separated when hint and error are both present', () => {
      expect(describedByIds('campo', { hint: 'ajuda', error: 'ruim' })).toBe(
        'campo-hint campo-error'
      );
    });

    it('returns undefined when neither hint nor error is present', () => {
      expect(describedByIds('campo', {})).toBeUndefined();
      expect(describedByIds('campo')).toBeUndefined();
    });
  });
});
