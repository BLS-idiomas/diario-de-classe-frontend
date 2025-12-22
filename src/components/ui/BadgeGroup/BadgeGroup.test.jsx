import { render, screen } from '@testing-library/react';
import { BadgeGroup } from './index';

describe('BadgeGroup', () => {
  describe('basic rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<BadgeGroup />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render as a div element', () => {
      const { container } = render(<BadgeGroup />);
      const badgeGroup = container.firstChild;
      expect(badgeGroup.tagName).toBe('DIV');
    });

    it('should render with children', () => {
      render(
        <BadgeGroup>
          <span>Child 1</span>
        </BadgeGroup>
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <BadgeGroup>
          <span>Badge 1</span>
          <span>Badge 2</span>
          <span>Badge 3</span>
        </BadgeGroup>
      );
      expect(screen.getByText('Badge 1')).toBeInTheDocument();
      expect(screen.getByText('Badge 2')).toBeInTheDocument();
      expect(screen.getByText('Badge 3')).toBeInTheDocument();
    });

    it('should render without children', () => {
      const { container } = render(<BadgeGroup />);
      const badgeGroup = container.firstChild;
      expect(badgeGroup).toBeEmptyDOMElement();
    });
  });

  describe('styling', () => {
    it('should have flex class', () => {
      const { container } = render(<BadgeGroup />);
      const badgeGroup = container.firstChild;
      expect(badgeGroup).toHaveClass('flex');
    });

    it('should have flex-wrap class', () => {
      const { container } = render(<BadgeGroup />);
      const badgeGroup = container.firstChild;
      expect(badgeGroup).toHaveClass('flex-wrap');
    });

    it('should have gap-2 class', () => {
      const { container } = render(<BadgeGroup />);
      const badgeGroup = container.firstChild;
      expect(badgeGroup).toHaveClass('gap-2');
    });

    it('should have mb-4 class', () => {
      const { container } = render(<BadgeGroup />);
      const badgeGroup = container.firstChild;
      expect(badgeGroup).toHaveClass('mb-4');
    });

    it('should have all required classes', () => {
      const { container } = render(<BadgeGroup />);
      const badgeGroup = container.firstChild;
      expect(badgeGroup.className).toBe('flex flex-wrap gap-2 mb-4');
    });
  });

  describe('children rendering', () => {
    it('should render text children', () => {
      render(<BadgeGroup>Simple text</BadgeGroup>);
      expect(screen.getByText('Simple text')).toBeInTheDocument();
    });

    it('should render nested elements', () => {
      render(
        <BadgeGroup>
          <div>
            <span>Nested content</span>
          </div>
        </BadgeGroup>
      );
      expect(screen.getByText('Nested content')).toBeInTheDocument();
    });

    it('should render complex children structure', () => {
      render(
        <BadgeGroup>
          <div data-testid="child-1">First</div>
          <span data-testid="child-2">Second</span>
          <p data-testid="child-3">Third</p>
        </BadgeGroup>
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should render components as children', () => {
      const CustomComponent = () => <div>Custom Component</div>;
      render(
        <BadgeGroup>
          <CustomComponent />
        </BadgeGroup>
      );
      expect(screen.getByText('Custom Component')).toBeInTheDocument();
    });

    it('should preserve children order', () => {
      const { container } = render(
        <BadgeGroup>
          <span data-testid="first">First</span>
          <span data-testid="second">Second</span>
          <span data-testid="third">Third</span>
        </BadgeGroup>
      );
      const children = container.firstChild.children;
      expect(children[0]).toHaveAttribute('data-testid', 'first');
      expect(children[1]).toHaveAttribute('data-testid', 'second');
      expect(children[2]).toHaveAttribute('data-testid', 'third');
    });
  });

  describe('edge cases', () => {
    it('should handle null children', () => {
      const { container } = render(<BadgeGroup>{null}</BadgeGroup>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      const { container } = render(<BadgeGroup>{undefined}</BadgeGroup>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle empty array as children', () => {
      const { container } = render(<BadgeGroup>{[]}</BadgeGroup>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle boolean children', () => {
      const { container } = render(
        <BadgeGroup>
          {true}
          {false}
        </BadgeGroup>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle mixed valid and invalid children', () => {
      render(
        <BadgeGroup>
          {null}
          <span>Valid</span>
          {undefined}
          {false}
        </BadgeGroup>
      );
      expect(screen.getByText('Valid')).toBeInTheDocument();
    });

    it('should handle large number of children', () => {
      const children = Array.from({ length: 100 }, (_, i) => (
        <span key={i} data-testid={`child-${i}`}>
          Child {i}
        </span>
      ));
      render(<BadgeGroup>{children}</BadgeGroup>);
      expect(screen.getByTestId('child-0')).toBeInTheDocument();
      expect(screen.getByTestId('child-99')).toBeInTheDocument();
    });
  });

  describe('integration scenarios', () => {
    it('should work with Badge components', () => {
      const Badge = ({ text }) => <span className="badge">{text}</span>;
      render(
        <BadgeGroup>
          <Badge text="Badge 1" />
          <Badge text="Badge 2" />
          <Badge text="Badge 3" />
        </BadgeGroup>
      );
      expect(screen.getByText('Badge 1')).toBeInTheDocument();
      expect(screen.getByText('Badge 2')).toBeInTheDocument();
      expect(screen.getByText('Badge 3')).toBeInTheDocument();
    });

    it('should maintain flex layout with many items', () => {
      const { container } = render(
        <BadgeGroup>
          <span>Item 1</span>
          <span>Item 2</span>
          <span>Item 3</span>
          <span>Item 4</span>
          <span>Item 5</span>
        </BadgeGroup>
      );
      const badgeGroup = container.firstChild;
      expect(badgeGroup).toHaveClass('flex', 'flex-wrap');
    });

    it('should render with conditional children', () => {
      const showFirst = true;
      const showSecond = false;
      render(
        <BadgeGroup>
          {showFirst && <span>First</span>}
          {showSecond && <span>Second</span>}
        </BadgeGroup>
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.queryByText('Second')).not.toBeInTheDocument();
    });

    it('should render with mapped children', () => {
      const items = ['Apple', 'Banana', 'Cherry'];
      render(
        <BadgeGroup>
          {items.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </BadgeGroup>
      );
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
      expect(screen.getByText('Cherry')).toBeInTheDocument();
    });
  });

  describe('rerendering', () => {
    it('should update when children change', () => {
      const { rerender } = render(
        <BadgeGroup>
          <span>Initial</span>
        </BadgeGroup>
      );
      expect(screen.getByText('Initial')).toBeInTheDocument();

      rerender(
        <BadgeGroup>
          <span>Updated</span>
        </BadgeGroup>
      );
      expect(screen.getByText('Updated')).toBeInTheDocument();
      expect(screen.queryByText('Initial')).not.toBeInTheDocument();
    });

    it('should handle adding children', () => {
      const { rerender } = render(
        <BadgeGroup>
          <span>First</span>
        </BadgeGroup>
      );
      expect(screen.getByText('First')).toBeInTheDocument();

      rerender(
        <BadgeGroup>
          <span>First</span>
          <span>Second</span>
        </BadgeGroup>
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('should handle removing children', () => {
      const { rerender } = render(
        <BadgeGroup>
          <span>First</span>
          <span>Second</span>
        </BadgeGroup>
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();

      rerender(
        <BadgeGroup>
          <span>First</span>
        </BadgeGroup>
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.queryByText('Second')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should render semantic HTML', () => {
      const { container } = render(<BadgeGroup />);
      const badgeGroup = container.firstChild;
      expect(badgeGroup.tagName).toBe('DIV');
    });

    it('should allow children to maintain their accessibility attributes', () => {
      render(
        <BadgeGroup>
          <button aria-label="Close">X</button>
          <a href="#" aria-label="Learn more">
            Link
          </a>
        </BadgeGroup>
      );
      expect(screen.getByLabelText('Close')).toBeInTheDocument();
      expect(screen.getByLabelText('Learn more')).toBeInTheDocument();
    });
  });
});
