import { render, screen } from '@testing-library/react';
import ForgotPassword from './page';

describe('ForgotPassword Page', () => {
  describe('Page Rendering', () => {
    it('should render the forgot password heading', () => {
      render(<ForgotPassword />);

      const heading = screen.getByRole('heading', {
        name: 'Forgot Password Page',
      });
      expect(heading).toBeInTheDocument();
    });

    it('should render h1 element with correct text', () => {
      render(<ForgotPassword />);

      const h1 = screen.getByText('Forgot Password Page');
      expect(h1).toBeInTheDocument();
      expect(h1.tagName).toBe('H1');
    });

    it('should render the page without errors', () => {
      const { container } = render(<ForgotPassword />);
      expect(container).toBeInTheDocument();
    });

    it('should have correct DOM structure', () => {
      const { container } = render(<ForgotPassword />);

      const h1 = container.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1.textContent).toBe('Forgot Password Page');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with semantic HTML', () => {
      const { container } = render(<ForgotPassword />);

      const heading = container.querySelector('h1');
      expect(heading).toBeInTheDocument();
    });
  });
});
