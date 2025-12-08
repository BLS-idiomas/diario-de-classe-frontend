import { render, screen } from '@testing-library/react';
import { InfoCard } from './index';
import { useInfoCard } from './useInfoCard';

// Mock the useInfoCard hook
jest.mock('./useInfoCard');

describe('InfoCard', () => {
  beforeEach(() => {
    // Setup default mock implementation
    useInfoCard.mockReturnValue({
      getClassName: jest.fn((index, column) => {
        if (index === 0) return 'text-sm text-gray-600';
        return 'text-sm mt-1 text-gray-600';
      }),
      getBgColor: jest.fn(color => {
        if (color === 'white') return 'bg-white';
        return 'bg-gray-50';
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render without crashing', () => {
      const columns = [{ text: 'Test' }];
      const { container } = render(
        <InfoCard columns={columns} bgColor="gray" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with data-testid', () => {
      const columns = [{ text: 'Test' }];
      render(<InfoCard columns={columns} bgColor="gray" />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });

    it('should render as a div element', () => {
      const columns = [{ text: 'Test' }];
      render(<InfoCard columns={columns} bgColor="gray" />);
      const card = screen.getByTestId('info-card');
      expect(card.tagName).toBe('DIV');
    });

    it('should render empty card when columns is empty array', () => {
      render(<InfoCard columns={[]} bgColor="gray" />);
      const card = screen.getByTestId('info-card');
      expect(card.children.length).toBe(0);
    });
  });

  describe('columns rendering', () => {
    it('should render single column', () => {
      const columns = [{ text: 'Single column' }];
      render(<InfoCard columns={columns} bgColor="gray" />);
      expect(screen.getByText('Single column')).toBeInTheDocument();
    });

    it('should render multiple columns', () => {
      const columns = [
        { text: 'Column 1' },
        { text: 'Column 2' },
        { text: 'Column 3' },
      ];
      render(<InfoCard columns={columns} bgColor="gray" />);
      expect(screen.getByText('Column 1')).toBeInTheDocument();
      expect(screen.getByText('Column 2')).toBeInTheDocument();
      expect(screen.getByText('Column 3')).toBeInTheDocument();
    });

    it('should render column text inside div elements', () => {
      const columns = [{ text: 'Test content' }];
      render(<InfoCard columns={columns} bgColor="gray" />);
      const card = screen.getByTestId('info-card');
      expect(card.firstChild.tagName).toBe('DIV');
      expect(card.firstChild.textContent).toBe('Test content');
    });

    it('should preserve column order', () => {
      const columns = [
        { text: 'First' },
        { text: 'Second' },
        { text: 'Third' },
      ];
      render(<InfoCard columns={columns} bgColor="gray" />);
      const card = screen.getByTestId('info-card');
      expect(card.children[0].textContent).toBe('First');
      expect(card.children[1].textContent).toBe('Second');
      expect(card.children[2].textContent).toBe('Third');
    });

    it('should render correct number of columns', () => {
      const columns = [
        { text: 'Col 1' },
        { text: 'Col 2' },
        { text: 'Col 3' },
        { text: 'Col 4' },
        { text: 'Col 5' },
      ];
      render(<InfoCard columns={columns} bgColor="gray" />);
      const card = screen.getByTestId('info-card');
      expect(card.children.length).toBe(5);
    });
  });

  describe('hook integration', () => {
    it('should call useInfoCard hook', () => {
      const columns = [{ text: 'Test' }];
      render(<InfoCard columns={columns} bgColor="gray" />);
      expect(useInfoCard).toHaveBeenCalled();
    });

    it('should call getClassName for each column', () => {
      const mockGetClassName = jest.fn(() => 'text-sm');
      useInfoCard.mockReturnValue({
        getClassName: mockGetClassName,
        getBgColor: jest.fn(() => 'bg-gray-50'),
      });

      const columns = [
        { text: 'Col 1', type: 'header' },
        { text: 'Col 2', type: 'bold' },
        { text: 'Col 3', type: 'default' },
      ];
      render(<InfoCard columns={columns} bgColor="gray" />);

      expect(mockGetClassName).toHaveBeenCalledTimes(3);
      expect(mockGetClassName).toHaveBeenCalledWith(0, columns[0]);
      expect(mockGetClassName).toHaveBeenCalledWith(1, columns[1]);
      expect(mockGetClassName).toHaveBeenCalledWith(2, columns[2]);
    });

    it('should call getBgColor with bgColor prop', () => {
      const mockGetBgColor = jest.fn(() => 'bg-white');
      useInfoCard.mockReturnValue({
        getClassName: jest.fn(() => 'text-sm'),
        getBgColor: mockGetBgColor,
      });

      const columns = [{ text: 'Test' }];
      render(<InfoCard columns={columns} bgColor="white" />);

      expect(mockGetBgColor).toHaveBeenCalledWith('white');
    });

    it('should apply className from getClassName', () => {
      const mockGetClassName = jest.fn(() => 'custom-class text-bold');
      useInfoCard.mockReturnValue({
        getClassName: mockGetClassName,
        getBgColor: jest.fn(() => 'bg-gray-50'),
      });

      const columns = [{ text: 'Test' }];
      const { container } = render(
        <InfoCard columns={columns} bgColor="gray" />
      );
      const columnDiv = container.querySelector('.custom-class');
      expect(columnDiv).toBeInTheDocument();
    });

    it('should apply bgColor from getBgColor', () => {
      const mockGetBgColor = jest.fn(() => 'bg-custom-color');
      useInfoCard.mockReturnValue({
        getClassName: jest.fn(() => 'text-sm'),
        getBgColor: mockGetBgColor,
      });

      const columns = [{ text: 'Test' }];
      render(<InfoCard columns={columns} bgColor="custom" />);
      const card = screen.getByTestId('info-card');
      expect(card).toHaveClass('bg-custom-color');
    });
  });

  describe('styling', () => {
    it('should have base classes', () => {
      const columns = [{ text: 'Test' }];
      render(<InfoCard columns={columns} bgColor="gray" />);
      const card = screen.getByTestId('info-card');
      expect(card).toHaveClass('p-3');
      expect(card).toHaveClass('rounded-md');
      expect(card).toHaveClass('shadow-sm');
    });

    it('should apply background color class from getBgColor', () => {
      const columns = [{ text: 'Test' }];
      render(<InfoCard columns={columns} bgColor="white" />);
      const card = screen.getByTestId('info-card');
      expect(card).toHaveClass('bg-white');
    });

    it('should apply gray background by default', () => {
      const columns = [{ text: 'Test' }];
      render(<InfoCard columns={columns} bgColor="gray" />);
      const card = screen.getByTestId('info-card');
      expect(card).toHaveClass('bg-gray-50');
    });

    it('should have all required classes combined', () => {
      const columns = [{ text: 'Test' }];
      render(<InfoCard columns={columns} bgColor="white" />);
      const card = screen.getByTestId('info-card');
      expect(card.className).toContain('p-3');
      expect(card.className).toContain('rounded-md');
      expect(card.className).toContain('bg-white');
      expect(card.className).toContain('shadow-sm');
    });
  });

  describe('column data variations', () => {
    it('should handle column with type property', () => {
      const columns = [
        { text: 'Header', type: 'header' },
        { text: 'Bold', type: 'bold' },
        { text: 'Normal', type: 'default' },
      ];
      render(<InfoCard columns={columns} bgColor="gray" />);
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('Normal')).toBeInTheDocument();
    });

    it('should handle column with additional properties', () => {
      const columns = [{ text: 'Test', type: 'header', extraProp: 'value' }];
      render(<InfoCard columns={columns} bgColor="gray" />);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should handle empty text', () => {
      const columns = [{ text: '' }];
      render(<InfoCard columns={columns} bgColor="gray" />);
      const card = screen.getByTestId('info-card');
      expect(card.children.length).toBe(1);
    });

    it('should handle numeric text', () => {
      const columns = [{ text: '12345' }];
      render(<InfoCard columns={columns} bgColor="gray" />);
      expect(screen.getByText('12345')).toBeInTheDocument();
    });

    it('should handle long text', () => {
      const longText =
        'This is a very long text that should still be rendered correctly in the info card component';
      const columns = [{ text: longText }];
      render(<InfoCard columns={columns} bgColor="gray" />);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should handle special characters in text', () => {
      const columns = [{ text: 'Test & <Special> "Characters"' }];
      render(<InfoCard columns={columns} bgColor="gray" />);
      expect(
        screen.getByText('Test & <Special> "Characters"')
      ).toBeInTheDocument();
    });
  });

  describe('bgColor variations', () => {
    it('should handle gray bgColor', () => {
      const columns = [{ text: 'Test' }];
      render(<InfoCard columns={columns} bgColor="gray" />);
      const card = screen.getByTestId('info-card');
      expect(card).toHaveClass('bg-gray-50');
    });

    it('should handle white bgColor', () => {
      const columns = [{ text: 'Test' }];
      render(<InfoCard columns={columns} bgColor="white" />);
      const card = screen.getByTestId('info-card');
      expect(card).toHaveClass('bg-white');
    });

    it('should handle undefined bgColor', () => {
      const columns = [{ text: 'Test' }];
      render(<InfoCard columns={columns} />);
      const card = screen.getByTestId('info-card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle columns with only one item', () => {
      const columns = [{ text: 'Single' }];
      render(<InfoCard columns={columns} bgColor="gray" />);
      expect(screen.getByText('Single')).toBeInTheDocument();
    });

    it('should handle many columns', () => {
      const columns = Array.from({ length: 20 }, (_, i) => ({
        text: `Column ${i + 1}`,
      }));
      render(<InfoCard columns={columns} bgColor="gray" />);
      const card = screen.getByTestId('info-card');
      expect(card.children.length).toBe(20);
    });

    it('should use index as key for columns', () => {
      const columns = [{ text: 'First' }, { text: 'Second' }];
      const { container } = render(
        <InfoCard columns={columns} bgColor="gray" />
      );
      const card = container.querySelector('[data-testid="info-card"]');
      expect(card.children.length).toBe(2);
    });

    it('should handle columns with identical text', () => {
      const columns = [
        { text: 'Same text' },
        { text: 'Same text' },
        { text: 'Same text' },
      ];
      render(<InfoCard columns={columns} bgColor="gray" />);
      const elements = screen.getAllByText('Same text');
      expect(elements.length).toBe(3);
    });
  });

  describe('rerendering', () => {
    it('should update when columns change', () => {
      const columns1 = [{ text: 'Initial' }];
      const columns2 = [{ text: 'Updated' }];

      const { rerender } = render(
        <InfoCard columns={columns1} bgColor="gray" />
      );
      expect(screen.getByText('Initial')).toBeInTheDocument();

      rerender(<InfoCard columns={columns2} bgColor="gray" />);
      expect(screen.getByText('Updated')).toBeInTheDocument();
      expect(screen.queryByText('Initial')).not.toBeInTheDocument();
    });

    it('should update when bgColor changes', () => {
      const columns = [{ text: 'Test' }];

      const { rerender } = render(
        <InfoCard columns={columns} bgColor="gray" />
      );
      let card = screen.getByTestId('info-card');
      expect(card).toHaveClass('bg-gray-50');

      rerender(<InfoCard columns={columns} bgColor="white" />);
      card = screen.getByTestId('info-card');
      expect(card).toHaveClass('bg-white');
    });

    it('should update when columns are added', () => {
      const columns1 = [{ text: 'One' }];
      const columns2 = [{ text: 'One' }, { text: 'Two' }];

      const { rerender } = render(
        <InfoCard columns={columns1} bgColor="gray" />
      );
      let card = screen.getByTestId('info-card');
      expect(card.children.length).toBe(1);

      rerender(<InfoCard columns={columns2} bgColor="gray" />);
      card = screen.getByTestId('info-card');
      expect(card.children.length).toBe(2);
    });

    it('should update when columns are removed', () => {
      const columns1 = [{ text: 'One' }, { text: 'Two' }];
      const columns2 = [{ text: 'One' }];

      const { rerender } = render(
        <InfoCard columns={columns1} bgColor="gray" />
      );
      let card = screen.getByTestId('info-card');
      expect(card.children.length).toBe(2);

      rerender(<InfoCard columns={columns2} bgColor="gray" />);
      card = screen.getByTestId('info-card');
      expect(card.children.length).toBe(1);
    });
  });

  describe('integration scenarios', () => {
    it('should work with realistic data structure', () => {
      const columns = [
        { text: 'Nome:', type: 'header' },
        { text: 'João Silva', type: 'bold' },
        { text: 'Email:', type: 'header' },
        { text: 'joao@example.com', type: 'default' },
        { text: 'Telefone:', type: 'header' },
        { text: '(11) 98765-4321', type: 'default' },
      ];
      render(<InfoCard columns={columns} bgColor="white" />);

      expect(screen.getByText('Nome:')).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('joao@example.com')).toBeInTheDocument();
      expect(screen.getByText('Telefone:')).toBeInTheDocument();
      expect(screen.getByText('(11) 98765-4321')).toBeInTheDocument();
    });

    it('should render multiple info cards independently', () => {
      const columns1 = [{ text: 'Card 1' }];
      const columns2 = [{ text: 'Card 2' }];

      const { container } = render(
        <>
          <InfoCard columns={columns1} bgColor="gray" />
          <InfoCard columns={columns2} bgColor="white" />
        </>
      );

      const cards = container.querySelectorAll('[data-testid="info-card"]');
      expect(cards.length).toBe(2);
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
    });
  });
});
