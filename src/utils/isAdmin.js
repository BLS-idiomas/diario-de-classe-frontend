export function isAdmin(user) {
  return Boolean(user) && user.permissao === 'admin';
}
