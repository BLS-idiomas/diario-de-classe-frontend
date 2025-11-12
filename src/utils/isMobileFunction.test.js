import { isMobileFunction } from './isMobileFunction';

describe('isMobileFunction', () => {
  afterEach(() => {
    // Limpa mocks do window
    if (typeof window !== 'undefined') {
      window.innerWidth = 1024;
    }
    jest.restoreAllMocks();
  });

  it('should return true if window.innerWidth < 640', () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'innerWidth', {
      value: 500,
      writable: true,
    });
    expect(isMobileFunction()).toBe(true);
  });

  it('should return false if window.innerWidth >= 640', () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'innerWidth', {
      value: 800,
      writable: true,
    });
    expect(isMobileFunction()).toBe(false);
  });

  it('should return false if window is undefined', () => {
    const originalWindow = global.window;
    delete global.window;
    expect(isMobileFunction()).toBe(false);
    global.window = originalWindow;
  });
});
