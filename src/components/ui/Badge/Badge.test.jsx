import { render, screen } from '@testing-library/react';
import { Badge } from './index';

describe('Badge', () => {
  describe('icon rendering', () => {
    it('should render lock icon', () => {
      render(<Badge icon="lock" text="Admin" color="blue" />);
      expect(screen.getByText(/🔐/)).toBeInTheDocument();
    });

    it('should render calendar icon', () => {
      render(<Badge icon="calendar" text="5 aulas" color="gray" />);
      expect(screen.getByText(/📅/)).toBeInTheDocument();
    });

    it('should render star icon', () => {
      render(<Badge icon="star" text="Destaque" color="yellow" />);
      expect(screen.getByText(/⭐/)).toBeInTheDocument();
    });

    it('should render check icon', () => {
      render(<Badge icon="check" text="Ativo" color="green" />);
      expect(screen.getByText(/✅/)).toBeInTheDocument();
    });

    it('should render alert icon', () => {
      render(<Badge icon="alert" text="Atenção" color="red" />);
      expect(screen.getByText(/⚠️/)).toBeInTheDocument();
    });

    it('should render info icon', () => {
      render(<Badge icon="info" text="Informação" color="blue" />);
      expect(screen.getByText(/ℹ️/)).toBeInTheDocument();
    });

    it('should render default info icon when icon not provided', () => {
      render(<Badge text="Default" color="blue" />);
      expect(screen.getByText(/ℹ️/)).toBeInTheDocument();
    });

    it('should render default info icon when icon is invalid', () => {
      render(<Badge icon="invalid" text="Invalid" color="blue" />);
      expect(screen.getByText(/ℹ️/)).toBeInTheDocument();
    });
  });

  describe('color rendering', () => {
    it('should apply gray background color', () => {
      const { container } = render(
        <Badge icon="lock" text="Test" color="gray" />
      );
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-gray-100');
    });

    it('should apply blue background color', () => {
      const { container } = render(
        <Badge icon="lock" text="Test" color="blue" />
      );
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-blue-100');
    });

    it('should apply green background color', () => {
      const { container } = render(
        <Badge icon="check" text="Test" color="green" />
      );
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-green-100');
    });

    it('should apply red background color', () => {
      const { container } = render(
        <Badge icon="alert" text="Test" color="red" />
      );
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-red-100');
    });

    it('should apply yellow background color', () => {
      const { container } = render(
        <Badge icon="star" text="Test" color="yellow" />
      );
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-yellow-100');
    });

    it('should apply default blue color when color not provided', () => {
      const { container } = render(<Badge icon="lock" text="Test" />);
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-blue-100');
    });

    it('should apply default blue color when color is invalid', () => {
      const { container } = render(
        <Badge icon="lock" text="Test" color="invalid" />
      );
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-blue-100');
    });
  });

  describe('text rendering', () => {
    it('should render text content', () => {
      render(<Badge icon="lock" text="Admin" color="blue" />);
      expect(screen.getByText(/Admin/)).toBeInTheDocument();
    });

    it('should render icon and text together', () => {
      render(<Badge icon="calendar" text="5 aulas" color="gray" />);
      const badge = screen.getByText(/📅 5 aulas/);
      expect(badge).toBeInTheDocument();
    });

    it('should render with empty text', () => {
      render(<Badge icon="lock" text="" color="blue" />);
      expect(screen.getByText(/🔐/)).toBeInTheDocument();
    });

    it('should render with long text', () => {
      const longText = 'This is a very long text for the badge component';
      render(<Badge icon="info" text={longText} color="blue" />);
      expect(screen.getByText(new RegExp(longText))).toBeInTheDocument();
    });

    it('should render with special characters in text', () => {
      render(<Badge icon="lock" text="Café & Açúcar" color="blue" />);
      expect(screen.getByText(/Café & Açúcar/)).toBeInTheDocument();
    });

    it('should render with numbers in text', () => {
      render(<Badge icon="calendar" text="123 aulas" color="gray" />);
      expect(screen.getByText(/123 aulas/)).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply base styling classes', () => {
      const { container } = render(
        <Badge icon="lock" text="Test" color="blue" />
      );
      const badge = container.firstChild;
      expect(badge).toHaveClass('px-2');
      expect(badge).toHaveClass('py-1');
      expect(badge).toHaveClass('rounded');
      expect(badge).toHaveClass('text-sm');
    });

    it('should render as span element', () => {
      const { container } = render(
        <Badge icon="lock" text="Test" color="blue" />
      );
      const badge = container.firstChild;
      expect(badge.tagName).toBe('SPAN');
    });

    it('should combine all classes correctly', () => {
      const { container } = render(
        <Badge icon="lock" text="Test" color="green" />
      );
      const badge = container.firstChild;
      expect(badge.className).toContain('px-2');
      expect(badge.className).toContain('py-1');
      expect(badge.className).toContain('bg-green-100');
      expect(badge.className).toContain('rounded');
      expect(badge.className).toContain('text-sm');
    });
  });

  describe('edge cases', () => {
    it('should handle all props being undefined', () => {
      const { container } = render(<Badge />);
      const badge = container.firstChild;
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-blue-100'); // default color
      expect(screen.getByText(/ℹ️/)).toBeInTheDocument(); // default icon
    });

    it('should handle null text', () => {
      render(<Badge icon="lock" text={null} color="blue" />);
      expect(screen.getByText(/🔐/)).toBeInTheDocument();
    });

    it('should handle undefined text', () => {
      render(<Badge icon="lock" text={undefined} color="blue" />);
      expect(screen.getByText(/🔐/)).toBeInTheDocument();
    });
  });

  describe('integration', () => {
    it('should render multiple badges with different configurations', () => {
      const { rerender } = render(
        <Badge icon="lock" text="Admin" color="blue" />
      );
      expect(screen.getByText(/🔐 Admin/)).toBeInTheDocument();

      rerender(<Badge icon="star" text="Premium" color="yellow" />);
      expect(screen.getByText(/⭐ Premium/)).toBeInTheDocument();

      rerender(<Badge icon="check" text="Ativo" color="green" />);
      expect(screen.getByText(/✅ Ativo/)).toBeInTheDocument();
    });

    it('should render correctly with all available icons', () => {
      const icons = ['lock', 'calendar', 'star', 'check', 'alert', 'info'];
      const expectedEmojis = ['🔐', '📅', '⭐', '✅', '⚠️', 'ℹ️'];

      icons.forEach((icon, index) => {
        const { container, unmount } = render(
          <Badge icon={icon} text="Test" color="blue" />
        );
        expect(
          screen.getByText(new RegExp(expectedEmojis[index]))
        ).toBeInTheDocument();
        unmount();
      });
    });

    it('should render correctly with all available colors', () => {
      const colors = ['gray', 'blue', 'green', 'red', 'yellow'];
      const expectedClasses = [
        'bg-gray-100',
        'bg-blue-100',
        'bg-green-100',
        'bg-red-100',
        'bg-yellow-100',
      ];

      colors.forEach((color, index) => {
        const { container, unmount } = render(
          <Badge icon="lock" text="Test" color={color} />
        );
        const badge = container.firstChild;
        expect(badge).toHaveClass(expectedClasses[index]);
        unmount();
      });
    });
  });

  describe('icon and color combinations', () => {
    it('should render lock icon with blue color', () => {
      const { container } = render(
        <Badge icon="lock" text="Admin" color="blue" />
      );
      expect(screen.getByText(/🔐/)).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('bg-blue-100');
    });

    it('should render calendar icon with gray color', () => {
      const { container } = render(
        <Badge icon="calendar" text="5 aulas" color="gray" />
      );
      expect(screen.getByText(/📅/)).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('bg-gray-100');
    });

    it('should render check icon with green color', () => {
      const { container } = render(
        <Badge icon="check" text="Ativo" color="green" />
      );
      expect(screen.getByText(/✅/)).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('bg-green-100');
    });

    it('should render alert icon with red color', () => {
      const { container } = render(
        <Badge icon="alert" text="Erro" color="red" />
      );
      expect(screen.getByText(/⚠️/)).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('bg-red-100');
    });

    it('should render star icon with yellow color', () => {
      const { container } = render(
        <Badge icon="star" text="Premium" color="yellow" />
      );
      expect(screen.getByText(/⭐/)).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('bg-yellow-100');
    });
  });
});
