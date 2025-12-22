import { render, screen } from '@testing-library/react';
import { BlockQuoteInfo } from './index';

describe('BlockQuoteInfo', () => {
  describe('basic rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <BlockQuoteInfo title="Title" noContent="No content" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render as a div element', () => {
      const { container } = render(
        <BlockQuoteInfo title="Title" noContent="No content" />
      );
      const wrapper = container.firstChild;
      expect(wrapper.tagName).toBe('DIV');
    });

    it('should render title', () => {
      render(<BlockQuoteInfo title="Test Title" noContent="No content" />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render title as h4', () => {
      render(<BlockQuoteInfo title="Test Title" noContent="No content" />);
      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe('Test Title');
    });
  });

  describe('children rendering', () => {
    it('should render children when provided', () => {
      render(
        <BlockQuoteInfo title="Title" noContent="No content">
          Child content
        </BlockQuoteInfo>
      );
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should render children in blockquote element', () => {
      const { container } = render(
        <BlockQuoteInfo title="Title" noContent="No content">
          Quote text
        </BlockQuoteInfo>
      );
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toBeInTheDocument();
      expect(blockquote.textContent).toBe('Quote text');
    });

    it('should not render noContent when children is provided', () => {
      render(
        <BlockQuoteInfo title="Title" noContent="No content message">
          Child content
        </BlockQuoteInfo>
      );
      expect(screen.getByText('Child content')).toBeInTheDocument();
      expect(screen.queryByText('No content message')).not.toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <BlockQuoteInfo title="Title" noContent="No content">
          <span>First part</span>
          <strong>Second part</strong>
        </BlockQuoteInfo>
      );
      expect(screen.getByText('First part')).toBeInTheDocument();
      expect(screen.getByText('Second part')).toBeInTheDocument();
    });

    it('should render multiple text nodes as children', () => {
      render(
        <BlockQuoteInfo title="Title" noContent="No content">
          Part 1 <em>emphasized</em> Part 2
        </BlockQuoteInfo>
      );
      expect(screen.getByText(/Part 1/)).toBeInTheDocument();
      expect(screen.getByText('emphasized')).toBeInTheDocument();
      expect(screen.getByText(/Part 2/)).toBeInTheDocument();
    });
  });

  describe('noContent rendering', () => {
    it('should render noContent when children is not provided', () => {
      render(<BlockQuoteInfo title="Title" noContent="Nothing to show" />);
      expect(screen.getByText('Nothing to show')).toBeInTheDocument();
    });

    it('should render noContent in paragraph element', () => {
      const { container } = render(
        <BlockQuoteInfo title="Title" noContent="No data" />
      );
      const paragraph = container.querySelector('p');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph.textContent).toBe('No data');
    });

    it('should not render blockquote when children is not provided', () => {
      const { container } = render(
        <BlockQuoteInfo title="Title" noContent="No content" />
      );
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).not.toBeInTheDocument();
    });

    it('should render noContent when children is null', () => {
      render(
        <BlockQuoteInfo title="Title" noContent="Empty content">
          {null}
        </BlockQuoteInfo>
      );
      expect(screen.getByText('Empty content')).toBeInTheDocument();
    });

    it('should render noContent when children is undefined', () => {
      render(
        <BlockQuoteInfo title="Title" noContent="No data">
          {undefined}
        </BlockQuoteInfo>
      );
      expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('should render noContent when children is false', () => {
      render(
        <BlockQuoteInfo title="Title" noContent="Nothing here">
          {false}
        </BlockQuoteInfo>
      );
      expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });

    it('should render noContent when children is empty string', () => {
      render(
        <BlockQuoteInfo title="Title" noContent="No content">
          {''}
        </BlockQuoteInfo>
      );
      expect(screen.getByText('No content')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have mt-4 class on wrapper', () => {
      const { container } = render(
        <BlockQuoteInfo title="Title" noContent="No content" />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('mt-4');
    });

    it('should have font-semibold class on title', () => {
      render(<BlockQuoteInfo title="Title" noContent="No content" />);
      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toHaveClass('font-semibold');
    });

    it('should have correct classes on blockquote', () => {
      const { container } = render(
        <BlockQuoteInfo title="Title" noContent="No content">
          Content
        </BlockQuoteInfo>
      );
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toHaveClass('border-l-4');
      expect(blockquote).toHaveClass('pl-3');
      expect(blockquote).toHaveClass('italic');
      expect(blockquote).toHaveClass('text-gray-700');
    });

    it('should have text-gray-500 class on noContent paragraph', () => {
      const { container } = render(
        <BlockQuoteInfo title="Title" noContent="No content" />
      );
      const paragraph = container.querySelector('p');
      expect(paragraph).toHaveClass('text-gray-500');
    });
  });

  describe('title variations', () => {
    it('should render title with special characters', () => {
      render(
        <BlockQuoteInfo title="Título & Descrição" noContent="No content" />
      );
      expect(screen.getByText('Título & Descrição')).toBeInTheDocument();
    });

    it('should render title with numbers', () => {
      render(<BlockQuoteInfo title="Section 123" noContent="No content" />);
      expect(screen.getByText('Section 123')).toBeInTheDocument();
    });

    it('should render long title', () => {
      const longTitle =
        'This is a very long title that should still render correctly';
      render(<BlockQuoteInfo title={longTitle} noContent="No content" />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should render empty title', () => {
      const { container } = render(
        <BlockQuoteInfo title="" noContent="No content" />
      );
      const heading = container.querySelector('h4');
      expect(heading).toBeEmptyDOMElement();
    });
  });

  describe('edge cases', () => {
    it('should handle all props being empty strings', () => {
      const { container } = render(
        <BlockQuoteInfo title="" noContent="">
          {''}
        </BlockQuoteInfo>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with only title', () => {
      render(<BlockQuoteInfo title="Only Title" />);
      expect(screen.getByText('Only Title')).toBeInTheDocument();
    });

    it('should handle children with whitespace', () => {
      render(
        <BlockQuoteInfo title="Title" noContent="No content">
          {'   '}
        </BlockQuoteInfo>
      );
      const blockquote = screen.queryByRole('blockquote');
      // Whitespace is truthy, so blockquote should render
      expect(blockquote).toBeInTheDocument();
    });

    it('should handle numeric children', () => {
      render(
        <BlockQuoteInfo title="Title" noContent="No content">
          {123}
        </BlockQuoteInfo>
      );
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('should handle zero as children', () => {
      render(
        <BlockQuoteInfo title="Title" noContent="No content">
          {0}
        </BlockQuoteInfo>
      );
      // 0 is falsy, should show noContent
      expect(screen.getByText('No content')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should use semantic heading for title', () => {
      render(
        <BlockQuoteInfo title="Accessible Title" noContent="No content" />
      );
      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toBeInTheDocument();
    });

    it('should use semantic blockquote element', () => {
      const { container } = render(
        <BlockQuoteInfo title="Title" noContent="No content">
          Quote content
        </BlockQuoteInfo>
      );
      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toBeInTheDocument();
      expect(blockquote.tagName).toBe('BLOCKQUOTE');
    });

    it('should maintain proper heading hierarchy', () => {
      render(
        <div>
          <h3>Parent Heading</h3>
          <BlockQuoteInfo title="Child Heading" noContent="No content" />
        </div>
      );
      const h3 = screen.getByRole('heading', { level: 3 });
      const h4 = screen.getByRole('heading', { level: 4 });
      expect(h3).toBeInTheDocument();
      expect(h4).toBeInTheDocument();
    });
  });

  describe('rerendering', () => {
    it('should update when title changes', () => {
      const { rerender } = render(
        <BlockQuoteInfo title="Initial Title" noContent="No content" />
      );
      expect(screen.getByText('Initial Title')).toBeInTheDocument();

      rerender(<BlockQuoteInfo title="Updated Title" noContent="No content" />);
      expect(screen.getByText('Updated Title')).toBeInTheDocument();
      expect(screen.queryByText('Initial Title')).not.toBeInTheDocument();
    });

    it('should update when children changes', () => {
      const { rerender } = render(
        <BlockQuoteInfo title="Title" noContent="No content">
          Initial content
        </BlockQuoteInfo>
      );
      expect(screen.getByText('Initial content')).toBeInTheDocument();

      rerender(
        <BlockQuoteInfo title="Title" noContent="No content">
          Updated content
        </BlockQuoteInfo>
      );
      expect(screen.getByText('Updated content')).toBeInTheDocument();
      expect(screen.queryByText('Initial content')).not.toBeInTheDocument();
    });

    it('should switch from children to noContent', () => {
      const { rerender, container } = render(
        <BlockQuoteInfo title="Title" noContent="Empty">
          Has content
        </BlockQuoteInfo>
      );
      expect(screen.getByText('Has content')).toBeInTheDocument();
      expect(container.querySelector('blockquote')).toBeInTheDocument();

      rerender(<BlockQuoteInfo title="Title" noContent="Empty" />);
      expect(screen.getByText('Empty')).toBeInTheDocument();
      expect(container.querySelector('blockquote')).not.toBeInTheDocument();
    });

    it('should switch from noContent to children', () => {
      const { rerender, container } = render(
        <BlockQuoteInfo title="Title" noContent="Empty" />
      );
      expect(screen.getByText('Empty')).toBeInTheDocument();
      expect(container.querySelector('p')).toBeInTheDocument();

      rerender(
        <BlockQuoteInfo title="Title" noContent="Empty">
          New content
        </BlockQuoteInfo>
      );
      expect(screen.getByText('New content')).toBeInTheDocument();
      expect(container.querySelector('blockquote')).toBeInTheDocument();
      expect(screen.queryByText('Empty')).not.toBeInTheDocument();
    });
  });

  describe('real-world usage', () => {
    it('should display user bio information', () => {
      render(
        <BlockQuoteInfo title="Biografia" noContent="Sem biografia cadastrada">
          Este é um professor experiente com mais de 10 anos de ensino.
        </BlockQuoteInfo>
      );
      expect(screen.getByText('Biografia')).toBeInTheDocument();
      expect(screen.getByText(/professor experiente/)).toBeInTheDocument();
    });

    it('should display empty state for missing data', () => {
      render(
        <BlockQuoteInfo
          title="Observações"
          noContent="Nenhuma observação registrada"
        />
      );
      expect(screen.getByText('Observações')).toBeInTheDocument();
      expect(
        screen.getByText('Nenhuma observação registrada')
      ).toBeInTheDocument();
    });

    it('should work with formatted text', () => {
      render(
        <BlockQuoteInfo title="Descrição" noContent="Sem descrição">
          <p>
            Lorem ipsum <strong>dolor sit amet</strong>, consectetur adipiscing
            elit.
          </p>
        </BlockQuoteInfo>
      );
      expect(screen.getByText('Descrição')).toBeInTheDocument();
      expect(screen.getByText(/Lorem ipsum/)).toBeInTheDocument();
      expect(screen.getByText('dolor sit amet')).toBeInTheDocument();
    });

    it('should display multiple BlockQuoteInfo components', () => {
      render(
        <div>
          <BlockQuoteInfo title="Info 1" noContent="Empty 1">
            Content 1
          </BlockQuoteInfo>
          <BlockQuoteInfo title="Info 2" noContent="Empty 2">
            Content 2
          </BlockQuoteInfo>
          <BlockQuoteInfo title="Info 3" noContent="Empty 3" />
        </div>
      );
      expect(screen.getByText('Info 1')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Info 2')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.getByText('Info 3')).toBeInTheDocument();
      expect(screen.getByText('Empty 3')).toBeInTheDocument();
    });
  });

  describe('conditional rendering logic', () => {
    it('should show blockquote when children is truthy string', () => {
      const { container } = render(
        <BlockQuoteInfo title="Title" noContent="No content">
          Some content
        </BlockQuoteInfo>
      );
      expect(container.querySelector('blockquote')).toBeInTheDocument();
      expect(container.querySelector('p')).not.toBeInTheDocument();
    });

    it('should show paragraph when children is falsy', () => {
      const { container } = render(
        <BlockQuoteInfo title="Title" noContent="No content">
          {null}
        </BlockQuoteInfo>
      );
      expect(container.querySelector('p')).toBeInTheDocument();
      expect(container.querySelector('blockquote')).not.toBeInTheDocument();
    });

    it('should evaluate children prop correctly for conditional', () => {
      const { container } = render(
        <BlockQuoteInfo title="Title" noContent="No content">
          {false && 'Should not show'}
        </BlockQuoteInfo>
      );
      expect(container.querySelector('p')).toBeInTheDocument();
      expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
    });
  });
});
