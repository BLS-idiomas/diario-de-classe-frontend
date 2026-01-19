import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: props => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Global test setup
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.matchMedia =
  global.matchMedia ||
  function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  };

// Previne problemas de memory leak e stack overflow
global.setImmediate =
  global.setImmediate || ((fn, ...args) => global.setTimeout(fn, 0, ...args));

// Configura timeouts menores para evitar stack overflow
jest.setTimeout(10000);

// Mock do HTMLFormElement.requestSubmit para jsdom
if (typeof HTMLFormElement.prototype.requestSubmit === 'undefined') {
  HTMLFormElement.prototype.requestSubmit = function (submitter) {
    if (submitter) {
      if (!submitter.form || submitter.form !== this) {
        throw new DOMException(
          "Failed to execute 'requestSubmit' on 'HTMLFormElement'",
          'NotFoundError'
        );
      }
      if (submitter.type !== 'submit') {
        throw new TypeError(
          "Failed to execute 'requestSubmit' on 'HTMLFormElement': The specified element is not a submit button."
        );
      }
    }
    this.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    );
  };
}
