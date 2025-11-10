import React from 'react';
import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { ReduxProvider } from './ReduxyProvider';

// Mock do react-redux
jest.mock('react-redux', () => ({
  Provider: ({ children, store }) => (
    <div
      data-testid="redux-provider"
      data-store={store ? 'present' : 'missing'}
    >
      {children}
    </div>
  ),
  useSelector: jest.fn(),
}));

// Mock do store
jest.mock('../store', () => ({
  store: {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe('ReduxProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children wrapped in Redux Provider', () => {
    const TestComponent = () => <div data-testid="test-child">Test Child</div>;

    const { getByTestId } = render(
      <ReduxProvider>
        <TestComponent />
      </ReduxProvider>
    );

    expect(getByTestId('redux-provider')).toBeInTheDocument();
    expect(getByTestId('test-child')).toBeInTheDocument();
  });

  it('should pass store to Provider', () => {
    const TestComponent = () => <div>Test</div>;

    const { getByTestId } = render(
      <ReduxProvider>
        <TestComponent />
      </ReduxProvider>
    );

    const provider = getByTestId('redux-provider');
    expect(provider).toHaveAttribute('data-store', 'present');
  });

  it('should render multiple children correctly', () => {
    const { getByTestId } = render(
      <ReduxProvider>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </ReduxProvider>
    );

    expect(getByTestId('child-1')).toBeInTheDocument();
    expect(getByTestId('child-2')).toBeInTheDocument();
  });

  it('should handle empty children', () => {
    const { getByTestId } = render(<ReduxProvider />);

    expect(getByTestId('redux-provider')).toBeInTheDocument();
  });

  it('should work with functional components as children', () => {
    const FunctionalChild = () => (
      <span data-testid="functional-child">Functional</span>
    );

    const { getByTestId } = render(
      <ReduxProvider>
        <FunctionalChild />
      </ReduxProvider>
    );

    expect(getByTestId('functional-child')).toBeInTheDocument();
  });

  it('should work with class components as children', () => {
    class ClassChild extends React.Component {
      render() {
        return <span data-testid="class-child">Class</span>;
      }
    }

    const { getByTestId } = render(
      <ReduxProvider>
        <ClassChild />
      </ReduxProvider>
    );

    expect(getByTestId('class-child')).toBeInTheDocument();
  });

  it('should handle nested components', () => {
    const NestedComponent = () => (
      <div data-testid="nested-parent">
        <div data-testid="nested-child">Nested</div>
      </div>
    );

    const { getByTestId } = render(
      <ReduxProvider>
        <NestedComponent />
      </ReduxProvider>
    );

    expect(getByTestId('nested-parent')).toBeInTheDocument();
    expect(getByTestId('nested-child')).toBeInTheDocument();
  });
});
