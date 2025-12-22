/** @jest-environment jsdom */
import { isMobileFunction } from './isMobileFunction';

describe('isMobileFunction', () => {
  let originalWindow;

  beforeEach(() => {
    originalWindow = global.window;
  });

  afterEach(() => {
    // Restaurar objeto original do window
    if (typeof originalWindow === 'undefined') {
      try {
        delete global.window;
      } catch (e) {
        global.window = undefined;
      }
    } else {
      global.window = originalWindow;
    }
    jest.restoreAllMocks();
  });

  it('should return true if window.innerWidth < 640', () => {
    const fakeWindow = { innerWidth: 500 };
    expect(isMobileFunction(fakeWindow)).toBe(true);
  });

  it('should return false if window.innerWidth >= 640', () => {
    const fakeWindow = { innerWidth: 800 };
    expect(isMobileFunction(fakeWindow)).toBe(false);
  });

  it('should return false if window is undefined', () => {
    expect(isMobileFunction(undefined)).toBe(false);
  });
});
