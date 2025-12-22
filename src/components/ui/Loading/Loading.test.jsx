import { render, screen } from '@testing-library/react';
import { Loading } from './index';
import '@testing-library/jest-dom';

describe('Loading', () => {
  it('deve renderizar o spinner centralizado', () => {
    render(<Loading />);
    const loadingDiv = screen.getByTestId('loading');
    expect(loadingDiv).toBeInTheDocument();
    expect(loadingDiv).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
      'h-full',
      'w-full'
    );
    const spinner = loadingDiv.querySelector('div');
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'h-12',
      'w-12',
      'border-t-4',
      'border-b-4',
      'border-blue-500'
    );
  });
});
