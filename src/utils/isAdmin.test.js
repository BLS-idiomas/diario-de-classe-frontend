import { isAdmin } from './isAdmin';

describe('isAdmin', () => {
  it('should return true if user.permissao is admin', () => {
    expect(isAdmin({ permissao: 'admin' })).toBe(true);
  });

  it('should return false if user.permissao is not admin', () => {
    expect(isAdmin({ permissao: 'user' })).toBe(false);
    expect(isAdmin({ permissao: 'supervisor' })).toBe(false);
    expect(isAdmin({ permissao: '' })).toBe(false);
  });

  it('should return false if user is null or undefined', () => {
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
  });

  it('should return false if user does not have permissao property', () => {
    expect(isAdmin({})).toBe(false);
    expect(isAdmin({ nome: 'João' })).toBe(false);
  });
});
