import { render, screen } from '@testing-library/react';
import { SectionTitle } from './index';

describe('SectionTitle', () => {
  describe('basic rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<SectionTitle>Title</SectionTitle>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render as h3 element', () => {
      const { container } = render(<SectionTitle>Title</SectionTitle>);
      const title = container.firstChild;
      expect(title.tagName).toBe('H3');
    });

    it('should render children text', () => {
      render(<SectionTitle>Section Title</SectionTitle>);
      expect(screen.getByText('Section Title')).toBeInTheDocument();
    });

    it('should render without children', () => {
      const { container } = render(<SectionTitle />);
      const title = container.firstChild;
      expect(title).toBeEmptyDOMElement();
    });
  });

  describe('styling', () => {
    it('should have text-lg class', () => {
      const { container } = render(<SectionTitle>Title</SectionTitle>);
      const title = container.firstChild;
      expect(title).toHaveClass('text-lg');
    });

    it('should have font-semibold class', () => {
      const { container } = render(<SectionTitle>Title</SectionTitle>);
      const title = container.firstChild;
      expect(title).toHaveClass('font-semibold');
    });

    it('should have mb-3 class', () => {
      const { container } = render(<SectionTitle>Title</SectionTitle>);
      const title = container.firstChild;
      expect(title).toHaveClass('mb-3');
    });

    it('should have all required classes', () => {
      const { container } = render(<SectionTitle>Title</SectionTitle>);
      const title = container.firstChild;
      expect(title.className).toBe('text-lg font-semibold mb-3');
    });
  });

  describe('children rendering', () => {
    it('should render text children', () => {
      render(<SectionTitle>Simple text</SectionTitle>);
      expect(screen.getByText('Simple text')).toBeInTheDocument();
    });

    it('should render with special characters', () => {
      render(<SectionTitle>Título & Descrição</SectionTitle>);
      expect(screen.getByText('Título & Descrição')).toBeInTheDocument();
    });

    it('should render with numbers', () => {
      render(<SectionTitle>Section 123</SectionTitle>);
      expect(screen.getByText('Section 123')).toBeInTheDocument();
    });

    it('should render long text', () => {
      const longTitle =
        'This is a very long section title that should still be rendered correctly';
      render(<SectionTitle>{longTitle}</SectionTitle>);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should render empty string', () => {
      const { container } = render(<SectionTitle></SectionTitle>);
      const title = container.firstChild;
      expect(title).toBeEmptyDOMElement();
    });

    it('should render nested elements as children', () => {
      render(
        <SectionTitle>
          <span>Nested</span> Content
        </SectionTitle>
      );
      expect(screen.getByText('Nested')).toBeInTheDocument();
      expect(screen.getByText(/Content/)).toBeInTheDocument();
    });

    it('should render multiple nested elements', () => {
      render(
        <SectionTitle>
          <span>First</span>
          <strong>Second</strong>
        </SectionTitle>
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle null children', () => {
      const { container } = render(<SectionTitle>{null}</SectionTitle>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      const { container } = render(<SectionTitle>{undefined}</SectionTitle>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle boolean children', () => {
      const { container } = render(
        <SectionTitle>
          {true}
          {false}
        </SectionTitle>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle mixed valid and invalid children', () => {
      render(
        <SectionTitle>
          {null}
          Valid Title
          {undefined}
        </SectionTitle>
      );
      expect(screen.getByText(/Valid Title/)).toBeInTheDocument();
    });

    it('should handle array of children', () => {
      const items = ['Part 1', 'Part 2', 'Part 3'];
      render(
        <SectionTitle>
          {items.map((item, index) => (
            <span key={index}>{item} </span>
          ))}
        </SectionTitle>
      );
      expect(screen.getByText(/Part 1/)).toBeInTheDocument();
      expect(screen.getByText(/Part 2/)).toBeInTheDocument();
      expect(screen.getByText(/Part 3/)).toBeInTheDocument();
    });
  });

  describe('semantic HTML', () => {
    it('should use h3 for proper document structure', () => {
      const { container } = render(<SectionTitle>Title</SectionTitle>);
      const h3Elements = container.querySelectorAll('h3');
      expect(h3Elements.length).toBe(1);
    });

    it('should maintain heading hierarchy', () => {
      const { container } = render(
        <div>
          <h2>Main Title</h2>
          <SectionTitle>Subsection</SectionTitle>
        </div>
      );
      const h2 = container.querySelector('h2');
      const h3 = container.querySelector('h3');
      expect(h2).toBeInTheDocument();
      expect(h3).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should render semantic heading', () => {
      render(<SectionTitle>Accessible Title</SectionTitle>);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it('should have correct heading level', () => {
      render(<SectionTitle>Title</SectionTitle>);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading.textContent).toBe('Title');
    });

    it('should be accessible by text content', () => {
      render(<SectionTitle>Find Me</SectionTitle>);
      const heading = screen.getByRole('heading', { name: 'Find Me' });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('rerendering', () => {
    it('should update when children change', () => {
      const { rerender } = render(<SectionTitle>Initial</SectionTitle>);
      expect(screen.getByText('Initial')).toBeInTheDocument();

      rerender(<SectionTitle>Updated</SectionTitle>);
      expect(screen.getByText('Updated')).toBeInTheDocument();
      expect(screen.queryByText('Initial')).not.toBeInTheDocument();
    });

    it('should maintain styling when content changes', () => {
      const { rerender, container } = render(
        <SectionTitle>First</SectionTitle>
      );
      const titleBefore = container.firstChild;
      expect(titleBefore).toHaveClass('text-lg', 'font-semibold', 'mb-3');

      rerender(<SectionTitle>Second</SectionTitle>);
      const titleAfter = container.firstChild;
      expect(titleAfter).toHaveClass('text-lg', 'font-semibold', 'mb-3');
    });
  });

  describe('real-world usage', () => {
    it('should work in typical section layout', () => {
      render(
        <section>
          <SectionTitle>User Information</SectionTitle>
          <p>Content goes here</p>
        </section>
      );
      expect(
        screen.getByRole('heading', { name: 'User Information' })
      ).toBeInTheDocument();
      expect(screen.getByText('Content goes here')).toBeInTheDocument();
    });

    it('should work with multiple sections', () => {
      render(
        <div>
          <section>
            <SectionTitle>Section 1</SectionTitle>
          </section>
          <section>
            <SectionTitle>Section 2</SectionTitle>
          </section>
          <section>
            <SectionTitle>Section 3</SectionTitle>
          </section>
        </div>
      );
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(3);
    });

    it('should work with conditional rendering', () => {
      const showTitle = true;
      render(
        <div>{showTitle && <SectionTitle>Conditional Title</SectionTitle>}</div>
      );
      expect(screen.getByText('Conditional Title')).toBeInTheDocument();
    });

    it('should work with dynamic content', () => {
      const titleText = 'Dynamic Section';
      render(<SectionTitle>{titleText}</SectionTitle>);
      expect(screen.getByText(titleText)).toBeInTheDocument();
    });
  });

  describe('integration scenarios', () => {
    it('should work alongside other heading levels', () => {
      render(
        <article>
          <h1>Page Title</h1>
          <h2>Main Section</h2>
          <SectionTitle>Subsection</SectionTitle>
        </article>
      );
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });

    it('should render correctly in card-like components', () => {
      render(
        <div className="card">
          <SectionTitle>Card Title</SectionTitle>
          <div className="card-body">Card content</div>
        </div>
      );
      const heading = screen.getByRole('heading', { name: 'Card Title' });
      expect(heading).toHaveClass('text-lg', 'font-semibold', 'mb-3');
    });
  });

  describe('visual styling verification', () => {
    it('should have margin bottom for spacing', () => {
      const { container } = render(<SectionTitle>Title</SectionTitle>);
      const title = container.firstChild;
      expect(title).toHaveClass('mb-3');
    });

    it('should have large text size', () => {
      const { container } = render(<SectionTitle>Title</SectionTitle>);
      const title = container.firstChild;
      expect(title).toHaveClass('text-lg');
    });

    it('should have semibold font weight', () => {
      const { container } = render(<SectionTitle>Title</SectionTitle>);
      const title = container.firstChild;
      expect(title).toHaveClass('font-semibold');
    });
  });
});
