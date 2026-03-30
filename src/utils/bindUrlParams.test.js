import { buildQueryString } from './bindUrlParams';

describe('buildQueryString', () => {
  it('should convert object to query string', () => {
    expect(buildQueryString({ backUrl: 'alunos', teste: 25 })).toBe(
      '?backUrl=alunos&teste=25'
    );
  });

  it('should handle single parameter', () => {
    expect(buildQueryString({ id: 123 })).toBe('?id=123');
  });

  it('should handle multiple parameters', () => {
    const result = buildQueryString({ a: 1, b: 2, c: 3 });
    expect(result).toContain('a=1');
    expect(result).toContain('b=2');
    expect(result).toContain('c=3');
    expect(result.startsWith('?')).toBe(true);
  });

  it('should encode special characters', () => {
    expect(buildQueryString({ url: 'https://example.com' })).toBe(
      '?url=https%3A%2F%2Fexample.com'
    );
    expect(buildQueryString({ name: 'João Silva' })).toBe(
      '?name=Jo%C3%A3o%20Silva'
    );
  });

  it('should filter out null values', () => {
    expect(buildQueryString({ a: 1, b: null, c: 3 })).toBe('?a=1&c=3');
  });

  it('should filter out undefined values', () => {
    expect(buildQueryString({ a: 1, b: undefined, c: 3 })).toBe('?a=1&c=3');
  });

  it('should handle empty object', () => {
    expect(buildQueryString({})).toBe('');
  });

  it('should handle null parameter', () => {
    expect(buildQueryString(null)).toBe('');
  });

  it('should handle undefined parameter', () => {
    expect(buildQueryString(undefined)).toBe('');
  });

  it('should handle non-object parameter', () => {
    expect(buildQueryString('string')).toBe('');
    expect(buildQueryString(123)).toBe('');
    expect(buildQueryString(true)).toBe('');
  });

  it('should handle object with all null/undefined values', () => {
    expect(buildQueryString({ a: null, b: undefined })).toBe('');
  });

  it('should handle boolean values', () => {
    expect(buildQueryString({ active: true, visible: false })).toBe(
      '?active=true&visible=false'
    );
  });

  it('should handle numeric values', () => {
    expect(buildQueryString({ page: 1, limit: 10, offset: 0 })).toBe(
      '?page=1&limit=10&offset=0'
    );
  });

  it('should handle string values', () => {
    expect(buildQueryString({ name: 'test', category: 'dev' })).toBe(
      '?name=test&category=dev'
    );
  });
});
