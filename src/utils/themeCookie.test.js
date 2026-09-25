import { getKey, parseThemeCookie, serializeThemeCookie } from './themeCookie';

describe('themeCookie util', () => {
  it('getKey returns the cookie name', () => {
    expect(getKey()).toBe('theme');
  });

  it('parseThemeCookie returns the theme for a valid value', () => {
    expect(parseThemeCookie('dark')).toBe('dark');
    expect(parseThemeCookie('light')).toBe('light');
  });

  it('parseThemeCookie returns null for an invalid value', () => {
    expect(parseThemeCookie('bogus')).toBeNull();
  });

  it('parseThemeCookie returns null when the value is absent', () => {
    expect(parseThemeCookie(undefined)).toBeNull();
    expect(parseThemeCookie(null)).toBeNull();
  });

  it('serializeThemeCookie contains the expected attributes and no HttpOnly', () => {
    const cookie = serializeThemeCookie('dark');
    expect(cookie).toContain('theme=dark');
    expect(cookie).toContain('Path=/');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toMatch(/Max-Age=\d+/);
    expect(cookie).not.toMatch(/HttpOnly/i);
  });

  it('round-trips a serialized value back through parseThemeCookie (AC-001-012)', () => {
    const serialized = serializeThemeCookie('dark');
    const rawValue = serialized.split(';')[0].split('=')[1];
    expect(parseThemeCookie(rawValue)).toBe('dark');
  });
});
