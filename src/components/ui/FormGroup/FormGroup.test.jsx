import { render } from '@testing-library/react';
import { FormGroup } from './index.jsx';

describe('FormGroup', () => {
  describe('default behavior', () => {
    it('renders children inside a grid container with default classes', () => {
      const { container } = render(
        <FormGroup>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('grid');
      expect(gridDiv).toHaveClass('grid-cols-1');
      expect(gridDiv).toHaveClass('md:grid-cols-2');
      expect(gridDiv).toHaveClass('gap-6');
      expect(
        container.querySelector('[data-testid="child1"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-testid="child2"]')
      ).toBeInTheDocument();
    });

    it('uses default cols=2 when cols prop is not provided', () => {
      const { container } = render(
        <FormGroup>
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('md:grid-cols-2');
      expect(gridDiv).not.toHaveClass('lg:grid-cols-3');
      expect(gridDiv).not.toHaveClass('lg:grid-cols-4');
    });

    it('uses default gap-6 when className is not provided', () => {
      const { container } = render(
        <FormGroup>
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('gap-6');
    });
  });

  describe('cols prop', () => {
    it('uses cols=1 to omit md:grid-cols-2', () => {
      const { container } = render(
        <FormGroup cols={1}>
          <div>Teste</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).not.toHaveClass('md:grid-cols-2');
      expect(gridDiv).not.toHaveClass('lg:grid-cols-3');
      expect(gridDiv).toHaveClass('grid-cols-1');
    });

    it('uses cols=2 for medium devices', () => {
      const { container } = render(
        <FormGroup cols={2}>
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('grid-cols-1');
      expect(gridDiv).toHaveClass('md:grid-cols-2');
      expect(gridDiv).not.toHaveClass('lg:grid-cols-3');
    });

    it('uses cols=3 for medium and large devices', () => {
      const { container } = render(
        <FormGroup cols={3}>
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('grid-cols-1');
      expect(gridDiv).toHaveClass('md:grid-cols-2');
      expect(gridDiv).toHaveClass('lg:grid-cols-3');
    });

    it('uses cols=4 for medium and large devices', () => {
      const { container } = render(
        <FormGroup cols={4}>
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('grid-cols-1');
      expect(gridDiv).toHaveClass('md:grid-cols-2');
      expect(gridDiv).toHaveClass('lg:grid-cols-4');
    });

    it('uses cols=5 for medium and large devices', () => {
      const { container } = render(
        <FormGroup cols={5}>
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('grid-cols-1');
      expect(gridDiv).toHaveClass('md:grid-cols-3');
      expect(gridDiv).toHaveClass('lg:grid-cols-5');
    });

    it('uses cols=6 for medium and large devices', () => {
      const { container } = render(
        <FormGroup cols={6}>
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('grid-cols-1');
      expect(gridDiv).toHaveClass('md:grid-cols-3');
      expect(gridDiv).toHaveClass('lg:grid-cols-6');
    });
  });

  describe('className prop', () => {
    it('applies custom className if provided', () => {
      const { container } = render(
        <FormGroup className="custom-class">
          <div>Conteúdo</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('custom-class');
      expect(gridDiv).toHaveClass('grid');
      expect(gridDiv).toHaveClass('grid-cols-1');
    });

    it('uses custom cols and className together', () => {
      const { container } = render(
        <FormGroup cols={1} className="extra-class">
          <div>Teste</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('extra-class');
      expect(gridDiv).toHaveClass('grid-cols-1');
      expect(gridDiv).not.toHaveClass('md:grid-cols-2');
    });

    it('replaces empty className with gap-6', () => {
      const { container } = render(
        <FormGroup className="">
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('gap-6');
    });

    it('keeps custom className when provided', () => {
      const { container } = render(
        <FormGroup className="gap-4">
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('gap-4');
      expect(gridDiv).not.toHaveClass('gap-6');
    });
  });

  describe('children rendering', () => {
    it('renders single child correctly', () => {
      const { getByText } = render(
        <FormGroup>
          <div>Single Child</div>
        </FormGroup>
      );
      expect(getByText('Single Child')).toBeInTheDocument();
    });

    it('renders multiple children correctly', () => {
      const { getByText } = render(
        <FormGroup>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </FormGroup>
      );
      expect(getByText('Child 1')).toBeInTheDocument();
      expect(getByText('Child 2')).toBeInTheDocument();
      expect(getByText('Child 3')).toBeInTheDocument();
    });

    it('renders no children without errors', () => {
      const { container } = render(<FormGroup />);
      const gridDiv = container.firstChild;
      expect(gridDiv).toBeInTheDocument();
      expect(gridDiv).toHaveClass('grid');
      expect(gridDiv.children).toHaveLength(0);
    });

    it('renders complex nested children', () => {
      const { getByTestId } = render(
        <FormGroup cols={3}>
          <div data-testid="form-field-1">
            <label>Field 1</label>
            <input type="text" />
          </div>
          <div data-testid="form-field-2">
            <label>Field 2</label>
            <input type="text" />
          </div>
        </FormGroup>
      );
      expect(getByTestId('form-field-1')).toBeInTheDocument();
      expect(getByTestId('form-field-2')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles undefined cols gracefully', () => {
      const { container } = render(
        <FormGroup cols={undefined}>
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('grid');
      expect(gridDiv).toHaveClass('grid-cols-1');
    });

    it('handles null className gracefully', () => {
      const { container } = render(
        <FormGroup className={null}>
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('grid');
      expect(gridDiv).toHaveClass('gap-6');
    });

    it('handles unsupported cols value', () => {
      const { container } = render(
        <FormGroup cols={7}>
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('grid-cols-1');
      expect(gridDiv).not.toHaveClass('md:grid-cols-2');
      expect(gridDiv).not.toHaveClass('lg:grid-cols-3');
    });

    it('handles cols=0', () => {
      const { container } = render(
        <FormGroup cols={0}>
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv).toHaveClass('grid-cols-1');
    });
  });

  describe('responsive behavior', () => {
    it('always starts with grid-cols-1 for mobile', () => {
      const testCases = [1, 2, 3, 4, 5, 6];
      testCases.forEach(cols => {
        const { container } = render(
          <FormGroup cols={cols}>
            <div>Content</div>
          </FormGroup>
        );
        const gridDiv = container.firstChild;
        expect(gridDiv).toHaveClass('grid-cols-1');
      });
    });

    it('applies correct responsive classes for cols=3', () => {
      const { container } = render(
        <FormGroup cols={3}>
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      const classes = gridDiv.className;
      expect(classes).toContain('grid-cols-1');
      expect(classes).toContain('md:grid-cols-2');
      expect(classes).toContain('lg:grid-cols-3');
    });

    it('applies correct responsive classes for cols=6', () => {
      const { container } = render(
        <FormGroup cols={6}>
          <div>Content</div>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      const classes = gridDiv.className;
      expect(classes).toContain('grid-cols-1');
      expect(classes).toContain('md:grid-cols-3');
      expect(classes).toContain('lg:grid-cols-6');
    });
  });

  describe('integration with form fields', () => {
    it('works with multiple input fields', () => {
      const { getByLabelText } = render(
        <FormGroup cols={2}>
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" />
          </div>
        </FormGroup>
      );
      expect(getByLabelText('Name')).toBeInTheDocument();
      expect(getByLabelText('Email')).toBeInTheDocument();
    });

    it('maintains grid layout with different field types', () => {
      const { container } = render(
        <FormGroup cols={4}>
          <input type="text" />
          <select></select>
          <textarea></textarea>
          <button>Submit</button>
        </FormGroup>
      );
      const gridDiv = container.firstChild;
      expect(gridDiv.children).toHaveLength(4);
      expect(gridDiv).toHaveClass('lg:grid-cols-4');
    });
  });
});
