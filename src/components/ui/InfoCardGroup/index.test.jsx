import { render, screen } from '@testing-library/react';
import { InfoCardGroup } from './index';

describe('InfoCardGroup', () => {
  describe('basic rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<InfoCardGroup />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render as a div element', () => {
      const { container } = render(<InfoCardGroup />);
      const group = container.firstChild;
      expect(group.tagName).toBe('DIV');
    });

    it('should render with children', () => {
      render(
        <InfoCardGroup>
          <div>Child 1</div>
        </InfoCardGroup>
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <InfoCardGroup>
          <div>Card 1</div>
          <div>Card 2</div>
          <div>Card 3</div>
        </InfoCardGroup>
      );
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
    });

    it('should render without children', () => {
      const { container } = render(<InfoCardGroup />);
      const group = container.firstChild;
      expect(group).toBeEmptyDOMElement();
    });
  });

  describe('styling', () => {
    it('should have grid class', () => {
      const { container } = render(<InfoCardGroup />);
      const group = container.firstChild;
      expect(group).toHaveClass('grid');
    });

    it('should have grid-cols-1 class', () => {
      const { container } = render(<InfoCardGroup />);
      const group = container.firstChild;
      expect(group).toHaveClass('grid-cols-1');
    });

    it('should have md:grid-cols-3 class', () => {
      const { container } = render(<InfoCardGroup />);
      const group = container.firstChild;
      expect(group).toHaveClass('md:grid-cols-3');
    });

    it('should have gap-4 class', () => {
      const { container } = render(<InfoCardGroup />);
      const group = container.firstChild;
      expect(group).toHaveClass('gap-4');
    });

    it('should have all required classes', () => {
      const { container } = render(<InfoCardGroup />);
      const group = container.firstChild;
      expect(group.className).toBe('grid grid-cols-1 md:grid-cols-3 gap-4');
    });
  });

  describe('children rendering', () => {
    it('should render text children', () => {
      render(<InfoCardGroup>Simple text</InfoCardGroup>);
      expect(screen.getByText('Simple text')).toBeInTheDocument();
    });

    it('should render nested elements', () => {
      render(
        <InfoCardGroup>
          <div>
            <span>Nested content</span>
          </div>
        </InfoCardGroup>
      );
      expect(screen.getByText('Nested content')).toBeInTheDocument();
    });

    it('should render complex children structure', () => {
      render(
        <InfoCardGroup>
          <div data-testid="card-1">First Card</div>
          <div data-testid="card-2">Second Card</div>
          <div data-testid="card-3">Third Card</div>
        </InfoCardGroup>
      );
      expect(screen.getByTestId('card-1')).toBeInTheDocument();
      expect(screen.getByTestId('card-2')).toBeInTheDocument();
      expect(screen.getByTestId('card-3')).toBeInTheDocument();
    });

    it('should render components as children', () => {
      const CustomCard = ({ title }) => <div>{title}</div>;
      render(
        <InfoCardGroup>
          <CustomCard title="Custom Card 1" />
          <CustomCard title="Custom Card 2" />
        </InfoCardGroup>
      );
      expect(screen.getByText('Custom Card 1')).toBeInTheDocument();
      expect(screen.getByText('Custom Card 2')).toBeInTheDocument();
    });

    it('should preserve children order', () => {
      const { container } = render(
        <InfoCardGroup>
          <span data-testid="first">First</span>
          <span data-testid="second">Second</span>
          <span data-testid="third">Third</span>
        </InfoCardGroup>
      );
      const children = container.firstChild.children;
      expect(children[0]).toHaveAttribute('data-testid', 'first');
      expect(children[1]).toHaveAttribute('data-testid', 'second');
      expect(children[2]).toHaveAttribute('data-testid', 'third');
    });

    it('should render exactly 3 cards for typical use case', () => {
      const { container } = render(
        <InfoCardGroup>
          <div>Card 1</div>
          <div>Card 2</div>
          <div>Card 3</div>
        </InfoCardGroup>
      );
      expect(container.firstChild.children.length).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('should handle null children', () => {
      const { container } = render(<InfoCardGroup>{null}</InfoCardGroup>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      const { container } = render(<InfoCardGroup>{undefined}</InfoCardGroup>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle empty array as children', () => {
      const { container } = render(<InfoCardGroup>{[]}</InfoCardGroup>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle boolean children', () => {
      const { container } = render(
        <InfoCardGroup>
          {true}
          {false}
        </InfoCardGroup>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle mixed valid and invalid children', () => {
      render(
        <InfoCardGroup>
          {null}
          <div>Valid Card</div>
          {undefined}
          {false}
        </InfoCardGroup>
      );
      expect(screen.getByText('Valid Card')).toBeInTheDocument();
    });

    it('should handle single child', () => {
      render(
        <InfoCardGroup>
          <div>Single Card</div>
        </InfoCardGroup>
      );
      expect(screen.getByText('Single Card')).toBeInTheDocument();
    });

    it('should handle more than 3 children', () => {
      const { container } = render(
        <InfoCardGroup>
          <div>Card 1</div>
          <div>Card 2</div>
          <div>Card 3</div>
          <div>Card 4</div>
          <div>Card 5</div>
        </InfoCardGroup>
      );
      expect(container.firstChild.children.length).toBe(5);
    });

    it('should handle large number of children', () => {
      const children = Array.from({ length: 20 }, (_, i) => (
        <div key={i} data-testid={`card-${i}`}>
          Card {i}
        </div>
      ));
      render(<InfoCardGroup>{children}</InfoCardGroup>);
      expect(screen.getByTestId('card-0')).toBeInTheDocument();
      expect(screen.getByTestId('card-19')).toBeInTheDocument();
    });
  });

  describe('grid layout behavior', () => {
    it('should use grid layout for responsive design', () => {
      const { container } = render(
        <InfoCardGroup>
          <div>Card 1</div>
          <div>Card 2</div>
          <div>Card 3</div>
        </InfoCardGroup>
      );
      const group = container.firstChild;
      // Should have grid classes for responsive layout
      expect(group).toHaveClass('grid');
      expect(group).toHaveClass('grid-cols-1'); // Mobile: 1 column
      expect(group).toHaveClass('md:grid-cols-3'); // Desktop: 3 columns
    });

    it('should have spacing between cards', () => {
      const { container } = render(
        <InfoCardGroup>
          <div>Card 1</div>
          <div>Card 2</div>
        </InfoCardGroup>
      );
      const group = container.firstChild;
      expect(group).toHaveClass('gap-4');
    });
  });

  describe('integration with InfoCard', () => {
    it('should work with InfoCard-like components', () => {
      const InfoCard = ({ title, content }) => (
        <div className="info-card">
          <h3>{title}</h3>
          <p>{content}</p>
        </div>
      );

      render(
        <InfoCardGroup>
          <InfoCard title="Card 1" content="Content 1" />
          <InfoCard title="Card 2" content="Content 2" />
          <InfoCard title="Card 3" content="Content 3" />
        </InfoCardGroup>
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
      expect(screen.getByText('Content 3')).toBeInTheDocument();
    });
  });

  describe('rerendering', () => {
    it('should update when children change', () => {
      const { rerender } = render(
        <InfoCardGroup>
          <div>Initial Card</div>
        </InfoCardGroup>
      );
      expect(screen.getByText('Initial Card')).toBeInTheDocument();

      rerender(
        <InfoCardGroup>
          <div>Updated Card</div>
        </InfoCardGroup>
      );
      expect(screen.getByText('Updated Card')).toBeInTheDocument();
      expect(screen.queryByText('Initial Card')).not.toBeInTheDocument();
    });

    it('should handle adding children', () => {
      const { rerender, container } = render(
        <InfoCardGroup>
          <div>Card 1</div>
        </InfoCardGroup>
      );
      expect(container.firstChild.children.length).toBe(1);

      rerender(
        <InfoCardGroup>
          <div>Card 1</div>
          <div>Card 2</div>
          <div>Card 3</div>
        </InfoCardGroup>
      );
      expect(container.firstChild.children.length).toBe(3);
    });

    it('should handle removing children', () => {
      const { rerender, container } = render(
        <InfoCardGroup>
          <div>Card 1</div>
          <div>Card 2</div>
          <div>Card 3</div>
        </InfoCardGroup>
      );
      expect(container.firstChild.children.length).toBe(3);

      rerender(
        <InfoCardGroup>
          <div>Card 1</div>
        </InfoCardGroup>
      );
      expect(container.firstChild.children.length).toBe(1);
    });
  });

  describe('accessibility', () => {
    it('should render semantic HTML', () => {
      const { container } = render(<InfoCardGroup />);
      const group = container.firstChild;
      expect(group.tagName).toBe('DIV');
    });

    it('should allow children to maintain their accessibility attributes', () => {
      render(
        <InfoCardGroup>
          <div role="region" aria-label="Card 1">
            Content 1
          </div>
          <div role="region" aria-label="Card 2">
            Content 2
          </div>
        </InfoCardGroup>
      );
      expect(screen.getByLabelText('Card 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Card 2')).toBeInTheDocument();
    });
  });

  describe('real-world usage', () => {
    it('should render typical dashboard cards layout', () => {
      render(
        <InfoCardGroup>
          <div className="card">
            <h3>Total Users</h3>
            <p>1,234</p>
          </div>
          <div className="card">
            <h3>Active Sessions</h3>
            <p>567</p>
          </div>
          <div className="card">
            <h3>Revenue</h3>
            <p>$89,012</p>
          </div>
        </InfoCardGroup>
      );

      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('1,234')).toBeInTheDocument();
      expect(screen.getByText('Active Sessions')).toBeInTheDocument();
      expect(screen.getByText('567')).toBeInTheDocument();
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('$89,012')).toBeInTheDocument();
    });

    it('should work with conditional rendering', () => {
      const showCard2 = false;
      render(
        <InfoCardGroup>
          <div>Card 1</div>
          {showCard2 && <div>Card 2</div>}
          <div>Card 3</div>
        </InfoCardGroup>
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.queryByText('Card 2')).not.toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
    });

    it('should work with mapped data', () => {
      const data = [
        { id: 1, title: 'Card A' },
        { id: 2, title: 'Card B' },
        { id: 3, title: 'Card C' },
      ];

      render(
        <InfoCardGroup>
          {data.map(item => (
            <div key={item.id}>{item.title}</div>
          ))}
        </InfoCardGroup>
      );

      expect(screen.getByText('Card A')).toBeInTheDocument();
      expect(screen.getByText('Card B')).toBeInTheDocument();
      expect(screen.getByText('Card C')).toBeInTheDocument();
    });
  });
});
